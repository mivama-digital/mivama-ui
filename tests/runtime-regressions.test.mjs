import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const readSource = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8")

test("portal shell synchronization updates every portal and removes stale attributes", async () => {
  const source = await readSource("src/lib/shell-attributes.ts")

  assert.match(source, /document\.querySelectorAll\(portalSelector\)/)
  assert.match(source, /element\.removeAttribute\(attribute\)/)
  assert.match(source, /shellObserver\.observe\(shell,[\s\S]*attributes: true/)
  assert.match(source, /attributeFilter: \[\.\.\.SHELL_ATTRIBUTES\]/)
  assert.match(source, /portalObserver\.disconnect\(\)/)
  assert.match(source, /shellObserver\.disconnect\(\)/)
})

test("mobile detection uses the same media-query snapshot for subscription and reads", async () => {
  const source = await readSource("src/hooks/use-mobile.ts")

  assert.match(source, /const MOBILE_QUERY =/)
  assert.match(
    source,
    /useSyncExternalStore\(subscribe, getSnapshot, getServerSnapshot\)/
  )
  assert.match(source, /window\.matchMedia\(MOBILE_QUERY\)\.matches/)
  assert.doesNotMatch(source, /window\.innerWidth/)
})

test("verification workflow pins actions and avoids install lifecycle scripts", async () => {
  const source = await readSource(".github/workflows/verify.yml")

  assert.match(source, /actions\/checkout@[a-f0-9]{40}/)
  assert.match(source, /actions\/setup-node@[a-f0-9]{40}/)
  assert.match(source, /persist-credentials: false/)
  assert.match(source, /npm ci --ignore-scripts/)
  assert.match(source, /cancel-in-progress: true/)
})
