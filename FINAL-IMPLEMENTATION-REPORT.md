# Per-person RSVP and Intro final implementation

Date: October 21, 2026, Asia/Shanghai. Work is local in the existing Micko & Christine project. No spreadsheet/project/site replacement, live import, response overwrite, deployment or GitHub push occurred. No actual guest list has been supplied or invented.

## Current state and completed changes

The previous local name-only/first-response flow was inspected before changes; the original private-code step was already absent. Its locking, persistent rate limits, response uniqueness and frozen retry ID/payload were retained.

Every NEW invitation prepared by the owner tooling has one unique invitation UUID, one reserved seat, one unique primary name UUID, invitation_type individual and one final response at most. Label and mapped name both identify the invited person. Required legacy columns remain populated with compatible typed values. Public RSVP has no code/OTP, attendee-count selector, plus-one slot or second name entry. Acceptance uses the server-mapped invited name and count 1; decline uses count 0 and no names. Optional dietary notes, email, activities and message retain existing support. Exact requested labels/helper, confirmation messages and returning-guest notice are used. The sidebar and FAQ reflect individual invitations.

Before a new response, the backend revalidates active status, individual type, reserved_seats exactly 1, exactly one enabled mapping, matching canonical name/label and the configured deadline. Extra attendees, substituted names and seat changes fail safely. The stored accepted name comes from GuestNames, not arbitrary browser text. Existing group responses remain immutable and return only alreadySubmitted; unanswered group records require owner help rather than shared invitations. No legacy record is migrated or deleted.

## Verified live Google Sheets reads

The supplied existing workbook Wedding RSVP ? TEST was re-read through the Google Drive connector in this task. Metadata confirmed Invitations (tab ID 0), GuestNames (2058138112), Responses (952142424) and SecurityState (792824444). Exact existing headers were inspected in all four tabs using bounded reads within their 1000-row grids.

There are four active invitations with reserved seats 1, 2, 4 and 2; six enabled mappings; four response rows; and two SecurityState rows. All four invitations already have responses. No duplicate invitation IDs, normalized names, normalization mismatches, orphan mappings or duplicate response invitation IDs were found. Private names, answers, digests and security-state keys are omitted from this report. These are live connector read results, distinct from synthetic tests. A final readback of all four tabs exactly matched their values at task start.

Original Apps Script inspection is based on the owner's supplied Code.gs. The authenticated current remote deployment/version and Script Property values were not fetched. Local changes have not been uploaded.

## Owner guest preparation and import boundary

See [GUEST-IMPORT.md](apps-script/GUEST-IMPORT.md) for exact commands and operating steps. Supply full names one per line in an ignored private file, then capture the verified existing sheet state privately. The dry run validates complete names, normalized duplicates, conflicts including inactive mappings, IDs, digests and exact headers. Its private preview lists accepted records and rejected input rows/reasons. Any rejected row blocks whole-plan confirmation. Random ID/digest generation checks existing values and retries collisions boundedly.

An explicit reviewed-plan digest and a fresh unchanged snapshot are required to prepare local CSVs and a typed two-tab append batch. No fictional fixture mode exists. The CLI never connects to Google or imports anything. The read-only owner snapshot helper is separate from public doPost and has not been uploaded.

A future LIVE import needs the actual supplied list and separate owner approval. Re-read and compare the live snapshot immediately before writing, coordinate exclusive editing, apply both append requests in one atomic Sheets batch, and verify IDs, mappings, seats and unchanged original responses afterward. The connector provides no conditional revision write here; do not claim concurrency safety against simultaneous external editors. If safe atomic application cannot be ensured, deliver validated files and leave import unperformed. Never blindly retry an uncertain append: read back and reconcile first.

## Intro root cause and correction

The initial Intro timeline animated the background, frame, A love letter from heading and opening button, but omitted the paragraph containing Micko & Christine. The separate Hero letter animation starts only after clicking Open the Invitation because main/Hero is conditionally mounted afterward. No CSS overlay was overriding an existing names entrance; the Intro names simply had no tween.

The existing Intro timeline now includes three inline name parts with a subtle 18px upward fade, 0.12-second stagger, 0.95-second duration and power3.out easing. Text, typography, colors, spacing and the opening/exit sequence are preserved. It initializes after mounted/nextTick, is scoped to the Intro, runs once per mount, clears final opacity/transform and reverts contexts on unmount. Early opening stops and restores the entrance before the exit. Reduced motion is static immediately and does not replay when preferences change. Partial initialization failures revert to visible default markup. Name parts remain width-bounded at enlarged text sizes.

