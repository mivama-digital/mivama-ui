import assert from "node:assert/strict"
import { execFile } from "node:child_process"
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"
import { brotliCompressSync, constants, gzipSync } from "node:zlib"

import { preparePackageSource } from "./lib/package-source.mjs"

const execFileAsync = promisify(execFile)
const root = fileURLToPath(new URL("..", import.meta.url))
const fixture = path.join(root, "fixtures", "vite-react-19")
const artifacts = path.join(root, ".artifacts", "tree-shaking")
const workspace = path.join(fixture, ".tree-shaking")

const absoluteLimits = {
  raw: 64_000,
  gzip: 18_000,
  brotli: 16_000,
}
const rootOverheadLimits = {
  raw: 1_024,
  gzip: 512,
  brotli: 512,
}

async function run(command, args, cwd, env = {}) {
  try {
    const result = await execFileAsync(command, args, {
      cwd,
      env: { ...process.env, ...env },
      maxBuffer: 16 * 1024 * 1024,
    })
    if (result.stdout) process.stdout.write(result.stdout)
    if (result.stderr) process.stderr.write(result.stderr)
    return result.stdout
  } catch (error) {
    if (error.stdout) process.stdout.write(error.stdout)
    if (error.stderr) process.stderr.write(error.stderr)
    throw error
  }
}

function measure(content) {
  return {
    raw: content.length,
    gzip: gzipSync(content, { level: 9 }).length,
    brotli: brotliCompressSync(content, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 },
    }).length,
  }
}

await rm(workspace, { recursive: true, force: true })
const packageSource = await preparePackageSource({ root, artifacts })

try {
  await run("npm", ["ci", "--ignore-scripts"], fixture)
  await run(
    "npm",
    [
      "install",
      "--ignore-scripts",
      "--no-save",
      "--package-lock=false",
      packageSource.spec,
    ],
    fixture
  )
  await run("npm", ["ls", "@mivama/ui", "--depth=0"], fixture)

  await mkdir(workspace, { recursive: true })
  await writeFile(
    path.join(workspace, "direct.js"),
    'import { Button } from "@mivama/ui/button"; console.log(Button)\n'
  )
  await writeFile(
    path.join(workspace, "root.js"),
    'import { Button } from "@mivama/ui"; console.log(Button)\n'
  )
  await writeFile(
    path.join(workspace, "vite.config.mjs"),
    `import { defineConfig } from "vite"
import path from "node:path"

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(process.env.TREE_ENTRY),
      formats: ["es"],
      fileName: "bundle",
    },
    outDir: path.resolve(process.env.TREE_OUT),
    emptyOutDir: true,
    minify: "oxc",
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
  },
})
`
  )

  const results = {}
  for (const name of ["direct", "root"]) {
    const outputDirectory = path.join(workspace, `dist-${name}`)
    await run(
      "npm",
      [
        "exec",
        "--",
        "vite",
        "build",
        "--config",
        path.join(workspace, "vite.config.mjs"),
      ],
      fixture,
      {
        TREE_ENTRY: path.join(workspace, `${name}.js`),
        TREE_OUT: outputDirectory,
      }
    )

    const bundlePath = path.join(outputDirectory, "bundle.js")
    await stat(bundlePath)
    const content = await readFile(bundlePath)
    results[name] = measure(content)

    for (const metric of ["raw", "gzip", "brotli"]) {
      assert.ok(
        results[name][metric] <= absoluteLimits[metric],
        `${name} Button bundle ${metric} is ${results[name][metric]} bytes and exceeds ${absoluteLimits[metric]}`
      )
    }
  }

  for (const metric of ["raw", "gzip", "brotli"]) {
    const overhead = results.root[metric] - results.direct[metric]
    assert.ok(
      overhead <= rootOverheadLimits[metric],
      `root Button bundle adds ${overhead} ${metric} bytes over the direct subpath; limit is ${rootOverheadLimits[metric]}`
    )
  }

  console.log(
    `Tree shaking passed with ${packageSource.label}: direct=${JSON.stringify(results.direct)}, root=${JSON.stringify(results.root)}`
  )
} finally {
  await rm(workspace, { recursive: true, force: true })
  await packageSource.cleanup()
}
