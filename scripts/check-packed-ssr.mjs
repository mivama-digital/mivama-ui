import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { getModuleImportSpecifiers } from "./lib/package-exports.mjs"
import { preparePackageSource } from "./lib/package-source.mjs"
import { runCommand, runNpm } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const temp = await mkdtemp(path.join(tmpdir(), "mivama-ui-ssr-"))
const artifacts = path.join(temp, "artifacts")
const packageSource = await preparePackageSource({ root, artifacts })
const commandOptions = { cwd: temp, maxBuffer: 16 * 1024 * 1024 }

try {
  await writeFile(
    path.join(temp, "package.json"),
    JSON.stringify({ private: true, type: "module" })
  )
  await runNpm(
    ["install", "--ignore-scripts", "--package-lock=false", packageSource.spec],
    commandOptions
  )

  const packageDir = path.join(temp, "node_modules", "@mivama", "ui")
  const installedPackage = JSON.parse(
    await readFile(path.join(packageDir, "package.json"), "utf8")
  )
  const importSpecifiers = getModuleImportSpecifiers(installedPackage)

  const checkFile = path.join(temp, "ssr-check.mjs")
  await writeFile(
    checkFile,
    `import * as React from "react";\n` +
      `import { renderToStaticMarkup } from "react-dom/server";\n` +
      `const specifiers = ${JSON.stringify(importSpecifiers)};\n` +
      `for (const specifier of specifiers) {\n` +
      `  const namespace = await import(specifier);\n` +
      `  if (Object.keys(namespace).length === 0) throw new Error(\`Empty module: \${specifier}\`);\n` +
      `}\n` +
      `const bento = await import("@mivama/ui/bento-grid");\n` +
      `const editorial = await import("@mivama/ui/editorial-grid");\n` +
      `const scroll = await import("@mivama/ui/scroll-scene");\n` +
      `const tree = React.createElement(\n` +
      `  "main",\n` +
      `  null,\n` +
      `  React.createElement(editorial.EditorialGrid, null, React.createElement("div", null, "SSR editorial")),\n` +
      `  React.createElement(bento.BentoGrid, null, React.createElement(bento.BentoGridItem, null, "SSR bento")),\n` +
      `  React.createElement(scroll.ScrollScene, null, React.createElement(scroll.ScrollLayer, null, "SSR scroll"))\n` +
      `);\n` +
      `const html = renderToStaticMarkup(tree);\n` +
      `for (const text of ["SSR editorial", "SSR bento", "SSR scroll"]) {\n` +
      `  if (!html.includes(text)) throw new Error(\`Missing SSR output: \${text}\`);\n` +
      `}\n` +
      `console.log(\`Imported \${specifiers.length} ESM entry points and rendered SSR markup\`);\n`
  )

  await runCommand(process.execPath, [checkFile], commandOptions)
  console.log(`SSR consumer passed with ${packageSource.label}`)
} finally {
  await packageSource.cleanup()
  await rm(temp, { recursive: true, force: true })
}
