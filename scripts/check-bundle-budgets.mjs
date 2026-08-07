import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { brotliCompressSync, constants, gzipSync } from "node:zlib"

const root = path.resolve(import.meta.dirname, "..")
const budgets = {
  "dist/index.js": { raw: 4_000, gzip: 1_100, brotli: 950 },
  "dist/components/ui/button.js": { raw: 5_500, gzip: 1_900, brotli: 1_700 },
  "dist/components/ui/dialog.js": { raw: 5_500, gzip: 1_700, brotli: 1_500 },
  "dist/components/ui/sheet.js": { raw: 7_000, gzip: 1_900, brotli: 1_700 },
  "dist/components/ui/tooltip.js": { raw: 4_700, gzip: 1_600, brotli: 1_450 },
  "dist/components/ui/sidebar.js": { raw: 25_000, gzip: 5_500, brotli: 4_900 },
  "dist/styles.css": { raw: 7_500, gzip: 2_000, brotli: 1_750 },
  "dist/tokens.css": { raw: 6_200, gzip: 1_500, brotli: 1_300 },
  "dist/themes.css": { raw: 8_500, gzip: 1_750, brotli: 1_500 },
}

function measure(content) {
  return {
    raw: content.length,
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

const results = []
for (const [relativePath, limits] of Object.entries(budgets)) {
  const content = await readFile(path.join(root, relativePath))
  const sizes = measure(content)
  results.push({ relativePath, sizes, limits })

  for (const metric of ["raw", "gzip", "brotli"]) {
    assert.ok(
      sizes[metric] <= limits[metric],
      `${relativePath} ${metric} is ${sizes[metric]} bytes and exceeds its ${limits[metric]} byte budget`
    )
  }
}

for (const { relativePath, sizes, limits } of results) {
  const metrics = ["raw", "gzip", "brotli"].map((metric) => {
    const percentage = Math.round((sizes[metric] / limits[metric]) * 100)
    return `${metric}=${sizes[metric]}/${limits[metric]} (${percentage}%)`
  })
  console.log(`${relativePath}: ${metrics.join(", ")}`)
}
