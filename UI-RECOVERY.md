# UI recovery — approved phases

Branch: `recovery/ui-restoration`, created from the clean RSVP checkpoint `82ff728`.

## Phase 2: OurStory carousel

Approved after the UI audit. Only OurStory and its verification/documentation are in scope for this checkpoint. Intro/Hero, other sections, RSVP visuals, parallax and full-site polish each remain pending approval. Backend source, API contracts, environment files, schemas and invitation security are unchanged.

The three original chapter records are preserved verbatim, including titles, descriptions, accents, photo paths and alternative text. The long alternating timeline now presents one focused chapter in a paper-toned card, retaining the section's existing typography, colors, opening text and closing line. No carousel dependency or autoplay was added.

Controls include previous/next with wraparound, chapter pagination, left/right keyboard arrows, Home/End while focused, polite slide announcements and visible keyboard focus. Inactive chapters are inert and hidden from accessibility APIs. Deliberate horizontal single-finger swipes navigate; vertical scroll, pinch zoom and cancelled gestures remain available without changing chapters. Transitions use short opacity/translation effects and are interrupted safely if reduced motion is enabled. All carousel animation/listener resources are cleaned up on unmount.

Overlapping grid cells reserve the tallest chapter's natural height at each width, including inactive chapters; fixed image aspect ratios prevent image loading from shifting the controls. Text can grow instead of being clipped to a fixed card height. Photos use object-fit:cover and retain their source proportions while cropping into the frame. No new scrolling/parallax effects were implemented.

The first chapter still references the missing `/images/story/story-01.jpg`. Its image area displays the original alternative text on the existing neutral palette after a load failure; no substitute photo, invented story content or new artwork was introduced. The original image can be restored at that path later.

Changed files:

- `src/components/OurStory.vue`: carousel interface, local interaction/motion lifecycle and responsive styles; reuse the shared GSAP plugin instead of registering ScrollTrigger again.
- `tests/browser/story.spec.js`: browser coverage for navigation, accessibility/focus, content, image fallback, stable sizing, touch, motion changes and responsive/enlarged text behavior.
- `playwright.config.js`: optional `RSVP_TEST_PORT` override so verification does not interrupt an existing local server; default remains 1011.
- `UI-RECOVERY.md`: phase scope and handoff.

## Preview and checks

Run `npm run dev`, open `http://localhost:1010`, open the invitation and scroll to Our Story. Review all three chapters on a phone and desktop. The first image remains a recovery gap; confirm the intended photo rather than selecting an unrelated existing asset.

```powershell
npm test
npm run test:browser
npm run build
```

If the default browser-test port is occupied, leave that server alone and use a free port for the test process:

```powershell
$env:RSVP_TEST_PORT='1013'
npm run test:browser
Remove-Item Env:RSVP_TEST_PORT
```

Tests use local Chrome with network interception, existing photos and dummy RSVP responses. Remote font requests are blocked for repeatable automated layout checks, so final typography/cropping still deserves visual approval in the normal browser with fonts loaded. Real iPhone/Safari and Android device checks are not claimed by Chrome emulation. Existing unrelated missing-image, favicon and inactive-gallery markup warnings remain outside this phase.

## Approval gates and backups

Phase verification completed: `npm test` passed all 29 Node tests; the complete Chrome browser suite passed 12 checks with 3 inapplicable configurations skipped (desktop touch and repeated mobile resize sweeps); `npm run build` passed with 49 modules and the existing three background warnings. The responsive sweep covered 320, 390, 768, 1024 and 1440px plus 200% text size. Desktop/mobile chapter screenshots were inspected. An exact comparison against `82ff728` confirmed all original chapter fields unchanged. `git diff --check` passed. No new carousel console warnings or page errors were observed; unrelated existing intro/gallery/favicon/missing-asset findings remain deferred.

Review the carousel before approving Intro/Hero work. The OurStory parallax prototype is a later, separate approval; no full-site rollout is authorized. Gallery stays disabled. Never use UI recovery to change wedding data, backend logic or private records.

Keep each approved phase in its own tested commit on this branch. Keep a second private backup of the repository and restore missing original assets separately. Do not push or deploy without explicit approval; this local repository has reconstructed history, so preserve the real GitHub repository's history through the separate-clone workflow documented in README rather than force-pushing it.

## Phase 3: Intro and Hero

Approved after carousel checkpoint `38af0fa`. Original visible wording, names, date, Baguio venue, wedding timestamp and artwork URLs remain unchanged. No other wedding sections or backend/API/security files are changed in this phase.

