# Design-system governance

`@mivama/ui` is maintained as a design system, not as a collection of copied application components. New work should strengthen one canonical implementation instead of introducing aliases, parallel primitives, or compatibility layers without a concrete migration need.

## Sources of truth

| Concern | Canonical source |
| --- | --- |
| Design tokens and theme values | `src/tokens.css`, `src/themes.css`, and shared CSS foundations |
| Public component inventory | `config/components.mjs` |
| Published package entry points | `package.json#exports` |
| Generated export documentation | `docs/generated/exports.md` |
| TypeScript public API contract | `etc/api/mivama-ui.api.md` via API Extractor |
| Release intent | Changesets plus the PR release-policy gate |
| Component behavior | Runtime and browser tests |
| Repository security policy | Permanent workflows plus `docs/maintainers/repository-settings.md` |

Do not maintain a second hand-written list when a source above can generate or validate it.

## Component architecture

Use the smallest reusable layer that owns the behavior:

1. **Foundation** — tokens, typography, spacing, radius, elevation, motion, breakpoints.
2. **Primitive** — focused UI behavior with a stable accessibility contract.
3. **Composite** — multiple primitives composed into a reusable interaction.
4. **Pattern** — application-facing arrangement that is still broadly reusable.

Application-specific business logic does not belong in this package.

### Duplication rule

Before adding a component, hook, helper, token, or variant:

- search the registry and public exports for an existing owner of the behavior
- extend the existing owner when the semantics match
- extract shared internal behavior when two implementations would otherwise diverge
- do not keep the old implementation as an unbounded `legacy`, `v1`, or compatibility copy

A temporary compatibility alias is allowed only when an external migration requires it. It must be deprecated, documented, tested, and scheduled for removal in the next appropriate major release.

## Public API changes

Public API changes must satisfy all of the following in the same pull request:

- registry and package exports remain consistent
- API Extractor report is intentionally updated when the type surface changes
- generated export documentation remains synchronized
- consumer tests cover the supported import path
- release intent is recorded with a Changeset unless the change is strictly internal

Avoid re-exporting private implementation modules merely to preserve an accidental import path.

## Token-first styling

Components should use semantic design-system tokens before introducing local values. A new literal value is justified only when it represents component-specific geometry that is not a reusable system concept.

When the same literal or behavior appears repeatedly, promote it to the correct shared layer rather than copying it across components.

## Accessibility contract

Interactive components own their keyboard, focus, ARIA, reduced-motion, contrast, directionality, and browser behavior. Tests should live at the lowest layer that can catch the regression reliably:

- runtime tests for semantics and deterministic state
- Playwright for real focus, keyboard, portal, browser, RTL, and media-mode behavior
- visual regression for rendering states where pixel changes are meaningful

Do not duplicate the same assertion across all three layers unless each layer catches a distinct failure mode.

## Documentation model

Component documentation should have one primary interactive surface once Storybook is introduced. The repository should not maintain separate hand-written prop tables that can drift from TypeScript or API Extractor.

Storybook should consume the real package source and expose the supported matrices:

- product, editorial, and portal themes
- light and dark modes
- comfortable and compact density
- LTR and RTL direction
- accessibility notes and keyboard behavior

The registry remains the inventory source; Storybook becomes the usage and interaction documentation surface rather than another registry.

## Deprecation policy

Prefer removal through an intentional major release over permanent compatibility code.

When deprecation is necessary:

1. mark the public symbol with `@deprecated` and the replacement
2. add migration guidance
3. preserve tests for the deprecated contract only for the supported migration window
4. remove the deprecated path in the next planned major release
5. remove obsolete tests, docs, aliases, and internal adapters in the same removal change

No deprecated path may become a second maintained implementation.

## Definition of done

A design-system change is complete when:

- there is one canonical implementation
- public exports and registry data agree
- tests cover the behavior at the appropriate layers
- accessibility and compatibility impact is addressed
- release intent is recorded
- generated artifacts are synchronized
- obsolete implementation, docs, tests, and aliases are removed instead of left behind
