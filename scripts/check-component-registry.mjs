import { readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { components } from "../config/components.mjs"

const root = process.cwd()
const writeMode = process.argv.includes("--write")
const packageJson = JSON.parse(
  await readFile(path.join(root, "package.json"), "utf8")
)
const errors = []

const findDuplicates = (values) =>
  new Set(values.filter((value, index) => values.indexOf(value) !== index))

const setDifference = (left, right) =>
  [...left].filter((value) => !right.has(value))

const validateModuleExport = (key, value) => {
  if (!value || typeof value !== "object") {
    errors.push(`Module export must define types/import/default: ${key}`)
    return
  }
  if (!value.types || !value.import || !value.default) {
    errors.push(`Incomplete package export contract: ${key}`)
  }
  if (value.import !== value.default) {
    errors.push(`Import/default mismatch: ${key}`)
  }
}

for (const [label, values] of [
  ["component name", components.map(({ name }) => name)],
  ["component slug", components.map(({ slug }) => slug)],
  ["component source", components.map(({ source }) => source)],
]) {
  for (const duplicate of findDuplicates(values)) {
    errors.push(`Duplicate ${label}: ${duplicate}`)
  }
}

const rootExport = packageJson.exports?.["."]
validateModuleExport(".", rootExport)

for (const component of components) {
  const sourcePath = path.join(root, component.source)
  try {
    if (!(await stat(sourcePath)).isFile()) {
      errors.push(`Source is not a file: ${component.source}`)
    }
  } catch {
    errors.push(`Missing source file: ${component.source}`)
  }

  const exportKey = `./${component.slug}`
  validateModuleExport(exportKey, packageJson.exports?.[exportKey])
}

const uiFiles = new Set(
  (await readdir(path.join(root, "src/components/ui")))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => `src/components/ui/${file}`)
)
const registeredUiFiles = new Set(
  components
    .map(({ source }) => source)
    .filter(
      (source) =>
        source.startsWith("src/components/ui/") && source.endsWith(".tsx")
    )
)

for (const source of setDifference(uiFiles, registeredUiFiles)) {
  errors.push(`Unregistered public UI source: ${source}`)
}
for (const source of setDifference(registeredUiFiles, uiFiles)) {
  errors.push(`Registry references unknown UI source: ${source}`)
}

const moduleExportSlugs = new Set(
  Object.entries(packageJson.exports ?? {})
    .filter(([key, value]) => key !== "." && typeof value === "object")
    .map(([key]) => key.slice(2))
)
const registeredSlugs = new Set(components.map(({ slug }) => slug))

for (const slug of setDifference(moduleExportSlugs, registeredSlugs)) {
  errors.push(`Unregistered module export: ./${slug}`)
}
for (const slug of setDifference(registeredSlugs, moduleExportSlugs)) {
  errors.push(`Registry slug has no module export: ./${slug}`)
}

const sorted = [...components].sort((a, b) => a.slug.localeCompare(b.slug))
const moduleSections = sorted.map(
  ({ name, slug, category, status, client, interactive }) => {
    const packageExport = packageJson.exports[`./${slug}`]
    return `## \`@mivama/ui/${slug}\`

- Primary component: ${name}
- Category: ${category}
- Status: ${status}
- Client boundary: ${client ? "Yes" : "No"}
- Interactive: ${interactive ? "Yes" : "No"}
- Types: \`${packageExport.types}\`
- Runtime: \`${packageExport.import}\``
  }
)

const stylesheetExports = Object.entries(packageJson.exports ?? {})
  .filter(([key, value]) => key !== "." && typeof value === "string")
  .sort(([left], [right]) => left.localeCompare(right))

const stylesheetLines = stylesheetExports.length
  ? stylesheetExports
      .map(
        ([key, target]) => `- \`@mivama/ui/${key.slice(2)}\` → \`${target}\``
      )
      .join("\n")
  : "- None"

const generated = `# Package exports

This file is generated from \`config/components.mjs\` and \`package.json\`. Do not edit it manually.

The registry is the authoritative catalog of public JavaScript/TypeScript component subpaths. Package export validation fails when a public module is missing from the registry or a registered module is missing from \`package.json\`.

## Root barrel

- Import: \`@mivama/ui\`
- Types: \`${rootExport?.types ?? "missing"}\`
- Runtime: \`${rootExport?.import ?? "missing"}\`

## Component and module subpaths

${moduleSections.join("\n\n")}

## Stylesheet exports

${stylesheetLines}
`
const docsPath = path.join(root, "docs/generated/exports.md")

if (writeMode) {
  await writeFile(docsPath, generated)
} else {
  let existing = ""
  try {
    existing = await readFile(docsPath, "utf8")
  } catch {
    errors.push(
      "Missing generated export documentation: docs/generated/exports.md"
    )
  }
  if (existing && existing !== generated) {
    errors.push(
      "Generated export documentation is stale. Run npm run registry:write."
    )
  }
}

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}

console.log(
  `Validated ${components.length} registered module exports and ${stylesheetExports.length} stylesheet exports`
)