- `src/components/IntroScreen.vue`: fix transparent hover text; add visible keyboard focus; animate only rendered elements; support initial/live reduced motion; stop entrance/idle effects before an early opening click; track and clean up the exit timeline. Scroll locking preserves prior body styles and scroll position, including cleanup on unmount. The fixed Intro supports internal scrolling on short screens so the button stays reachable.
- `src/components/HeroSection.vue`: expose the names as a focusable, labeled h1; preserve letter-based entrance styling with reduced-motion cleanup; use responsive sizing and room for the longer name; keep the existing background movement on wider screens only. Remove the separate background entrance zoom to avoid overlapping transform ownership. Countdown uses one interval, pauses while hidden, refreshes on return, stops at zero and clears its interval/listener on unmount. Its timer announcement is explicitly silent rather than reading every second aloud.
- `src/App.vue`: after opening, wait for main content to mount, scroll directly to the top and hand focus to the Hero heading without another scroll. Cancel pending handoff work on unmount. Section order and disabled Gallery are unchanged.
- `tests/browser/intro-hero.spec.js`: keyboard opening, hover/focus states, scroll locking/restoration, preserved content/artwork, live reduced-motion changes, short landscape screens, responsive/enlarged text and deterministic countdown visibility/zero/unmount checks. The existing OurStory/RSVP suite remains a regression gate.
- `UI-RECOVERY.md`: this phase record.

Preview remains `npm run dev` at `http://localhost:1010`. Open using both pointer and keyboard, review the original artwork/crop and loaded fonts at phone/desktop sizes, then check the Hero link into OurStory. Automated screenshots block remote fonts and are not a claim of visual parity or real iOS/Safari verification. Existing unrelated missing assets, favicon-path and inactive-gallery markup warnings remain deferred.

After this checkpoint, wait for approval before working on existing content sections, FAQ/Closing, RSVP styling or any parallax prototype. No push or deployment is performed.

Phase verification: 29 Node tests passed; the full browser regression suite passed 22 checks with 5 inapplicable configurations skipped. After screenshot review corrected whole-name wrapping, hover colors and decorative-layer scrolling, the final affected Intro/Hero suite passed all 10 applicable checks (2 repeated responsive configurations skipped). Production build passed with 49 modules and the same existing background warnings. Screenshots were inspected at desktop and mobile sizes, and the tests include a 320–1440px sweep, short landscape and 200% text. Original visible text, artwork URLs and wedding timestamp were compared with `38af0fa`; all were preserved. No missing-target GSAP warnings or page errors were observed in the new checks. Google integration and broader full-site reduced-motion behavior remain outside this phase.

## Phase 4: Wedding content, FAQ and Closing

Approved after Intro/Hero checkpoint `f686b84`. Wedding Details, Dress Code, Timeline, Entourage, FAQ and Closing retain their original static wording and data, including every venue/time/map URL, dress instruction and color hex value, schedule order, entourage placeholder/grouping, FAQ answer and closing message. The phase changes presentation and interaction, without touching RSVP API/security/backend files, environment configuration, Gallery activation, deployment or parallax redesign.

- `src/composables/useGsapContext.js`: reuse the existing scoped helper for live reduced-motion preferences; dispose nested animation resources and prevent setup after unmount. The five GSAP-based content sections use it, retaining their existing reveals with gentler scales/easing. Reduced motion restores readable static content and removes section ScrollTriggers.
- `src/components/WeddingDetails.vue`: progressive reveals keep content visible by default and reveal keyboard-focused cards immediately; properly nest venue headings; preserve map anchors; improve mobile metadata layout and focus visibility.
- `src/components/DressCodeSection.vue`: preserve all palette values and labels; expose swatch groups/lists semantically; show the original alt descriptions in reserved frames for the two missing photos, without substituting artwork. Improve enlarged-text wrapping and simplify hover motion under reduced motion.
- `src/components/WeddingTimeline.vue`: preserve all seven events/times; expose the schedule as a list; use separate mobile grid rows for time and card so enlarged text cannot overlap. Preserve existing decorative pointers and spine.
- `src/components/EntourageSection.vue`: retain all original placeholder names, titles, pairings and order; increase small-phone text size and allow long names/headings to wrap.
- `src/components/FAQSection.vue`: give buttons/panels matching IDs and accessible expanded/collapsed state, make closed panels inert/hidden from accessibility APIs, retain one-open-at-a-time behavior, and add Arrow/Home/End focus navigation. Intrinsic grid expansion replaces stored pixel heights, so resizing/font loading can change answer height without clipping; refresh scroll positions after transitions and font readiness, with teardown guards.
- `src/components/ClosingSection.vue`: preserve the missing background URL and existing solid fallback; keep decorative layers from intercepting clicks; put the footer in normal flow; return both scroll and keyboard focus to Hero. Existing background motion is limited to wider screens and respects reduced motion.
- `tests/browser/content-sections.spec.js`: content/link/label checks, visual snapshots, FAQ keyboard/accessibility and normal transitions, initial/live motion preferences, resource cleanup, back-to-top, responsive/enlarged text and overlap checks.

