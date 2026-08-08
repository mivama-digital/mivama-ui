import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import { preparePackageSource } from "./lib/package-source.mjs"

const execFileAsync = promisify(execFile)
const root = fileURLToPath(new URL("..", import.meta.url))
const fixtureName = process.argv[2]?.trim()
const fixtures = {
  "vite-react-18": { maxBuffer: 16 * 1024 * 1024 },
  "vite-react-19": { maxBuffer: 16 * 1024 * 1024 },
  "next-app-router": {
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    maxBuffer: 32 * 1024 * 1024,
  },
}
const fixtureConfig = fixtures[fixtureName]

if (!fixtureConfig) {
  throw new Error(
    `Usage: node scripts/test-app-consumer.mjs <${Object.keys(fixtures).join("|")}>`
  )
}

const fixture = path.join(root, "fixtures", fixtureName)
const artifacts = path.join(root, ".artifacts", fixtureName)
const packageSource = await preparePackageSource({ root, artifacts })

async function runNpm(args) {
  try {
    const result = await execFileAsync("npm", args, {
      cwd: fixture,
      env: { ...process.env, ...fixtureConfig.env },
      maxBuffer: fixtureConfig.maxBuffer,
    })
    if (result.stdout) process.stdout.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

try {
  await runNpm(["ci", "--ignore-scripts"])
  await runNpm([
    "install",
    "--ignore-scripts",
    "--no-save",
    "--package-lock=false",
    packageSource.spec,
  ])
  await runNpm(["ls", "@mivama/ui", "--depth=0"])
  await runNpm(["run", "typecheck"])
  await runNpm(["run", "build"])

  console.log(`${fixtureName} consumer passed with ${packageSource.label}`)
} finally {
  await packageSource.cleanup()
}
