# Repository protection settings

This document defines the required GitHub repository settings for `mivama-digital/mivama-ui`.
It is the maintainer checklist for protecting the default branch and the package supply chain.
Repository administrators must keep these settings aligned with the permanent workflow job names.

## Default branch ruleset

Create an active branch ruleset targeting `main` with the following settings.

### Pull requests

- Require a pull request before merging.
- Require at least one approving review.
- Dismiss stale approvals when new commits are pushed.
- Require approval of the most recent reviewable push.
- Require all review conversations to be resolved.
- Require Code Owner review when a matching `CODEOWNERS` rule applies.
- Require branches to be up to date before merging.

### Required status checks

Require these exact permanent checks:

- `Node 20 (package)`
- `Node 22 (full)`
- `Node 24 (full)`
- `CodeQL / analyze`
- `Release policy`
- `Dependency review`

The two Policy workflow checks become eligible to require after `.github/workflows/policy.yml` has landed on `main` and each check has completed successfully at least once.

Treat job names as repository-level interfaces. If a workflow job name changes, update the ruleset in the same maintenance window.

### History and branch safety

- Block force pushes.
- Block branch deletion.
- Require linear history only if the repository standardizes on squash or rebase merges.
- Do not allow direct pushes to `main`.
- Do not allow bypasses for normal maintainers.
- Limit emergency bypasses to repository administrators and require a documented follow-up pull request.

## Merge settings

Recommended repository merge configuration:

- Enable squash merge.
- Disable merge commits unless preserving multi-parent history is explicitly required.
- Optionally enable rebase merge for maintainers.
- Automatically delete head branches after merge.
- Enable automatic merging only after all required checks and reviews pass.

## Actions permissions

- Default `GITHUB_TOKEN` permissions to read-only.
- Grant write permissions only per job where necessary.
- Do not permit unreviewed third-party actions.
- Pin external actions to immutable full commit SHAs.
- Restrict workflow approval for first-time external contributors.
- Keep `persist-credentials: false` on checkout steps unless a job intentionally writes to the repository.
- Keep the repository security audit responsible for validating action pins across every permanent workflow rather than maintaining per-workflow duplicate checks.

## Security features

Enable and retain:

- Dependency Graph.
- Dependabot alerts.
- Dependabot security updates.
- Secret scanning.
- Secret scanning push protection.
- Private vulnerability reporting.
- CodeQL advanced setup from `.github/workflows/codeql.yml`; do not also enable a duplicate default CodeQL setup.
- Dependency Review through `.github/workflows/policy.yml`.
- OpenSSF Scorecard through `.github/workflows/scorecard.yml`.

Dependency Review intentionally fails closed when Dependency Graph is disabled. Enable Dependency Graph before requiring the `Dependency review` check.

If a feature is unavailable for the repository plan or visibility, record that limitation in an issue rather than silently omitting it.

## npm publishing

- Use npm Trusted Publishing with OpenID Connect.
- Use a protected GitHub Environment named `npm` for production publishing.
- Grant `id-token: write` only to the publish job.
- Publish only from the protected default branch after the complete verification pipeline.
- Do not store a long-lived npm automation token when Trusted Publishing is available.

## Verification checklist

After creating or changing the ruleset:

1. Open a test pull request with a harmless documentation change.
2. Confirm that each required check appears with the exact expected name.
3. Confirm that merge is blocked while a required check is pending or failing.
4. Confirm that unresolved review conversations block merge.
5. Confirm that a direct push to `main` is rejected.
6. Confirm that force push and branch deletion are rejected.
7. Query the GitHub API and confirm `main` reports protected before closing the protection issue.
8. Close or merge the test pull request and record any deviations in a GitHub issue.

## Maintenance ownership

Changes to any of the following require reviewing this document and the live ruleset together:

- `.github/workflows/verify.yml`
- `.github/workflows/policy.yml`
- `.github/workflows/codeql.yml`
- `.github/workflows/scorecard.yml`
- `.github/CODEOWNERS`
- repository merge settings
- GitHub Actions permissions
- npm publishing workflows
