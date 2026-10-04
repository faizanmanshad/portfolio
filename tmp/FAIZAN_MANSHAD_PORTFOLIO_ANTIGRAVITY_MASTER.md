# FAIZAN MANSHAD — DIGITAL PORTFOLIO
## Antigravity Master Product, Design, Architecture & Implementation Specification

**Document role:** Persistent source of operating instructions for the AI IDE / coding agent building Faizan Manshad's portfolio.

**Deployment target:** GitHub Pages with a custom domain managed in Cloudflare DNS.

**Intended public domain:** `faizanmanshad.com` based on the spelling Faizan Manshad. **Before DNS changes, verify the exact purchased domain spelling in Cloudflare. Do not guess.**

**Project status:** Greenfield / first production implementation.

---

# 0. READ THIS FIRST — OPERATING CONTRACT

You are Antigravity, acting as the senior product designer, creative developer, frontend architect, information architect, accessibility engineer, performance engineer, SEO implementer, and repository maintainer for this project.

Your objective is **not** to produce a generic personal website, résumé website, academic portfolio, or a showcase of trendy frontend effects.

You are building a **complete digital identity system for Faizan Manshad**, a Civil Engineering graduate whose profile spans:

- civil and structural engineering;
- Building Information Modeling (BIM);
- Autodesk Revit and digital construction workflows;
- BIM-to-Augmented-Reality research;
- construction technology;
- professional work;
- academic excellence;
- engineering projects;
- research and preprints;
- honors and awards;
- leadership and fellowships;
- certifications and continuing professional development;
- volunteering and community service;
- technical competitions and extracurricular activities.

Academics are important, but **academics are one layer of the identity, not the entire identity**.

The finished website should communicate:

> **Faizan understands physical structures, digital models, engineering information, construction, and emerging technology — and the website itself expresses that way of thinking.**

It must **not** primarily communicate:

> “Faizan has a flashy Three.js website.”

The site's originality must come from Faizan's actual domain and evidence, not from imitation of creative-developer portfolios.

---

# 1. NON-NEGOTIABLE PRODUCT PRINCIPLE

## One content system, two first-class interfaces

The site must have two complementary ways to experience the same underlying information.

### 1.1 Explore Mode

A cinematic, spatial, interactive interpretation of Faizan's work and identity.

Explore Mode may use:

- 2D technical linework;
- structural grids;
- point-cloud or survey-inspired visual language;
- controlled WebGL / 3D;
- structural geometry;
- model assembly;
- section-cut concepts;
- drawing-to-model transformations;
- subtle AR/BIM annotations;
- camera movement;
- scroll-linked state changes;
- hover or pointer interaction on capable devices.

Explore Mode is **interpretive**.

It is not the canonical database.

It must never be the only way to reach important content.

### 1.2 Index Mode

A fast, beautiful, editorial, highly usable information interface.

It must be optimized for:

- professors;
- scholarship reviewers;
- admissions committees;
- researchers;
- recruiters;
- engineers;
- employers;
- collaborators;
- visitors who do not want an immersive experience;
- keyboard users;
- users with reduced-motion preferences;
- search engines;
- weak devices or failed WebGL environments.

Index Mode is **not a fallback or "lite version."** It is a premium experience in its own right.

### 1.3 Shared canonical content

Explore and Index must read from the same structured content source.

Do not create:

- one copy of a project for Explore;
- another copy for Index;
- another copy for the archive.

Each record exists once and may appear in multiple contexts through relationships, tags, categories, and presentation rules.

Think:

**content graph → multiple presentations**

not:

**immersive site + separate résumé site**

---

# 2. SOURCE-OF-TRUTH POLICY

The textual content of the website must be generated from curated source data, not rediscovered by recursively reading raw PDFs.

## 2.1 Source priority

Use this hierarchy:

1. **Latest explicit user instruction or correction**
2. `Faizan_Master_Academic_and_Professional_Portfolio-Comprehensive.md`
3. `Academic Porfolio.md`
4. Structured site content created from those sources
5. Raw evidence files only when the user explicitly authorizes targeted verification or visual extraction

If two sources disagree, **do not silently reconcile them**.

Create a visible internal `content-conflicts.md` record and mark the affected field as unresolved until the user chooses the correct value.

## 2.2 Known examples of potential conflicts

Examples already visible in the available knowledge base include:

- Mount Khalid internship dating appears differently across the two Markdown knowledge bases.
- Some certification/CPE details are represented differently across the two knowledge bases.
- Some older profile summaries may use wording such as “scheduled graduation” even though the primary comprehensive source records the degree as conferred.

Therefore, source precedence and conflict tracking are mandatory.

## 2.3 Never fabricate missing facts

Do not invent:

- final CGPA;
- email address;
- phone number;
- LinkedIn URL;
- GitHub URL;
- exact office addresses;
- project clients;
- supervisor names not supported by the content source;
- dates;
- role titles;
- software;
- award status;
- publication status;
- metrics or outcomes;
- testimonial quotes.

If a value is unavailable, either omit the field or place an internal TODO.

Never publish a placeholder that looks like a real fact.

---

# 3. RAW EVIDENCE / LOCAL FOLDER POLICY

The user may give you filesystem access to a portfolio/evidence directory containing folders such as:

- `01 Honors & Awards`
- `02 Community Service`
- `03 Extracurricular Activities`
- `04 Certifications & Professional Development`
- `05 Present Jobs`
- `06 Internship Certificate`
- `07 Transcript & Degree`
- `08 BIM Portfolio`
- `09 Research Paper, Publication`

Treat these directories primarily as a **controlled visual asset and evidence repository**, not as a content-ingestion source.

## 3.1 Do not bulk-read evidence

Do not:

- recursively parse every PDF;
- OCR all certificates;
- summarize every document;
- extract personal data from raw evidence;
- rebuild Faizan's biography from raw files;
- ingest every image because it exists;
- copy every PDF into the website.

## 3.2 Allowed targeted asset behavior

Only when a specific portfolio section needs a visual:

1. Identify the likely source folder/file by filename or user-provided mapping.
2. Inspect only the required file.
3. Extract only the required visual page/image.
4. Crop or redact private information where necessary.
5. Optimize the resulting asset.
6. Copy the curated output into the website's media directory.
7. Record the transformation in `docs/ASSET_MANIFEST.md`.

If a PDF is needed as a public document, copy only the specifically approved PDF.

## 3.3 Do not infer public copy from raw documents

The Markdown knowledge base remains the content authority.

A raw certificate can prove or illustrate an item, but it must not silently override the curated source data unless the user explicitly asks for verification/correction.

## 3.4 Privacy rules

Never publish without explicit review:

- CNIC / national ID;
- home addresses;
- personal account numbers;
- student or employee identifiers when not necessary;
- QR codes that expose private verification data;
- signatures;
- phone numbers;
- registration numbers unless they are intentionally public and useful;
- family member identifiers;
- unnecessary serial numbers.

For credentials, default to:

- title;
- issuer;
- date;
- concise relevance;
- safe verification link if available;
- redacted/selected visual preview when appropriate.

A full certificate scan should be an exception.

---

# 4. PRODUCT VISION

The website should feel like a **digital construction of identity**.

It should combine the credibility of a strong engineering/research portfolio with the spatial expressiveness of a premium interactive site.

