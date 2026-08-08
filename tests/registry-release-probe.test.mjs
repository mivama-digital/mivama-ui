import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const workflow = await readFile(
  new URL("../.github/workflows/registry-release-probe.yml", import.meta.url),
  "utf8"
)
const probe = await readFile(
  new URL("../scripts/check-registry-release.mjs", import.meta.url),
  "utf8"
)

test("registry release probe remains manual, read-only, and main-only", () => {
  assert.match(workflow, /workflow_dispatch:/)
  assert.match(workflow, /permissions:\s*\n\s+contents: read/)
  assert.match(workflow, /RELEASE_REF.*github\.ref/s)
  assert.match(workflow, /refs\/heads\/main/)
  assert.doesNotMatch(workflow, /id-token:\s*write/)
  assert.doesNotMatch(workflow, /NPM_TOKEN|NODE_AUTH_TOKEN/)
})

test("registry release probe requires an exact version and provenance", () => {
  assert.match(probe, /exactVersionPattern/)
  assert.match(probe, /dist\.attestations/)
  assert.match(probe, /attestations\?\.provenance/)
  assert.match(probe, /npm["'], \["audit", "signatures"\]/)
})

test("registry release probe reuses canonical consumer runners", () => {
  for (const script of [
    "test-vite-consumer.mjs",
    "test-next-app-router-consumer.mjs",
    "check-packed-ssr.mjs",
    "check-packed-tree-shaking.mjs",
  ]) {
    assert.match(probe, new RegExp(script.replaceAll(".", "\\.")))
  }
  assert.match(probe, /"test-vite-consumer\.mjs", "vite-react-19"/)
})
