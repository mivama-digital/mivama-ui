export function getModuleExportSubpaths(packageJson) {
  if (!packageJson.exports || typeof packageJson.exports !== "object") {
    throw new Error(
      `${packageJson.name ?? "Package"} is missing package exports`
    )
  }

  return Object.keys(packageJson.exports).filter(
    (subpath) => !subpath.endsWith(".css")
  )
}

export function getModuleImportSpecifiers(packageJson) {
  return getModuleExportSubpaths(packageJson).map((subpath) =>
    subpath === "."
      ? packageJson.name
      : `${packageJson.name}/${subpath.slice(2)}`
  )
}
