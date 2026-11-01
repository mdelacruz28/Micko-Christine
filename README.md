Local Vercel + Neon migration is prepared and tested; see [VERCEL-NEON-MIGRATION.md](VERCEL-NEON-MIGRATION.md) for local preview, account setup and the unexecuted cutover procedure. No deployment or live migration has occurred.

Current guest validation and approved deadline: see [final guest review and deadline report](GUEST-VALIDATION-AND-DEADLINE-REPORT.md). The approved local deadline is November 15, 2026, 11:59 PM Philippine Time; real guest import and live deployment remain unapproved.

Latest UI/Guest List work: see [creation, heading sizes, shared background and validation report](DESIGN-AND-GUEST-LIST-REPORT.md). Enter names in the existing spreadsheet?s Guest List tab; validation and import remain owner-operated.

Current RSVP: one person per invitation, one reserved seat, name-only lookup and an immutable first response. See [final implementation report](FINAL-IMPLEMENTATION-REPORT.md) and [owner guest preparation](apps-script/GUEST-IMPORT.md).

# Micko & Christine wedding invitation

Vue 3 Composition API, Vite and GSAP/ScrollTrigger. Recovered wedding content, colors, fonts, images and section order are preserved. Gallery stays disabled. The latest authorized enhancements add two-second story autoplay with pause controls, shared Cinzel Decorative headings, desktop decorative parallax across the active sections, a compact timeline and aligned parents rows. Touch/reduced-motion layouts stay static. See [UI recovery phases and current visual-review checklist](UI-RECOVERY.md); the original recovery report records the earlier backend checkpoint.

## Run locally

```powershell
npm ci
npm run dev
```

Vite uses port 1010. Copy `.env.example` to `.env.local` if connecting a reviewed backend. `VITE_RSVP_API_URL` is the public Apps Script `/exec` endpoint only; leave it empty until remote contract review. Without it the wedding site works and RSVP reports that it is not connected. No Google Form placeholder remains.

## Verify

```powershell
npm test
npm run test:browser
npm run build
npm audit
```

Node tests simulate Apps Script and exercise the real frontend service/composable plus owner-only guest preparation. Browser tests use installed Chrome and dummy intercepted responses at desktop, 390px and 320px reduced motion, plus responsive sweeps at 320–1440px and 200% text. They never contact Google. For installed Edge in PowerShell, set `$env:RSVP_BROWSER_CHANNEL='msedge'` before the browser command. Tests require a free local port 1011; set `$env:RSVP_TEST_PORT='1013'` to use another free port without stopping an existing server. Browser outputs contain dummy data only and are ignored by Git. Production output is `dist/`.

See [backend contract and manual reconnection instructions](apps-script/README.md), [recovery checklist](RECOVERY.md), and [verification report](RECOVERY-REPORT.md). The owner-supplied original source was inspected and adapted locally. The live deployment/version, Script Properties and Google integration remain unverified; this is not a production-security verification.

## Structure

- `src/components/RSVPSection.vue`: preserved RSVP shell, theme and section reveals.
- `src/components/InvitationRsvpForm.vue`: full-name lookup, one-seat attendance, private returning-guest notice and receipt UI.
- `src/composables/useInvitationRsvp.js`: form state, draft validation, safe retries and conflicts.
- `src/services/rsvpApi.js`: simple POST transport, safe errors and response contract validation.
- `apps-script/`: adapted four-tab backend, owner-only dry-run CLI/snapshot helper and manifest reference. The historical dummy-family fixture is not an import input.
- `tests/`: backend, frontend workflow, CLI and browser checks.
- `src/assets/styles`, `public/images`: recovered theme and wedding assets.

Use ignored `private-rsvp/` for private guest lists, snapshots, previews and confirmed append files. The CLI never contacts Google; live import and deployment each need separate approval. Do not add secrets, real guest data or local environment files to Git.

## Git recovery and future push

This recovered folder had no `.git`; a new local repository was initialized on `recovery/secure-rsvp`, with baseline `f24862a`. The original GitHub history is not included, and no remote is configured. Temporary portable Git was used because Git was not installed on PATH; install/use your own Git client for future work. Commits use the local label `Wedding Recovery <recovery@localhost>` without changing global identity settings.

Do not force-push this new root history over the existing repository. **Only after explicit owner approval to push**, clone the real GitHub repository into a separate folder, create a new recovery branch from its current branch, and transfer the reviewed recovery changes without copying this `.git`, `node_modules`, `dist`, private files or environment files. Review the diff and run the tests/build there, then push the new branch with `git push -u origin recovery/secure-rsvp` and open a review. Resolve differences with the current remote content before pushing; never reset or overwrite either copy blindly.
