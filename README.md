# @mivama/ui

Shared brand tokens and React UI primitives for Mivama projects.

## Components

- `Button`
- `Card` and card subcomponents
- `Badge`
- `Alert`
- `Attachment` primitives
- `Breadcrumb`
- `Dialog` and `Sheet`
- `Empty` states
- `Input` and `Textarea`
- `Message` primitives
- `Pagination`
- `Progress`
- `Separator`
- `Container` and `Section`
- `Sidebar`
- `Skeleton`
- `Switch`
- `Tabs`
- `Tooltip`
- `Heading`, `Text`, and `Eyebrow`
- `cn` utility

The package is the single UI source for Mivama websites and client portals. It
owns the Mivama color, typography, shape, focus, and shared component contracts.
Its base components retain the official `base-nova` shadcn/ui composition APIs.

```tsx
import { Button, Card } from "@mivama/ui";
import "@mivama/ui/styles.css";
```

## Theme contract

Import `@mivama/ui/styles.css` once. The stylesheet contains the self-hosted
Onest variable font, Mivama brand tokens, Tailwind utilities, accessible light
defaults on `:root`, and dark defaults below `.dark`. Add `.dark` to a common
ancestor to switch themes.

- Layout: `--page-gutter`, `--container-reading`, `--container-standard`,
  `--container-wide`, `--section-compact`, `--section-default`,
  `--section-hero`, `--layout-gap`, `--content-stack`, `--card-grid-gap`
- Surfaces and text: `--background`, `--foreground`, `--surface`,
  `--surface-elevated`, `--card`, `--card-foreground`, `--popover`,
  `--popover-foreground`
- Actions: `--primary`, `--primary-foreground`, `--secondary`,
  `--secondary-foreground`, `--accent`, `--accent-foreground`,
  `--destructive`, `--success`, `--warning`
- Controls: `--muted`, `--muted-foreground`, `--border`, `--border-strong`,
  `--input`, `--ring`, `--focus-ring`, `--overlay`
- Elevation and motion: `--shadow-subtle`, `--shadow-elevated`,
  `--motion-duration-fast`, `--motion-duration-default`,
  `--motion-easing-standard`
- Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`,
  `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- Shape and typography: `--radius`, `--font-heading`, `--font-sans`

Use `Heading`, `Text`, and `Eyebrow` for shared type roles. The visual variant
is independent from the rendered element:

```tsx
<Heading render={<h1 />} variant="display">A clear proposition</Heading>
<Text variant="lead">Supporting context for the page.</Text>
```

Tailwind exposes the semantic color utilities `bg-surface`,
`bg-surface-elevated`, `border-border-strong`, and `bg-overlay`. Layout,
shadow, and motion values remain runtime CSS properties so responsive and
theme overrides continue to work. Keep each foreground/background override at
WCAG AA contrast.

## Layout and variants

`Container` retains the reading, standard, and wide widths with responsive
20/24/32/40px gutters. `Section` retains its bordered default and supports
`tone="default"`, `tone="muted"`, and `tone="accent"`; combine these with the
existing compact, default, and hero densities.

Normal controls use a minimum 44px interaction target. `xs` and `icon-xs` are
reserved for dense desktop interfaces and should not be used for primary,
navigation, or touch actions. `Button` accepts `loading` to preserve its size,
set `aria-busy`, and prevent repeated activation while work is pending. Use
`variant="navigation"` for shared navigation actions and set
`aria-current="page"` on the active destination.

Built-in English labels can be localized with `closeLabel` on `DialogContent`,
`DialogFooter`, and `SheetContent`; `label` on `Pagination`, pagination previous
and next controls, `Breadcrumb`, `SidebarTrigger`, and `SidebarRail`; and
`mobileTitle`/`mobileDescription` on `Sidebar`.

Cards use comfortable spacing and `variant="surface"` by default. Use
`variant="subtle"` for quieter grouping and `variant="interactive"` when a
card contains a focusable action. Interactive styling uses rings and shadows,
so hover and focus-within do not resize the card. Use `size="sm"` for dense
surfaces and `size="lg"` for prominent content rather than overriding
subcomponent padding at each call site.

Right and left `SheetContent` panels support `size="sm"`, `size="md"`, and
`size="full"`; `sm` remains the default. Pass `overlayClassName` to customize
the shared backdrop without replacing the portal or overlay composition.

The stylesheet explicitly scans the packaged component source so utilities
used only by shared components are included in Tailwind v4 consumer builds.

## Accessibility

`Alert` defaults to `role="alert"` for urgent content. Pass `role="status"` for
polite announcements or `role={undefined}` for static informational notices.

Give every `Switch` and `Progress` an accessible name with `aria-label` or
`aria-labelledby`. Visible sibling text alone does not name these ARIA widgets;
the showcase repository contains complete labeled examples.

The `interactive` Card variant is visual only. Keep the actual link or button
inside the card so keyboard and assistive technology semantics remain native.
Keep localized `closeLabel` text on dialog and sheet close controls. Sheet
sizes preserve safe-area insets, focus management, and contained scrolling.

The official Sidebar owns responsive Sheet behavior, open state, keyboard
shortcut, rail, trigger, and menu composition through `SidebarProvider`.

## Reduced motion

The stylesheet provides a non-`!important` reduced-motion fallback. Button,
interactive Card, Sheet overlay, and Sheet panel transitions also opt out
explicitly with `motion-reduce` utilities. Consumer-owned animation should do
the same rather than relying only on the global fallback.

## Registry sync

`components.json` pins the official `base-nova` preset with the neutral theme.
After adding or refreshing components with the shadcn CLI, normalize package
imports before building:

```bash
npx shadcn@4.15.0 add button --overwrite
npm run sync:imports
npm run verify
```

## Checks

Run `npm run verify` for type checking, declaration build, source contract
tests, and a package smoke test. The smoke test packs the tarball and imports
the extracted package by its `@mivama/ui` name in Node ESM. Linting is
intentionally not exposed until the package has a project-specific ESLint
configuration.

For a consumer that commits a package archive, run this from the package root.
Replace the consumer path once; the generated archive name is deterministic for
version 2.1.0:

```bash
consumer=/absolute/path/to/consumer
mkdir -p "$consumer/vendor"
npm run verify
npm pack --ignore-scripts --pack-destination "$consumer/vendor"
npm install --prefix "$consumer" "$consumer/vendor/mivama-ui-2.1.0.tgz"
npm --prefix "$consumer" run verify
```

Commit the consumer's new archive, `package.json`, and `package-lock.json`
together. Remove the previous archive only after both manifests reference
`mivama-ui-2.1.0.tgz`.
