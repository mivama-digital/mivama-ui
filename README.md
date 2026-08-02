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
- `EditorialGrid`
- `BentoGrid` and `BentoGridItem`
- `Field`, native `Choice`, and native `Select` primitives
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
- `ScrollScene` and `ScrollLayer`
- `cn` utility

The package is the single UI source for Mivama websites and client portals. It
owns the Mivama color, typography, shape, focus, and shared component contracts.
Its base components retain the official `base-nova` shadcn/ui composition APIs.

```tsx
import { Button, Card } from "@mivama/ui";
import "@mivama/ui/styles.css";
```

Frequently used client-facing modules can bypass the root barrel:

```tsx
import { Button } from "@mivama/ui/button";
import { Card } from "@mivama/ui/card";
import { Field, Input } from "@mivama/ui/forms";
```

Explicit subpaths are available for `button`, `sheet`, `card`, `scroll-scene`,
`bento-grid`, and `forms`.

## Design-system contract

Import `@mivama/ui/styles.css` once. It remains the compatibility aggregate and
contains the self-hosted Onest variable font, Tailwind utilities, tokens,
themes, and component styles. Advanced builds may import
`@mivama/ui/tokens.css` and `@mivama/ui/themes.css` explicitly; import both in
that order before component styles.

Set `data-mivama-theme="product"`, `data-mivama-theme="editorial"`, or
`data-mivama-theme="portal"` on an application shell. Set
`data-density="comfortable"` or `data-density="compact"` independently. The
`:root` defaults remain product/comfortable for compatibility, and `.dark` on
the shell or an ancestor selects each theme's dark contract.

```tsx
<main data-mivama-theme="portal" data-density="compact" className="dark">
  ...
</main>
```

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
  `--motion-duration-slow`, `--motion-easing-standard`,
  `--motion-easing-emphasized`, `--motion-distance-8`,
  `--motion-distance-16`, `--motion-distance-24`, `--motion-distance-32`,
  `--motion-distance-48`
- Instrument surfaces: `--instrument`, `--instrument-elevated`,
  `--instrument-foreground`, `--instrument-muted`, `--instrument-border`
- Sidebar: `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`,
  `--sidebar-accent`, `--sidebar-border`, `--sidebar-ring`
- Shape: `--shape-control-sm`, `--shape-control`, `--shape-surface`,
  `--shape-panel`
- Spacing and density: `--space-1` through `--space-12`, `--panel-padding`,
  `--control-height`, `--sidebar-row-height`
- Typography roles: `--type-display-*`, `--type-title-*`, `--type-body-*`,
  `--type-meta-*`, `--font-heading`, `--font-sans`

Use `Heading`, `Text`, and `Eyebrow` for shared type roles. The visual variant
is independent from the rendered element:

```tsx
<Heading render={<h1 />} variant="display">A clear proposition</Heading>
<Text variant="lead">Supporting context for the page.</Text>
<Heading variant="hero" tone="inherit">Designed to move work forward.</Heading>
<Heading variant="statement">A decisive closing statement.</Heading>
<Text variant="signal">Signal 01</Text>
```

Use `tone="inherit"` when typography should take the foreground color from a
brand or instrument surface. Existing variants retain their current default
colors.

### Editorial theme

Use `data-mivama-theme="editorial"` for the verified
warm-paper/cobalt/lime/instrument palette. `.mivama-editorial-theme` remains a
supported compatibility selector. A surrounding `.dark` class, or `.dark` on
the shell itself, selects its dark contract.

```tsx
<main className="mivama-editorial-theme">
  <Section tone="brand">
    <Heading variant="statement" tone="inherit">Clear systems. Useful outcomes.</Heading>
    <Button variant="inverse">Start a project</Button>
  </Section>
</main>
```

The named palette tokens are `--editorial-paper`, `--editorial-cobalt`,
`--editorial-lime`, and `--editorial-instrument`. Semantic aliases include
`--signal`, `--instrument`, `--instrument-elevated`, `--instrument-foreground`,
`--brand`, and `--brand-foreground`.

Tailwind exposes the semantic color utilities `bg-surface`,
`bg-surface-elevated`, `border-border-strong`, and `bg-overlay`. Layout,
shadow, and motion values remain runtime CSS properties so responsive and
theme overrides continue to work. Keep each foreground/background override at
WCAG AA contrast.

## Layout and variants

