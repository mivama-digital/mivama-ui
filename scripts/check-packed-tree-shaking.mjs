import assert from "node:assert/strict"
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"

import { bundleSizeMetrics, measureBundleSize } from "./lib/bundle-size.mjs"
import { prepareAppConsumer } from "./lib/app-consumer.mjs"
import { runNpm } from "./lib/process.mjs"

const root = path.resolve(import.meta.dirname, "..")
const consumer = await prepareAppConsumer({
  root,
  fixtureName: "vite-react-19",
  artifactsName: "tree-shaking",
})
const workspace = path.join(consumer.fixture, ".tree-shaking")

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

try {
  await rm(workspace, { recursive: true, force: true })
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
    await runNpm(
      [
        "exec",
        "--",
        "vite",
        "build",
        "--config",
        path.join(workspace, "vite.config.mjs"),
      ],
      {
        ...consumer.npmOptions,
        env: {
          TREE_ENTRY: path.join(workspace, `${name}.js`),
          TREE_OUT: outputDirectory,
        },
      }
    )

    const bundlePath = path.join(outputDirectory, "bundle.js")
    await stat(bundlePath)
    const content = await readFile(bundlePath)
    results[name] = measureBundleSize(content)

    for (const metric of bundleSizeMetrics) {
      assert.ok(
        results[name][metric] <= absoluteLimits[metric],
        `${name} Button bundle ${metric} is ${results[name][metric]} bytes and exceeds ${absoluteLimits[metric]}`
      )
    }
  }

  for (const metric of bundleSizeMetrics) {
    const overhead = results.root[metric] - results.direct[metric]
    assert.ok(
      overhead <= rootOverheadLimits[metric],
      `root Button bundle adds ${overhead} ${metric} bytes over the direct subpath; limit is ${rootOverheadLimits[metric]}`
    )
  }

  console.log(
    `Tree shaking passed with ${consumer.packageLabel}: direct=${JSON.stringify(results.direct)}, root=${JSON.stringify(results.root)}`
  )
} finally {
  await rm(workspace, { recursive: true, force: true })
  await consumer.cleanup()
}
