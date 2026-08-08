# Production-readiness audit

Run this audit before declaring a release train or major design-system milestone complete. The checklist references existing gates instead of duplicating their implementation.

## Build and quality

- [ ] `npm ci --ignore-scripts`
- [ ] `npm run verify`
- [ ] lint, formatting, source audit, typecheck, build, API Extractor, coverage, contract tests, package validation, Storybook coverage/build, and bundle budgets are green
- [ ] no generated or temporary migration files remain

## Package contract

- [ ] `npm pack` validation passes
- [ ] Publint passes
- [ ] Are The Types Wrong passes for supported entry points
- [ ] registry, `package.json#exports`, generated export docs, Storybook coverage, and API report are synchronized
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
- [ ] Axe scans are green for the maintained high-risk browser states
- [ ] visual regression baselines are intentional and reviewed
- [ ] keyboard/focus contracts are green for high-risk interactive components
- [ ] reduced motion, contrast, forced colors, and RTL coverage is green where supported

## Supply chain and repository security

- [ ] Release policy is green for package-facing changes
- [ ] Dependabot npm and GitHub Actions updates remain configured
- [ ] permanent workflow actions are pinned to immutable commit SHAs
- [ ] checkout credentials are not persisted in read-only workflows
- [ ] no temporary write-capable workflow remains after migration/bootstrap work
- [ ] no permanently failing workflow exists solely for a feature unavailable to the current repository plan or visibility
- [ ] CodeQL/code scanning is green when the repository plan and visibility support it
- [ ] available repository-hosted security features are enabled without duplicating version-controlled checks

Unavailable plan-specific features are not completion blockers. Do not emulate them with redundant custom systems or keep red placeholder workflows; use the repository's existing audits and CI until the capability becomes available.

## Release

- [ ] release intent is represented by Changesets
- [ ] release versioning has consumed pending Changesets
- [ ] `main` has no pending release Changesets before publish
- [ ] npm Trusted Publisher matches `mivama-digital/mivama-ui` and `release.yml`
- [ ] publishing is restricted to `main` by the release workflow
- [ ] GitHub environment `npm` is configured when environment protection is available
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
- [ ] `npm audit signatures` succeeds for the installed registry graph

## Documentation and maintenance

- [ ] README points to canonical generated/export documentation instead of duplicating it
- [ ] every registry component has Storybook usage documentation
- [ ] TypeScript/API Extractor remain the API contract; Storybook does not duplicate hand-written prop tables
- [ ] breaking changes include migration guidance
- [ ] deprecated compatibility paths have an explicit removal target
- [ ] no obsolete implementation, test, workflow, documentation path, or duplicate source of truth remains after migration
- [ ] repository search finds no accidental `legacy`, `old`, `v2`, temporary, or superseded implementation left as an active alternative

Any unchecked external/admin item should remain tracked by an open GitHub issue rather than being treated as complete by documentation alone.
