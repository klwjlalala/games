# V4 — The Last Watch

## Implementation
- Replaced the 2D battlefield renderer with world-space mesh construction, orthographic projection, face lighting, depth sorting, and animated articulated creature geometry. Includes the castle, towers, weapons, and all eight monster types.
- Full-screen-oriented desktop layout with battle on the left, backpack on the right, and a tabbed preparation dock (arsenal, market, forge). Existing 20-cell bag, recipes and game rules remain intact.
- Static scenery is cached; creature mesh detail is reduced during dense waves, preserving boss and brute detail.

## Three review rounds
1. Fixed-state Chromium screenshots at 1440×900, 1280×720 and 390×844: identified wrong castle viewing angle, muted models and excess scrolling at 720px height.
2. Revised camera, light, terrain, model scale, equipment cards and layout. Both tested desktop sizes fit in the viewport, and the mobile test showed no horizontal overflow. Actual Chrome screenshots used a fixed game-state fixture, not a production playthrough.
3. Render microbenchmark in local Chromium: 32 fixed monsters, median render-call time 17.7ms before LOD and 13.3ms after LOD (10 samples per configuration; not end-to-end FPS). Integrated rule and mesh smoke tests executed against committed source with simulated DOM and Canvas APIs; all 15 recipes, wave progression and 36-monster mesh paths completed. Updated browser E2E tests for tab navigation, purchase/forge, mobile layout, laptop fit and pause/resume. GitHub Actions end-to-end results have not been retrieved.

## Remaining quality gates
This is a stylized procedural low-poly game, not a certified commercial release. Independent art direction review, full production browser playthrough and real-device GPU/performance profiling remain necessary.