The visual system should use **authentic engineering concepts** as design material:

- structural grids;
- plan/section logic;
- levels;
- beam/column systems;
- model layers;
- point clouds;
- survey points;
- drawing identifiers;
- revision states;
- geometry assembly;
- section cuts;
- model metadata;
- construction sequences;
- BIM categories;
- architectural/structural linework.

These ideas must be used semantically.

Do not skin the entire website like:

- Revit;
- AutoCAD;
- a blueprint;
- a sci-fi HUD;
- a terminal;
- a construction dashboard.

The result should be sophisticated, editorial, and human.

---

# 5. CREATIVE DIRECTION — V1 DECISION

For the first complete version, use a hybrid of:

## Editorial Engineer
High information quality, strong typography, confident whitespace, calm case-study pages, evidence-first presentation.

## Spatial Blueprint
Technical 2D linework can become 3D/spatial geometry at selected moments.

## Selective Digital Structure
Structural systems and model assembly can anchor the hero and certain project transitions.

The site should be approximately:

**80–90% calm, readable interface**
+
**10–20% premium spatial/interactive moments**

This ratio is conceptual, not a literal pixel calculation.

Do not make every section animated.

---

# 6. SIGNATURE EXPERIENCE — V1

The first version should concentrate effort into **three or four memorable interactions**.

## Interaction A — Drawing → Model → Identity

The hero begins in an engineered but abstract state:

- a restrained grid;
- survey-like points or line intersections;
- selected technical marks;
- linework resembling a structural plan/section without copying a real proprietary drawing.

The interface then resolves into a lightweight structural/spatial object.

The transformation should suggest:

**technical drawing → BIM model → digital understanding**

This is the primary conceptual statement.

## Interaction B — Structural Domain Focus

As the user explores key domains, the spatial model changes emphasis rather than completely changing into unrelated 3D scenes.

Possible states:

- Practice / professional work;
- BIM / digital construction;
- Engineering / structures;
- Research / AR;
- Recognition / academic growth.

Use one coherent spatial language.

Do not build five unrelated mini-games.

## Interaction C — Index Hover/Focus Preview

Index Mode uses a refined row or editorial-list pattern:

`Year — Title — Domain — Role/Context`

On hover/focus:

- reveal a contextual preview;
- image, drawing, model still, or diagram;
- no huge motion;
- preserve readability.

Touch devices receive an inline/tap alternative.

## Interaction D — Project Entry Transition

For a small number of featured projects, clicking from Explore can briefly isolate or section a geometry element before revealing the canonical project page.

Keep this transition short and skippable.

Navigation must never be held hostage by animation.

---

# 7. ANTI-PATTERNS — HARD REJECTIONS

Do not use the following as default design language:

- “Hi, I'm Faizan” giant-headshot hero;
- generic floating sphere;
- random metaballs;
- liquid blobs;
- fake terminal;
- fake code rain;
- glassmorphism everywhere;
- neon cyberpunk aesthetic;
- huge gradients without meaning;
- skill percentage bars;
- star ratings;
- giant logo wall;
- endless certificate cards;
- meaningless equations;
- fake blueprint texture on every page;
- fake BIM software chrome;
- random technical coordinates;
- animation on every heading;
- every section fading upward;
- long page transition blockers;
- custom cursor on touch;
- hidden navigation;
- forced scroll hijacking;
- autoplay audio;
- autoplay video that exists only for atmosphere;
- large particle systems with no narrative role;
- duplicated records across categories.

Every major visual effect must answer:

> **What does this communicate about Faizan, the project, or the content?**

If the answer is unclear, remove the effect.

---

# 8. PRIMARY AUDIENCES

Design for all of these without creating separate websites.

## 8.1 Academic / scholarship reviewer

Needs:

- education;
- distinctions;
- research;
- publication/preprint status;
- awards;
- leadership;
- evidence;
- quick navigation.

## 8.2 Engineering / BIM employer

Needs:

- current professional work;
- BIM projects;
- software/tool evidence;
- technical responsibilities;
- project outputs;
- drawing/model screenshots;
- concise role descriptions.

## 8.3 Research collaborator / postgraduate supervisor

Needs:

- research problem;
- methodology;
- role;
- BIM/AR workflow;
- preprint/DOI;
- technical context;
- related engineering projects.

## 8.4 General professional visitor

Needs:

- a rapid understanding of who Faizan is;
- memorable positioning;
- selected work;
- contact route.

## 8.5 Curious explorer

Needs:

- a visually meaningful experience;
- controlled discovery;
- no confusion.

---

# 9. INFORMATION ARCHITECTURE

Avoid turning every source category into a top-level navigation item.

## 9.1 Main global navigation

Recommended V1:

- **Work**
- **Projects**
- **Research**
- **Recognition**
- **Journey**
- **About**
- **Index / Explore toggle**

A compact `Contact` action may exist separately.

Exact copy may evolve, but keep top-level navigation concise.

## 9.2 Meaning of each domain

### Work
Professional roles and internships.

### Projects
Engineering, BIM, structural, digital-construction, semester, and selected technical projects.

### Research
BIM-to-AR research, preprints, research methods, publications/manuscripts.

### Recognition
Awards, merit distinctions, scholarships, selected fellowships and major credentials.

### Journey
A curated chronological view across education, practice, research, and growth.

### About
A concise professional/personal identity statement, not a long autobiography.

### Archive
Accessible through Index Mode rather than necessarily appearing as a permanent primary-nav item.

Archive contains lower-priority credentials, CPD, workshops, volunteering, older extracurricular items, and historical records.

---

# 10. CONTENT PRIORITY MODEL

Not every achievement deserves equal visual weight.

Use three editorial tiers.

## Tier A — Featured identity anchors

Prioritize prominently:

1. **BIM to Augmented Reality: A Standardized Multimodal Deployment Framework for Construction Layout Visualization**
   - Final Year Project / research;
   - Revit → Unity / AR workflow;
   - SSRN preprint;
   - 3rd Position in FYP category at CUI Wah Open House & Job Fair Spring 2026;
   - use careful publication language: preprint/manuscript, not peer-reviewed journal publication.

2. **Professional work at OpenSpace**
   - Track Delivery Specialist;
   - construction progress analysis using 360° imagery / OpenSpace Track;
   - current professional identity.

3. **Professional Revit work at Urbana**
   - Revit Drafter / Modeler;
   - structural/fabrication/shop-detailing context for modular pedestrian bridge work;
   - current professional identity.

4. **BIM portfolio / Revit body of work**
   - Tahir Residency;
   - Haroon Residency;
   - structural and architectural modeling;
   - Dynamo automation;
   - parametric modeling and documentation.

5. **Mount Khalid high-rise BIM / structural internship**
   - 45-story high-rise context;
   - show only after date conflict is resolved.

6. **Academic distinction**
   - BS Civil Engineering;
   - Gold Medal status should retain its evidence-status wording internally;
   - semester merit positions;
   - selected merit recognitions.

7. **A strong structural engineering project**
   - NUST Faisal Masjid ETABS/SAFE design project is a strong candidate.

## Tier B — Supporting professional/technical depth

Examples:

- SIMCO management trainee internship;
- reinforced-concrete school building design;
- Primavera P6 construction scheduling;
- highway geometric design;
- hydrology;
- geotechnical foundation design;
- water-treatment project;
- recycled aggregate concrete research;
- wastewater/SWMM project;
- survey camp / Best Survey Group;
- truss bridge competition.

