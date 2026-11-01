Latest checkpoint: [GUEST-VALIDATION-AND-DEADLINE-REPORT.md](GUEST-VALIDATION-AND-DEADLINE-REPORT.md). Live authoritative validation found 74 valid guests, zero rejects/duplicates/formulas/conflicts; rows 2?75 were verified Valid / Ready without importing records. Local approved deadline: 2026-11-15T23:59:59+08:00. Tests: 24 Node passed, 13 targeted Chrome passed with 2 intentional skips, build passed. Earlier notes requesting a deadline decision or claiming an empty Guest List are historical.

Current Guest List and shared-background changes are documented in [DESIGN-AND-GUEST-LIST-REPORT.md](DESIGN-AND-GUEST-LIST-REPORT.md). Exactly one new live input tab was added; original RSVP records were preserved and verified unchanged again at completion. Current validation: 20 Node tests passed; 67 unique browser cases passed after correcting/rerunning three obsolete assertions, with 23 intentional skips; production build passed.

# Current per-person RSVP and Intro checkpoint

See [FINAL-IMPLEMENTATION-REPORT.md](FINAL-IMPLEMENTATION-REPORT.md) for the latest authorized implementation, live read-only verification, complete changed-file list, import preparation and launch decisions. Final current checks: 16 Node tests and 62 browser tests passed, with 19 intentional browser skips; production build passed. All four live sheet tabs matched their start-of-task values on final readback. No import/deployment/push was performed. Earlier reports below describe superseded group/edit flows and retain their original checkpoint results.

# RSVP finalization checkpoint ? October 21, 2026

The current local RSVP flow supersedes the earlier private-code/edit implementation documented below. The original Code.gs supplied by the owner has been inspected and adapted. Name-only lookup now proceeds directly to reserved seats and attendance; first successful response only; repeat lookups show the required already-recorded message without prior personal details. Public editing is removed. See apps-script/README.md for the current contract and impersonation risk.

Live read-only verification: the exact supplied spreadsheet ID was read through Google Drive. Title: Wedding RSVP ? TEST. Invitations, GuestNames, Responses and SecurityState tabs and headers were confirmed. Four active invitations reserve 1, 2, 4 and 2 seats; six enabled name mappings have no normalized duplicates or orphan mappings. Four response rows have no duplicate invitation IDs. All four invitations already have responses. No existing rows were altered. These facts were verified in the preceding turn, not inferred from local fixtures.

Original source inspection is based on the owner-provided file, not authenticated remote Apps Script source retrieval. Remote deployment version, properties, deadline and production endpoint remain unverified. No website deployment, Apps Script update, live test submission, spreadsheet replacement or GitHub push occurred.

## Finalization validation

- Node: 9 tests passed, executing local Apps Script with simulated Google services and the real frontend adapter/composable.
- Full browser suite: 49 passed, 17 intentionally skipped by viewport-specific rules.
- Final RSVP browser run after adding decline: 6 passed across desktop, mobile and 320px reduced motion.
- Production build passed; existing missing RSVP and closing background warnings remain.
- Diff whitespace check passed; built assets contained none of the scanned private fixture markers. Mobile dummy screenshot visually inspected.
- These tests made no live Google writes and do not verify production deployment, Google CORS or actual Script Properties.
- The existing displayed October 17, 2026 deadline is already past and remains unchanged pending owner reconciliation with the actual server setting.

# Historical RSVP recovery report

This report records the original backend/RSVP recovery checkpoint. For the later UI restoration and authorized autoplay, headings, full-page depth, compact timeline and parents-alignment work, see [the current UI phase log and results](UI-RECOVERY.md). Historical UI deferrals below are retained as checkpoint context, not the current interface status. The live-backend integration limitations still apply.

Recovery date: October 21, 2026 (UTC+08:00). All work is local. No deployment, Google Sheets writes, remote Apps Script modification, or GitHub push was performed.

## Implemented

The themed RSVP section now uses name challenge → private code verification → verified invitation → accept/decline → receipt. Accepted responses require exactly one nonblank, distinct full name per selected attendee, up to reserved seats. Declines have zero attendees. Existing optional email, dietary notes, activity choices and message are retained. Saved attendee names restore when editing, and guests can clear their local invitation details.

The reconstructed backend keeps the exact four tabs/headers. It stores attendee names and other response fields inside response_json, enforces active status/code version/session expiry/updates/deadline/seats, uses keyed digests, persists throttles, serializes operations with ScriptLock, detects duplicate response rows, checks revisions and protects retries with request IDs/digests/receipts. Failures use safe fixed messages. No plaintext invitation codes or private sheet IDs are embedded in frontend assets.

Offline provisioning creates cryptographic random codes/IDs, compatible keyed digests, normalized lookup rows, exact-header CSVs and a separate private delivery file. It refuses existing output directories and never contacts Google. Only a fictional four-seat family input is committed; no real guest records have been created or imported.

## Changed files

