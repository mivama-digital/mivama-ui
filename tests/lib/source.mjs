import { readFile } from "node:fs/promises"

export const readRoot = (path) =>
  readFile(new URL(`../../${path}`, import.meta.url), "utf8")

export const readJson = async (path) => JSON.parse(await readRoot(path))

export const readUiSource = (name) =>
  readRoot(`src/components/ui/${name}.tsx`)
