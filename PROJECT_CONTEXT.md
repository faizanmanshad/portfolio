# Project Context: Faizan Manshad Portfolio

This document provides a detailed overview of the architectural structure, tech stack, and content organization of Faizan Manshad's personal portfolio website. It is designed to act as context for AI assistants analyzing, modifying, or building upon this codebase.

## 1. Tech Stack & Core Technologies
- **Framework:** [Astro](https://astro.build/) (Static Site Generation & Content Collections)
- **Styling:** Vanilla CSS (CSS Variables for theming, modular `.css` files, inline scoped `<style>` in Astro components). No Tailwind CSS.
- **Animations:** GSAP (`gsap`) for scroll and load animations (e.g., stagger effects).
- **Icons / SVGs:** Custom SVG implementation or local assets.
- **Language:** HTML, JavaScript, and TypeScript (for Astro configuration and content schemas).

## 2. Global Styling & Theming
- The design system is highly tabular and grid-based, focusing on a premium, academic, and structured feel.
- Global CSS tokens (colors, spacing, typography) are likely defined in `src/styles/` or the base `Layout.astro`.
- Components often utilize standard classes like `.gsap-stagger-parent` and `.gsap-stagger-item` for automatic staggered entrance animations managed by a global or page-level GSAP script.

## 3. Directory Structure

### `src/layouts/`
Contains the base HTML shells wrapping the content.
- `Layout.astro`: The standard layout wrapping standard pages (like Home, About, Academic). Contains the `<head>`, global metadata, and the base structure.
- `ProjectLayout.astro`: The specific layout for individual content collection entries (like a specific project or research paper). It usually includes project headers, meta information sidebars, and navigation back to index pages.

### `src/components/`
Modular UI components used across the site.
- `Nav.astro`: Global navigation sidebar/header.
- `Cursor.astro`: Custom mouse cursor implementation.
- `index/`: Components related to listing content (the core tabular list view).
  - `IndexList.astro`: Iterates over an array of content collection items and renders `IndexRow` components.
  - `IndexRow.astro`: Renders an individual row in the tabular layout (Year, Title, Domain, Context/Role). This is a heavily reused component for the "Archive/CV" feel.
- `explore/` & `project/`: Specific components for the visual explorer UI and project detail pages.

### `src/content/`
Astro Content Collections containing Markdown/MDX files for all dynamic portfolio items.
- `projects/`: Standard academic and professional projects.
- `experience/`: Work experience and internships.
- `research/`: Academic papers and research efforts.
- `recognition/`: Awards, certifications, and community service.
- `journey/`: Used for chronological timelines on the About page.
- `content.config.ts`: Defines the Zod schemas validating the frontmatter for all these collections (e.g., parsing `title`, `dateStart`, `domains`, `role`).

### `src/pages/`
The routing structure of the application.
- `index.astro`: The landing page/homepage.
- `about/index.astro`: The "About Me" page detailing the biography and community journey.
- `academic/index.astro`: The "Curriculum Vitae" page. It aggregates `experience`, `research`, `projects`, and `recognition` into a single, highly structured, sectioned CV layout mimicking academic standards. Includes hardcoded sections for "Education" and "Technical Skills".
- Dynamic Routes (e.g., `projects/[...slug].astro`, `experience/[...slug].astro`): Each content collection has a corresponding dynamic route folder to generate individual detail pages for entries.

## 4. Key Architectural Patterns
1. **The "Index" Pattern:** The site relies heavily on an `IndexList` and `IndexRow` pattern. Pages present content as a 4-column grid (YEAR, TITLE, DOMAIN, ROLE/CONTEXT). 
2. **Content Aggregation:** Pages like `/academic` fetch multiple collections (`projects`, `experience`, `research`, `recognition`) via `getCollection()`, sort them by priority or date, and pass them into the `IndexList` component.
3. **GSAP Integration:** Almost all pages trigger an entrance animation. A `<script>` block at the bottom of the `.astro` files hooks into `.gsap-stagger-parent` and `.gsap-stagger-item` to execute `gsap.fromTo()`.
4. **CSS Grid:** Core layout structures (like the `index-columns` and `row-inner` in `IndexRow.astro`) utilize `display: grid` with explicitly defined fractional columns (e.g., `grid-template-columns: 80px 3fr 2fr 3fr`).

## 5. Development Workflow
- **Dev Server:** `npm run dev` starts the Astro development server.
- **Content Updates:** To add a new project, research item, or experience, a new markdown file should be added to the respective `src/content/<collection>/` folder conforming to the schema in `content.config.ts`. The UI will automatically propagate the changes on the CV and detail pages.
