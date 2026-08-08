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
const registryAttempts = 12
const registryRetryDelayMs = 10_000

if (!version || !exactVersionPattern.test(version)) {
  throw new Error(
    "Usage: node scripts/check-registry-release.mjs <exact-version>"
  )
}

const packageSpec = `${packageName}@${version}`
const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration))

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

async function readRegistryJson(field) {
  const output = await run("npm", ["view", packageSpec, field, "--json"])
  return output ? JSON.parse(output) : null
}

async function waitForRegistryRelease() {
  let lastError

  for (let attempt = 1; attempt <= registryAttempts; attempt += 1) {
    try {
      const publishedVersion = await readRegistryJson("version")
      assert.equal(
        publishedVersion,
        version,
        `Registry returned ${publishedVersion} for ${packageSpec}`
      )

      const attestations = await readRegistryJson("dist.attestations")
      assert.ok(
        attestations?.url,
        `${packageSpec} is missing an npm attestation URL`
      )
      assert.ok(
        attestations?.provenance,
        `${packageSpec} is missing an npm provenance attestation`
      )

      return
    } catch (error) {
      lastError = error
      if (attempt === registryAttempts) break

      console.warn(
        `Registry release is not fully visible yet (${attempt}/${registryAttempts}); retrying in ${registryRetryDelayMs / 1000}s`
      )
      await sleep(registryRetryDelayMs)
    }
  }

  throw lastError
}

await waitForRegistryRelease()

const env = { MIVAMA_PACKAGE_SPEC: packageSpec }
const consumerChecks = [
  ["test-app-consumer.mjs", "vite-react-18"],
  ["test-app-consumer.mjs", "vite-react-19"],
  ["test-app-consumer.mjs", "next-app-router"],
  ["check-packed-ssr.mjs"],
  ["check-packed-tree-shaking.mjs"],
]

for (const [script, ...args] of consumerChecks) {
  await run(
    process.execPath,
    [path.join(root, "scripts", script), ...args],
    root,
    env
  )
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
