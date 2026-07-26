# @mivama/ui

Shared React UI primitives for Mivama projects.

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
- `cn` utility

The package is the single UI source for Mivama websites and client portals. Components use the same Base UI + shadcn-style contract in every consuming project. Mivama-specific `brand`, `light`, and `accent` variants are kept here so visual changes are released once and shared everywhere.

```tsx
import { Button, Card } from "@mivama/ui";
import "@mivama/ui/styles.css";
```

Build with `npm run build`.
