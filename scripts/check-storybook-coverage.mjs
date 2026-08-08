import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { components } from "../config/components.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const storiesRoot = path.join(root, "stories")
const files = await readdir(storiesRoot)
const actualStoryFiles = files.filter((file) => file.endsWith(".stories.tsx")).sort()
const expectedStoryFiles = components.map(({ slug }) => `${slug}.stories.tsx`).sort()

assert.deepEqual(
  actualStoryFiles,
  expectedStoryFiles,
  "Storybook stories must match the component registry exactly"
)

for (const { name, slug } of components) {
  const story = await readFile(path.join(storiesRoot, `${slug}.stories.tsx`), "utf8")
  assert.match(
    story,
    /export const Basic\b/,
    `${name} must expose a Basic Storybook story`
  )
}

console.log(`Storybook coverage matches ${components.length} registry entries`)
