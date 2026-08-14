import assert from "node:assert/strict"
import test from "node:test"

import { readJson, readRoot } from "./lib/source.mjs"

const workflow = await readRoot(".github/workflows/release.yml")
const packageJson = await readJson("package.json")

test("release workflow is manual, OIDC-only, and GitHub-hosted", () => {
  assert.match(workflow, /on:\n  workflow_dispatch:/)
  assert.doesNotMatch(workflow, /\n  push:/)
  assert.doesNotMatch(workflow, /\n  pull_request:/)

  assert.match(workflow, /contents: read/)
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /runs-on: ubuntu-latest/)
  assert.match(workflow, /environment: npm/)
  assert.match(workflow, /persist-credentials: false/)
  assert.match(workflow, /package-manager-cache: false/)

  assert.match(workflow, /npm install --global npm@11\.18\.0/)
  assert.match(workflow, /npm ci --ignore-scripts/)
  assert.match(workflow, /npm publish --access public --tag/)
  assert.equal(packageJson.scripts?.prepublishOnly, "npm run verify")
  assert.equal(packageJson.scripts?.["release:publish"], undefined)
  assert.doesNotMatch(workflow, /run: npm run verify/)

  assert.doesNotMatch(workflow, /NPM_TOKEN/)
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN/)
})

test("release workflow requires provenance-capable repository visibility", () => {
  assert.match(workflow, /github\.event\.repository\.visibility/)
  assert.match(workflow, /REPOSITORY_VISIBILITY !== "public"/)
  assert.match(workflow, /requires npm provenance/)
})

test("release workflow reserves the matching Git tag before publishing", () => {
  const tagCheckIndex = workflow.indexOf("git ls-remote --tags origin")
  const publishIndex = workflow.indexOf(
    'run: npm publish --access public --tag "$NPM_TAG"'
  )

  assert.ok(tagCheckIndex >= 0, "release workflow must check the Git tag")
  assert.ok(
    tagCheckIndex < publishIndex,
    "Git tag conflicts must fail before npm publish"
  )
  assert.match(
    workflow,
    /release versions must map to one immutable source revision/
  )
})

test("release workflow verifies the exact published version after publish", () => {
  const publishIndex = workflow.indexOf(
    'run: npm publish --access public --tag "$NPM_TAG"'
  )
  const probeIndex = workflow.indexOf(
    'node scripts/check-registry-release.mjs "${{ inputs.version }}"'
  )

  assert.ok(publishIndex >= 0, "release workflow must publish through npm")
  assert.ok(probeIndex > publishIndex, "registry probe must run after publish")
})

test("GitHub release synchronization runs only after verified publishing", () => {
  const probeIndex = workflow.indexOf(
    'node scripts/check-registry-release.mjs "${{ inputs.version }}"'
  )
  const syncJobIndex = workflow.indexOf("\n  github-release:")
  const publishJob = workflow.slice(0, syncJobIndex)
  const syncJob = workflow.slice(syncJobIndex)

  assert.ok(
    syncJobIndex > probeIndex,
    "GitHub release job must be declared after the registry probe"
  )
  assert.match(syncJob, /needs: publish/)
  assert.match(syncJob, /permissions:\n      contents: write/)
  assert.doesNotMatch(publishJob, /contents: write/)
  assert.match(syncJob, /release_tag="v\$\{VERSION\}"/)
  assert.match(syncJob, /release create "\$release_tag"/)
  assert.match(syncJob, /--target "\$GITHUB_SHA"/)
  assert.match(syncJob, /--generate-notes/)
  assert.match(syncJob, /args\+=\(--prerelease\)/)
})

test("release workflow validates the canonical package repository", () => {
  assert.deepEqual(packageJson.repository, {
    type: "git",
    url: "https://github.com/mivama-digital/ui.git",
  })
  assert.equal(
    packageJson.bugs?.url,
    "https://github.com/mivama-digital/ui/issues"
  )
  assert.equal(
    packageJson.homepage,
    "https://github.com/mivama-digital/ui#readme"
  )
  assert.match(workflow, /GITHUB_SERVER_URL/)
  assert.match(workflow, /GITHUB_REPOSITORY/)
  assert.doesNotMatch(workflow, /mivama-digital\/mivama-ui/)
})
