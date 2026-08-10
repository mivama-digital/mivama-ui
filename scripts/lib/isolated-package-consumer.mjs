import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { preparePackageSource } from "./package-source.mjs"
import { runNpm } from "./process.mjs"

export async function prepareIsolatedPackageConsumer({
  root,
  tempPrefix,
  ignorePackScripts = false,
}) {
  const workspace = await mkdtemp(path.join(tmpdir(), tempPrefix))
  const artifacts = path.join(workspace, "artifacts")
  let packageSource

  const cleanup = async () => {
    try {
      if (packageSource) await packageSource.cleanup()
    } finally {
      await rm(workspace, { recursive: true, force: true })
    }
  }

  try {
    packageSource = await preparePackageSource({
      root,
      artifacts,
      ignoreScripts: ignorePackScripts,
    })
    await writeFile(
      path.join(workspace, "package.json"),
      JSON.stringify({ private: true, type: "module" })
    )

    const commandOptions = { cwd: workspace }
    await runNpm(
      [
        "install",
        "--ignore-scripts",
        "--package-lock=false",
        packageSource.spec,
      ],
      commandOptions
    )

    const packageDir = path.join(workspace, "node_modules", "@mivama", "ui")
    const installedPackage = JSON.parse(
      await readFile(path.join(packageDir, "package.json"), "utf8")
    )

    return {
      workspace,
      packageDir,
      installedPackage,
      commandOptions,
      packageLabel: packageSource.label,
      cleanup,
    }
  } catch (error) {
    await cleanup()
    throw error
  }
}
