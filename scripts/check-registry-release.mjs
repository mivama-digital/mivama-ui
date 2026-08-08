import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const root = path.resolve(import.meta.dirname, "..")
const packageName = "@mivama/ui"
const version = process.argv[2]?.trim()
const exactVersionPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/

if (!version || !exactVersionPattern.test(version)) {
  throw new Error("Usage: node scripts/check-registry-release.mjs <exact-version>")
}

const packageSpec = `${packageName}@${version}`

async function run(command, args, cwd = root, env = {}) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      env: { ...process.env, ...env },
      maxBuffer: 32 * 1024 * 1024,
    })
    if (result.stdout) process.stdout.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
    return result.stdout.trim()
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

const publishedVersion = JSON.parse(
  await run("npm", ["view", packageSpec, "version", "--json"])
)
assert.equal(
  publishedVersion,
  version,
  `Registry returned ${publishedVersion} for ${packageSpec}`
)

const attestationsRaw = await run("npm", [
  "view",
  packageSpec,
  "dist.attestations",
  "--json",
])
const attestations = attestationsRaw ? JSON.parse(attestationsRaw) : null
assert.ok(attestations?.url, `${packageSpec} is missing an npm attestation URL`)
assert.ok(
  attestations?.provenance,
  `${packageSpec} is missing an npm provenance attestation`
)

const env = { MIVAMA_PACKAGE_SPEC: packageSpec }
for (const script of [
  "test-vite-react-19-consumer.mjs",
  "test-next-app-router-consumer.mjs",
  "check-packed-ssr.mjs",
  "check-packed-tree-shaking.mjs",
]) {
  await run(process.execPath, [path.join(root, "scripts", script)], root, env)
}

const auditDir = await mkdtemp(path.join(tmpdir(), "mivama-ui-audit-"))
try {
  await writeFile(
    path.join(auditDir, "package.json"),
    JSON.stringify({ private: true, dependencies: { [packageName]: version } })
  )
  await run(
    "npm",
    ["install", "--ignore-scripts", "--package-lock=true"],
    auditDir
  )
  await run("npm", ["audit", "signatures"], auditDir)
} finally {
  await rm(auditDir, { recursive: true, force: true })
}

console.log(`Registry release probe passed for ${packageSpec}`)
