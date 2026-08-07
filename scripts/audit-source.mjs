import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = path.join(root, "src")

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await walk(target)))
    else if (/\.(?:ts|tsx)$/.test(entry.name)) files.push(target)
  }

  return files
}

const forbiddenPatterns = [
  ["eval", /\beval\s*\(/],
  ["Function constructor", /\bnew\s+Function\s*\(/],
  ["dangerouslySetInnerHTML", /dangerouslySetInnerHTML/],
  ["javascript URL", /["'`]javascript:/i],
  ["document.write", /document\.write\s*\(/],
]

const violations = []
for (const file of await walk(sourceRoot)) {
  const source = await readFile(file, "utf8")
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(source)) {
      violations.push(`${path.relative(root, file)}: ${label}`)
    }
  }
}

const workflow = await readFile(
  path.join(root, ".github/workflows/verify.yml"),
  "utf8"
)
assert.doesNotMatch(workflow, /uses:\s+[^\s]+@(?:main|master|v\d+)\b/)
assert.match(workflow, /persist-credentials:\s*false/)
assert.match(workflow, /npm ci --ignore-scripts/)

assert.deepEqual(
  violations,
  [],
  `Source audit violations:\n${violations.join("\n")}`
)
console.log("Source security audit passed")
