# House portfolio continuation — 2026-10-08

## Agreed direction and scope
A warm Pakistani brick/plaster house based on reference.png, green metalwork, roof water tank, charpai and canopy, bougainvillea, balcony, courtyard and boundary walls. Maintain the dark green/charcoal portfolio theme. Keep Academic and page transitions separate from the Explore model. Local changes only; no deployment performed.

## Current implementation
- HouseModel.tsx: procedural Three.js geometry, textured plaster/brick/paving, rear boundary wall and caps, separate ground/first/roof groups, actual front openings, opening gate/door leaves while touring, interior partitions and staircase, workstation with laptop/monitor/keyboard/mouse/chair, planting and roof details. General and Exploded only. Drag orbit excludes underside; reset retained.
- StudioScene.tsx: overview orthographic camera; fullscreen perspective guided journey, Previous/Next/Finish, desktop milestone picker, Exit/Escape, focus trap/restore, scroll locking, reduced-motion handling. Separate persistent look target and doorway waypoints avoid abrupt aim resets. Mobile tour has scene above story and reachable controls below.
- houseJourney.ts: editable camera positions, look targets and intermediate doorway passages; coordinates are world coordinates, model base is y=-.35. Route currently has 17 stops. Any added records spread over these physical stops automatically.
- pages/index.astro: collects all education, recognition, journey, experience, projects and research records (17 currently). Sorts by dateStart, otherwise first year of dateDisplay. Equal dates tie by ID. Undated records last with explicit label. Full-story links preserve detail pages. Old three-topic hotspots removed.
- pages/academic/index.astro: chapter cards use one muted green/brown theme and numbered headers; mobile section selector compacted to 40px tall and 14px text.

## Accuracy and known limits
This is an illustrative guided prototype, not an exact reconstruction or a collision-controlled game. Interior rooms are invented because the reference only shows exterior. Roof access is a scenic camera lift outside the balcony, not a walkable roof staircase. Side windows remain applied to solid side walls. Gate leaves open immediately on entering journey. Interior framed panels are illustrative placeholders; actual milestone content is in the adjacent accessible story panel. Rapidly interrupting long milestone skips can still need camera-path refinement. Geometry/material detail is substantially simpler than the reference image.

Existing dates were preserved; some source records may need user review (e.g. Gold Medal date versus degree period). Education is sorted by its start year, not completion year. NUST/Faisal Masjid project has no date and remains last. Do not invent dates or extra achievements.

## Validation
Astro check: 49 files, zero errors/warnings (77 existing hints). Production build: 27 pages. Browser verified gate, courtyard, interior reading room and work desk, Previous/Next and milestone picker; mobile layout tested at 390x844. Final verification details in chat. Browser had zero captured errors at first journey check.

## Continue here
1. Keep source data and route independent; edit houseJourney.ts for camera framing/passages.
2. Improve physical detail and add meaningful actual room displays if requested. Build true roof staircase and collision-safe navigation for a future free-roam phase.
3. Preserve General/Exploded/Reset and existing page transitions.
4. Test both mobile and desktop after changes; keep controls reachable and prevent scrolling behind fullscreen tour.

## Commands
Run npm run check and npm run build from E:/Faizan Manshad Portfolio. In this environment sandboxed Astro can fail loading picomatch with require-is-not-defined; the same commands pass with approved execution outside the sandbox. Set ASTRO_TELEMETRY_DISABLED=1. Development server uses localhost:4321. No deployment or commit has been performed.

## Follow-up — 2026-10-09
Completed Academic check: all six chapter fills #171c18; mobile selector 40px / 14px. Latest request: fit mobile house, close floor gaps, soften palette, make interior more spacious, smooth journey entrance, direct milestone skips.
- houseSpace.ts now centralizes HOUSE_SCALE=[1.12,1,1.25] (40% more plan area with same floor heights), coordinate mapping and overview spans. Desk uses inverse horizontal scaling to retain original furniture size.
- HouseModel has continuous perimeter ring beams at y=1.82 per level, closing side/rear wall-to-slab gaps; muted olive limestone/plaster and brown brick; less yellow lighting.
- Mobile model container no longer extends beyond its parent. Overview frustum has margins for rotation.
- Entry perspective camera takes the overview orientation and matching view height, then eases via an outside approach toward the gate for 3.6 seconds.
- Non-adjacent milestone selection uses a brief fade and direct placement (no intermediate route). Next/Previous retain doorway routes. Camera cleanup restores opacity if interrupted.
- Production browser verification at localhost:4322: mobile fit and side seams, gradual entry, direct jump from SSC to Urbana. Academic styles checked via DOM. Check passed 50 files, zero errors/warnings; build passed 27 pages. Dev server had a dynamic-module load failure; restarted after validating the production build. Preview4322 remains an alternate local review URL, not a deployment.
