import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const workflow = await readFile(".github/workflows/release.yml", "utf8")
const packageJson = JSON.parse(await readFile("package.json", "utf8"))

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

test("release workflow validates the canonical package repository", () => {
  assert.deepEqual(packageJson.repository, {
    type: "git",
    url: "https://github.com/mivama-digital/mivama-ui.git",
  })
  assert.equal(
    packageJson.bugs?.url,
    "https://github.com/mivama-digital/mivama-ui/issues"
  )
  assert.equal(
    packageJson.homepage,
    "https://github.com/mivama-digital/mivama-ui#readme"
  )
  assert.match(
    workflow,
    /https:\/\/github\.com\/mivama-digital\/mivama-ui\.git/
  )
})
