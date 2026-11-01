Current requirements and results are in [FINAL-IMPLEMENTATION-REPORT.md](FINAL-IMPLEMENTATION-REPORT.md). The checklist below is the historical recovery checkpoint; the current flow has one seat per person and no public editing.

# Recovery checklist

Approved scope: local RSVP recovery; no remote writes, deployment, push, gallery activation, or parallax redesign.

- [x] Audit recovered sources, assets, package scripts, RSVP, motion and documentation.
- [x] Preserve recovered folder in a new local Git repository, branch `recovery/secure-rsvp`, baseline `f24862a` (original Git history was absent).
- [x] Implement and simulate the four-tab backend contract.
- [x] Implement themed invitation verification, attendee names, edits and receipts.
- [x] Add offline provisioning, tests and operator documentation.
- [x] Run tests and production build; record verification limits in RECOVERY-REPORT.md.
- [x] Commit recovery checkpoint on recovery/secure-rsvp (see Git log for hash).
- [ ] Compare existing remote Apps Script source and digest format before any approved manual update.
- [ ] Perform real browser, Google integration and abuse testing before production use.

Audit: all wedding sections exist; Gallery is disabled and BackgroundCanvas is not rendered. RSVP opened a placeholder Google Form and did not submit its local fields. No backend, tests or provisioning existed. RSVP copy says October 17, 2026; this is past at recovery time and requires owner confirmation against RSVP_DEADLINE. Wedding date/content remain unchanged.

Existing missing assets: `/images/story/story-01.jpg`, dress-code family/principal-sponsor photos, RSVP/closing backgrounds, inactive gallery photos. BackgroundCanvas uses an unresolved `@` alias. Existing GSAP animations do not consistently respect reduced motion. Preserve these findings separately from RSVP recovery; do not invent replacement photos or change section animations.

Baseline: in-memory Vite compilation passed (45 modules), with unresolved background warnings. No baseline tests or actual browser/Google checks existed.