Chrome checks use the actual local GSAP timeline, inspect early/mid/final style values, resume real-time playback, capture screenshots, verify one initialization and preference changes, inject a partial initialization failure, and mount/unmount the component three times using the application's Vue runtime. Test instrumentation is route-injected only; it is not included in production files. Remote font requests are blocked in these tests, so production font delivery is not verified.

## Validation

Node suite: 16 passed. Tests execute actual local Code.gs with simulated Sheets/Properties/LockService and the real frontend service/composable. Coverage includes individual acceptance/decline, name/seat tampering, unknown/ambiguous names, duplicate response rows, expiration, rate limits, lock contention, unchanged retries, four legacy responded invitations, import dry-run/confirmation/conflicts/collisions and owner-helper privacy.

Production build: passed (49 modules). Existing unresolved RSVP and closing background-image warnings remain. No new assets were invented. Full Chrome browser regression: 62 passed, 19 intentionally skipped by viewport-specific rules (81 cases total, 6.4 minutes). Acceptance, decline, returning privacy and the initial names reveal passed on desktop, 390px mobile and 320px reduced motion, with additional 320-1440px/200% text sweeps. The dedicated corrected desktop Intro run also passed all four checks. Desktop mid-reveal/final and mobile final screenshots were visually inspected.

Diff whitespace checks passed. A production-asset scan found no test-secret, dummy-endpoint, family-fixture or supplied spreadsheet-ID markers.

These local tests do not verify real Google CORS, redirects, anonymous access, deployment version, runtime quotas, cross-execution persistence or real-world concurrent writers. No live test submission occurred.

## Changed files in this implementation

- src/components/IntroScreen.vue ? integrate the missing initial names reveal and safe lifecycle cleanup.
- src/components/InvitationRsvpForm.vue ? exact copy, one-seat form and confirmation messages.
- src/components/RSVPSection.vue and src/components/FAQSection.vue ? individual policy copy and configurable deadline presentation.
- src/composables/useInvitationRsvp.js, src/services/rsvpApi.js, src/utils/guestName.js ? canonical individual name/count state, contract and shared normalization.
- apps-script/Code.gs ? server-side individual policy, canonical name checks and returned deadline, preserving existing schema/security/first-save protections.
- apps-script/GuestImport.gs and apps-script/provision-invitations.mjs ? owner-only snapshot and validated dry-run/confirmed artifact workflow.
- apps-script/GUEST-IMPORT.md and apps-script/README.md ? operation, safety and deployment instructions.
- tests/helpers/apps-script.mjs, tests/rsvp-backend.test.mjs, tests/rsvp-workflow.test.mjs and tests/rsvp-provision.test.mjs ? simulated individual/legacy/import coverage.
- tests/browser/intro-entrance.spec.js, tests/browser/rsvp.spec.js and tests/browser/rsvp-visual.spec.js ? actual Intro lifecycle/style checks and individual RSVP viewport checks.
- tests/browser/enhancements.spec.js and tests/browser/story.spec.js ? updated exact accessible name for the renamed full-name field.
- README.md, RECOVERY.md, RECOVERY-REPORT.md and this report ? current instructions and historical checkpoint context.

## Required owner decisions before live use

1. Supply and review the actual full-name guest list; separately approve any real import. No list is prepared yet.
2. Decide the intended RSVP deadline as an exact ISO timestamp with a timezone/UTC offset. The past October 17, 2026 frontend fallback is replaced with Please refer to your invitation; server enforcement remains. Privately review and separately approve any RSVP_DEADLINE Script Property change. No date was invented.
3. Review/approve merging these local files into the EXISTING Apps Script project and updating its existing deployment, with a rollback version and preserved secrets/properties. No source upload or deployment has occurred.
4. Verify the actual approved /exec endpoint, owner execution identity, anonymous guest access and readable JSON/CORS redirects from the real website origin. No endpoint is configured by this work.
5. Separately authorize appropriate live integration checks without overwriting existing responses, then public website deployment if desired.

Name-only impersonation remains a deliberate policy risk: someone who knows an invited name can submit its first response. Rate limits and opaque in-memory sessions do not prove identity. Handle disputes and changes privately with the couple. Never publish the sheet, snapshot, guest list, Script Properties or response details.
