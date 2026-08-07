import { execFile } from "node:child_process"
import { mkdir, rm } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)
const root = fileURLToPath(new URL("..", import.meta.url))
const fixture = path.join(root, "fixtures", "next-app-router")
const artifacts = path.join(root, ".artifacts")

async function runNpm(args, cwd) {
  try {
    const result = await execFileAsync("npm", args, {
      cwd,
      env: {
        ...process.env,
        NEXT_TELEMETRY_DISABLED: "1",
      },
      maxBuffer: 32 * 1024 * 1024,
    })
    if (result.stderr) process.stderr.write(result.stderr)
    return result.stdout
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

await rm(artifacts, { recursive: true, force: true })
await mkdir(artifacts, { recursive: true })

try {
  const packOutput = await runNpm(
    ["pack", "--json", "--pack-destination", artifacts],
    root
  )
  const [packed] = JSON.parse(packOutput)
  const tarball = path.join(artifacts, packed.filename)

  await runNpm(["ci", "--ignore-scripts"], fixture)
  await runNpm(
    [
      "install",
      "--ignore-scripts",
      "--no-save",
      "--package-lock=false",
      tarball,
    ],
    fixture
  )
  await runNpm(["ls", "@mivama/ui", "--depth=0"], fixture)
  await runNpm(["run", "typecheck"], fixture)
  await runNpm(["run", "build"], fixture)

  console.log("Next App Router packed consumer fixture passed")
} finally {
  await rm(artifacts, { recursive: true, force: true })
}
