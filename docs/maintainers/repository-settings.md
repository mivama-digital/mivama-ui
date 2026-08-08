# Repository operating settings

This document defines the repository settings and maintainer conventions that are useful for `mivama-digital/mivama-ui` without depending on plan- or visibility-specific GitHub enforcement features.

Repository policy must match capabilities that are actually available. Do not commit permanently failing workflows or document unavailable rulesets as required infrastructure.

## Merge discipline

Use pull requests for normal changes and prefer squash merges so temporary bootstrap, formatting, and migration commits do not become permanent history.

Maintainers should:

- merge only after the relevant permanent CI jobs pass
- resolve review conversations before merge
- keep pull requests focused on one responsibility
- delete superseded implementations in the same migration instead of retaining `legacy`, `old`, or `v2` copies
- avoid direct pushes to `main` during normal development even when the repository plan cannot enforce that convention
- avoid force-pushing `main`

If stronger branch protection becomes available later, configure it to enforce these existing conventions rather than creating a second policy model.

## Permanent CI gates

The repository owns the checks it can execute consistently:

- Verify / Node 20 package compatibility
- Verify / Node 22 full verification
- Verify / Node 24 full verification
- Storybook build
- Consumer compatibility
- Browser / Chromium
- Browser / Firefox
- Browser / WebKit
- Release policy
- CodeQL when code scanning is available for the repository plan and visibility

A check that is unavailable for the current repository plan must not be represented by a permanently failing placeholder workflow.

## Release policy

`.github/workflows/policy.yml` enforces release intent for package-facing pull requests. Changes that affect published package behavior require a Changeset; strictly internal refactors, tests, docs, or CI-only changes may explicitly declare **No package release required** in the pull request template.

Changesets remain the only release metadata format. Do not introduce labels, custom version files, or a second release manifest for the same purpose.

## GitHub Actions permissions

- Keep default workflow permissions read-only.
- Grant write permissions only to the job that actually needs them.
- Pin external actions to immutable full commit SHAs.
- Keep `persist-credentials: false` on checkout steps unless the job intentionally writes to the repository.
- Keep the repository source audit responsible for validating action pins and checkout credential handling across permanent workflows; do not add one pin checker per workflow.
- Do not keep temporary write-capable bootstrap or formatter workflows after a migration is complete.

## Security features

Enable repository-hosted security features when they are available for the current plan and visibility, including Dependabot alerts/security updates, secret scanning, push protection, private vulnerability reporting, and code scanning.

The repository already keeps Dependabot configuration and permanent source/workflow audits in version control. Those remain useful regardless of whether plan-specific GitHub security products are available.

Do not add these as required repository workflows when the current plan cannot run them reliably:

- Dependency Review action
- OpenSSF Scorecard action/SARIF upload
- plan-specific branch rulesets or required-check enforcement

If the repository plan changes later, add a capability only after it can run successfully and replace an existing gap. Do not keep dormant or permanently red workflows in anticipation of an upgrade.

## npm publishing

- Use npm Trusted Publishing with OpenID Connect.
- Use a GitHub Environment named `npm` for production publishing when environment protection is available.
- Restrict publishing to `main` in the release workflow itself.
- Grant `id-token: write` only to the publish job.
- Do not store a long-lived npm write token when Trusted Publishing is available.
- Validate the exact published version with the registry release probe after publishing.

## Verification checklist

After changing repository policy or CI:

1. Open or update a focused pull request.
2. Confirm every permanent workflow that applies can actually execute for the repository plan and visibility.
3. Confirm Verify, Consumer, Browser, and release-policy coverage remain green where relevant.
4. Confirm external actions remain pinned to immutable commit SHAs.
5. Confirm read-only workflows do not persist checkout credentials.
6. Confirm temporary/bootstrap workflows and generated outputs are absent from the final branch.
7. Confirm the pull request does not introduce a second registry, release format, provider, state machine, or compatibility implementation for an existing concern.
8. Squash merge after validation so migration scaffolding does not remain in permanent history.

## Maintenance ownership

Review this document when changing any of the following:

- `.github/workflows/verify.yml`
- `.github/workflows/policy.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/browser.yml`
- `.github/workflows/consumer.yml`
- `.github/CODEOWNERS`
- repository merge settings
- GitHub Actions permissions
- npm publishing workflows

The repository should have one operational policy: version-controlled gates plus the strongest available GitHub settings, never a second aspirational policy that the current repository cannot enforce.
