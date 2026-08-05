type SidebarPersistence = "none" | "localStorage" | "cookie"

type SidebarCookieOptions = {
  path?: string
  maxAge?: number
  sameSite?: "Lax" | "Strict" | "None"
  secure?: boolean
}

type SidebarPersistenceOptions = {
  persistence: SidebarPersistence
  storageKey: string
  cookieOptions?: SidebarCookieOptions
}

function parseSidebarState(value: string | null | undefined) {
  if (value === "true") return true
  if (value === "false") return false
  return null
}

function readSidebarState({
  persistence,
  storageKey,
}: SidebarPersistenceOptions): boolean | null {
  if (typeof window === "undefined" || persistence === "none") return null

  try {
    if (persistence === "localStorage") {
      return parseSidebarState(window.localStorage.getItem(storageKey))
    }

    const entry = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${encodeURIComponent(storageKey)}=`))

    return parseSidebarState(
      entry ? decodeURIComponent(entry.slice(entry.indexOf("=") + 1)) : null
    )
  } catch {
    return null
  }
}

function persistSidebarState(
  open: boolean,
  { persistence, storageKey, cookieOptions }: SidebarPersistenceOptions
) {
  if (typeof window === "undefined" || persistence === "none") return

  try {
    if (persistence === "localStorage") {
      window.localStorage.setItem(storageKey, String(open))
      return
    }

    const {
      path = "/",
      maxAge = 60 * 60 * 24 * 7,
      sameSite = "Lax",
      secure = window.location.protocol === "https:",
    } = cookieOptions ?? {}

    const attributes = [
      `Path=${path}`,
      `Max-Age=${maxAge}`,
      `SameSite=${sameSite}`,
    ]
    if (secure) attributes.push("Secure")

    document.cookie = `${encodeURIComponent(storageKey)}=${encodeURIComponent(
      String(open)
    )}; ${attributes.join("; ")}`
  } catch {
    // Storage can be blocked by browser privacy settings. The UI must remain usable.
  }
}

export { parseSidebarState, persistSidebarState, readSidebarState }
export type {
  SidebarCookieOptions,
  SidebarPersistence,
  SidebarPersistenceOptions,
}
