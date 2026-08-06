import { readFile, writeFile } from "node:fs/promises"

const path = "src/components/ui/sidebar.tsx"
const source = await readFile(path, "utf8")
const startMarker = "        const target = event.target as HTMLElement | null\n"
const endMarker = "        event.preventDefault()\n"
const start = source.indexOf(startMarker)
const end = source.indexOf(endMarker, start)

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

await writeFile(path, source.slice(0, start) + replacement + source.slice(end))
