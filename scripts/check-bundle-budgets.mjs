import assert from "node:assert/strict"
import { stat } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dirname, "..")
const budgets = {
  "dist/index.js": 45_000,
  "dist/components/ui/button.js": 8_000,
  "dist/components/ui/dialog.js": 16_000,
  "dist/components/ui/sheet.js": 20_000,
  "dist/components/ui/tooltip.js": 12_000,
  "dist/components/ui/sidebar.js": 40_000,
  "dist/styles.css": 80_000,
  "dist/tokens.css": 40_000,
  "dist/themes.css": 40_000,
}

const results = []
for (const [relativePath, limit] of Object.entries(budgets)) {
  const { size } = await stat(path.join(root, relativePath))
  results.push({ relativePath, size, limit })
  assert.ok(
    size <= limit,
    `${relativePath} is ${size} bytes and exceeds its ${limit} byte budget`
  )
}

for (const { relativePath, size, limit } of results) {
  const percentage = Math.round((size / limit) * 100)
  console.log(`${relativePath}: ${size}/${limit} bytes (${percentage}%)`)
}