## Tier C — Archive / supporting evidence

Examples:

- CPD seminars;
- certifications;
- webinars;
- workshops;
- leadership certificates;
- community-service records;
- school-level sports and early achievements;
- other evidence that adds completeness but should not dominate the landing experience.

Do not delete Tier C.

Curate its presentation.

---

# 11. CONTENT FACTS AVAILABLE FOR V1

The following are supported by the primary comprehensive knowledge base unless otherwise noted.

Do not treat this list as permission to publish sensitive IDs.

## Education

- Bachelor of Science in Civil Engineering.
- COMSATS University Islamabad, Wah Campus.
- Academic period: 2022–2026.
- Degree conferred: July 20, 2026 according to the primary comprehensive source.
- Registration details exist in source but should not be public by default.

## Academic merit

- Fall 2022 / 1st Semester: 3.89 SGPA, First Position.
- Spring 2024 / 4th Semester: 4.00 SGPA, Second Position.
- Fall 2024 / 5th Semester: 4.00 SGPA, First Position.
- Gold Medal in Civil Engineering is present in the source as a user-reported text record; preserve internal evidence status and do not falsely imply an official certificate is available if it is not.

## Research / FYP

- Title: **BIM to Augmented Reality: A Standardized Multimodal Deployment Framework for Construction Layout Visualization**
- Institution: COMSATS University Islamabad, Wah Campus, Department of Civil Engineering.
- Spring 2026.
- Team members include Faizan Manshad, Kashan Shafiq, and Faiz Fareed.
- Supervisor: Dr. Hassan Ashraf.
- Tools/methods include Autodesk Revit, Unity, AR Foundation / ARCore, C# and model interoperability workflows.
- SSRN preprint DOI recorded in source: `10.2139/ssrn.6884926`.
- 3rd Position in Final Year Project category at Open House & Job Fair Spring 2026.

## Current work

### OpenSpace
- Role: Track Delivery Specialist.
- Start date: August 17, 2026.
- Location recorded as Islamabad, Pakistan / remote-hybrid context.
- Work includes analysis of 360° construction-site capture to audit and track structural, architectural and MEP progress.

### Urbana
- Role: Revit Drafter / Modeler.
- Start date recorded in primary source: June 20, 2026.
- Remote work supporting Australian infrastructure.
- Work includes structural Revit models, 2D/3D fabrication drawings and shop detailing for steel/concrete modular pedestrian bridges.

## Internships

### SIMCO
- Shoukat Iqbal Mir & Co.
- Management Trainee Engineer.
- Primary source: July 1–30, 2024.
- Drawing interpretation, site layout/leveling, quantity takeoff, site/HR management and quality control.

### Mount Khalid
- BIM / structural high-rise internship.
- 45-story tower context.
- **Date conflict exists across source files. Resolve before public display.**

## BIM portfolio

- Tahir Residency.
- Haroon Residency.
- Revit structural and architectural modeling.
- Solar studies and documentation.
- Parametric / massing work.
- Dynamo automation scripts reading beam data and generating family types.
- Tools represented across portfolio include Revit, AutoCAD, Lumion, Enscape, Primavera P6 and ETABS.

## Structural / semester projects

Major candidates include:

- NUST Faisal Masjid design using ETABS and SAFE, seismic Zone 2B / BCP-2021 context.
- Three-story reinforced concrete school building, ACI 318-14 / ASCE 7.
- Indeterminate structural analysis comparing manual matrix stiffness with RISA-2D.
- Highway geometric design using Civil 3D / AASHTO-based checks.
- Hydrology / SCS-CN and unit hydrograph.
- Geotechnical direct shear / Terzaghi bearing capacity.
- Recycled coarse aggregate concrete testing.
- Primavera P6 scheduling and earned-value analysis.
- Quantity surveying.
- Retaining-wall design spreadsheets.
- Wastewater / EPA SWMM.
- Water-treatment / coagulation design.

## Recognition

Candidates include:

- Gold Medal record — evidence status user-reported in source.
- Prime Minister's Laptop Scheme record — source text record.
- 3rd Position FYP at Open House & Job Fair Spring 2026.
- Pakistan Navy Educational Scholarship.
- Best Survey Group.
- 2nd Position in ICE Truss Bridge Competition.
- semester merit positions.
- Class VIII academic merit / 91.60%.

## Leadership / development

Examples include:

- Aspire Leaders Program 2026.
- One Million Leaders Asia (OMLAS) Fellowship 2025.
- AI Fluency: Framework & Foundations.
- Revit training/certifications.
- AutoCAD 2023 Masterclass.
- Master Structural Design of Buildings.
- PEC CPD seminars.
- R workshop.
- WFEO World Engineering Day 2026 participation.

## Community / service

Examples include:

- Alkhidmat Foundation professional volunteer record.
- orphan-support community service record.

## Early archive

Examples include:

- school-level relay;
- cricket;
- football;
- Class VIII merit.

These should generally live in Archive/Journey unless there is a narrative reason to feature them.

---

# 12. CONTENT MODEL

Use structured content with schema validation.

## 12.1 Chosen architecture

Use **Astro Content Collections with strict TypeScript/Zod schema validation**.

Use Markdown/MDX for long-form bodies and typed frontmatter for metadata.

Do not hardcode project content directly into page components.

## 12.2 Collections

Create collections approximately like:

- `projects`
- `experience`
- `research`
- `recognition`
- `development`
- `journey`

Common fields should be normalized.

## 12.3 Common record fields

At minimum support:

```ts
id
slug
title
shortTitle?
deck?
type
domains[]
tags[]
dateStart?
dateEnd?
dateDisplay?
ongoing?
organization?
location?
role?
featured
priority
verificationStatus
summary
heroMedia?
thumbnail?
media[]
tools[]
methods[]
outcomes[]
links[]
relatedIds[]
evidence[]
privacyLevel
seo
```

For relevant project/research records also support:

```ts
challenge?
context?
responsibilities?
methodology?
workflow?
deliverables?
technicalDetails?
codesStandards?
results?
publication?
award?
team?
supervisor?
```

Do not force irrelevant fields.

## 12.4 Verification status

Use controlled values such as:

- `official-document`
- `primary-curated-source`
- `user-reported`
- `conflicting-sources`
- `pending-verification`

Verification status is primarily internal and does not need to clutter public pages, but it must govern publication confidence.

## 12.5 Relations

A research item may relate to:

- a project;
- an award;
- an institution;
- a publication;
- a tool;
- a domain.

Use IDs, not duplicated copy.

---

# 13. ROUTING

Prefer generated static routes.

Recommended shape:

```text
/
  Explore landing / default experience

/index/
  Premium Index Mode

/about/

/work/
  Professional experience index

/work/[slug]/

/projects/

/projects/[slug]/

/research/

/research/[slug]/

/recognition/

/recognition/[slug]/

/journey/

/archive/

/contact/
```

If a cleaner architecture emerges during implementation, document the change in `docs/DECISIONS.md`.

Do not depend exclusively on SPA history fallback behavior on GitHub Pages.

Every important shareable item should resolve to a real static route.

---

# 14. TECHNICAL STACK — V1 DECISION

