import assert from "node:assert/strict"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = path.join(root, "src")
const workflowRoot = path.join(root, ".github", "workflows")

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

const workflowFiles = (await readdir(workflowRoot)).filter((file) =>
  /\.ya?ml$/.test(file)
)
assert.ok(
  workflowFiles.length > 0,
  "Expected at least one GitHub Actions workflow"
)

for (const file of workflowFiles) {
  const workflow = await readFile(path.join(workflowRoot, file), "utf8")
  const actionReferences = [
    ...workflow.matchAll(/uses:\s+([^\s@]+)@([^\s#]+)/g),
  ]

  for (const [, action, reference] of actionReferences) {
    assert.match(
      reference,
      /^[0-9a-f]{40}$/,
      `${file}: ${action} must be pinned to an immutable full commit SHA`
    )
  }

  const checkoutCount = actionReferences.filter(
    ([, action]) => action === "actions/checkout"
  ).length
  const nonPersistentCheckoutCount = [
    ...workflow.matchAll(/persist-credentials:\s*false/g),
  ].length
  assert.ok(
    nonPersistentCheckoutCount >= checkoutCount,
    `${file}: every actions/checkout step must disable persisted credentials`
  )
}

const verifyWorkflow = await readFile(
  path.join(workflowRoot, "verify.yml"),
  "utf8"
)
assert.match(verifyWorkflow, /npm ci --ignore-scripts/)

assert.deepEqual(
  violations,
  [],
  `Source audit violations:\n${violations.join("\n")}`
)
console.log("Source and workflow security audit passed")
