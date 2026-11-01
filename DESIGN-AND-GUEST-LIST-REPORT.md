# Guest List, responsive headings and continuous Hero background

October 21, 2026, Asia/Shanghai. Existing project and original spreadsheet retained. The only authorized live write was creation/formatting of Guest List. No invitations, mappings or responses were imported/modified; no live Apps Script source/deployment, website publishing or GitHub push occurred.

## Actual Google Sheets result

Guest List was successfully created in Wedding RSVP ? TEST, in the SAME supplied spreadsheet. Metadata now confirms exactly five tabs. The original four tab IDs and grid dimensions remain unchanged. Readback after creation exactly matched all original Invitations (4 records), GuestNames (6), Responses (4) and SecurityState (2) values captured before the write. No fictional guest names were added. Final readback again matched all four original tabs, and Guest List still contained zero entered names.

The new tab has five columns, a frozen header, filter, 200 prepared rows, Arial 11 text, a slate-blue header, warm ivory alternating rows, wrapped text and explicit widths (60, 320, 175, 155 and 360 pixels). Row heights are 44 pixels for the header and 32 for prepared input rows. Full Name cells use plain-text formatting. No formulas, scripts, edit triggers or automatic invitations were installed. Formatting, header notes, blank name cells and initial statuses were verified through API readback; a native Google UI visual render was not available, so native visual fit is not claimed.

| Column | Header | Owner action |
| --- | --- | --- |
| A | No. | Pre-numbered 1?200; no technical ID entry required. |
| B | Full Name | Enter one invited person's complete first and last name. |
| C | Validation Status | Initially Needs Review; authoritative tooling supplies results. |
| D | Import Status | Initially Not Imported; Imported requires actual record verification. |
| E | Notes | Optional private owner notes; validation preserves them. |

## Validation and future import

See [owner instructions](apps-script/GUEST-IMPORT.md). After names are entered, capture a fresh private snapshot of existing invitation/name records and Guest List A:E, including actual formula metadata for column B. Run guest-list-workflow.mjs against that snapshot. It uses the same canonical NFKC/whitespace/en-US lowercase normalization as RSVP, rejects invalid/formula-backed names, detects input duplicates and conflicts including disabled mappings, and prepares private status requests plus an import preview. No live action occurs just because a name is entered or because the local CLI runs.

Valid / Ready means the authoritative validation and conflict checks passed. Blank rows remain Needs Review / Not Imported. Notes/reasons are attached to status cells; owner Notes are not overwritten. Before writing status requests, re-read Full Name cells and formula metadata to avoid stale labels.

The generated plan includes names, actual input row numbers, rejected rows, collision-checked invitation/name IDs and exactly one reserved seat per person. Invalid rows block whole-plan import confirmation. Guest List name/formula fingerprints invalidate plans after edits/reordering; changes to statuses or owner notes alone do not. Existing confirmation-token and fresh-invitation-snapshot checks remain.

Real append operations still need separate explicit owner approval of the actual list. After an approved import, run reconciliation against the exact approved plan and a fresh live snapshot. Imported is emitted only when both exact IDs, planned field values, one active individual seat and exactly one enabled, unambiguous primary mapping are verified. Missing/partial/changed records produce Error / Needs Review. Never infer import success from an acknowledgement or repeat an uncertain append blindly. The original snapshot/atomic-batch/exclusive-editing limitations remain documented. No actual guest list has been supplied, validated or imported in this task.

## Heading scale

Cinzel Decorative, serif, weight 700 remains the main section-heading family. A shared fluid scale now controls section titles, with a slightly larger treatment for the short Our Story/RSVP headings. Line-height is 1.2, letter-spacing is restrained, and balanced wrapping allows long titles to fit. Card headings and decorative eyebrows have a subordinate scale; ordinary body text and the Intro script-name focal treatment were not indiscriminately reduced.

Values below are normal 16px root text at 320px and 1440px widths, in pixels, derived from the before/after CSS. Browser checks verify computed sizes/fit across all requested widths.

| Heading | Mobile before ? after | Desktop before ? after |
| --- | --- | --- |
| Intro couple names | 64 ? 64 | 136 ? 136 |
| Intro A love letter from | 12.8 ? 12.8 | 43.2 ? 43.2 |
| Hero couple names | 48 ? 44 | 140.8 ? 112 |
| Our Story | 64 ? 32 | 112 ? 60 |
| Wedding Details | 60.8 ? 28 | 112 ? 48.8 |
| Wedding Day Timeline | 57.6 ? 28 | 112 ? 48.8 |
| Wedding Entourage | 57.6 ? 28 | 105.6 ? 48.8 |
| Wedding Attire | 60.8 ? 28 | 112 ? 48.8 |
| RSVP | 51.2 ? 32 | 128 ? 60 |
| FAQ | 41.6 ? 28 | 105.6 ? 48.8 |
| Closing section heading | 51.2 ? 28 | 104 ? 48.8 |

Heading and focal-name checks cover 320, 375, 390, 430, 768, 1024 and 1440 pixels. The section-heading sweep also uses 200% root text and verifies width, overflow, family, weight and proportion. Existing responsive tests continue to check timeline compactness, paired parent rows and form layouts.

## Shared background architecture

SharedPageBackground is mounted once inside the isolated main site shell after Intro opens. It is a fixed viewport-covering, pointer-inert layer at z-index -1, behind content. It reuses /images/hero/lafayette.png unchanged. The inner image uses center/cover with vertical overscan; the artwork retains its aspect ratio and is not stretched to document height. One image stays present across all sections, with no per-section image reload/reset or pinning.

