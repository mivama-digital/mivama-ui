# Storybook stories

Storybook is the interactive usage documentation for `@mivama/ui`. It is not a second component registry or public API definition.

## Sources of truth

- `config/components.mjs` defines which public component entries require stories.
- TypeScript and API Extractor define the public type/API contract.
- `docs/generated/exports.md` defines the generated package export catalog.
- `stories/*.stories.tsx` demonstrate supported composition and interaction only.

`npm run storybook:check` requires exactly one `<registry-slug>.stories.tsx` file with a `Basic` story for every registry entry. Add or remove the registry entry and its story in the same change.

## Story rules

- Compose the real public components; do not create Storybook-only component implementations.
- Keep CSF metadata statically analyzable by Storybook rather than hiding it behind helper factories.
- Reuse `_examples.tsx` only for example composition shared by story files; it must not become an alternate component implementation.
- Put API details in TypeScript/API Extractor instead of maintaining hand-written prop tables.
- Use the global toolbar for product/editorial/portal theme, light/dark mode, comfortable/compact density, and LTR/RTL direction.

Run `npm run storybook:typecheck` and `npm run storybook:build` before merging Storybook changes. Generated `storybook-static/` output is intentionally ignored and must not be committed.