Use a static-first architecture.

## 14.1 Core

- **Astro** as the site shell and static generator.
- **TypeScript** with strict mode.
- **React** only for interactive islands that genuinely need React.
- **React Three Fiber** for the primary 3D/Explore scene unless a prototype proves direct Three.js materially simpler.
- **Three.js** through R3F.
- **Drei** only for justified utilities.
- **GSAP** only for complex choreography / timeline synchronization that CSS or lightweight animation cannot express cleanly.
- Prefer native CSS transitions/animations for simple UI motion.
- Keep native browser scrolling unless a prototype demonstrates a compelling need for a smooth-scroll library.

Do not add Lenis, Motion, Theatre.js, Zustand, Tailwind, a UI kit, a state library, or other dependencies preemptively.

Add dependencies only when there is a clear architectural reason.

## 14.2 Styling

Use a custom design system based on:

- CSS custom properties;
- component-scoped CSS or CSS modules;
- strong layout primitives;
- no generic component-library visual language.

A utility framework may be introduced only if the codebase genuinely benefits and the decision is documented.

## 14.3 3D asset format

Use:

- GLB/GLTF;
- Meshopt and/or Draco compression where beneficial;
- KTX2/Basis texture compression where textures justify it;
- geometry simplification;
- instancing for repeated elements.

Prefer geometry-driven visuals over heavy photorealistic texture sets.

## 14.4 No backend in V1

Do not introduce:

- database;
- CMS server;
- Node backend;
- authentication;
- server-rendered API;
- private server secrets.

Contact should use safe public links / mailto or a later user-approved service.

---

# 15. REPOSITORY STRUCTURE

Use a clean repository such as:

```text
/
├─ public/
│  ├─ fonts/
│  ├─ images/
│  ├─ models/
│  ├─ documents/
│  ├─ social/
│  └─ favicon/
│
├─ src/
│  ├─ components/
│  │  ├─ core/
│  │  ├─ navigation/
│  │  ├─ index/
│  │  ├─ explore/
│  │  ├─ project/
│  │  └─ media/
│  │
│  ├─ content/
│  │  ├─ projects/
│  │  ├─ experience/
│  │  ├─ research/
│  │  ├─ recognition/
│  │  ├─ development/
│  │  └─ journey/
│  │
│  ├─ layouts/
│  ├─ pages/
│  ├─ styles/
│  ├─ lib/
│  ├─ data/
│  └─ types/
│
├─ docs/
│  ├─ PROJECT_MEMORY.md
│  ├─ DECISIONS.md
│  ├─ CONTENT_CONFLICTS.md
│  ├─ ASSET_MANIFEST.md
│  ├─ QA_CHECKLIST.md
│  └─ PERFORMANCE_LOG.md
│
├─ scripts/
├─ astro.config.*
├─ tsconfig.json
├─ package.json
└─ README.md
```

Keep generated output out of source control unless deployment configuration requires otherwise.

---

# 16. DESIGN SYSTEM

## 16.1 Visual tone

Target:

- engineered;
- calm;
- contemporary;
- precise;
- materially grounded;
- intellectually confident;
- not corporate;
- not juvenile;
- not sci-fi cosplay.

## 16.2 Initial color direction

Start with a restrained material palette:

- near-black graphite;
- warm mineral/off-white;
- concrete/steel gray;
- one restrained warm signal accent inspired by engineering/site marking rather than neon UI.

Do not overuse the accent.

The final exact colors can be tuned after visual prototypes.

## 16.3 Typography

Use a high-quality, openly licensed web-font system unless the user later provides licensed fonts.

Direction:

- primary neo-grotesk / contemporary sans for interface and large display;
- restrained monospace for metadata, coordinates, model labels, dates, drawing references;
- optional editorial serif only if it improves long-form research/project storytelling.

Do not use more typefaces than necessary.

Use variable fonts where beneficial.

## 16.4 Type hierarchy

Create deliberate scales for:

- monumental hero statement;
- section title;
- project title;
- body;
- metadata;
- technical annotation;
- caption.

Avoid dozens of arbitrary font sizes.

## 16.5 Grid

Use a desktop editorial grid, e.g. 12 columns, but allow the structural/BIM metaphor to influence alignment without making everything rigid.

On mobile, collapse to a simple readable grid.

## 16.6 Metadata language

Use technical labels sparingly:

- `YEAR`
- `ROLE`
- `DOMAIN`
- `TOOLS`
- `STATUS`
- `FIG.`
- `SECTION`
- `LEVEL`

Do not fill the UI with fake engineering jargon.

---

# 17. HOME / EXPLORE EXPERIENCE

## 17.1 First load

The visitor must get meaningful HTML immediately.

The 3D scene must load progressively.

Before WebGL is ready, show:

- identity;
- concise positioning;
- primary navigation;
- Index toggle;
- static linework/visual state.

Never show a blank canvas while waiting.

## 17.2 Hero copy

Do not default to cliché copy.

A useful starting direction is a concise positioning statement around:

**Civil Engineering × BIM × Digital Construction × Research**

with supporting copy that explains the physical-to-digital continuum.

Final copy must be grounded in the source data.

## 17.3 Spatial system

Build one reusable abstract structural system.

Possible components:

- base grid;
- primary verticals;
- beams/frames;
- node points;
- section plane;
- sparse annotations.

Keep polygon count disciplined.

Do not use a photorealistic building as the homepage hero.

## 17.4 Explore navigation

Provide visible orientation.

Potential domains:

- Practice
- BIM
- Engineering
- Research
- Recognition

Exact naming may be refined.

A user must always be able to:

- return home;
- open Index;
- skip motion;
- navigate by keyboard;
- enter a selected project.

---

# 18. INDEX MODE

Index Mode should be production-ready before the full Explore scene.

## 18.1 Core presentation

Primary view:

A refined editorial list or table.

Columns/metadata may include:

- year;
- title;
- domain;
- role/type;
- organization/context.

Do not create a spreadsheet aesthetic.

Use typography and spacing to make density beautiful.

## 18.2 Preview

On hover/focus:

- image/drawing/model still;
- short deck;
- optional tags.

On touch:

- inline preview or direct project card expansion;
- no hover dependency.

## 18.3 Filters

Start with a small useful set:

- All
- Work
- BIM
- Engineering
- Research
- Recognition

Add filters only if the content volume justifies them.

Potential secondary filters:

- year;
- tools;
- organization;
- project type.

## 18.4 Search

If content volume is sufficient, implement lightweight client-side search.

A command palette may be added later.

Do not make `Cmd/Ctrl + K` the only way to navigate.

---

# 19. PROJECT / CASE-STUDY TEMPLATE

Important work should be presented as engineering case studies, not galleries.

Suggested structure:

1. **Hero**
   - title;
   - concise deck;
   - role;
   - organization/context;
   - date;
   - selected media.

2. **At a glance**
   - domain;
   - tools;
   - scope;
   - contribution;
   - team where relevant.

3. **Context / problem**
   - what was being solved.

4. **Faizan's contribution**
   - make personal contribution explicit.

5. **Method / workflow**
   - diagrams where possible.

6. **Technical evidence**
   - drawings;
   - models;
   - screenshots;
   - calculations/analysis summaries;
   - standards where supported.

7. **Outcome**
   - result, award, publication, implementation, or learning.

