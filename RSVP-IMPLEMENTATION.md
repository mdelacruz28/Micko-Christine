# RSVP implementation checkpoint — October 22, 2026

The Vue RSVP form is connected to the existing live Google Apps Script deployment through VITE_RSVP_API_URL. The local .env.local file is ignored by Git and is loaded by normal Vite dev and build commands. .env.example contains only the verified PUBLIC web-app URL for reproducible setup; it contains no backend credentials. Keep HMAC_SECRET and SPREADSHEET_ID in Apps Script only.

## Start locally

Run npm run dev -- --host 127.0.0.1 --port 1011 --strictPort from this project directory. If that port is already running, restart that original terminal after configuring the environment, or use --port 1013 for a second preview. Do not stop an unknown process. After changes to .env files, Vite should restart; if not, restart the dev command. For same-computer use, localhost is suitable for the secure browser APIs used to generate submission IDs. Production guest access must use HTTPS.

For a fresh checkout, copy .env.example to .env.local before npm run dev or npm run build. Set the same variable in the hosting build environment when a future website release is explicitly approved. A build artifact is not a published website.

## Guest behavior

Enter a registered full name; unique active one-seat individual invitations proceed to attendance. Accepted attendee identity is fixed to the mapped guest. Each guest has one seat and a first-response-only RSVP. Identical-request retry confirms the original save without a duplicate. Repeated lookup shows the already-recorded message without exposing saved personal answers. The approved cutoff is November 15, 2026, 23:59:59 UTC+08:00.

The polished invitation card and attendance choices are implemented in src/components/InvitationRsvpForm.vue. The form, API adapter, state handling and backend validation already implement this flow; connection configuration is now retained in the project rather than only in a temporary preview process.

## Existing live data and completed checks

The earlier live integration test used only Codex Live Test Guest: one seat, one response, identical retry and readback. All 74 imported real guests and four original responses were preserved. The retained test audit trail brings totals to 79 invitations, 81 mappings and five responses. Real-name checks were lookup only. Do not count the labeled test response as a real RSVP.

For the live test and responsive UI verification see this chat's outputs/LIVE-TEST-SUCCESS.md and outputs/RENDERED-VUE-LIVE-REPORT.md. Native full-device Safari testing, final owner acceptance, test-record exclusion from reporting and a separately authorized website release remain distinct launch work. Do not interpret the name-only lookup as proof of a guest's identity.

No website publication, new deployment, property change or GitHub push is included in this implementation checkpoint.