Primary fonts and the wedding palette are preserved. Meaningful labels use existing darker palette colors where contrast was weak. Existing missing assets and entourage placeholders still require original material from the owner. No real guest records or invented wedding information were added. Map URL attributes/navigation affordances are checked locally; actual Google Maps destinations are not verified by the intercepted browser tests.

Preview with `npm run dev` at `http://localhost:1010`. Review these sections on phone/desktop with web fonts loaded and both motion preferences. Browser automation blocks remote fonts and services, so screenshots do not establish typography parity, Safari/iOS behavior or live Google integration.

After review, wait for approval before the next phase: RSVP visual consistency only. OurStory parallax and full-site polish remain separate approval gates.

Content verification against `f686b84` confirmed all six sections' original data and static wording unchanged. Responsive checks cover 320, 390, 768, 1024 and 1440px at normal and 200% text size; desktop/mobile screenshots were inspected. Entourage retains its primary font with a corrected serif fallback. Production build passed with 50 modules and the same three existing background warnings. All 29 Node tests passed. No push, deployment or live Google Sheets write was performed.

Final complete browser regression: 32 checks passed, with 7 inapplicable/repeated configurations skipped. The checks include existing Intro/Hero, OurStory and RSVP flows as well as the new content-section coverage. No page errors or missing-target GSAP warnings were observed in the new checks. `git diff --check` passed.

## Phase 5: RSVP visual consistency

Approved after content-section checkpoint `18bfc98`. The existing secure lookup, private code verification, dynamic attendee fields, validation, save/edit/decline flow and privacy controls remain intact. Exact SFC comparisons confirmed both RSVP templates and the form's script unchanged. API/composable/backend/security files, schemas, environment configuration and wedding data were not edited.

- `src/components/RSVPSection.vue`: retain the original dark blue/cream/melon/pomegranate palette and primary fonts; improve labels, explanatory text, input sizing, wrapping, button states and focus outlines. Remove sticky positioning from the tall information panel. Keep the interactive form visible without an entrance transform. Use the existing scoped animation helper for the surrounding header/info/footer so live reduced-motion changes and unmount restore static content and clean up ScrollTriggers. Decorative layers do not intercept input.
- `src/components/InvitationRsvpForm.vue`: CSS only. Standardize the form's font, helper text, secondary controls and select; keep receipt values readable in one column on phones; separate busy/error notices clearly. Existing focus handoff, labels, aria states and all form logic are preserved.
- `tests/browser/rsvp-visual.spec.js`: exercise keyboard input/buttons/radio/checkbox focus, visible busy/error states, live reduced-motion cleanup and unmount; sweep lookup, code, verified four-seat form and receipt at 320/390/768/1024/1440px with normal and 200% text. Native field values can scroll within their fitted controls. All requests use dummy responses or the local Apps Script fixture; no real invitation or Google Sheets is contacted.
- `UI-RECOVERY.md`: phase record and review gate.

The existing missing RSVP background still uses its original dark fallback; no substitute artwork was added. The original unverified sidebar fallback date remains October 17, 2026 and needs owner confirmation before any content change. Verified invitations continue to show the deadline returned by the backend. Browser automation blocks remote fonts, so loaded-font typography and real Safari/iOS still require visual review.

Preview: run `npm run dev`, open `http://localhost:1010`, open the invitation and scroll to RSVP. Automated tests supply dummy invitation details; an ordinary preview uses only the configured endpoint, which has not been enabled or deployed by this phase. Do not enter real guest credentials into test fixtures.

The next gate is approval for an OurStory parallax prototype. Full-site polish remains a separate approval. No push or deployment was performed.

Phase verification: all 29 Node tests passed. The affected browser suite passed 7 checks with 2 repeated responsive configurations skipped; it includes the original end-to-end RSVP regression on all three projects. Lookup/code/verified/receipt, busy and error screenshots were inspected. Production build passed with 50 modules and the same three existing background warnings. Existing favicon-path and inactive-gallery markup warnings remain outside this phase. No new page errors or missing-target GSAP warnings were observed. `git diff --check` passed. Live Google integration and visual parity with an external reference are not claimed.

