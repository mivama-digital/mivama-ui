import path from "node:path"

import { preparePackageSource } from "./package-source.mjs"
import { runNpm } from "./process.mjs"

export async function prepareAppConsumer({
  root,
  fixtureName,
  artifactsName = fixtureName,
  env,
  maxBuffer,
}) {
  const fixture = path.join(root, "fixtures", fixtureName)
  const artifacts = path.join(root, ".artifacts", artifactsName)
  const packageSource = await preparePackageSource({ root, artifacts })
  const npmOptions = { cwd: fixture }

  if (env !== undefined) npmOptions.env = env
  if (maxBuffer !== undefined) npmOptions.maxBuffer = maxBuffer

  try {
    await runNpm(["ci", "--ignore-scripts"], npmOptions)
    await runNpm(
      [
        "install",
        "--ignore-scripts",
        "--no-save",
        "--package-lock=false",
        packageSource.spec,
      ],
      npmOptions
    )
    await runNpm(["ls", "@mivama/ui", "--depth=0"], npmOptions)
  } catch (error) {
    await packageSource.cleanup()
    throw error
  }

  return {
    fixture,
    npmOptions,
    packageLabel: packageSource.label,
    cleanup: packageSource.cleanup,
  }
}