8. **Related evidence**
   - DOI;
   - safe document;
   - credential;
   - award relationship.

9. **Related work**
   - cross-links to associated projects/roles.

Not all projects need all sections.

Shorter records can use a condensed template.

---

# 20. RESEARCH PRESENTATION

The BIM-to-AR work is one of the strongest portfolio anchors.

Treat it with scholarly precision.

## 20.1 Publication wording

Use:

- preprint;
- research manuscript;
- Final Year Project thesis;

where supported.

Do not call it a peer-reviewed journal publication unless a future source confirms that status.

## 20.2 Research page content

Include where supported:

- research question/problem;
- standardized multimodal deployment concept;
- Revit → model exchange → Unity → AR workflow;
- AR Foundation / ARCore context;
- C#;
- screenshots/diagrams;
- team;
- supervisor;
- award;
- SSRN DOI;
- relationship to final-year project.

## 20.3 Visual narrative

A drawing/model-to-AR overlay sequence is especially appropriate here.

Do not invent experimental results that are absent from source data.

---

# 21. RECOGNITION / AWARDS

Avoid a wall of certificates.

Use a curated editorial timeline/list.

For major awards:

- title;
- institution;
- date;
- basis;
- concise significance;
- safe visual preview if useful.

For lower-priority credentials:

- metadata-only rows are acceptable.

Group by meaning, not by certificate file type.

Possible groupings:

- Academic merit;
- Engineering competitions;
- Research recognition;
- Leadership/fellowships;
- Professional development;
- Early milestones.

---

# 22. JOURNEY

Journey should not be a childish “from age 8 to now” story.

Use it as a selective progression through meaningful transitions.

Potential milestones:

- early academic recognition;
- entering Civil Engineering;
- first semester merit;
- engineering competitions;
- SIMCO / field exposure;
- survey camp;
- Mount Khalid / BIM exposure;
- BIM specialization;
- research / BIM-to-AR;
- leadership/fellowships;
- graduation;
- current professional roles.

Do not include every certificate.

Archive preserves completeness.

Journey preserves narrative.

---

# 23. ABOUT

About should answer:

- What kind of engineer is Faizan?
- What themes connect his work?
- What is he working on now?
- What areas is he interested in?
- What evidence supports the positioning?

Avoid:

- a long autobiography;
- generic claims like “passionate, hardworking, innovative” unless tied to evidence;
- exaggerated expertise.

Use a professional portrait only if the user provides one and wants it used.

Do not generate a fake portrait.

---

# 24. MEDIA / ASSET STRATEGY

## 24.1 Preferred visual order

For engineering work, prefer:

1. real project model/drawing;
2. real process diagram;
3. selected site/photo evidence;
4. carefully designed diagram built from verified data;
5. decorative rendering only when it adds meaning.

## 24.2 Image processing

Generate responsive sizes.

Use:

- AVIF where practical;
- WebP fallback;
- explicit dimensions;
- lazy loading below the fold;
- meaningful alt text;
- consistent crop logic.

## 24.3 Documents

Do not embed full PDF viewers everywhere.

Preferred pattern:

- cover/selected preview;
- metadata;
- “View document” or “View preprint” link.

## 24.4 Asset manifest

For every copied/derived asset, log:

- source path;
- destination path;
- original filename;
- type;
- selected page if PDF;
- crop/redaction notes;
- optimization performed;
- public usage;
- privacy review status.

---

# 25. PERFORMANCE BUDGETS

Treat these as V1 acceptance targets and log real measurements.

## 25.1 Index / content pages

Target on a representative mid-tier mobile profile and Fast 4G-like conditions:

- LCP: ≤ 2.5 s where realistically achievable
- CLS: < 0.1
- INP: < 200 ms
- initial JS: keep deliberately small; target roughly ≤ 180–220 KB gzip excluding deferred Explore/3D code where possible

Do not chase a number by harming usability. Measure and document.

## 25.2 Explore shell

The HTML/nav/text shell must become usable before the entire 3D scene.

Load 3D asynchronously.

Suggested targets:

- primary compressed hero model: approximately ≤ 1.5 MB where possible;
- total automatically loaded 3D/media for the initial Explore experience: keep within a few MB, not tens of MB;
- defer project-specific models until selection.

## 25.3 Canvas quality

Start with:

- desktop DPR cap around 1.5;
- mobile DPR around 1.0–1.25;
- reduce shadows;
- avoid expensive postprocessing by default;
- adaptive particle count if particles are used;
- avoid full-screen multipass effects unless justified.

## 25.4 Reduced / low-power mode

Provide simplified rendering when:

- mobile/coarse pointer;
- low-end device heuristic;
- reduced motion;
- WebGL limitation;
- performance degradation.

A static or lightly animated substitute is acceptable.

---

# 26. ACCESSIBILITY

Accessibility is a design requirement.

## 26.1 HTML first

Every meaningful project and navigation action must exist in semantic DOM content.

WebGL is supplemental.

## 26.2 Keyboard

Users must be able to:

- open navigation;
- switch mode;
- browse Index;
- open project pages;
- use filters;
- exit dialogs;
- activate all important controls.

## 26.3 Focus

Use clearly visible focus states.

Do not remove outline without an accessible replacement.

## 26.4 Reduced motion

Respect `prefers-reduced-motion`.

Reduced-motion mode should:

- disable camera journeys;
- eliminate parallax;
- minimize text splitting;
- replace complex transitions with near-instant state changes or subtle fades;
- use a static/low-motion hero composition.

## 26.5 Screen readers

Do not expose every decorative canvas object.

Give the canvas an appropriate accessible label only if useful, otherwise treat it as decorative while the equivalent meaning exists in HTML.

## 26.6 Touch

No information may depend solely on hover.

## 26.7 Contrast

Technical metadata must remain readable.

Do not use ultra-faint gray text for aesthetic effect.

---

# 27. MOBILE STRATEGY

Mobile is not a squeezed desktop version.

## Keep

- core identity;
- typography;
- project hierarchy;
- mode switch;
- Index;
- selected lightweight spatial motif;
- high-value imagery;
- short transition moments.

## Simplify

- camera travel;
- 3D depth;
- particles;
- model complexity;
- annotation density;
- simultaneous animations.

## Remove

- custom cursor;
- magnetism;
- mouse-specific interactions;
- expensive postprocessing;
- complex hover-dependent navigation.

## Replace

- hover → tap/focus;
- drag → simple swipe only if needed;
- large spatial world → focused lightweight vignette.

---

# 28. SEO / METADATA

Every canonical page should have:

- unique `<title>`;
- meta description;
- canonical URL;
- Open Graph metadata;
- social image where useful;
- meaningful image alt text;
- correct heading hierarchy.

Generate:

- sitemap;
- robots.txt;
- favicon/app icons;
- share images.

Use structured data when semantically valid:

- `Person`
- `CreativeWork`
- `Article`
- `ScholarlyArticle`

Do not misuse schema.

Research items should include DOI metadata where safe and supported.

WebGL content must never be the only location of indexable text.

---

# 29. GITHUB PAGES + CLOUDFLARE DEPLOYMENT

## 29.1 Deployment model

Use:

Repository
→ GitHub Actions
→ Astro static build
→ GitHub Pages
→ custom domain
→ Cloudflare-managed DNS

## 29.2 GitHub Pages rules