## Phase 6: OurStory parallax prototype

Approved after RSVP checkpoint `86b02df`. This prototype is confined to OurStory. Original chapter records, photos/alt text, static wording and carousel script were compared with that checkpoint and preserved. Missing `story-01.jpg` continues to show its original alternative description. No other section, backend, environment or asset was changed, and no dependency was installed.

- `src/composables/useSectionParallax.js`: a reusable section-local helper built on the existing scoped GSAP/reduced-motion helper. One scrubbed timeline moves the background from -32 to +32px and the foreground wrapper from +12 to -12px as the section crosses the viewport. It runs only at 1024px or wider with a fine pointer and no reduced-motion preference. Nested media cleanup removes transforms/triggers on resize, preference change and unmount. No pinning, zoom, bounce, fixed background, custom scroll listener or perpetual animation is used.
- `src/components/OurStory.vue`: reuse the existing palette-based decorative wash with 48px vertical overscan; keep it behind content and noninteractive. Add a separate foreground wrapper around the existing carousel so scroll movement cannot conflict with individual slide transitions. Existing photos, shadows, navigation, focus rings, touch gestures and intrinsic card sizing remain intact. Touch/narrow screens use the ordinary static document layout.
- `tests/browser/story.spec.js`: add tests for actual scroll-linked movement, bounded travel and background coverage, clickable arrows/keyboard navigation during depth effects, repeated preference changes, breakpoint cleanup, unmount cleanup and static touch/reduced-motion rendering. Existing carousel tests remain the regression gate.
- `UI-RECOVERY.md`: prototype behavior, results and review gate.

Verification: 29 Node tests passed; build passed with 51 modules and the same three existing background warnings. Existing carousel checks passed 9 tests (3 inapplicable configurations skipped); the added depth checks passed 4 tests (2 desktop-only configurations skipped). Together these are 13 applicable browser checks, including touch swipes, keyboard controls, stable chapter heights, 320–1440px resizing and enlarged text. Desktop motion and static phone screenshots were inspected. No new page errors or missing-target GSAP warnings were observed. `git diff --check` passed.

Preview: `npm run dev`, open `http://localhost:1010`, open the invitation and slowly scroll through OurStory on a desktop at least 1024px wide. The decorative wash drifts behind the gently moving carousel. Test arrows/keys while scrolling; then resize to a phone width or enable reduced motion and confirm the scene stays static. Automated screenshots block remote fonts; real loaded-font/Safari/iOS review remains manual. The supplied reference page could not be fetched, so no visual parity is claimed.

Stop here for prototype review before full-site polish. Extending this parallax to other sections requires explicit approval; importing the reusable helper elsewhere is not part of this checkpoint. Keep the existing private-backup/local-commit strategy; no push or deployment was performed.

## Phase 7: Full-site polish

Approved after prototype checkpoint `02b08a4`, with parallax explicitly confined to OurStory. This phase makes small presentation and loading fixes; it does not change wedding content, activate Gallery, alter backend/API/security files, configure an endpoint or deploy the site.

- `index.html`: correct the favicon's public URL to the existing monogram; remove two redundant Google font links while retaining every originally requested family and weight/style combination.
- `src/App.vue`: stop importing the disabled Gallery and unused BackgroundCanvas. Their source and assets remain available for future approved recovery. The visible section order and invitation-opening behavior are unchanged. Removing inactive imports avoids compiling their unused CSS/assets and surfacing inactive markup/alias warnings in the active site.
- `src/assets/styles/global.css`: allow headings/body copy/list/receipt text to wrap at enlarged sizes instead of clipping at section edges. This fixes the Timeline closing line at 320px/200% text without shrinking it.
- `src/components/HeroSection.vue`: increase countdown and scroll-link label size/contrast. Phones use a two-by-two countdown for readable labels rather than four tiny columns. Preserve all four units, date, names, artwork and countdown behavior. Decorative layers do not intercept clicks.
- `src/components/OurStory.vue`: use the existing bistre for the formerly faint eyebrow; improve small chapter/status text and remove the eyebrow tilt under reduced motion. The approved depth effect and carousel are unchanged.
- `src/components/ClosingSection.vue`: improve privacy/footer text size and contrast using the original cream color. All wording, focus handoff and background behavior remain unchanged.
- `tests/browser/site-polish.spec.js`: walk the entire keyboard path from Hero to Closing, checking visible focus and avoiding hidden/inert content; verify section order, inactive features, favicon response, new asset failures and browser warnings; inspect every visible heading/body text/control at 320/390/768/1024/1440px and normal/200% text.
- `README.md`, `UI-RECOVERY.md`: current interface status, test-port option and final review checklist.

