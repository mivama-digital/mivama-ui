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

const duplicateValues = (values) =>
  values.filter((value, index) => values.indexOf(value) !== index)

for (const duplicate of new Set(
  duplicateValues(components.map(({ name }) => name))
)) {
  errors.push(`Duplicate component name: ${duplicate}`)
}
for (const duplicate of new Set(
  duplicateValues(components.map(({ slug }) => slug))
)) {
  errors.push(`Duplicate component slug: ${duplicate}`)
}
for (const duplicate of new Set(
  duplicateValues(components.map(({ source }) => source))
)) {
  errors.push(`Duplicate component source: ${duplicate}`)
}

for (const component of components) {
  const sourcePath = path.join(root, component.source)
  try {
    const sourceStat = await stat(sourcePath)
    if (!sourceStat.isFile()) {
      errors.push(`Source is not a file: ${component.source}`)
    }
  } catch {
    errors.push(`Missing source file: ${component.source}`)
  }

  const exportKey = `./${component.slug}`
  const packageExport = packageJson.exports?.[exportKey]
  if (!packageExport) {
    errors.push(`Missing package export: ${exportKey}`)
    continue
  }
  if (typeof packageExport !== "object") {
    errors.push(
      `Component export must define types/import/default: ${exportKey}`
    )
    continue
  }
  if (!packageExport.types || !packageExport.import || !packageExport.default) {
    errors.push(`Incomplete package export contract: ${exportKey}`)
  }
  if (packageExport.import !== packageExport.default) {
    errors.push(`Import/default mismatch: ${exportKey}`)
  }
}

const uiFiles = (await readdir(path.join(root, "src/components/ui")))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => `src/components/ui/${file}`)
  .sort()
const registeredUiFiles = components
  .map(({ source }) => source)
  .filter(
    (source) =>
      source.startsWith("src/components/ui/") && source.endsWith(".tsx")
  )
  .sort()

for (const source of uiFiles) {
  if (!registeredUiFiles.includes(source)) {
    errors.push(`Unregistered public UI source: ${source}`)
  }
}
for (const source of registeredUiFiles) {
  if (!uiFiles.includes(source)) {
    errors.push(`Registry references unknown UI source: ${source}`)
  }
}

const moduleExportKeys = Object.entries(packageJson.exports ?? {})
  .filter(([key, value]) => key !== "." && typeof value === "object")
  .map(([key]) => key.slice(2))
  .sort()
const registeredSlugs = components.map(({ slug }) => slug).sort()
for (const slug of moduleExportKeys) {
  if (!registeredSlugs.includes(slug)) {
    errors.push(`Unregistered module export: ./${slug}`)
  }
}
for (const slug of registeredSlugs) {
  if (!moduleExportKeys.includes(slug)) {
    errors.push(`Registry slug has no module export: ./${slug}`)
  }
}

const sorted = [...components].sort((a, b) => a.slug.localeCompare(b.slug))
const sections = sorted.map(
  ({
    name,
    slug,
    category,
    status,
    client,
    interactive,
  }) => `## \`@mivama/ui/${slug}\`

- Primary component: ${name}
- Category: ${category}
- Status: ${status}
- Client boundary: ${client ? "Yes" : "No"}
- Interactive: ${interactive ? "Yes" : "No"}`
)
const generated = `# Package exports

This file is generated from \`config/components.mjs\`. Do not edit it manually.

${sections.join("\n\n")}
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

console.log(`Validated ${components.length} registered module exports`)