- output static files;
- use correct base/path configuration;
- ensure asset paths work on custom domain and Pages;
- generate static routes;
- include a `CNAME` only if required by the current official Pages workflow;
- verify current official GitHub documentation before final deployment steps.

## 29.3 Cloudflare rules

The user purchased the domain through / manages DNS in Cloudflare.

Before making DNS changes:

- verify exact domain spelling;
- verify current GitHub Pages DNS guidance;
- do not guess whether proxying should be enabled;
- do not change unrelated DNS records;
- document every record added/changed.

## 29.4 HTTPS

Use GitHub Pages HTTPS/custom-domain support according to current official documentation.

## 29.5 Secrets

Never commit:

- credentials;
- API keys;
- Cloudflare API tokens;
- personal access tokens.

Anything shipped to the browser is public.

---

# 30. CODE QUALITY RULES

Use:

- strict TypeScript;
- clear naming;
- small composable components;
- typed content;
- no `any` unless absolutely unavoidable and documented;
- no abandoned experimental code in production;
- no duplicated content;
- cleanup for event listeners, RAF loops and WebGL resources;
- route-level code splitting where beneficial;
- accessible semantic elements before generic `div` controls.

Do not:

- over-engineer a state-management system;
- introduce a global store for trivial state;
- mix content logic into presentation components;
- leave huge monolithic scene files;
- hardcode content in JSX;
- use magic animation values without tokens/comments;
- add dependencies because a reference site used them.

---

# 31. MOTION SYSTEM

Define motion tokens centrally.

Suggested conceptual categories:

- `micro`: 120–180 ms
- `ui`: 180–320 ms
- `section`: 400–700 ms
- `cinematic`: 700–1400 ms only for rare Explore moments

Do not rigidly use these numbers if the interaction needs tuning.

Use a small easing vocabulary.

Navigation actions should feel responsive.

Avoid transitions longer than roughly 1–1.5 seconds unless they are optional cinematic moments.

Motion intensity hierarchy:

### Tier 1
Hero transformation, Explore entry, signature project transition.

### Tier 2
Project preview, domain focus, navigation state.

### Tier 3
Button/row feedback.

Most text should not animate continuously.

---

# 32. CUSTOM CURSOR / POINTER POLICY

Custom cursor is optional.

Only implement if the design prototype clearly benefits.

If used:

- desktop/fine pointer only;
- native pointer semantics remain understandable;
- no large lag;
- use contextual words sparingly;
- disable for reduced motion if appropriate;
- never use on mobile;
- do not make button targeting harder.

Magnetic effects must be subtle and optional.

---

# 33. ANALYTICS

Do not add analytics without user approval.

If later approved:

- use a privacy-respecting solution;
- document what is collected;
- avoid unnecessary cookies;
- do not block first render.

V1 can launch without analytics.

---

# 34. CONTACT

Do not invent contact details.

Build the contact component to accept user-provided:

- email;
- LinkedIn;
- GitHub;
- ORCID;
- Google Scholar;
- SSRN;
- other professional links.

Use only confirmed links.

Do not create a backend form in V1.

---

# 35. PROJECT MEMORY SYSTEM

Antigravity must maintain persistent project memory.

## 35.1 `docs/PROJECT_MEMORY.md`

This file is the concise “state of the project.”

Update after every meaningful development phase.

Include:

- current architecture;
- current stack;
- active visual direction;
- implemented routes;
- implemented content;
- unresolved questions;
- known bugs;
- upcoming work;
- performance state;
- deployment state.

Before each new substantial task, read this file.

## 35.2 `docs/DECISIONS.md`

Use an ADR-like chronological record.

For each significant decision:

```md
## YYYY-MM-DD — Decision title

Context:
Decision:
Why:
Alternatives considered:
Consequences:
```

Record decisions such as:

- Astro chosen over SPA-only React;
- R3F chosen for Explore;
- Index data schema;
- route changes;
- asset/privacy decisions;
- typography change;
- major motion architecture.

## 35.3 `docs/CONTENT_CONFLICTS.md`

Record:

- conflicting field;
- source A;
- source B;
- public impact;
- status;
- user resolution.

Never silently “pick what seems right” when conflicting source data could affect public claims.

## 35.4 `docs/ASSET_MANIFEST.md`

Track source-to-public asset transformations.

## 35.5 `docs/PERFORMANCE_LOG.md`

Record benchmark snapshots after major phases.

## 35.6 `docs/QA_CHECKLIST.md`

Maintain release checks for:

- links;
- routes;
- mobile;
- keyboard;
- reduced motion;
- metadata;
- privacy;
- content conflicts;
- WebGL fallback;
- 404 behavior;
- deployment.

---

# 36. DEVELOPMENT PHASES

Do not attempt the entire site in one unreviewable pass.

Each phase should end in a stable, runnable state.

## Phase 0 — Repository audit and project memory

1. Inspect the working directory.
2. Do not modify raw evidence folders.
3. Create project repository structure.
4. Create `docs/` memory files.
5. Record initial decisions.
6. Confirm no secrets exist.

**Exit criteria:**
Repository is clean, documented, and ready for scaffold.

---

## Phase 1 — Static shell and content system

1. Scaffold Astro + TypeScript.
2. Add React integration.
3. Create content collections and schemas.
4. Add initial canonical routes.
5. Add a small representative seed set of content.
6. Add sitemap/metadata foundation.
7. Add 404 page.
8. Build successfully for static output.

Do **not** start 3D first.

**Exit criteria:**
Indexable static pages render and build correctly.

---

## Phase 2 — Design system and Index Mode

1. Implement typography.
2. Implement grid and spacing.
3. Implement navigation.
4. Implement Explore/Index switch shell.
5. Build Index list.
6. Add filters.
7. Add responsive behavior.
8. Add focus/keyboard support.
9. Add project preview behavior.
10. Add reduced motion foundation.

**Exit criteria:**
The site is already useful and visually credible without WebGL.

---

## Phase 3 — Canonical content pages

1. Implement project templates.
2. Implement work/experience pages.
3. Implement research page.
4. Implement recognition pages.
5. Implement journey.
6. Add related-content graph.
7. Add document-link components.
8. Add verification/privacy-aware asset slots.

**Exit criteria:**
Core portfolio information is complete enough to be reviewed as a professional website.

---

## Phase 4 — Explore prototype

1. Prototype one lightweight structural scene.
2. Validate performance.
3. Validate desktop/mobile fallback.
4. Prototype drawing → model transition.
5. Add visible orientation/nav.
6. Connect one featured record to scene state.

Do not add polish before testing the interaction model.

**Exit criteria:**
The core spatial metaphor is understandable and useful.

---

## Phase 5 — Signature interactions

Build only high-value interactions:

- hero drawing-to-model;
- domain focus;
- Index preview;
- selected project transition.

Do not add effects merely because time remains.

**Exit criteria:**
Interaction hierarchy is clear and no effect blocks navigation.

---

## Phase 6 — Curated asset integration

1. Select only needed visuals from evidence folders.
2. Apply privacy review.
3. Optimize media.
4. Update asset manifest.
5. Add real project drawings/renders/screens.
6. Replace temporary placeholders.

**Exit criteria:**
No sensitive data leaks and no unnecessary evidence files are copied.

---

## Phase 7 — Performance, accessibility, SEO

