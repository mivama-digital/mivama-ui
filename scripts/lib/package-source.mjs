import { mkdir, rm } from "node:fs/promises"
import path from "node:path"

import { runNpm } from "./process.mjs"

export async function preparePackageSource({ root, artifacts }) {
  await rm(artifacts, { recursive: true, force: true })

  const registrySpec = process.env.MIVAMA_PACKAGE_SPEC?.trim()
  if (registrySpec) {
    return {
      spec: registrySpec,
      label: registrySpec,
      cleanup: async () => {},
    }
  }

  await mkdir(artifacts, { recursive: true })
  const { stdout } = await runNpm(
    ["pack", "--json", "--pack-destination", artifacts],
    { cwd: root, echo: false }
  )
  const [packed] = JSON.parse(stdout)
  const tarball = path.join(artifacts, packed.filename)

  return {
    spec: tarball,
    label: packed.filename,
    cleanup: () => rm(artifacts, { recursive: true, force: true }),
  }
}
