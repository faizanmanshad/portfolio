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

## Academic dossier and contextual navigation — 2026-09-24
- Implemented the approved dark academic overview, section index, research diagram, education and shared content records. Existing content files remain unchanged; unresolved education dates are omitted from the overview.
- Academic-only IntersectionObserver reveals reset outside the viewport and replay on re-entry; reduced-motion preference displays content immediately.
- Shared ContextReturn footer uses same-origin referrer and per-history-entry return data, preserving destination on reload. Known section labels and parent fallbacks cover direct visits; experience detail fallback is Work, journey fallback is About.
- Removed the fixed Academic Archive return from ProjectLayout. Global Layout only imports and renders the footer; existing transition code was compared with the starting version and is unchanged. Explore content and styles untouched.
- Contact includes required email/message and optional name/phone. Current implementation prepares a mailto draft; it does not deliver mail from a backend or claim successful delivery. Direct sending needs an email service later.
- Checked Academic → About → Recognition → Best Survey Group labels and reload persistence. Academic reveal class cycled visible → hidden → visible. Phone widths checked at 390px for Academic and Contact with no horizontal overflow. Contact required/email validation checked without sending email. No browser console errors observed.
- Final build: 24 pages; check: 0 errors, 0 warnings, existing advisory hints remain. Mail-app launch/delivery was not exercised.

## 2026-09-25 research pass
- Type check: zero errors/warnings. Production build: 24 pages.
- All three manuscript images loaded; gallery visually reviewed at narrow preview width.
- Academic -> study -> browser Back -> Forward: content visible, zero remaining door panels on both returns. Cached-restoration cleanup added; browser tooling does not confirm cache eligibility on every traversal.