1. Lighthouse/real-browser checks.
2. Keyboard audit.
3. reduced-motion audit.
4. screen-reader smoke test.
5. mobile GPU test.
6. route/deep-link test.
7. optimize models.
8. optimize images.
9. validate metadata and sitemap.
10. add structured data where appropriate.

**Exit criteria:**
QA checklist passes with documented exceptions.

---

## Phase 8 — GitHub Pages deployment

1. Configure build workflow.
2. Deploy to Pages test URL.
3. Validate deep routes.
4. Validate assets.
5. Validate 404 behavior.
6. Verify exact custom domain spelling with user/Cloudflare.
7. Apply domain/DNS according to current official GitHub/Cloudflare documentation.
8. Verify HTTPS.
9. Re-test canonical URLs and metadata.

**Exit criteria:**
Production site is stable on custom domain.

---

## Phase 9 — Editorial polish

Only after production architecture is stable:

- copy refinements;
- animation tuning;
- hover polish;
- visual rhythm;
- additional archive items;
- selected 3D refinements.

Avoid rebuilding architecture for cosmetic changes.

---

# 37. REVIEW GATES

At the end of each major phase:

1. summarize what changed;
2. list files created/modified;
3. state unresolved issues;
4. update project memory;
5. run build/tests;
6. do not claim success if build/QA failed;
7. preserve a rollback point.

Do not rewrite large parts of the project between review gates without a documented reason.

---

# 38. TESTING REQUIREMENTS

At minimum test:

## Build

- static production build succeeds;
- no TypeScript errors;
- no broken content schema;
- no unresolved imports.

## Routing

- home;
- Index;
- all primary landing pages;
- representative project;
- research;
- recognition;
- 404;
- direct deep link.

## Responsive

- small mobile;
- large mobile;
- tablet;
- common laptop;
- large desktop.

## Interaction

- mouse;
- keyboard;
- touch where possible;
- reduced motion;
- WebGL unavailable/fallback.

## Content

- no invented facts;
- no unresolved conflict accidentally published;
- no private IDs;
- DOI links correct based on curated source;
- dates from source.

## Accessibility

- focus;
- headings;
- labels;
- alt text;
- skip link;
- contrast;
- modal/dialog behavior.

## Performance

- initial Index load;
- Explore lazy load;
- scene memory;
- route transition;
- mobile.

---

# 39. 3D IMPLEMENTATION RULES

## 39.1 Scene purpose

The scene is a narrative instrument.

Keep one coherent world/state system.

## 39.2 Geometry

Prefer:

- simple structural members;
- instanced repeated geometry;
- line segments;
- point representation;
- low-complexity custom geometry.

Avoid importing an entire BIM model as the landing scene.

## 39.3 Interaction

Raycast only where needed.

Provide DOM equivalents.

## 39.4 Camera

Camera motion should:

- orient;
- focus;
- reveal.

Do not induce motion sickness with constant drift.

## 39.5 Shadows / lighting

Use restrained lighting.

Do not turn the scene into a photorealistic render benchmark.

## 39.6 Postprocessing

Start with none.

Add only if a specific effect materially improves the visual concept.

## 39.7 Cleanup

Dispose resources properly on unmount.

Pause animation when the tab is hidden where appropriate.

---

# 40. COPYWRITING RULES

Tone:

- precise;
- modern;
- professional;
- technically literate;
- calm;
- evidence-based.

Avoid:

- “visionary”;
- “world-class”;
- “revolutionary”;
- “master of”;
- inflated leadership language;
- unverified impact claims;
- AI-generated motivational clichés.

Prefer:

**what was done + context + method + result**

Example pattern:

> Developed structural Revit models and fabrication/shop-detailing outputs for modular pedestrian bridge systems serving Australian infrastructure projects.

Only use wording supported by source data.

---

# 41. STATUS / PUBLICATION LANGUAGE

Be precise with status.

Examples:

- “SSRN preprint” is not “journal publication.”
- “participated in” is not “won.”
- “certificate of completion” is not “professional license.”
- “Gold Medal record in curated source” must not be falsely described as “official certificate verified” if the source says otherwise.

Internally track evidence quality even if the public page uses clean wording.

---

# 42. CONTENT CONFLICT WORKFLOW

When a conflict appears:

1. stop before publishing the affected field;
2. record it in `CONTENT_CONFLICTS.md`;
3. identify source priority;
4. ask the user only if the conflict materially affects the public site;
5. after resolution, update canonical content;
6. record resolution date/source.

Do not waste user attention on trivial formatting differences.

---

# 43. INITIAL FEATURED RECORDS TO BUILD FIRST

Use a small seed dataset first.

Recommended initial content:

1. BIM-to-AR research project.
2. OpenSpace role.
3. Urbana role.
4. BIM portfolio overview / Tahir + Haroon + Dynamo.
5. NUST Faisal Masjid structural design project.
6. Academic merit / degree recognition overview.
7. SIMCO internship.
8. Best Survey Group / survey camp.

Do not block development waiting for every archive record.

---

# 44. ARCHIVE STRATEGY

The archive should preserve depth without overwhelming the main site.

Possible structure:

- compact list;
- year grouping;
- category filters;
- metadata rows;
- optional safe credential preview.

Archive can include:

- certifications;
- CPD;
- webinars;
- workshops;
- volunteering;
- competitions;
- school-level achievements.

Do not give every certificate a full-page case study.

---

# 45. SOCIAL / EXTERNAL LINKS

Add components capable of supporting:

- SSRN;
- DOI;
- LinkedIn;
- GitHub;
- ORCID;
- Google Scholar;
- email;
- employer profile;
- publication link.

Only enable confirmed links.

Use `rel` attributes appropriately for external links.

---

# 46. 404 / FAILURE STATES

Create a designed 404 page consistent with the identity.

If Explore fails:

- keep nav;
- keep Index toggle;
- show a graceful static hero;
- never trap the visitor.

If an image/model fails:

- content remains readable;
- show meaningful alt/fallback.

---

# 47. REDUCED-MOTION / STATIC EXPERIENCE

Build this intentionally, not as an afterthought.

The static experience should still look excellent.

For reduced motion:

- hero linework can be pre-composed;
- model can be a still image/SVG/very gentle static canvas;
- no scroll-linked camera motion;
- no magnetic controls;
- minimal fades.

The user should not feel punished for accessibility preferences.

---

# 48. VISUAL REFERENCE PRINCIPLES

The research package identified useful reference families such as:

- creative 3D portfolios;
- high-end editorial portfolios;
- architecture practices;
- BIM/digital-twin interfaces;
- research sites;
- design archives.

References include sites associated with:

- Bruno Simon;
- Dennis Snellenberg;
- Active Theory;
- Locomotive;
- Lusion;
- BIG;
- Foster + Partners;
- Snøhetta;
- MIT Media Lab;
- Codrops;
- Three.js examples.

These are **reference families, not templates**.

Do not reproduce:

- their navigation mechanics;
- their signature transitions;
- their color systems;
- their 3D worlds;
- their project layouts.

Learn principles, then translate them into Faizan's domain.

---

# 49. DESIGN DIFFERENTIATION TEST

Before approving a major visual idea, ask:

