import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import {
  access,
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
const temp = await mkdtemp(path.join(tmpdir(), "mivama-ui-pack-"))

try {
  const { stdout } = await execFileAsync(
    "npm",
    ["pack", "--ignore-scripts", "--json", "--pack-destination", temp],
    { cwd: root }
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

  const checkFile = path.join(temp, "check.mjs")
  await writeFile(
    checkFile,
    `const specifiers = ${JSON.stringify(importSpecifiers)};\n` +
      "for (const specifier of specifiers) {\n" +
      "  const namespace = await import(specifier);\n" +
      "  if (Object.keys(namespace).length === 0) throw new Error(`Empty module: ${specifier}`);\n" +
      "}\n" +
      "console.log(`Imported ${specifiers.length} public module entry points`);\n"
  )
  await execFileAsync(process.execPath, [checkFile], { cwd: temp })

  assert.deepEqual(packedPackage.sideEffects, ["**/*.css"])
  for (const stylesheet of ["styles.css", "tokens.css", "themes.css"]) {
    assert.equal(
      packedPackage.exports[`./${stylesheet}`],
      `./dist/${stylesheet}`
    )
    await access(path.join(packageDir, "dist", stylesheet))
  }

  for (const [subpath, target] of Object.entries(packedPackage.exports)) {
    if (typeof target === "string") continue
    assert.equal(typeof target.types, "string", `${subpath} is missing types`)
    assert.equal(typeof target.import, "string", `${subpath} is missing import`)
    assert.equal(
      target.default,
      target.import,
      `${subpath} default/import mismatch`
    )
    await access(path.join(packageDir, target.import))
    await access(path.join(packageDir, target.types))
  }

  console.log(
    `Validated packed ${packedPackage.name}@${packedPackage.version} with ${moduleSubpaths.length} module exports`
  )
} finally {
  await rm(temp, { recursive: true, force: true })
}