Light sections use a common translucent warm-paper surface. Cards retain stronger local surfaces for readability. Hero, RSVP and Closing use translucent dark overlays; the RSVP card retains its highly readable cream surface. Old Hero/RSVP/Closing image layers were removed, including the two previously unresolved background references. Existing decorative radial washes remain static at reduced opacity.

Fine-pointer/hover desktops at 1024px or wider use one depth-page ScrollTrigger spanning the main document, with transform travel from -24vh to +24vh, linear mapping and a 0.6-second scrub. The image overscan is 28vh above/below the viewport, leaving a coverage margin throughout motion. Resize refresh recalculates travel. This is native scrolling with no page pin, scroll-jacking or CSS background-attachment reliance. All competing section background depth triggers were removed. The Story's separate small foreground depth remains on its existing wrapper so it cannot conflict with slide animations.

Touch/mobile and reduced-motion presentations retain the same continuous image without scroll-linked image motion. GSAP matchMedia/context cleanup removes transforms/triggers on preference changes and unmount. Only desktop enables the image transform compositing hint. This reduces animation work but is not a measured real-device performance certification.

## Visual verification and tests

Screenshots are captured at Hero, Story, Timeline, RSVP and Closing scroll positions, after visible entrance animations complete. The readiness check respects the existing timeline's deliberate threshold for upcoming rows; it does not force or disable product animation. Desktop and mobile screenshots were visually inspected. Desktop screenshots show the same artwork behind all sections, readable cards and form controls, finished Hero text and a compact timeline. Initial center-scroll captures caught entrance animations in progress; final captures wait for completion.

The targeted desktop run passed 10 tests with 1 intentional viewport-specific skip. Final Node suite: 20 passed. Production build: passed, 52 modules, with no unresolved background warnings. The complete 90-case browser run produced 64 passes, 23 intentional viewport-specific skips and three failures from the same obsolete Closing-image assertion. After correcting that assertion, all three affected cases passed on rerun. Final verified coverage is 67 unique passing cases and 23 intentional skips, with no unresolved failure. No product change was needed for that correction.

Tests measure one shared image, more than 200px of desktop travel over the page, viewport coverage at multiple positions, static touch/reduced-motion behavior, cleanup, heading fit, Intro entrance, Story autoplay, preserved timeline/parents layout and individual first-response RSVP. Node tests cover Guest List duplicates, disabled conflicts, formula cells, pending plans and actual-record reconciliation. All RSVP tests use synthetic intercepted services; no live response submission occurs. Google deployment access/CORS, remote-font delivery and real low-powered mobile performance remain unverified. Existing unrelated missing content photos are unchanged.

Reviewed screenshots are retained locally (ignored by Git):

- [Desktop Hero](review-artifacts/continuous-background/desktop/home-shared-background.png)
- [Desktop Timeline](review-artifacts/continuous-background/desktop/timeline-shared-background.png)
- [Desktop RSVP](review-artifacts/continuous-background/desktop/rsvp-shared-background.png)
- [Desktop Story](review-artifacts/continuous-background/desktop/story-shared-background.png)
- [Desktop Closing](review-artifacts/continuous-background/desktop/closing-shared-background.png)
- [Mobile Timeline](review-artifacts/continuous-background/mobile/timeline-shared-background.png)
- [Mobile RSVP](review-artifacts/continuous-background/mobile/rsvp-shared-background.png)

Whitespace and production-asset checks passed. The supplied spreadsheet ID, test secret and dummy endpoint markers were absent from production assets.

## Modified local files in this task

- src/components/SharedPageBackground.vue (new), src/App.vue, src/main.js and src/assets/styles/page-design.css (new): shared background and centralized heading/readability styles.
- src/components/HeroSection.vue, OurStory.vue, WeddingDetails.vue, WeddingTimeline.vue, EntourageSection.vue, DressCodeSection.vue, RSVPSection.vue, FAQSection.vue and ClosingSection.vue: retire competing section background motion/old image layers; preserve existing content and entrance/interaction logic.
- src/composables/useSectionParallax.js: support foreground-only Story depth.
- apps-script/guest-list-workflow.mjs (new), provision-invitations.mjs and GuestImport.gs: Guest List snapshot, authoritative preview/status reconciliation and input fingerprint integration. GuestImport.gs remains local only.
- tests/guest-list.test.mjs (new): validation, collision/conflict and verified-status coverage.
- tests/browser/page-design.spec.js (new), enhancements.spec.js, story.spec.js, intro-hero.spec.js and content-sections.spec.js: shared-layer, typography, motion, responsive and existing-feature regression assertions.
- .gitignore: exclude local visual-review screenshots.
- apps-script/GUEST-IMPORT.md, README.md, RECOVERY-REPORT.md and this report: owner workflow and verification evidence.

## Remaining owner actions and limits

Enter actual names only in Guest List Full Name cells, then request authoritative validation. No import approval has been assumed. Approve a specific reviewed list separately before any real invitations/mappings are appended. Current status placeholders do not update automatically.

Live Apps Script source/deployment and website publishing are unchanged. RSVP still needs the owner-approved deadline timestamp/timezone and actual endpoint/access/CORS integration checks described in the prior implementation report. Name-only impersonation risk remains documented. Private snapshots, previews, notes, guest names and tokens must remain out of Git and frontend bundles. No new spreadsheet or Apps Script project was created.