1. Could this same interface belong unchanged to a photographer, UX designer, or musician?
2. Is the idea visibly connected to physical structures, digital models, construction, engineering information, or research?
3. Is the connection authentic rather than decorative?
4. Does the idea improve comprehension?
5. Will it still feel credible in five years?

If answer #1 is “yes” and #2 is “no,” the design is too generic.

---

# 50. PRODUCT SUCCESS CRITERIA

V1 succeeds when:

- a professor can find academic/research evidence quickly;
- a recruiter can understand Faizan's professional profile quickly;
- an engineer can see credible technical work;
- a design-aware visitor remembers the spatial engineering identity;
- the site is understandable without WebGL;
- the site works on mobile;
- Explore does not block Index;
- no private data is accidentally exposed;
- content is not duplicated;
- research/publication status is precise;
- the site deploys reliably on GitHub Pages;
- future records can be added without redesigning the site.

---

# 51. DEFINITION OF DONE FOR V1

Do not call V1 complete until:

- production build passes;
- custom domain is verified;
- all Tier A content has canonical pages or intentionally curated representations;
- Index Mode is complete;
- Explore Mode has at least one meaningful signature sequence;
- mobile behavior is intentionally designed;
- reduced motion works;
- keyboard navigation works;
- WebGL fallback works;
- source conflicts affecting public content are resolved or omitted;
- privacy audit passes;
- no raw sensitive certificate is exposed;
- metadata/sitemap work;
- broken links are fixed;
- asset manifest is current;
- project memory is current.

---

# 52. IMMEDIATE START INSTRUCTIONS FOR ANTIGRAVITY

When this file is first provided to you:

## Step 1
Read this entire document.

## Step 2
Inspect the working directory without altering evidence folders.

## Step 3
Locate the curated Markdown knowledge base if it is present.

Preferred source files:

- `Faizan_Master_Academic_and_Professional_Portfolio-Comprehensive.md`
- `Academic Porfolio.md`

Do not parse all PDFs to recreate their content.

## Step 4
Create:

- `docs/PROJECT_MEMORY.md`
- `docs/DECISIONS.md`
- `docs/CONTENT_CONFLICTS.md`
- `docs/ASSET_MANIFEST.md`
- `docs/PERFORMANCE_LOG.md`
- `docs/QA_CHECKLIST.md`

## Step 5
Scaffold the Astro/TypeScript project.

## Step 6
Implement Phase 1 only.

Do not jump directly into the hero animation.

## Step 7
Report:

- repository structure;
- dependencies;
- first routes;
- content schema;
- known content conflicts;
- build status;
- next phase proposal.

Then proceed sequentially.

---

# 53. CHANGE MANAGEMENT AFTER V1

The user intends to iterate on the website with ChatGPT and Antigravity.

Therefore:

- make changes incrementally;
- preserve stable architecture;
- document substantial visual/architectural decisions;
- avoid broad rewrites unless the user explicitly chooses a new direction;
- keep content and presentation decoupled;
- do not remove previous working functionality without a reason;
- maintain rollback-friendly commits.

When new content arrives:

1. add/update the canonical structured record;
2. add only necessary media;
3. verify privacy;
4. update relationships;
5. let Explore/Index surfaces inherit from shared data.

---

# 54. FINAL GOVERNING RULE

At every stage, prioritize this sequence:

**truth → clarity → accessibility → performance → design → spectacle**

Spectacle is last.

A technically ambitious moment is valuable only if the first five remain intact.

The website should ultimately feel like a **constructed system of identity**:

- grounded in evidence;
- architected like an engineering system;
- expressed with design discipline;
- enriched by interaction;
- never dependent on gimmicks.

---

# APPENDIX A — INITIAL CONTENT CATEGORIES FROM THE CURATED KNOWLEDGE BASE

The source database includes material across:

1. School-level extracurricular and early academic merit
2. BIM portfolio
3. Certifications
4. PEC CPD / professional development
5. Degree and transcript
6. University extracurricular activities
7. Final Year Project / research / preprint
8. Honors and awards
9. Internships
10. Semester merit positions
11. Present professional roles
12. Semester engineering projects
13. SSC / HSSC
14. Volunteer / community service
15. Webinars / conferences
16. Workshops

Do not mirror this 1:1 into global navigation.

Use it as a content inventory.

---

# APPENDIX B — STRONG INITIAL PROJECT/EXPERIENCE CANDIDATES

### BIM-to-Augmented-Reality Research
Primary research anchor.

### OpenSpace — Track Delivery Specialist
Primary current professional anchor.

### Urbana — Revit Drafter / Modeler
Primary current BIM/professional anchor.

### Tahir Residency / Haroon Residency / Dynamo
Primary BIM capability anchor.

### NUST Faisal Masjid — ETABS/SAFE
Primary structural-analysis/design anchor.

### Mount Khalid 45-Story Tower
Strong BIM/high-rise internship anchor after date conflict resolution.

### SIMCO
Strong construction/site management internship anchor.

### Best Survey Group
Strong field/surveying evidence.

### RC School Building
Strong academic design case study.

### Primavera P6 Project
Strong planning/management case study.

---

# APPENDIX C — PRIVACY-SENSITIVE SOURCE DETAILS TO AVOID PUBLISHING BY DEFAULT

The source material may include items such as:

- CNIC/national ID in internship evidence;
- father's name and service identifiers;
- university registration numbers;
- certificate serial numbers;
- signatures;
- QR/verification codes;
- institutional internal IDs.

These details are not needed to prove most public portfolio claims.

Omit or redact them unless the user explicitly requests otherwise.

---

# APPENDIX D — CURRENTLY KNOWN SOURCE QUALITY NOTES

### Gold Medal
Present in the primary knowledge base as a user-reported text record. Public wording may state the achievement if the user wishes, but the internal site record should preserve evidence status until official evidence is supplied.

### Prime Minister's Laptop Scheme
Present as a text record in the curated source. Preserve evidence status.

### Mount Khalid dates
Conflicting representations exist across the two Markdown knowledge bases. Do not publish a precise date until resolved.

### Publication
Treat BIM-to-AR as an SSRN preprint / research manuscript / FYP thesis according to source status. Do not describe it as a peer-reviewed journal publication.

---

# APPENDIX E — REFERENCE LINKS FOR IMPLEMENTATION REVIEW

Use official sources for implementation decisions and verify current documentation at the time of coding.

Potential references:

- Astro documentation: `https://docs.astro.build/`
- Vite documentation: `https://vite.dev/`
- Three.js documentation: `https://threejs.org/docs/`
- React Three Fiber: `https://r3f.docs.pmnd.rs/`
- Drei: `https://github.com/pmndrs/drei`
- GSAP: `https://gsap.com/docs/`
- GitHub Pages: `https://docs.github.com/pages`
- Cloudflare developer documentation: `https://developers.cloudflare.com/`

Portfolio/design reference families previously identified include:

- `https://bruno-simon.com/`
- `https://dennissnellenberg.com/`
- `https://activetheory.net/`
- `https://locomotive.ca/`
- `https://lusion.co/`
- `https://big.dk/`
- `https://www.fosterandpartners.com/`
- `https://www.snohetta.com/`
- `https://www.media.mit.edu/`
- `https://tympanus.net/codrops/`
- `https://threejs.org/examples/`

Do not assume any reference site's current implementation details unless verified live.

---

# END OF MASTER SPECIFICATION
