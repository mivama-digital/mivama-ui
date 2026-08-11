import { readFile, writeFile } from "node:fs/promises"

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
)
const lockUrl = new URL("../package-lock.json", import.meta.url)
const lockfile = JSON.parse(await readFile(lockUrl, "utf8"))

if (!packageJson.version) {
  throw new Error("package.json is missing version")
}

if (!lockfile.packages?.[""]) {
  throw new Error('package-lock.json is missing packages[""] metadata')
}

lockfile.version = packageJson.version
lockfile.packages[""].version = packageJson.version

await writeFile(lockUrl, `${JSON.stringify(lockfile, null, 2)}\n`)
