import assert from "node:assert/strict"
import test from "node:test"

import { components } from "../config/components.mjs"
import { readJson, readRoot } from "./lib/source.mjs"

test("package metadata and lockfile agree on the current version", async () => {
  const [packageJson, lockfile] = await Promise.all([
    readJson("package.json"),
    readJson("package-lock.json"),
  ])

  assert.equal(lockfile.version, packageJson.version)
  assert.equal(lockfile.packages[""].version, packageJson.version)
})

test("all registry components have package subpath exports", async () => {
  const packageJson = await readJson("package.json")

  for (const { slug } of components) {
    const subpath = `./${slug}`
    assert.ok(packageJson.exports[subpath], `missing ${subpath} export`)
    assert.equal(typeof packageJson.exports[subpath].types, "string")
    assert.equal(typeof packageJson.exports[subpath].import, "string")
  }
})

test("package exports cover maintained modules and stylesheets", async () => {
  const packageJson = await readJson("package.json")

  for (const subpath of [
    "button",
    "sheet",
    "card",
    "scroll-scene",
    "bento-grid",
    "forms",
  ]) {
    assert.ok(packageJson.exports[`./${subpath}`])
  }
  for (const stylesheet of ["styles.css", "tokens.css", "themes.css"]) {
    assert.equal(packageJson.exports[`./${stylesheet}`], `./dist/${stylesheet}`)
  }
})

test("manual packed-consumer guidance uses the generated archive name", async () => {
  const readme = await readRoot("README.md")

  assert.match(readme, /npm run verify/)
  assert.match(readme, /npm pack --ignore-scripts --pack-destination/)
  assert.match(readme, /archive=\$\(npm pack/)
  assert.match(readme, /vendor\/\$archive/)
  assert.doesNotMatch(readme, /mivama-ui-\d+\.\d+\.\d+\.tgz/)
})
