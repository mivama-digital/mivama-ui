import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

test("release version command synchronizes lockfile metadata", async () => {
  const packageJson = await readJson("package.json")
  const command = packageJson.scripts?.["release:version"]
  const syncScript = await readRoot("scripts/sync-package-lock-version.mjs")

  assert.equal(typeof command, "string")
  assert.match(command, /changeset version/)
  assert.match(command, /node scripts\/sync-package-lock-version\.mjs/)
  assert.doesNotMatch(command, /npm install/)

  assert.match(syncScript, /lockfile\.version = packageJson\.version/)
  assert.match(syncScript, /packages\[""\]\.version = packageJson\.version/)
})