Exact comparisons against `02b08a4` confirmed Hero/OurStory/Closing templates, data and scripts unchanged. Font-request coverage was compared before/after deduplication and is identical. No stock/generated images or new dependencies were added. The first story photo, two dress photos and two active background files remain missing; their established fallback treatments are preserved. The build now processes 47 modules and reports only the two known active missing-background warnings.

### Current component audit and handoff

| Area | Current status | Still needs owner/manual review |
| --- | --- | --- |
| Intro/Hero | Opening lock/focus, responsive names, timer lifecycle, readable mobile countdown and motion preference support restored | Normal browser with web fonts loaded; real device artwork/cropping |
| OurStory | Three original chapters, accessible carousel, swipe/keys, stable sizing and desktop-only depth prototype | Restore `/images/story/story-01.jpg`; approve the subtle motion visually |
| Details/Timeline | Original maps/venues/times retained; responsive readable cards and schedule | Verify actual Maps destinations manually; review on real phones |
| Dress | Original instructions/hex palette retained; missing photos show original alt descriptions | Restore `/images/dress-code/principal-sponsors.jpg` and `family.jpg` |
| Entourage | Original placeholder names, titles, grouping and order retained | Supply/approve actual names separately |
| RSVP | Secure recovered workflow and visual states tested using dummy data | Confirm the original October 17, 2026 fallback deadline; remote backend comparison/integration remains separate |
| FAQ/Closing | Keyboard accordion, intrinsic expansion, normal-flow footer and focus return restored | Restore `/images/closing/closing-bg.jpg`; review final typography |
| Active backgrounds | Existing solid/gradient fallbacks retained | Restore `/images/rsvp/rsvp-bg.jpg` and the Closing background from original material |
| Inactive Gallery/BackgroundCanvas | Stay disabled and unimported; no additional parallax rollout | Seven gallery images are missing; Gallery's existing nesting/accessibility/motion behavior and BackgroundCanvas's unresolved alias require review before any future activation |

Preview with `npm run dev` at `http://localhost:1010`. Review the opening and every section with loaded web fonts, normal/reduced motion and keyboard navigation; on desktop at least 1024px wide, scroll OurStory to review depth. Automated Chrome checks block remote fonts/services and use dummy RSVP data; they do not establish real Safari/iOS behavior, external reference parity, Google Maps destinations or live Google Sheets integration. Missing source material cannot be recovered by inventing new wedding information.

Keep this branch's tested commits and a second private repository backup. Original remote history is absent from this reconstructed local repository; follow README's separate-clone workflow only after explicit push approval. No push, deployment, live guest import or Google Sheets write was performed. UI implementation is ready for owner visual review; outstanding assets/content and remote integration remain separate work.

Final polish verification: all 29 Node tests passed. The complete browser suite passed 44 checks with 13 inapplicable/repeated configurations skipped across desktop, phone and narrow reduced-motion projects. This includes the prior Intro/Hero, content/FAQ/Closing, RSVP and carousel/depth regressions, plus the new full-site keyboard/layout checks. Desktop/mobile screenshots were inspected. No browser warnings, new asset failures, page errors or missing-target GSAP warnings were observed in the new site checks; the five established active missing assets remain allowlisted and documented rather than hidden or replaced. Production build passed (47 modules) with only the two missing RSVP/Closing background warnings. `git diff --check` passed. No deployment or push was performed.

## Authorized five-part enhancement

The later attached request explicitly authorizes all five local enhancements without intermediate approval gates. It supersedes the earlier no-autoplay and OurStory-only parallax limits. Work starts from clean checkpoint `629f349` on branch `enhancement/autoplay-heading-depth`; the recovery branch remains available. Deployment, remote Git, live Apps Script/Sheets, private records and secrets remain outside authorization.

