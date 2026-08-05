import { readFile, writeFile } from "node:fs/promises"

const path = "src/components/ui/sidebar.tsx"
let source = await readFile(path, "utf8")

source = source.replace(
  'import { cn } from "../../lib/utils.js"\n',
  `import { cn } from "../../lib/utils.js"\nimport {\n  persistSidebarState,\n  readSidebarState,\n  type SidebarCookieOptions,\n  type SidebarPersistence,\n} from "./sidebar-persistence.js"\n`
)

source = source.replace(
  'const SIDEBAR_COOKIE_NAME = "sidebar_state"\nconst SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7\n',
  ""
)

source = source.replace(
  `  onOpenChange: setOpenProp,\n  className,`,
  `  onOpenChange: setOpenProp,\n  persistence = "none",\n  storageKey = "mivama-sidebar",\n  cookieOptions,\n  className,`
)

source = source.replace(
  `  onOpenChange?: (open: boolean) => void\n}) {`,
  `  onOpenChange?: (open: boolean) => void\n  persistence?: SidebarPersistence\n  storageKey?: string\n  cookieOptions?: SidebarCookieOptions\n}) {`
)

source = source.replace(
  `  const [_open, _setOpen] = React.useState(defaultOpen)\n  const open = openProp ?? _open`,
  `  const [_open, _setOpen] = React.useState(defaultOpen)\n  const hasRestoredPersistence = React.useRef(false)\n  const open = openProp ?? _open\n\n  React.useEffect(() => {\n    if (hasRestoredPersistence.current) return\n    hasRestoredPersistence.current = true\n    if (openProp !== undefined) return\n\n    const persistedOpen = readSidebarState({\n      persistence,\n      storageKey,\n      cookieOptions,\n    })\n    if (persistedOpen !== null) _setOpen(persistedOpen)\n  }, [openProp, persistence, storageKey, cookieOptions])`
)

source = source.replace(
  `      // This sets the cookie to keep the sidebar state.\n      document.cookie = \`${"${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}"}\``,
  `      persistSidebarState(openState, {\n        persistence,\n        storageKey,\n        cookieOptions,\n      })`
)

source = source.replace(
  `    [setOpenProp, open]\n  )`,
  `    [setOpenProp, open, persistence, storageKey, cookieOptions]\n  )`
)

source += `\nexport type { SidebarCookieOptions, SidebarPersistence } from "./sidebar-persistence.js"\n`

if (source.includes("SIDEBAR_COOKIE_NAME") || source.includes("document.cookie = `${SIDEBAR_COOKIE_NAME}")) {
  throw new Error("Legacy sidebar cookie persistence was not fully removed")
}

await writeFile(path, source)
