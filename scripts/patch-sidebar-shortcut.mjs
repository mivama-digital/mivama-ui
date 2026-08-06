import { readFile, writeFile } from "node:fs/promises"

const sidebarPath = "src/components/ui/sidebar.tsx"
const sidebar = await readFile(sidebarPath, "utf8")
const startMarker = "        const target = event.target as HTMLElement | null\n"
const endMarker = "        event.preventDefault()\n"
const start = sidebar.indexOf(startMarker)
const end = sidebar.indexOf(endMarker, start)

if (start === -1 || end === -1) {
  throw new Error("Sidebar shortcut target block not found")
}

const replacement = `        const target = event.target
        if (
          target instanceof Element &&
          (target.matches("input, textarea, select") ||
            target.closest(
              '[contenteditable]:not([contenteditable="false"])'
            ))
        ) {
          return
        }
`

await writeFile(
  sidebarPath,
  sidebar.slice(0, start) + replacement + sidebar.slice(end)
)

const contractPath = "tests/contracts.test.mjs"
const contracts = await readFile(contractPath, "utf8")
const previousContract = `  assert.match(sidebar, /target\\.matches\\("input, textarea, select"\\)/)
  assert.match(sidebar, /target\\.isContentEditable/)`
const nextContract = `  assert.match(sidebar, /target instanceof Element/)
  assert.match(sidebar, /target\\.matches\\("input, textarea, select"\\)/)
  assert.match(sidebar, /target\\.closest\\(/)
  assert.match(sidebar, /contenteditable/)`

if (!contracts.includes(previousContract)) {
  throw new Error("Sidebar shortcut contract block not found")
}

await writeFile(
  contractPath,
  contracts.replace(previousContract, nextContract)
)