| Files | Purpose |
| --- | --- |
| `src/components/RSVPSection.vue` | Preserve section shell/theme/reveals; replace placeholder form with the invitation flow; guard RSVP GSAP for initial reduced-motion preference. |
| `src/components/InvitationRsvpForm.vue` | Verification, dynamic required names, optional fields, receipts, edit/reload, focus and responsive form UI. |
| `src/composables/useInvitationRsvp.js` | State, validation, restoration, retry freezing, conflict/session handling and clearing. |
| `src/services/rsvpApi.js` | Explicit public endpoint, simple POST, timeout, safe errors and response validation. |
| `apps-script/Code.gs`, `apps-script/appsscript.json` | Local backend reconstruction and minimal manifest reference; not deployed. |
| `apps-script/provision-invitations.mjs`, `apps-script/fixtures/dummy-family.json` | Offline CLI and dummy family. |
| `apps-script/README.md`, `.env.example`, `README.md` | Contract comparison, reconnect/provisioning/security instructions and frontend setup. |
| `tests/helpers/apps-script.mjs`, `tests/rsvp-backend.test.mjs` | Simulated Apps Script services and backend checks. |
| `tests/rsvp-workflow.test.mjs`, `tests/rsvp-provision.test.mjs` | Frontend/backend contract, workflow, retry/conflict and CLI checks. |
| `tests/browser/rsvp.spec.js`, `playwright.config.js` | Local Chrome checks at desktop/mobile/reduced-motion sizes with intercepted dummy API. |
| `package.json`, `package-lock.json` | Test commands, Playwright and compatible dependency security fixes. |
| `.gitignore`, `RECOVERY.md`, `RECOVERY-REPORT.md` | Private-output exclusions, checklist and results. |

Other wedding sections, photos, font links, colors and section order were preserved. Gallery remains disabled. Missing recovered photos were not replaced or removed.

## Verification

| Check | Result | Scope |
| --- | --- | --- |
| Baseline compilation | Passed, 45 modules | In memory, no output; no baseline tests existed. |
| Backend phase | 18 tests passed; production build passed | Actual reconstructed Code.gs executed in Node VM against simulated services. |
| Frontend/provisioning phase and final Node suite | 29 tests passed | Backend 18, provisioning 3, frontend workflow/API 8. These are newly implemented tests, not a claimed restoration of old tests. |
| Chrome browser suite | 3 tests passed | Desktop 1440px, mobile 390px, narrow 320px with reduced motion. Dummy backend only; Google and remote font requests intercepted/blocked. |
| Production build | Passed, 49 modules | Existing missing-background warnings remain. |
| Dependency audit after compatible fixes | Zero reported vulnerabilities | Four high-severity findings in the recovered dependency graph were resolved within declared ranges, without --force. |

Browser checks cover lookup privacy, verified flow, four required fields, duplicate rejection, focus, control bounds, single-column mobile attendance choices, save, restoration on edit, seat-count changes, decline, one response row and clearing. Screenshots were inspected; an initial narrow-screen attendance layout issue was corrected and an assertion added. The tests are real local Chrome automation using simulated API responses; they do not establish real Google integration, Safari/iOS compatibility, device performance, or full-site accessibility/motion compliance.

## Remaining blockers and deliberate adaptations

1. The existing remote project's source/digest format has not been provided or compared. Follow `apps-script/README.md` before any manual change. Actual Script Properties remain private and uninspected; no values are requested in chat. The frontend endpoint remains unconfigured.
2. Google CORS/redirect behavior, signed-out guest access, persistent state across Apps Script executions, actual quotas, concurrency, partial failures, abuse/load behavior and authorized dummy imports require approved integration testing. **No production-security claim is made.**
3. Apps Script has no documented native random-byte API in Utilities. Tokens use a secret-keyed HMAC PRF with a locked persistent counter and UUID/time nonces; UUIDs are not represented as a CSPRNG. Offline invitation codes/IDs use Node crypto. Strict native-CSPRNG token requirements need a suitable trusted service or explicit security review of this adaptation. JavaScript digest comparison cannot promise strict constant-time execution.
4. Public Apps Script quotas/global locks and lack of trusted client IP limit abuse protection and availability. Name-specific throttling can inconvenience a targeted legitimate guest. A protected gateway may be needed. Expired SecurityState housekeeping is supplied but no trigger was created; the owner must approve installation.
5. The recovered RSVP copy says October 17, 2026, already past. It is preserved before verification and replaced by the backend's configured deadline after verification. Confirm the intended date privately before launch; do not invent a new date or change the server property casually.
6. No original `.git` metadata existed. Portable Git was downloaded to the temporary directory and a new repository initialized on `recovery/secure-rsvp`; baseline is `f24862a`. This does not recover original GitHub history. No remote exists locally. Use the separate-clone review workflow in README before any approved push; never force-push this new history.
7. A small `InvitationRsvpForm.vue` child was added to keep the existing RSVP shell readable. Its shared form styles retain original values and are scoped by `.rsvp-section`. The single companion field is replaced by attendee names for all seats; obsolete Google Form text and the unused checkbox about unavailable edits are replaced with the actual update policy. Shell reveals remain; dynamic form steps are not hidden behind the old static field animations.
8. Existing missing assets remain: first OurStory image, two dress-code photos, RSVP/closing backgrounds, inactive gallery photos. BackgroundCanvas remains inactive and has an unresolved `@` alias. Existing favicon path and inactive Gallery figcaption markup produce development warnings. Other sections' GSAP reduced-motion gaps are outside this RSVP recovery and are recorded rather than silently redesigned.

## Deferred OurStory prototype proposal

No parallax redesign was implemented. After approved Google integration/security verification, propose one OurStory chapter with a decorative background layer moving at most 12–20px and a foreground offset at most 4–6px on wide screens. Use section-local ScrollTrigger, transform-only animation, existing art, cleanup on unmount, and zero scroll-linked motion under reduced motion. Initially disable the effect on phones and avoid background-attachment:fixed. Measure performance and clipping before considering other chapters. This is a proposal requiring separate approval, not an implementation commitment.

The supplied Wooowinvites demo could not be retrieved during this session, so no claim is made that the reference was visually matched. Review the reference together before finalizing prototype details.

Google platform limitations are documented with primary links in `apps-script/README.md`, including [Content Service redirects](https://developers.google.com/apps-script/guides/content), [Utilities](https://developers.google.com/apps-script/reference/utilities/utilities), and [quotas](https://developers.google.com/apps-script/guides/services/quotas).
