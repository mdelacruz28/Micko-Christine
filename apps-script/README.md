# Approved production deadline

Owner-approved: November 15, 2026, 11:59 PM Philippine Time. Exact cutoff: 2026-11-15T23:59:59+08:00 (2026-11-15T15:59:59Z).

Production Script Property required: RSVP_DEADLINE = 2026-11-15T23:59:59+08:00. The live property has NOT been read or changed by this work. No source upload or deployment was performed.

Local Code.gs uses this approved value by default and fails closed if a supplied RSVP_DEADLINE property differs, preventing stale settings from extending the approved cutoff. A newly approved future deadline requires a reviewed source/config update, not an unreviewed property-only extension. Before any separately approved deployment, set/verify the exact property privately and preserve SPREADSHEET_ID, HMAC_SECRET and other unrelated settings.

The frontend's public deadline configuration is in src/config/rsvp.js. It displays November 15, 2026 and 11:59 PM Philippine Time (UTC+08:00) before lookup. Date/time formatting explicitly uses Asia/Manila. The API adapter rejects a conflicting server deadline. Server acceptance uses absolute epoch timestamps and includes the exact cutoff instant; requests one millisecond afterward are closed. Active sessions are rechecked on submission. Existing first responses remain final; an identical committed retry returns its receipt without another write even after the cutoff.

# Name-only RSVP backend

Code.gs is adapted from the original source supplied by the owner on October 21, 2026. The remote project's current source/version and Script Properties have not been independently read. No remote edit or deployment was performed.

## Contract and preservation

Version 2 simple JSON POST supports lookup(fullName), status(sessionToken), submit(sessionToken, requestId, expectedRevision, response). Names use NFKC, whitespace folding and en-US lowercase; punctuation and accents remain significant. A full first and last name is required. New responses require an individual one-seat invitation with exactly one enabled primary mapping whose name agrees with the label. The backend rejects extra seats or substituted names and stores the canonical mapped name. Existing legacy group responses retain private alreadySubmitted behavior; unanswered group invitations require owner help. Only one active invitation may match. Existing Responses return only alreadySubmitted:true. No stored answers are returned by lookup or status. The frontend has no code, OTP, edit, or reload step.

All four existing tab/header layouts are preserved. Attendee names and optional answers retain the original camelCase response_json format. First writes append revision 1; any existing response is immutable regardless of legacy updates_allowed. Existing rows/revisions are never migrated. The legacy updates_allowed column is preserved but no longer gates a first response. The deadline still gates new submissions and is returned to the frontend after successful lookup. Before lookup the UI says to refer to the invitation; the obsolete October 17, 2026 fallback has been removed. The owner must decide the intended new deadline as an ISO timestamp with timezone and approve any corresponding Script Property change before launch. No new date was invented.

ScriptLock serializes checks and writes. Duplicate response rows fail closed. Repeating the same request ID and canonical payload returns a receipt without another write; changed payloads fail. An uncertain browser submission keeps its ID/payload frozen for retry. Sessions expire after 30 minutes; after expiry, name lookup can confirm only that a response exists. Persistent global/name/session throttles remain in SecurityState. Sheets is not a transactional database and other writers must observe the same lock policy.

## Privacy and limitations

Name-only RSVP permits impersonation: anyone who knows an invited name can claim its first response. Normalization, opaque in-memory sessions and throttling do not establish identity. Organizers must handle disputed responses privately. There is no public correction mechanism. Never publish the spreadsheet or expose Script Properties, guest records, or session tokens.

Apps Script quotas and the global lock constrain availability. Name limits can be targeted; there is no trusted client IP in this interface. HMAC-derived session tokens rely on the existing high-entropy HMAC_SECRET. Do not rotate that secret or regenerate invitation digests. Keep SPREADSHEET_ID, HMAC_SECRET, RSVP_DEADLINE and RSVP_DISABLED private and preserve their values. Deadline and anonymous-access settings remain unverified.

The owner preparation CLI now creates individual one-seat records with compatible IDs and typed required columns. It needs no secret and issues no private codes. Dry-run review and explicit confirmation prepare local append files only. See GUEST-IMPORT.md for the complete snapshot/review/approval workflow. No real list has been supplied or imported.

## Review and launch

Review this local diff against the supplied source. No initialization helper, live submission, trigger, source upload or deployment has been executed. Public deployment and any live write require separate authorization. Before launch verify actual deadline, owner execution identity, anonymous access, Content Service redirects/CORS from the website origin, and rollback version. Configure only the approved public /exec URL in VITE_RSVP_API_URL. No endpoint has been invented or configured here.

Node tests execute this actual Code.gs with simulated Google services. Browser tests intercept dummy requests. They cannot verify remote code, quotas, real concurrency, Google CORS or public access.
