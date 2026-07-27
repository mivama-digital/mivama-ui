import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const directory = new URL("../src/components/ui/", import.meta.url);

for (const entry of await readdir(directory)) {
  if (!entry.endsWith(".tsx")) continue;

  const path = join(directory.pathname, entry);
  const source = await readFile(path, "utf8");
  const updated = source
    .replaceAll('"@/lib/utils"', '"../../lib/utils"')
    .replaceAll('"@/hooks/', '"../../hooks/')
    .replaceAll('"@/components/ui/', '"./');

  if (updated !== source) await writeFile(path, updated);
}
