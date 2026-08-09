import path from "node:path"

import { prepareAppConsumer } from "./lib/app-consumer.mjs"
import { runNpm } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const fixtureName = process.argv[2]?.trim()
const fixtures = {
  "vite-react-18": {},
  "vite-react-19": {},
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

const consumer = await prepareAppConsumer({
  root,
  fixtureName,
  ...fixtureConfig,
})

try {
  await runNpm(["run", "typecheck"], consumer.npmOptions)
  await runNpm(["run", "build"], consumer.npmOptions)

  console.log(`${fixtureName} consumer passed with ${consumer.packageLabel}`)
} finally {
  await consumer.cleanup()
}
