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

- Surfaces and text: `--background`, `--foreground`, `--card`,
  `--card-foreground`, `--popover`, `--popover-foreground`
- Actions: `--primary`, `--primary-foreground`, `--secondary`,
  `--secondary-foreground`, `--accent`, `--accent-foreground`,
  `--destructive`, `--success`, `--warning`
- Controls: `--muted`, `--muted-foreground`, `--border`, `--input`, `--ring`
- Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`,
  `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- Shape and typography: `--radius`, `--font-heading`, `--font-sans`

Use `Heading`, `Text`, and `Eyebrow` for shared type roles. The visual variant
is independent from the rendered element:

```tsx
<Heading render={<h1 />} variant="display">A clear proposition</Heading>
<Text variant="lead">Supporting context for the page.</Text>
```

Keep each foreground/background override at WCAG AA contrast.

Normal controls use a minimum 44px interaction target. `xs` and `icon-xs` are
reserved for dense desktop interfaces and should not be used for primary,
navigation, or touch actions. `Button` accepts `loading` to preserve its size,
set `aria-busy`, and prevent repeated activation while work is pending.

Built-in English labels can be localized with `closeLabel` on `DialogContent`,
`DialogFooter`, and `SheetContent`; `label` on `Pagination`, pagination previous
and next controls, `Breadcrumb`, `SidebarTrigger`, and `SidebarRail`; and
`mobileTitle`/`mobileDescription` on `Sidebar`.

Cards use comfortable spacing by default. Use `size="sm"` for dense surfaces
and `size="lg"` for prominent content rather than overriding subcomponent
padding at each call site.

The stylesheet explicitly scans the packaged component source so utilities
used only by shared components are included in Tailwind v4 consumer builds.

## Accessibility

`Alert` defaults to `role="alert"` for urgent content. Pass `role="status"` for
polite announcements or `role={undefined}` for static informational notices.

Give every `Switch` and `Progress` an accessible name with `aria-label` or
`aria-labelledby`. Visible sibling text alone does not name these ARIA widgets;
the showcase repository contains complete labeled examples.

The official Sidebar owns responsive Sheet behavior, open state, keyboard
shortcut, rail, trigger, and menu composition through `SidebarProvider`.

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