1. **Story autoplay:** `useCarouselAutoplay.js` owns a single 2000ms timeout scheduler. It loops the original three slides, restarts after manual navigation and pauses for mouse hover, keyboard focus anywhere in the carousel, active touch, a hidden tab, offscreen content and reduced motion. Only positive viewport intersection counts as visible, avoiding the edge-only IntersectionObserver case. Timeout and observer/listener cleanup prevent work after unmount. Existing slide transitions/navigation are preserved. An explicit Pause/Resume button lets readers stop rotation; returning from a temporary pause starts a fresh two-second countdown. Live announcements are silent during automatic playback and polite during manual interaction. Reduced motion removes autoplay and its button while retaining manual navigation.
2. **Main H2 typography:** eight explicit `section-heading` classes use shared Cinzel Decorative, weight 700, italic baseline and readable 1.12 line-height. Section-specific responsive sizing/colors remain intact. Nested/card headings and decorative text are untouched. The existing font import already includes weight 700; an additional real-network font check confirmed it loaded successfully, and loaded-font screenshots were inspected.
3. **Page depth:** the existing scoped parallax helper now permits background-only scenes. Exactly one named depth timeline is created per active section on fine-pointer screens at least 1024px wide. Reuse original Hero/Closing assets and Story/Timeline/Entourage/Dress/FAQ washes; Details receives a palette-only decorative wash and RSVP uses its original background. Background travel is 16–32px, with only OurStory's separate wrapper retaining its 12px foreground travel. Hero/Closing's previous background ScrollTriggers were removed to avoid duplicate transform ownership. RSVP fields and all other content stay in normal, stationary layout. Overscan covers the movement. Touch/narrow screens and reduced motion disable these depth timelines. Intro retains its established opening depth/scroll lock; page ScrollTriggers mount only after the invitation opens. No pinning, spacers, fixed mobile backgrounds or new imagery were introduced.
4. **Compact timeline:** remove the 390px item minimum and reduce outer/header/footer gaps, card padding and title size while preserving body text size, all seven events, every description/note, chronological order, pointers, markers and connectors. Cards remain intrinsically sized; the mobile time/card rows remain separate.
5. **Parents alignment:** both families share three CSS Grid rows for headings, fathers and mothers. Plain wrapper divs use `display:contents`, with explicit column/row placement and normal text wrapping. The taller heading or longer father's name reserves space for both columns so mothers begin evenly. No names or headings were changed. Layout-only browser fixtures test asymmetric long fictional names at 320/375/390/430/768/1440px and 100/200% text.

### Measured timeline change

Measurements use the same local Chrome viewport and intercepted-font setup before/after, rounded to pixels. Real fonts were also loaded and visually checked separately.

| Viewport width | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| 1440px | 3911px | 2691px | 31% |
| 768px | 3303px | 2380px | 28% |
| 390px | 3779px | 2801px | 26% |
| 320px | 4274px | 3266px | 24% |

Changed files: nine active section components (Hero, OurStory, WeddingDetails, WeddingTimeline, Entourage, DressCode, RSVP, FAQ, Closing); shared `global.css`; `useSectionParallax.js`; new `useCarouselAutoplay.js`; new `tests/browser/enhancements.spec.js`; README, this phase log and the historical recovery report's current-status note. No backend/API/form-state component or source image was edited. An AST comparison confirmed all original chapter, event, timeline, dress, entourage and FAQ data declarations unchanged.

The reference demo could not be fetched; visual parity is not claimed. Original missing assets, entourage placeholders and deadline confirmation remain as listed in the handoff table. Real Safari/iOS and device-performance review remain manual. Local preview is `npm run dev` at `http://localhost:1010`: scroll to OurStory, move focus/pointer away to see rotation, test pause/navigation, scroll all sections on desktop, then check reduced motion and phone widths. Live RSVP integration remains separate; automated submission checks use only dummy data. No push or deployment was performed.

Final verification: 29 Node tests passed. The final combined Chrome suite passed 49 checks with 17 inapplicable/repeated configurations skipped (66 configurations total, 4.7 minutes). New coverage includes deterministic two-second looping/reset, hover/focus/touch/user pause, hidden-tab/offscreen/reduced-motion pauses, timer cleanup, all eight heading styles, complete timeline/order/height reduction, asymmetric long-name alignment at the six requested widths and enlarged text, nine unique desktop depth scenes, static touch/reduced-motion scenes, background coverage and stationary RSVP fields. Existing RSVP save/edit/decline, opening/countdown, FAQ, keyboard, responsive and carousel/touch regressions all passed. The production build passed with 48 modules and only the same two missing background warnings. Source-data comparisons and `git diff --check` passed. Real Cinzel Decorative 700 loaded successfully in an additional font-enabled browser review; desktop timeline/entourage and phone story screenshots were inspected. The temporary measurement server was stopped after use.
