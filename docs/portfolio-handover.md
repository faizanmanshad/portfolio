# Contact delivery setup and handover

## Starting point

The portfolio is an Astro static site with Markdown collections, React components, GSAP animation, GitHub Pages deployment and remote media. The verified starting commit is 199843e0a3e473134e5a1d5276e2fa4f4ae7da75. Current edits are in the working tree. The content changes and API have not been deployed.

## Work already done

- The read-only audit of the 87-file scholarship folder is in portfolio-evidence-review.md. It includes the approved-additions prompt, evidence sources and destinations.
- The shared navigation links to Contact from desktop and mobile. Academic shows Taxila, the requested mailto and the LinkedIn profile recovered from the BIM portfolio. Contact contains name, email, subject and message.
- Public wording was checked across the home, academic, about, work, research, projects, recognition, contact, development, education, experience, journey and detail routes. All 15 project entries retain their calculation and drawing details. The four work entries distinguish employment, modelling, site training and participation. Research presents an SSRN preprint and three physically tested Android prototypes. The awards dates match the scanned certificates. The reported medal remains on the site and the transcript confirms 3.95/4.00.
- The original Mount Khalid letter has the wrong year. Faizan confirms 2025 and eight weeks. The letter date is not an internship end date. Resolve and NSTP Tower were two sites within SIMCO. No separate employer should be created.
- Git comparison with the starting revision gives the complete per-file change list. The principal files are src/components/Nav.astro, src/consts.ts, src/pages/contact/index.astro, src/pages/academic/index.astro, the section overview pages, src/content, the truss and document components, and contact-api.
- Desktop Chrome and mobile-width Chrome navigation were tested at 320, 390, 768, 1024 and 1440 px. Both navigation versions reached Contact. The form fit within the viewport. QA used actual built files and did not depend on external media. The project built 74 pages. Browser navigation also read the separate Google verification HTML file.
- A local browser integration test connected the built form to the actual worker handler and simulated the downstream mail service. It checked required fields, origin restrictions, honeypot, rate limit, recipient, reply-to, subject, errors, retained draft, same-key retry, duplicate suppression and success reset. This test does not establish external delivery.

## Connect the live mail service

1. Sign in to the account that controls faizanmanshad.com and the current contact-api subdomain. Identify the Worker handling the existing route and save its current configuration. The live domain answered a CORS preflight. Its existing recipient could not be verified from this repository.
2. In Resend, add a sending domain you control and publish the DNS records it provides. Wait for verification and create a sending-only key for that domain. Choose a From address on that verified domain. The worker fixes the recipient at contactfaizanmanshad@gmail.com. The visitor’s email is used only as Reply-To.
3. From the contact-api directory, authenticate Wrangler to the intended Cloudflare account with npx wrangler login. Run npx wrangler secret put RESEND_API_KEY and npx wrangler secret put MAIL_FROM. Enter their values at the prompts. The latter is the verified sender address. Keep both out of frontend environment variables. The Wrangler configuration includes the CONTACT_LIMIT binding.
4. Deploy with npx wrangler deploy from contact-api. In Cloudflare Workers routes, assign contact-api.faizanmanshad.com/message* to portfolio-contact on the proxied subdomain. Check that this path reaches the new Worker. Preserve other paths used by the current website. If using another endpoint, set PUBLIC_CONTACT_ENDPOINT at Astro build time and adjust the allowed production origins if the site hostname changes.
5. Publish the static site through its normal deployment workflow. From the deployed Contact page submit one clearly labelled test. Confirm the visitor sees the accepted status, check the provider delivery event, then check receipt in contactfaizanmanshad@gmail.com including spam. Reply to the test and verify Reply-To. Only record live delivery as verified after the inbox test.
6. Review the evidence additions prompt with Faizan before adding projects or certificate scans. Obtain the corrected Mount Khalid letter when available. Keep sensitive personal data out of public artifacts.
