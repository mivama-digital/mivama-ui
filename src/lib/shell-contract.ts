export type MivamaTheme = "product" | "editorial" | "portal" | (string & {})
export type MivamaDensity = "comfortable" | "compact" | (string & {})

export const BUILT_IN_THEMES = ["product", "editorial", "portal"] as const
export const BUILT_IN_DENSITIES = ["comfortable", "compact"] as const

export const DEFAULT_THEME = "product" satisfies MivamaTheme
export const DEFAULT_DENSITY = "comfortable" satisfies MivamaDensity
