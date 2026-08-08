# Keyboard interaction contracts

This matrix is the maintainer contract for high-risk interactive primitives. It documents expected behavior; automated tests remain the enforcement mechanism.

| Component  | Tab / focus entry                                 | Enter / Space                             | Escape                    | Arrow keys                       | Focus restore           | Browser coverage                                    |
| ---------- | ------------------------------------------------- | ----------------------------------------- | ------------------------- | -------------------------------- | ----------------------- | --------------------------------------------------- |
| Dialog     | Trigger and modal focus cycle                     | Trigger activates                         | Closes                    | Not primary navigation           | Returns to trigger      | Chromium, Firefox, WebKit                           |
| Sheet      | Trigger and modal focus cycle                     | Trigger activates                         | Closes                    | Not primary navigation           | Returns to trigger      | Chromium, Firefox, WebKit                           |
| Tooltip    | Trigger remains keyboard reachable                | Trigger semantics remain native           | Dismisses when applicable | Not primary navigation           | Trigger retains focus   | Chromium, Firefox, WebKit                           |
| Sidebar    | Trigger reachable; content follows document order | Trigger toggles                           | Mobile sheet closes       | Component-specific controls only | Mobile trigger restored | Chromium, Firefox, WebKit                           |
| Tabs       | Active/selected tab is reachable                  | Activates according to component contract | Not a close interaction   | Moves between tabs               | Stays within tablist    | Runtime plus browser coverage when behavior changes |
| Pagination | Links remain native links                         | Native link activation                    | Not applicable            | Browser-native                   | Browser-native          | Runtime semantic coverage                           |

## Test placement

Use runtime tests for semantic role, accessible name, ARIA state, and deterministic interactions. Use Playwright for focus trapping, focus restoration, Escape behavior, real keyboard navigation, responsive overlays, RTL, forced colors, and media-query behavior.

Visual regression should cover only states where a rendering change would not be detected by semantic or interaction tests, such as focus visibility, open overlays, collapsed navigation, theme/density combinations, and selected high-risk states.

## Regression rule

When an accessibility bug is fixed, add the regression test at the lowest reliable layer and update this matrix only when the intended interaction contract itself changes. Do not add duplicate tests solely to increase test count.
