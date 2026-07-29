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

## Accessibility

`Alert` uses the upstream `role="alert"` contract. Use it for urgent content;
use another semantic container for static informational notices.

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

Run `npm run verify` for type checking, declaration build, stylesheet copy,
and an `npm pack --dry-run` package-content smoke test. Linting is intentionally
not exposed until the package has a project-specific ESLint configuration.
