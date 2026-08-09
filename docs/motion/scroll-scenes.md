# Scroll motion

`ScrollScene` and `ScrollLayer` provide a small progressive-enhancement foundation for bounded reveal and parallax effects. They are layout primitives, not a page-animation framework.

## Contract

- `ScrollScene` groups related scroll-motion content without owning scroll position, locking the viewport, or intercepting wheel/touch input.
- `ScrollLayer` owns one effect (`reveal` or `parallax`), one direction, and one tokenized distance.
- `data-slot`, `data-effect`, `data-direction`, and `data-distance` are stable DOM metadata suitable for behavior and Playwright assertions.
- Scroll-driven animation is applied only on viewports at least `48rem` wide, when `prefers-reduced-motion` is `no-preference`, and when the browser supports `animation-timeline: view()`.
- Every layer uses its own anonymous `view(block)` progress timeline. This avoids global named-timeline collisions between repeated or nested `ScrollScene` instances.
- Without scroll-driven animation support, the layer remains at its final transform and all content stays readable.

## Accessibility and fallbacks

Motion must never carry essential meaning. Reading order, focus order, labels, links, and controls must be complete before animation is considered.

The package-wide reduced-motion guard disables animation/transition duration and smooth scrolling when the user prefers reduced motion. Consumers must still design a polished static state; do not depend on the guard to hide unfinished animated layouts.

`ScrollScene` does not add scroll locking, snapping, wheel listeners, touch interception, or synthetic scrolling.

## Choosing the right implementation

Use `ScrollScene` / `ScrollLayer` when the effect is a small transform-only reveal or parallax enhancement tied to the layer entering/leaving the viewport.

Use consumer CSS when the composition is application-specific but can still be expressed declaratively and progressively.

Use a feature-level Web Animations API/controller when several elements truly need one shared progress model, media scrubbing, or application state. Keep that controller in the consuming application rather than adding project-specific orchestration to `@mivama/ui`.

Do not add WebGL, project reels, page transitions, sticky-story state machines, or product-specific animation concepts to these primitives.

## Example

```tsx
<ScrollScene>
  <ScrollLayer effect="reveal" distance={24}>
    <Heading>Independent reveal</Heading>
  </ScrollLayer>
  <ScrollLayer effect="parallax" direction="down" distance={16}>
    <Media />
  </ScrollLayer>
</ScrollScene>
```

Each layer gets its own view-progress timeline. Repeating or nesting this composition does not require unique timeline names from consumers.
