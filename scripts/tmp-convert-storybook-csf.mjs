import { readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const storiesRoot = path.resolve("stories")
const storyFiles = (await readdir(storiesRoot)).filter((file) =>
  file.endsWith(".stories.tsx")
)

for (const file of storyFiles) {
  const target = path.join(storiesRoot, file)
  let source = await readFile(target, "utf8")
  const metaMatch = source.match(
    /const meta = defineMivamaMeta\(\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\s*\)\s*\n\s*export default meta/s
  )

  if (!metaMatch) {
    throw new Error(`Unable to convert Storybook metadata in ${file}`)
  }

  const [, title, description, layout] = metaMatch
  source = source.replace(
    'import { defineMivamaMeta, type MivamaStory } from "./_support.js"',
    'import type { Meta, StoryObj } from "@storybook/react-vite"'
  )
  source = source.replace(
    metaMatch[0],
    `const meta = {\n  title: ${JSON.stringify(title)},\n  tags: ["autodocs"],\n  parameters: {\n    layout: ${JSON.stringify(layout)},\n    docs: {\n      description: {\n        component: ${JSON.stringify(description)},\n      },\n    },\n  },\n} satisfies Meta\n\nexport default meta\n\ntype Story = StoryObj<typeof meta>`
  )
  source = source.replaceAll("MivamaStory", "Story")

  await writeFile(target, source)
}

await rm(path.join(storiesRoot, "_support.ts"), { force: true })
console.log(`Converted ${storyFiles.length} Storybook files to static CSF metadata`)
