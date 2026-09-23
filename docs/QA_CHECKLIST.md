# QA Checklist

## Explore studio pass — 2026-09-23
- Production build succeeds: 24 pages. `npm run check`: 0 errors, 0 warnings; existing advisory hints remain.
- Visually reviewed desktop (1440 × 900) and phone (390 × 844). No horizontal overflow on the phone; corrected introduction spacing.
- Exercised Explore the model, topic details, Blueprint, Exploded, Reset and rotation controls. Research detail resolves to the existing BIM-to-AR route.
- Phone detail panel and mode controls fit; checked browser console without application errors.
- Fallback SVG and reduced-motion branches implemented; simulated WebGL failure, disabled JavaScript and OS reduced-motion preference were not exercised.
- Academic content was not revised. The broader checklist below remains a separate site-wide audit.

## General
- [ ] No invented facts
- [ ] No unresolved conflict accidentally published
- [ ] No private IDs exposed
- [ ] DOI links correct based on curated source
- [ ] Dates match source

## Routing & Links
- [ ] Home (`/`)
- [ ] Index (`/index/`)
- [ ] All primary landing pages
- [ ] Representative project pages
- [ ] Research pages
- [ ] Recognition pages
- [ ] 404 page
- [ ] No broken links

## Accessibility
- [ ] Focus states visible
- [ ] Proper heading hierarchy
- [ ] Meaningful alt text
- [ ] Skip link present
- [ ] Sufficient color contrast
- [ ] Respects `prefers-reduced-motion`

## Interaction & Mobile
- [ ] Keyboard navigation works
- [ ] Touch targets sufficient
- [ ] WebGL fallback works
- [ ] Responsive across screen sizes

## Build & SEO
- [ ] Static production build succeeds
- [ ] No TypeScript errors
- [ ] Metadata and sitemap valid
