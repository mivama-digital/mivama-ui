# Releases

`@mivama/ui` uses Changesets for release intent and a manual GitHub Actions workflow for npm publishing.

## Release preparation

1. Published-package changes should include a Changeset with the appropriate `patch`, `minor`, or `major` bump.
2. Review the pending plan with `npm run release:status`.
3. Run `npm run release:version` on a release branch. This consumes pending Changesets and updates the package version and changelog.
4. Review and merge the version change through the normal pull-request gates.
5. Confirm `main` has no pending `.changeset/*.md` files other than `.changeset/README.md`.

Do not publish directly from a feature branch.

## npm Trusted Publisher setup

The repository contains `.github/workflows/release.yml`, but npm must trust that workflow before the first OIDC publish can succeed.

Configure the `@mivama/ui` package on npm with a GitHub Actions trusted publisher using exactly:

- GitHub organization: `mivama-digital`
- Repository: `mivama-ui`
- Workflow filename: `release.yml`
- Environment: `npm`
- Allowed action: `npm publish`

The workflow filename and environment are part of the OIDC trust relationship and must match exactly.

## GitHub environment

Create or configure the `npm` deployment environment in GitHub before the first release:

- require maintainer approval before deployment
- restrict deployment branches to `main`
- do not store an npm write token in the environment

The release workflow itself also refuses to publish when it is not running from `main`.

## Publishing

Run the `Release` workflow manually from `main` and provide:

- `version`: the exact version currently committed in `package.json`
- `tag`: `latest` for stable versions or `next` for pre-release versions

The workflow then:

1. checks out the exact `main` revision without persisted Git credentials
2. uses a GitHub-hosted Node 24 runner
3. pins npm 11.18.0, which supports npm OIDC trusted publishing
4. performs a clean install without dependency lifecycle scripts
5. validates branch, version, repository metadata, pending Changesets, and dist-tag rules
6. refuses to publish a version that already exists on npm
7. runs the production dependency audit and full `npm run verify` gate
8. publishes with `npm publish` using the short-lived OIDC identity supplied by GitHub Actions

No `NPM_TOKEN` or other long-lived npm write credential is required for publishing.

## After the first successful OIDC release

Once trusted publishing is confirmed to work, remove/revoke obsolete npm automation write tokens. Keep any token needed for unrelated private-package installation read-only and scoped as narrowly as possible.

Public releases from this public repository receive npm provenance automatically when published through Trusted Publishing.

## Failure modes

- `ENEEDAUTH`: verify the npm Trusted Publisher configuration matches `mivama-digital/mivama-ui`, `release.yml`, and environment `npm` exactly.
- Environment waiting for approval: expected when deployment protection is enabled.
- Version mismatch: enter the exact `package.json` version or merge the correct version PR first.
- Version already published: create and merge a new version instead of retrying the same package version.
- Pending Changesets: run the versioning step and merge the resulting release change before publishing.
