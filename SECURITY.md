# Security Policy

## Supported versions

Security fixes are applied to the latest published major version of `@mivama/ui`.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting feature for this repository. Include:

- affected package version or commit
- impacted component or export
- reproduction steps
- expected and actual behavior
- potential impact
- suggested mitigation, if known

Reports should avoid real user data, production credentials, or destructive proof-of-concept payloads.

## Response process

Maintainers will validate the report, assess severity, prepare a fix, and coordinate disclosure. A security advisory and patched release will be published when appropriate.

## Scope

Relevant reports include:

- unsafe DOM or URL handling
- cross-site scripting risks
- focus or portal behavior that bypasses security boundaries
- dependency or release-chain compromise
- unintended package contents
- credential exposure in workflows or published artifacts

General feature requests and styling bugs should use normal GitHub issues.
