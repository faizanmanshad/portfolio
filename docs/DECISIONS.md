# Decisions Log

## 2026-09-23 — Explore hero: connected script and sequential reveal
User requested a softer script name inspired by the dimensional “hello” at haoqi.design, preserving the existing graphite/mineral/orange identity. Scope is the first Explore screen; Academic is unchanged.
- Replaced oversized Helvetiker capitals with kerned Pacifico outlines for “Faizan Manshad,” rounded extrusion, and locally generated studio reflections. Typeface and OFL license are local; no reference-site assets were copied.
- Name fits its own responsive stage. Scroll maps continuously to a modest turn and retreat, reverses on return, and uses demand rendering. Supporting copy no longer transforms the name's parent.
- Replaced random scrambling with a sequential 360ms character fade, 27ms stagger, and stable line breaks. Fixed duplicate visible supporting copy by removing the unstyled screen-reader duplicate.
- Added a visible HTML name fallback until 3D is ready and on rendering failure. Motion preferences disable name/copy animation and continuous background rendering.
- Validation: production build passes; desktop 1280×720 and mobile 390×844 inspected; scroll down/up verified; no browser console errors during checks. Existing build warnings remain for the empty development collection and large JS chunks. Reduced-motion and WebGL failure paths implemented but not independently emulated in browser.
- Source: https://github.com/google/fonts/tree/main/ofl/pacifico . Optional outline regeneration: `node scripts/prepare-hero-font.cjs <path-to-opentype.js-1.3.4-module>`; normal builds require no font conversion dependency.

## 2026-09-23 — Hero Iteration 01 — Spatial Name + Decoder Copy
Context: Incremental visual iteration to improve the Explore mode homepage hero without redesigning the entire page. Need a premium spatial typographic object and a scramble text reveal for the supporting statement.
Decision: "Faizan Manshad" is now a 3D Text geometry rendered via React Three Fiber. The supporting statement uses a custom JS decoder scramble effect on load.
Why: To elevate the technical and spatial theme (Information Becoming Structure) while remaining restrained.
Consequences:
- Current overall design retained.
- "Faizan Manshad" becomes real 3D geometry (`Hero3DName.tsx`), mapping scroll progress to twist, recede, and fade.
- The supporting label receives a scramble/decode load effect (`textScramble.ts`).
- Reference site was used only for interaction inspiration (no copying of aesthetic/colors).
- Implemented HTML fallbacks and disabled complex motion for `prefers-reduced-motion` and mobile environments.
## 2026-09-23 — Explore Motion Language — Reference-Derived, Domain-Specific
Context: The current portfolio has a solid visual identity, but Explore Mode lacks a memorable interactive digital experience. A reference video was provided to demonstrate interaction principles (e.g., continuous fields, reactive hero, dimensional interstitials, expressive finale).
Decision: Translate the reference video's interaction grammar into Faizan's domain (BIM, structural engineering, digital construction) without copying its exact aesthetic. Create a scroll-choreographed experience that feels like "moving through the digital model."
Why: To elevate the Explore experience into a spatial journey while preserving the existing, highly-rated visual theme and keeping the Academic CV strictly formal and static.
Consequences: Explore mode will receive scroll-driven spatial transitions via GSAP. A prototype will be built first (hero enhancement, one chapter, one portal, one destination) to validate the motion language before applying it globally.

