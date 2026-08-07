# Changesets

Use a changeset for changes that alter the published `@mivama/ui` consumer contract or should appear in the package changelog.

- `patch`: bug fixes, accessibility corrections, compatible behavior changes, and internal improvements that affect the published package.
- `minor`: new backwards-compatible components, variants, exports, or public capabilities.
- `major`: breaking public API, styling contract, peer-dependency, or behavior changes.

Run `npm run changeset` and commit the generated Markdown file with the pull request.

Documentation-only, CI-only, test-only, and repository-maintenance changes do not need a changeset unless they also change the published package contract.

Maintainers use `npm run release:status` to inspect the pending release plan and `npm run release:version` to consume changesets into the next package version and changelog. Publishing remains a separate protected workflow.
