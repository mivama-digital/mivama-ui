import { execFile } from "node:child_process"
import {
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const root = path.resolve(import.meta.dirname, "..")
const temp = await mkdtemp(path.join(tmpdir(), "mivama-ui-ssr-"))

try {
  const { stdout } = await execFileAsync(
    "npm",
    ["pack", "--json", "--pack-destination", temp],
    { cwd: root, maxBuffer: 16 * 1024 * 1024 }
  )
  const [{ filename }] = JSON.parse(stdout)
  await execFileAsync("tar", ["-xzf", path.join(temp, filename), "-C", temp])

  const packageDir = path.join(temp, "node_modules", "@mivama", "ui")
  await mkdir(path.dirname(packageDir), { recursive: true })
  await rename(path.join(temp, "package"), packageDir)

  for (const dependency of [
    "@base-ui/react",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "react",
    "react-dom",
    "tailwind-merge",
    "tw-animate-css",
  ]) {
    const target = path.join(temp, "node_modules", dependency)
    await mkdir(path.dirname(target), { recursive: true })
    await symlink(
      path.join(root, "node_modules", dependency),
      target,
      "junction"
    )
  }

  const packedPackage = JSON.parse(
    await readFile(path.join(packageDir, "package.json"), "utf8")
  )
  const moduleSubpaths = Object.keys(packedPackage.exports).filter(
    (subpath) => !subpath.endsWith(".css")
  )
  const importSpecifiers = moduleSubpaths.map((subpath) =>
    subpath === "."
      ? packedPackage.name
      : `${packedPackage.name}/${subpath.slice(2)}`
  )

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
      `  React.createElement(\n` +
      `    editorial.EditorialGrid,\n` +
      `    null,\n` +
      `    React.createElement("div", null, "SSR editorial")\n` +
      `  ),\n` +
      `  React.createElement(\n` +
      `    bento.BentoGrid,\n` +
      `    null,\n` +
      `    React.createElement(bento.BentoGridItem, null, "SSR bento")\n` +
      `  ),\n` +
      `  React.createElement(\n` +
      `    scroll.ScrollScene,\n` +
      `    null,\n` +
      `    React.createElement(scroll.ScrollLayer, null, "SSR scroll")\n` +
      `  )\n` +
      `);\n` +
      `const html = renderToStaticMarkup(tree);\n` +
      `for (const text of ["SSR editorial", "SSR bento", "SSR scroll"]) {\n` +
      `  if (!html.includes(text)) throw new Error(\`Missing SSR output: \${text}\`);\n` +
      `}\n` +
      `console.log(\`Imported \${specifiers.length} packed ESM entry points and rendered SSR markup\`);\n`
  )

  const { stdout: checkOutput, stderr: checkError } = await execFileAsync(
    process.execPath,
    [checkFile],
    { cwd: temp, maxBuffer: 16 * 1024 * 1024 }
  )
  if (checkOutput) process.stdout.write(checkOutput)
  if (checkError) process.stderr.write(checkError)
} finally {
  await rm(temp, { recursive: true, force: true })
}