## 2026-09-22 — Visual Prototype 01 Rejected
Context: The first visual implementation of the homepage hero consisted of a Three.js GridHelper floor plane and nine BoxGeometry black vertical columns animating upward from a white canvas, with portfolio text inside a large opaque/semi-transparent floating panel over the canvas.
Decision: This composition is rejected as the primary visual implementation of the Explore hero.
Why: The implementation interpreted "structural geometry" too literally, producing a result that resembles a Three.js tutorial or an unfinished WebGL experiment rather than a premium editorial portfolio. Specifically: (1) the GridHelper is a developer utility, not a designed element; (2) fat black box-columns are a generic massing placeholder, not a refined structural metaphor; (3) the opaque floating text panel disconnects typography from the spatial composition; (4) the white background eliminates depth and material sophistication.
New creative direction: EDITORIAL ENGINEER × SPATIAL BLUEPRINT × DIGITAL MODEL with MINIMAL MONUMENTAL as the governing restraint principle. The site should feel as though an exceptional independent design studio collaborated with a civil engineer, BIM specialist, computational designer, and architectural editor.
New metaphor: INFORMATION BECOMING STRUCTURE. The homepage begins with technical information in an abstract state (thin linework, nodes, coordinate markers, dimension references) and resolves into spatial geometry as interaction progresses. The sequence is: DATA/DRAWING → MODEL → BUILT SPACE → INFORMATION.
New 3D language: Slender structural members (TubeGeometry radius ~0.015), LineSegments for architectural grid and dimension lines, Points for nodes, thin transparent planes for section/layer surfaces. No fat primitives.
Visual system: Explore mode = deep graphite (#101214) with warm mineral white text and single accent (#E85C1A). Index mode = warm architectural paper (#F5F1EC) with dark type. Both modes share typefaces, accent, and spacing logic.
Typography: Instrument Sans (primary grotesk, variable weight) + IBM Plex Mono (metadata only).
Preserved: Astro architecture, TypeScript, React/R3F, content collections, routes, accessibility infrastructure, SEO, GitHub Pages compatibility, all canonical content records.
Consequences: ExploreScene.tsx is fully rebuilt. global.css is fully rewritten. Layout.astro nav is redesigned. index.astro hero HTML is rewritten. No content or routing changes.


## 2026-09-22 — Initial Architecture and Stack
Context: Greenfield portfolio project for Faizan Manshad. Master specification mandates a fast, static-first experience with a complementary 3D Explore mode.
Decision: Use Astro as the core framework with strict TypeScript. React will be integrated for interactive components and Three.js/R3F eventually. No backend or CMS in V1.
Why: Astro provides excellent static site generation, minimal client-side JS by default, and allows embedding interactive islands where needed (e.g., the 3D WebGL scene).
Alternatives considered: SPA-only React (rejected due to SEO and initial load performance constraints), Next.js (rejected as overkill for a static site with no backend).
Consequences: Content will be managed via Astro Content Collections. Client-side state must be managed carefully across Astro islands.

## 2026-09-22 — Content Sourcing
Context: Missing `Faizan_Master_Academic_and_Professional_Portfolio-Comprehensive.md` and `Academic Porfolio.md` files.
Decision: Use the facts provided in section 11 of the master specification (`FAIZAN_MANSHAD_PORTFOLIO_ANTIGRAVITY_MASTER.md`) as the seed data for Phase 1.
Why: Allows unblocking development and getting the basic structure and routing in place.
Alternatives considered: Block development and wait for user to provide files.
Consequences: Initial content may be incomplete and will need to be updated once the full source files are provided.

## 2026-09-23 — Interactive engineering studio
User approved a stylized architectural studio concept and authorized implementation, replacing the earlier 3D script-lettering direction.
- Homepage uses architectural sans-serif lettering with a pointer-following outline reveal.
- One original procedural pavilion and truss bridge, with matte materials, softened edges, planting, stairs, furnishings and people. No FBX supplied or required; no external model files or generated-image screenshot used as the live scene.
- Orbit drag, arrow-key and button rotation, reset, assembled/exploded/blueprint modes, reversible scroll separation, numbered hotspots and matching ordinary buttons.
- Three content topics connect to existing portfolio records. Static sections below cover work, research, projects and navigation onward.
- Demand rendering; no continuous idle loop. Local SVG loading/error drawing; semantic content survives missing JavaScript. Reduced-motion disables scroll separation and transition damping.
- Academic content/layout left for its separate phase. Contact stub replaced with the email supplied in the BIM portfolio.
- Source review is documented in STUDIO_SOURCE_NOTES.md. Raw evidence remains untouched.
