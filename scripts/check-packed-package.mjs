import assert from "node:assert/strict"
import { access, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  getModuleExportSubpaths,
  getModuleImportSpecifiers,
} from "./lib/package-exports.mjs"
import {
  prepareIsolatedPackageConsumer,
} from "./lib/isolated-package-consumer.mjs"
import { runCommand } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const consumer = await prepareIsolatedPackageConsumer({
  root,
  tempPrefix: "mivama-ui-pack-",
  ignorePackScripts: true,
})

try {
  const { installedPackage, packageDir, workspace, commandOptions } = consumer
  const moduleSubpaths = getModuleExportSubpaths(installedPackage)
  const importSpecifiers = getModuleImportSpecifiers(installedPackage)

  const checkFile = path.join(workspace, "check.mjs")
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

  assert.deepEqual(installedPackage.sideEffects, ["**/*.css"])
  for (const stylesheet of ["styles.css", "tokens.css", "themes.css"]) {
    assert.equal(
      installedPackage.exports[`./${stylesheet}`],
      `./dist/${stylesheet}`
    )
    await access(path.join(packageDir, "dist", stylesheet))
  }

  for (const [subpath, target] of Object.entries(installedPackage.exports)) {
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
    `Validated packed ${installedPackage.name}@${installedPackage.version} with ${moduleSubpaths.length} module exports using ${consumer.packageLabel}`
  )
} finally {
  await consumer.cleanup()
}
