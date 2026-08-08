# Security Policy

## Supported versions

Security fixes are applied to the latest published major version of `@mivama/ui`.

## Reporting a vulnerability

Do not open a normal repository issue or discussion for a suspected vulnerability.

Report the issue directly to a repository administrator through an approved private organization communication channel. Include:

- affected package version or commit
- impacted component or export
- reproduction steps
- expected and actual behavior
- potential impact
- suggested mitigation, if known

Do not include real user data, production credentials, or destructive proof-of-concept payloads.

If repository visibility or GitHub capabilities change later, maintainers may enable a dedicated GitHub vulnerability-reporting flow. Update this policy at the same time rather than documenting a reporting feature that is not available to the repository.

## Response process

Maintainers will validate the report, assess severity, prepare a fix, and coordinate disclosure through the private reporting channel available to the organization. Publish a security advisory or patched release when the repository/platform supports that process and disclosure is appropriate.

## Scope

Relevant reports include:

- unsafe DOM or URL handling
- cross-site scripting risks
- focus or portal behavior that bypasses security boundaries
- dependency or release-chain compromise
- unintended package contents
- credential exposure in workflows or published artifacts

General feature requests and styling bugs should use normal GitHub issues.
