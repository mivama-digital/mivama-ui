import assert from "node:assert/strict"
import test from "node:test"

import {
  changedReleaseFields,
  evaluateReleasePolicy,
} from "../scripts/check-release-policy.mjs"

const basePackage = {
  version: "3.0.0",
  dependencies: { react: "^19.0.0" },
  devDependencies: { prettier: "^3.0.0" },
  peerDependencies: { react: ">=18 <20" },
  exports: { ".": "./dist/index.js" },
}

test("ignores package metadata that does not affect published consumers", () => {
  const headPackage = {
    ...basePackage,
    version: "3.0.1",
    devDependencies: { prettier: "^3.1.0" },
    scripts: { verify: "echo verify" },
  }

  assert.deepEqual(changedReleaseFields(basePackage, headPackage), [])
  assert.equal(
    evaluateReleasePolicy({
      changedFiles: ["package.json", "package-lock.json"],
      basePackage,
      headPackage,
    }).ok,
    true
  )
})

test("requires release intent for source changes", () => {
  const result = evaluateReleasePolicy({
    changedFiles: ["src/components/ui/button.tsx"],
  })

  assert.equal(result.ok, false)
  assert.match(result.reason, /Changeset/)
})

test("accepts a changeset for source changes", () => {
  const result = evaluateReleasePolicy({
    changedFiles: [
      "src/components/ui/button.tsx",
      ".changeset/fresh-buttons.md",
    ],
  })

  assert.deepEqual(result, {
    ok: true,
    reason: "Changeset found for package-facing changes.",
  })
})

test("accepts an explicit no-release declaration for internal refactors", () => {
  const result = evaluateReleasePolicy({
    changedFiles: ["src/components/ui/sidebar.tsx"],
    pullRequestBody: "- [x] No package release required\n",
  })

  assert.equal(result.ok, true)
  assert.match(result.reason, /no release/i)
})

test("rejects contradictory release intent", () => {
  const result = evaluateReleasePolicy({
    changedFiles: ["src/index.ts", ".changeset/public-api.md"],
    pullRequestBody: "- [X] No package release required\n",
  })

  assert.equal(result.ok, false)
  assert.match(result.reason, /contradictory/)
})

test("requires release intent when published package fields change", () => {
  const headPackage = {
    ...basePackage,
    peerDependencies: { react: ">=19 <20" },
  }
  const result = evaluateReleasePolicy({
    changedFiles: ["package.json"],
    basePackage,
    headPackage,
  })

  assert.equal(result.ok, false)
  assert.deepEqual(changedReleaseFields(basePackage, headPackage), [
    "peerDependencies",
  ])
})
