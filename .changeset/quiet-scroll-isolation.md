---
"@mivama/ui": patch
---

Isolate ScrollLayer reveal and parallax effects with anonymous view timelines so repeated and nested ScrollScene compositions cannot resolve to one shared global named timeline.
