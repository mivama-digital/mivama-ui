import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const styles = fs.readFileSync(path.join(root, "src/styles.css"), "utf8")

test("scroll layers use anonymous view timelines instead of a shared global name", () => {
  assert.doesNotMatch(styles, /--mivama-scroll-scene/)
  assert.match(styles, /animation-timeline:\s*view\(block\)/)
})

test("scroll motion remains a progressive reduced-motion-safe enhancement", () => {
  assert.match(
    styles,
    /@media \(min-width: 48rem\) and \(prefers-reduced-motion: no-preference\)/
  )
  assert.match(styles, /@supports \(animation-timeline: view\(\)\)/)
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
})
