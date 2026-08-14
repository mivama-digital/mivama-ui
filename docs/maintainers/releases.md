# Releases

`@mivama/ui` uses Changesets for release intent and a manual GitHub Actions workflow for npm publishing.

## Release policy

Use semantic versioning for the published package:

| Change                                                        | Release intent     |
| ------------------------------------------------------------- | ------------------ |
| Backwards-compatible bug fix or consumer-visible styling fix  | Patch              |
| Backwards-compatible public API or component capability       | Minor              |
| Breaking public API, behavior, peer requirement, or migration | Major              |
| Tests, docs, CI, or tooling only                              | No package release |
| Strictly internal refactor with unchanged consumer behavior   | No package release |

Pull requests that change `src/**` or release-relevant `package.json` fields are checked by `.github/workflows/policy.yml`. They must either add a Changeset or explicitly check **No package release required** in the pull request template. Do not check both.

The no-release declaration is an escape hatch for genuinely internal work, not a way to skip versioning for consumer-visible changes.

## Release preparation

1. Published-package changes include a Changeset with the appropriate `patch`, `minor`, or `major` bump.
2. Review the pending plan with `npm run release:status`.
3. Run `npm run release:version` on a release branch. This consumes pending Changesets and updates the package version and changelog.
4. Review and merge the version change through the normal pull-request gates.
5. Confirm `main` has no pending `.changeset/*.md` files other than `.changeset/README.md`.

Version-only release preparation changes do not require another Changeset.
Do not publish directly from a feature branch.

## npm Trusted Publisher setup

The repository contains `.github/workflows/release.yml`, but npm must trust that workflow before the first OIDC publish can succeed.

Configure the `@mivama/ui` package on npm with a GitHub Actions trusted publisher using exactly:

- GitHub organization: `mivama-digital`
- Repository: `ui`
- Workflow filename: `release.yml`
- Environment: `npm`
- Allowed action: `npm publish`

The workflow filename, repository, and environment are part of the OIDC trust relationship and must match exactly.

## GitHub environment

Create or configure the `npm` deployment environment in GitHub before the first release:

- require maintainer approval before deployment when the current GitHub plan supports it
- restrict deployment branches to `main` when the current GitHub plan supports it
- do not store an npm write token in the environment

The release workflow itself also refuses to publish when it is not running from `main`, so unavailable plan-specific environment protection must not be replaced with a second custom release system.

## Publishing

Run the `Release` workflow manually from `main` and provide:

- `version`: the exact version currently committed in `package.json`
- `tag`: `latest` for stable versions or `next` for pre-release versions

The workflow then:

1. checks out the exact `main` revision without persisted Git credentials
2. uses a GitHub-hosted Node 24 runner
3. pins npm 11.18.0, which supports npm OIDC trusted publishing
4. performs a clean install without dependency lifecycle scripts
5. validates branch, repository visibility, version, canonical repository metadata derived from the current GitHub repository, pending Changesets, and dist-tag rules
6. refuses to publish when the matching `v<version>` Git tag already exists
7. refuses to publish a version that already exists on npm
8. runs the production dependency audit and full `npm run verify` gate through `prepublishOnly`
9. publishes with `npm publish` using the short-lived OIDC identity supplied by GitHub Actions
10. waits for the exact registry version and provenance attestation to become visible, then runs the canonical registry release probe against that exact published version
11. after the publish job succeeds, creates the matching `v<version>` tag and GitHub Release at the exact workflow commit; releases using the `next` npm tag are marked as GitHub pre-releases

The release is not considered successful merely because `npm publish` returns success. The same workflow must also prove the published artifact through the registry before GitHub release metadata is created.

No `NPM_TOKEN` or other long-lived npm write credential is required for publishing.

## GitHub release synchronization

npm and GitHub release metadata are one release identity:

- package version: `<version>`
- npm package: `@mivama/ui@<version>`
- Git tag: `v<version>`
- GitHub Release: `v<version>`
- source revision: the `main` commit that the `Release` workflow published

The publish job keeps `contents: read` plus the OIDC `id-token: write` permission required by npm Trusted Publishing. A separate downstream job receives `contents: write` only after the publish and registry-verification job succeeds. This prevents package installation, build, and publish verification from running with repository write permissions.

The downstream job uses the GitHub CLI already available on GitHub-hosted runners to create the tag and release. It does not publish to npm and does not receive npm credentials or OIDC permissions.

If only GitHub release synchronization fails after npm publication has already succeeded, re-run the failed `Sync GitHub release` job. Do not dispatch a second npm release for the same version.

## Registry release verification

The canonical `scripts/check-registry-release.mjs` probe verifies the exact package version that consumers receive from npm. It uses bounded retries for registry and attestation propagation, then validates:

- Vite React 18 production build
- Vite React 19 production build
- Next.js App Router production build
- SSR import/render path and public JavaScript/TypeScript subpaths
- root-barrel tree shaking
- npm provenance metadata
- `npm audit signatures`

The manual `Registry Release Probe` workflow remains available for a read-only rerun against an already published exact version. It does not publish and must not gain OIDC publish permissions or npm write credentials.

Do not treat a local tarball-only test as proof that registry publishing is complete.

## Provenance requirement

This release contract requires npm provenance. npm Trusted Publishing generates provenance automatically for public packages published from public GitHub repositories. The release workflow therefore fails before publishing when repository visibility is not public rather than silently weakening the release acceptance criteria.

If repository visibility intentionally changes, update the release policy and acceptance criteria explicitly instead of bypassing this guard.

## After the first successful OIDC release

Once trusted publishing is confirmed to work, the exact registry version passes the probe, and the matching GitHub Release exists, remove or revoke obsolete npm automation write tokens. Keep any token needed for unrelated private-package installation read-only and scoped as narrowly as possible.

## Failure modes

- `ENEEDAUTH`: verify the npm Trusted Publisher configuration matches `mivama-digital/ui`, `release.yml`, and environment `npm` exactly.
- Missing `npm` GitHub environment: create the environment before dispatching the release workflow.
- Environment waiting for approval: expected when deployment protection is enabled.
- Repository visibility failure: provenance is a required release contract; do not publish until the repository visibility and release policy agree.
- Version mismatch: enter the exact `package.json` version or merge the correct version PR first.
- Repository metadata mismatch: `package.json` must point at the current GitHub repository; the workflow derives the expected URL from `GITHUB_SERVER_URL` and `GITHUB_REPOSITORY` instead of hard-coding a historical repository name.
- Existing Git tag: the version is already associated with a source revision; create a new version instead of moving or replacing the tag.
- Version already published: create and merge a new version instead of retrying the same package version.
- Pending Changesets: run the versioning step and merge the resulting release change before publishing.
- Registry/attestation propagation: the canonical probe retries for a bounded period before failing.
- GitHub release synchronization failure after successful npm publication: re-run only the failed synchronization job; do not republish the package.
- Release policy failure: add release intent or explicitly declare a strictly internal no-release change in the PR template.
