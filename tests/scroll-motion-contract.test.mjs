import assert from "node:assert/strict"
import test from "node:test"

import { readRoot, readUiSource } from "./lib/source.mjs"

const [styles, scene] = await Promise.all([
  readRoot("src/styles.css"),
  readUiSource("scroll-scene"),
])

test("scroll scenes stay server-compatible and transform-only", () => {
  assert.doesNotMatch(scene, /["']use client["']/)
  assert.match(styles, /mivama-scroll-layer-parallax/)
  assert.match(styles, /data-effect="parallax"/)

  const keyframes = styles.slice(
    styles.indexOf("@keyframes mivama-scroll-layer-reveal"),
    styles.indexOf("@media (min-width: 48rem)")
  )
  assert.match(keyframes, /transform:/)
  assert.doesNotMatch(keyframes, /opacity|filter|top:|left:/)
})

test("scroll layers use isolated anonymous view timelines", () => {
  assert.doesNotMatch(styles, /--mivama-scroll-scene/)
  assert.match(styles, /animation-timeline:\s*view\(block\)/)
})

test("scroll motion remains a progressive reduced-motion-safe enhancement", () => {
  assert.match(styles, /@supports \(animation-timeline: view\(\)\)/)
  assert.match(
    styles,
    /@media \(min-width: 48rem\) and \(prefers-reduced-motion: no-preference\)/
  )
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/)
})
