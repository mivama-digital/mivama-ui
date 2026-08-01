import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdtemp, mkdir, readFile, rename, rm, symlink, writeFile } from "node:fs/promises"
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
    await symlink(path.join(root, "node_modules", dependency), target, "junction")
  }

  const checkFile = path.join(temp, "check.mjs")
  await writeFile(
    checkFile,
    'import * as ui from "@mivama/ui";\n' +
      'import { BentoGrid } from "@mivama/ui/bento-grid";\n' +
      'import { Button } from "@mivama/ui/button";\n' +
      'import { Card } from "@mivama/ui/card";\n' +
      'import { Input } from "@mivama/ui/forms";\n' +
      'import { ScrollScene } from "@mivama/ui/scroll-scene";\n' +
      'import { SheetPortal } from "@mivama/ui/sheet";\n' +
      'if ([ui.Button, BentoGrid, Button, Card, Input, ScrollScene, SheetPortal].some((value) => typeof value !== "function")) process.exit(1);\n'
  )
  await execFileAsync(process.execPath, [checkFile], { cwd: temp })

  const packedPackage = JSON.parse(await readFile(path.join(packageDir, "package.json"), "utf8"))
  assert.deepEqual(packedPackage.sideEffects, ["**/*.css"])
  console.log(`Imported packed ${packedPackage.name}@${packedPackage.version} in Node ESM`)
} finally {
  await rm(temp, { recursive: true, force: true })
}
