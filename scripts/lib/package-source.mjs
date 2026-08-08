import { execFile } from "node:child_process"
import { mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

export async function preparePackageSource({ root, artifacts }) {
  const registrySpec = process.env.MIVAMA_PACKAGE_SPEC?.trim()
  if (registrySpec) {
    return {
      spec: registrySpec,
      label: registrySpec,
      cleanup: async () => {},
    }
  }

  await rm(artifacts, { recursive: true, force: true })
  await mkdir(artifacts, { recursive: true })

  const { stdout } = await execFileAsync(
    "npm",
    ["pack", "--json", "--pack-destination", artifacts],
    { cwd: root, maxBuffer: 16 * 1024 * 1024 }
  )
  const [packed] = JSON.parse(stdout)
  const tarball = path.join(artifacts, packed.filename)

  return {
    spec: tarball,
    label: packed.filename,
    cleanup: () => rm(artifacts, { recursive: true, force: true }),
  }
}
