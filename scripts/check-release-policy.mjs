import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { isDeepStrictEqual } from "node:util"
import { fileURLToPath } from "node:url"

const RELEASE_RELEVANT_PACKAGE_FIELDS = [
  "bin",
  "browser",
  "bundledDependencies",
  "dependencies",
  "engines",
  "exports",
  "files",
  "main",
  "optionalDependencies",
  "peerDependencies",
  "sideEffects",
  "types",
  "typesVersions",
]

const NO_RELEASE_PATTERN =
  /^\s*-\s*\[[xX]\]\s*No package release required(?:\s|$)/m

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim()
}

function readJsonAt(ref, file) {
  return JSON.parse(git(["show", `${ref}:${file}`]))
}

function readPullRequestBody(eventPath) {
  if (!eventPath) return ""
  const event = JSON.parse(readFileSync(eventPath, "utf8"))
  return event.pull_request?.body ?? ""
}

export function changedReleaseFields(basePackage, headPackage) {
  return RELEASE_RELEVANT_PACKAGE_FIELDS.filter(
    (field) => !isDeepStrictEqual(basePackage?.[field], headPackage?.[field])
  )
}

export function evaluateReleasePolicy({
  changedFiles,
  basePackage = {},
  headPackage = {},
  pullRequestBody = "",
}) {
  const sourceChanged = changedFiles.some(
    (file) => file === "src" || file.startsWith("src/")
  )
  const packageChanged = changedFiles.includes("package.json")
  const packageFields = packageChanged
    ? changedReleaseFields(basePackage, headPackage)
    : []
  const releaseRelevant = sourceChanged || packageFields.length > 0
  const changesetPresent = changedFiles.some(
    (file) =>
      file.startsWith(".changeset/") &&
      file.endsWith(".md") &&
      file !== ".changeset/README.md"
  )
  const noReleaseDeclared = NO_RELEASE_PATTERN.test(pullRequestBody)

  if (!releaseRelevant) {
    return { ok: true, reason: "No package-facing files changed." }
  }

  if (changesetPresent && noReleaseDeclared) {
    return {
      ok: false,
      reason:
        "Release intent is contradictory: a changeset is present and 'No package release required' is checked.",
    }
  }

  if (changesetPresent) {
    return { ok: true, reason: "Changeset found for package-facing changes." }
  }

  if (noReleaseDeclared) {
    return {
      ok: true,
      reason:
        "Package-facing change explicitly declares that no release is required.",
    }
  }

  const reasons = []
  if (sourceChanged) reasons.push("src/** changed")
  if (packageFields.length > 0) {
    reasons.push(`package.json fields changed: ${packageFields.join(", ")}`)
  }

  return {
    ok: false,
    reason:
      `Package-facing changes require release intent (${reasons.join("; ")}). ` +
      "Add a Changeset, or check 'No package release required' in the pull request when the change is strictly internal and does not require publishing.",
  }
}

function parseArgument(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

export function runReleasePolicy({
  base,
  head,
  eventPath = process.env.GITHUB_EVENT_PATH,
}) {
  if (!base || !head) {
    throw new Error("Both --base and --head commit SHAs are required.")
  }

  const output = git([
    "diff",
    "--name-only",
    "--diff-filter=ACMR",
    `${base}...${head}`,
  ])
  const changedFiles = output ? output.split("\n").filter(Boolean) : []
  const packageChanged = changedFiles.includes("package.json")
  const basePackage = packageChanged ? readJsonAt(base, "package.json") : {}
  const headPackage = packageChanged ? readJsonAt(head, "package.json") : {}
  const result = evaluateReleasePolicy({
    changedFiles,
    basePackage,
    headPackage,
    pullRequestBody: readPullRequestBody(eventPath),
  })

  if (!result.ok) throw new Error(result.reason)
  console.log(`Release policy passed: ${result.reason}`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  runReleasePolicy({
    base: parseArgument("--base"),
    head: parseArgument("--head"),
  })
}
