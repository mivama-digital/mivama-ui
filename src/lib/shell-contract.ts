export const BUILT_IN_THEMES = ["product", "editorial", "portal"] as const
export const BUILT_IN_DENSITIES = ["comfortable", "compact"] as const

export type BuiltInMivamaTheme = (typeof BUILT_IN_THEMES)[number]
export type BuiltInMivamaDensity = (typeof BUILT_IN_DENSITIES)[number]

export const DEFAULT_THEME: BuiltInMivamaTheme = "product"
export const DEFAULT_DENSITY: BuiltInMivamaDensity = "comfortable"
