# Project Memory

## Latest implementation — 2026-09-23 hero refinement
- Explore name now uses rounded Pacifico script geometry, warm studio highlights, and gentle reversible scroll depth/rotation.
- Supporting statement is smaller with stable three-line layout and smooth sequential character reveal; duplicate text is fixed.
- Hero3DName.tsx owns name motion; heroCopy.ts owns copy entrance. Academic and later chapters retain their existing design.
- Academic mode is actually `/academic/`; the older `/index/` route notes below are stale.
- Browser checked on desktop and phone viewport; build passed. Detailed decision and font provenance recorded in DECISIONS.md.

## Current Architecture
- Static-first Astro build (Astro 7.x)
- Astro Content Collections for typed data (projects, experience, research, recognition, development, journey)
- No backend/database
- React integration for R3F/Three.js islands
- Custom design system (CSS custom properties, component-scoped CSS)

## Current Stack
- Astro 7.x
- TypeScript (Strict)
- React 19
- @react-three/fiber + @react-three/drei + Three.js 0.186

## Active Visual Direction (Phase A — Style Frame, 2026-09-22)
- EDITORIAL ENGINEER × SPATIAL BLUEPRINT × DIGITAL MODEL
- MINIMAL MONUMENTAL as governing restraint principle
- Core metaphor: INFORMATION BECOMING STRUCTURE (data/drawing → model → built space)
- Explore mode: deep graphite background (#101214), warm mineral white text, single accent (#E85C1A)
- Index mode: warm architectural paper (#F5F1EC), dark type — deliberate contrast with Explore
- Primary font: Instrument Sans (variable weight, open-licensed)
- Metadata font: IBM Plex Mono (technical labels, year, role, coordinates only)
- 3D geometry language: slender TubeGeometry members, LineSegments, Points, thin transparent planes
- No GridHelper, no fat BoxGeometry primitives
- NEW: Explore mode gets scroll-driven spatial transitions (BIM/structural portal) inspired by a reference interaction grammar. Academic CV remains strictly formal.

## Implemented Routes
- `/` — Explore homepage (hero + 3D scene)
- `/index/` — Index mode (archive list)
- `/projects/[slug]` — Project pages
- `/experience/[slug]` — Experience pages
- `/research/[slug]` — Research pages
- `/work/`, `/recognition/`, `/about/`, `/journey/`, `/contact/` — Section pages

## Implemented Content
- `experience/openspace.md` — Track Delivery Specialist at OpenSpace (priority 2)
- `experience/urbana.md` — Revit Drafter/Modeler at Urbana (priority 3)
- `research/bim-to-ar.md` — BIM to Augmented Reality FYP (priority 1)
- `projects/nust-faisal-masjid.md` — Structural Design (priority 4)

## Unresolved Questions
- Real project imagery not yet available — procedural geometry stands in for hero.
- BIM portfolio assets (Tahir/Haroon Residency, Dynamo) not yet supplied.
- Missing curated knowledge base Markdown files still not provided; using master spec facts.

## Known Bugs
- None yet

## Upcoming Work
- Phase B: Explore Motion Prototype (Hero enhancement, one sample chapter, one ExplorePortal, reversible scroll, reduced-motion fallback)
- Phase C: Full Explore Sequence Expansion (remaining chapters, Index transition, Research climax)
- Phase D: Index Mode visual redesign
- Phase E: Project page redesign into editorial design system

## Performance State
- Hero scene target: <5000 triangles, procedural only, no large assets

## Deployment State
- Local development (npm run dev)
- GitHub Pages compatible (static output)
