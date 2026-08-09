import assert from "node:assert/strict"
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import {
  getModuleExportSubpaths,
  getModuleImportSpecifiers,
} from "./lib/package-exports.mjs"
import { preparePackageSource } from "./lib/package-source.mjs"
import { runCommand, runNpm } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const temp = await mkdtemp(path.join(tmpdir(), "mivama-ui-pack-"))
const artifacts = path.join(temp, "artifacts")
const packageSource = await preparePackageSource({
  root,
  artifacts,
  ignoreScripts: true,
})
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
  const packedPackage = JSON.parse(
    await readFile(path.join(packageDir, "package.json"), "utf8")
  )
  const moduleSubpaths = getModuleExportSubpaths(packedPackage)
  const importSpecifiers = getModuleImportSpecifiers(packedPackage)

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
  await runCommand(process.execPath, [checkFile], commandOptions)

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
    `Validated packed ${packedPackage.name}@${packedPackage.version} with ${moduleSubpaths.length} module exports using ${packageSource.label}`
  )
} finally {
  await packageSource.cleanup()
  await rm(temp, { recursive: true, force: true })
}
