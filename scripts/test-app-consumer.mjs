import path from "node:path"
import { fileURLToPath } from "node:url"

import { preparePackageSource } from "./lib/package-source.mjs"
import { runNpm } from "./lib/process.mjs"

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
const npmOptions = {
  cwd: fixture,
  env: fixtureConfig.env,
  maxBuffer: fixtureConfig.maxBuffer,
}

try {
  await runNpm(["ci", "--ignore-scripts"], npmOptions)
  await runNpm(
    [
      "install",
      "--ignore-scripts",
      "--no-save",
      "--package-lock=false",
      packageSource.spec,
    ],
    npmOptions
  )
  await runNpm(["ls", "@mivama/ui", "--depth=0"], npmOptions)
  await runNpm(["run", "typecheck"], npmOptions)
  await runNpm(["run", "build"], npmOptions)

  console.log(`${fixtureName} consumer passed with ${packageSource.label}`)
} finally {
  await packageSource.cleanup()
}
