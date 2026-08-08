# Production-readiness audit

Run this audit before declaring a release train or major design-system milestone complete. The checklist references existing gates instead of duplicating their implementation.

## Build and quality

- [ ] `npm ci --ignore-scripts`
- [ ] `npm run verify`
- [ ] lint, formatting, source audit, typecheck, build, API Extractor, coverage, contract tests, package validation, and bundle budgets are green
- [ ] no generated or temporary migration files remain

## Package contract

- [ ] `npm pack` validation passes
- [ ] Publint passes
- [ ] Are The Types Wrong passes for supported entry points
- [ ] registry, `package.json#exports`, generated export docs, and API report are synchronized
- [ ] root and subpath imports remain tree-shakeable

## Consumers

- [ ] React 18 consumer is green
- [ ] React 19 consumer is green
- [ ] Vite production consumer is green
- [ ] Next.js App Router consumer is green
- [ ] SSR import/render contract is green
- [ ] tests consume the packed package where package behavior is under test

## Browser and accessibility

- [ ] Chromium functional suite is green
- [ ] Firefox functional suite is green
- [ ] WebKit functional suite is green
- [ ] visual regression baselines are intentional and reviewed
- [ ] keyboard/focus contracts are green for high-risk interactive components
- [ ] reduced motion, contrast, forced colors, and RTL coverage is green where supported

## Supply chain and repository security

- [ ] CodeQL is green
- [ ] Dependency & release policy is green
- [ ] OpenSSF Scorecard workflow has completed successfully on `main`
- [ ] Dependabot npm and GitHub Actions updates remain enabled
- [ ] permanent workflow actions are pinned to immutable commit SHAs
- [ ] checkout credentials are not persisted in read-only workflows
- [ ] default-branch ruleset is active and verified through the GitHub API
- [ ] required checks match `docs/maintainers/repository-settings.md`

## Release

- [ ] release intent is represented by Changesets
- [ ] release versioning has consumed pending Changesets
- [ ] `main` has no pending release Changesets before publish
- [ ] GitHub environment `npm` is protected and restricted to `main`
- [ ] npm Trusted Publisher matches `mivama-digital/mivama-ui`, `release.yml`, and environment `npm`
- [ ] no long-lived npm publish token is required
- [ ] the exact package version is unpublished before the workflow starts
- [ ] the published registry version has npm provenance

## Registry release probe

After the first OIDC-backed publish, validate the exact npm registry version in clean consumers. A local tarball alone is not sufficient evidence for the publishing path.

- [ ] Vite build using the registry version
- [ ] Next.js production build using the registry version
- [ ] SSR import/render using the registry version
- [ ] public subpath imports using the registry version
- [ ] tree-shaking comparison using the registry version

## Documentation and maintenance

- [ ] README points to the canonical generated/export documentation instead of duplicating it
- [ ] public components have usage and accessibility documentation in the canonical component-doc surface
- [ ] breaking changes include migration guidance
- [ ] deprecated compatibility paths have an explicit removal target
- [ ] no obsolete implementation, test, workflow, or documentation path remains after migration

Any unchecked external/admin item should remain tracked by an open GitHub issue rather than being treated as complete by documentation alone.
