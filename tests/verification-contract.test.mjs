import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

test("verification uses one canonical core pipeline and cancels stale runs", async () => {
  const [packageJson, workflow] = await Promise.all([
    readJson("package.json"),
    readRoot(".github/workflows/verify.yml"),
  ])
  const scripts = packageJson.scripts

  assert.match(scripts.verify, /npm run lint && npm run verify:core/)
  assert.match(scripts.verify, /npm run api:check/)
  assert.match(scripts.verify, /npm run test:coverage/)
  assert.equal(scripts["verify:package"], undefined)
  assert.equal(scripts["lint:node"], undefined)

  for (const check of [
    "format:check",
    "audit:source",
    "registry:check",
    "storybook:check",
    "typecheck",
    "build",
    "bundle:check",
    "test:contracts",
    "pack:check",
    "package:lint",
  ]) {
    assert.match(
      scripts["verify:core"],
      new RegExp(`npm run ${check.replace(":", "\\:")}`)
    )
  }

  assert.match(workflow, /concurrency:/)
  assert.match(workflow, /cancel-in-progress: true/)
})