`Container` retains the reading, standard, and wide widths with responsive
20/24/32/40px gutters. `Section` retains its bordered default and supports
`tone="default"`, `tone="muted"`, `tone="accent"`, `tone="brand"`, and
`tone="instrument"`; combine these with the existing compact, default, and
hero densities. `Button variant="inverse"` provides the contrasting action.

`EditorialGrid` is a server-compatible CSS grid with 4 columns by default, 8
from 40rem, and 12 from 64rem. It exposes `--editorial-grid-columns` and
`--editorial-grid-gap` so descendants can align tracks. Add
`.mivama-editorial-subgrid` to a child that should span and inherit every parent
track:

```tsx
<EditorialGrid style={{ "--editorial-grid-gap": "2rem" } as React.CSSProperties}>
  <article className="mivama-editorial-subgrid">...</article>
</EditorialGrid>
```

`BentoGrid` is the smaller card-layout primitive. It has one track on mobile
and two from 40rem. Items remain single-track by default; `span={2}` expands an
item only after the second track is available, so no separate breakpoint API is
needed.

```tsx
<BentoGrid>
  <BentoGridItem span={2}><Card variant="instrument">Lead story</Card></BentoGridItem>
  <BentoGridItem><Card variant="outline">Supporting story</Card></BentoGridItem>
</BentoGrid>
```

## Native forms

`Field`, `FieldLabel`, `FieldDescription`, `FieldError`, `Fieldset`, and
`FieldLegend` provide semantic composition without generated IDs. Consumers
retain control of `htmlFor`, `aria-describedby`, and `aria-invalid`. `Choice`
renders a native checkbox or radio, `ChoiceGroup` renders a native `fieldset`,
and `Select` renders a native `select`; all retain browser semantics, server
rendering, dark color scheme, focus rings, invalid states, and disabled states.

```tsx
<Field>
  <FieldLabel htmlFor="region">Region</FieldLabel>
  <Select id="region" aria-describedby="region-help">
    <option value="eu">Europe</option>
  </Select>
  <FieldDescription id="region-help">Used to route your enquiry.</FieldDescription>
</Field>
```

## Scroll scenes

`ScrollScene` and `ScrollLayer` are server-compatible wrappers with no client
directive. Reveal is the default; `effect="parallax"` moves a layer through a
bounded depth range. Distances are limited to 8, 16, 24, 32, or 48px. On larger
viewports, browsers supporting CSS view timelines animate only `transform`;
unsupported browsers, mobile viewports, and reduced-motion preferences receive
the complete static layout.

```tsx
<ScrollScene>
  <ScrollLayer effect="parallax" direction="up" distance={48}>Editorial content</ScrollLayer>
</ScrollScene>
```

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
`variant="subtle"` for quieter grouping, `variant="outline"` for transparent
framing, `variant="instrument"` for dark instrument surfaces, and
`variant="interactive"` when a card contains a focusable action. Interactive
styling uses rings and shadows, so hover and focus-within do not resize the
card. Use `size="sm"` for dense surfaces and `size="lg"` for prominent content
rather than overriding subcomponent padding at each call site.

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

## Migrating to v3

Version 3 formalizes theme and density selection without removing the v2
stylesheet entrypoint. Existing consumers can upgrade and continue importing
`@mivama/ui/styles.css`; `:root`, `.dark`, and `.mivama-editorial-theme` retain
their previous behavior.

New and migrated shells should add an explicit `data-mivama-theme` and
`data-density`. Portal applications should use `data-density="compact"` to
retain approximately the previous portal rhythm: cards use 16px padding,
desktop controls and sidebar rows use 32px, and `--control-height` drives the
default Button, Input, Select, and Tabs heights. Coarse-pointer/touch contexts
retain 44px control and sidebar targets. Component-level size props still
override density where intentional.

No font was added in v3. The existing vendored Onest files remain the only
packaged typeface.

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
configuration. Contract coverage also imports every explicit package subpath.

For a consumer that commits a package archive, run this from the package root.
Replace the consumer path once; the generated archive name is deterministic for
version 3.0.0:

```bash
consumer=/absolute/path/to/consumer
mkdir -p "$consumer/vendor"
npm run verify
npm pack --ignore-scripts --pack-destination "$consumer/vendor"
npm install --prefix "$consumer" "$consumer/vendor/mivama-ui-3.0.0.tgz"
npm --prefix "$consumer" run verify
```

Commit the consumer's new archive, `package.json`, and `package-lock.json`
together. Remove the previous archive only after both manifests reference
`mivama-ui-3.0.0.tgz`.
