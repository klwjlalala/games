# V5 external asset integration — verification scope

Branch starts from V4 main (9b82385), which has no previous Three.js/AssetManager/grid-placement implementation. This change adds the rendering/asset bridge without modifying combat targeting, balance, lane movement, economy or inventory rules. The ground checkerboard is a visual grid, not new player deployment or collision mechanics.

## Imported assets
55 self-contained local GLB paths (14 defense, 8 enemies, 8 supports, 8 projectiles, 3 pickups, 14 environment). Source commit, path, byte count, Git blob SHA and exact clip names are recorded in assets/models/import-*.json. All originate from Quaternius CC0 packs. Corrosion priest uses the skeleton as a theme replacement after a wizard file returned invalid bytes; shell uses spider; brute uses yeti. Shared geometry variants are deliberate.

Eight enemies have native clips; bat/dragon do not expose a named walking clip in the actual files, so idle clips + procedural movement are used. Attack/idle/death are mapped for those enemies; 14 defense units use procedural fallback. Native attack is triggered only when existing V4 logic emits the corresponding event (the V4 enemy AI has no barricade attacks). 55 assets have a local configuration; passive supports and unused reward variants are not placed as standalone live entities under V4 rules. Coins visualize existing instant credit rather than changing the economy.

## Validation
- Imported bytes validated through GitHub API: magic glTF, version 2, total length, chunk boundaries, JSON mesh, embedded resource checks and animation metadata. Invalid wizard was not committed. All 55 paths confirmed in branch tree.
- Three.js r160 and helper dependencies are vendored byte-for-byte with upstream Git blob hashes and MIT license.
- Source-level JavaScript parsing and legacy rules smoke test (15 recipes; first wave reaches reward with full gate) executed in isolated JS runtime. This is NOT a real Chromium/WebGL run.
- Run `node prototypes/nightwatch/validate-assets.cjs` after checkout; CI also checks every binary against manifest SHA.
- Browser CI tests preload all 55 models with GLTFLoader, check normalization, native clip mappings, missing asset fallback, real battle, F2 and screenshots.

## Calibration review
F2 shows cyan normalized model bounds, yellow legacy enemy hit radius, red muzzle markers and blue intended front axis. Model rotation offsets follow source conventions and geometry evidence where available; manual/real browser visual checks remain required, especially skeleton, cannon, gate, bat/dragon and high-tier archer towers. The muzzle on crystal/arrow towers is an estimated visual anchor derived from actual normalized bounds, not a visually verified named socket. No claim of screenshot review, zero browser 404, or frame-rate certification is made before actual CI evidence.
