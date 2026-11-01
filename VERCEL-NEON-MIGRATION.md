# Vercel + Neon migration — local preparation

Prepared October 28, 2026. Repository: D:\My Files\Personal Files\micko-christine.

Status: implemented and tested locally only. No Git push, Vercel deployment, Neon connection, live guest export/import, or Google change was performed. Existing uncommitted work was preserved. This guide supersedes Google-only deployment instructions for the new backend; the old Apps Script remains available for the existing deployment.

## What is ready

- api/rsvp.js: same-origin JSON POST endpoint with no-store responses, method/content-type/body-size checks and private errors.
- server/rsvp.js and server/validation.js: existing version-2 contract, normalized name lookup, individual seat policy, 30-minute sessions, persistent throttling, immutable first response and identical-request receipt retry.
- server/database.js: node-postgres connection to Neon with verified TLS, bounded connection pool and transaction timeouts.
- db/001-rsvp.sql: invitations, guest mappings, responses, transient security state, indexes, unique constraints and disabled-by-default launch control.
- server/migration.js and scripts/migrate-rsvp.mjs: strict snapshot validation, local dry-run, explicitly gated import into empty disabled tables, all-or-nothing transaction and exact readback verification.
- apps-script/VercelMigration.gs: owner-only read helper prepared locally; not installed on Google. Unlike the older guest-import snapshot, this includes existing Responses.
- .vercelignore excludes private guest files, local environment files and test artifacts from CLI uploads. Keep those files out of Git as well.
- The frontend accepts /api/rsvp and retains the previous strictly validated Google URL path for transition.

The SQL response payload and historical timestamp columns retain their original text. IDs, revisions, payload digests and previous responses are not regenerated. Duplicate or invalid data blocks import for review. Active unanswered group invitations require organizer cleanup before import. Old SecurityState is intentionally not migrated: guests must verify their name again; previous saved answers remain final.

## Run locally without accounts

From the repository directory:

```powershell
npm.cmd run dev:migration
```

Open http://127.0.0.1:1012 and enter **Dummy Guest**. This starts the actual new API handler backed by an in-memory PGlite PostgreSQL engine. It ignores DATABASE_URL and forces /api/rsvp even if .env.local still contains the old Google endpoint. Stop/restart to reset the dummy response. Nothing persists and no real guest records are loaded. The local test clock is fixed before the approved deadline; production uses actual time.

```powershell
npm.cmd test
npm.cmd run test:browser:migration
$env:VITE_RSVP_API_URL='/api/rsvp'
npm.cmd run build
```

Ordinary `npm run dev` does not run the new backend. Ordinary builds still honor any existing .env.local Google URL; explicitly set the route for migration builds. The existing .env.local has not been changed.

## Accounts: prepare these now, without deploying

1. Sign in to Vercel and Neon. Retain access to the existing wedding repository and Vercel project if one exists. Do not press Deploy, push to a connected deployment branch, or import a repository through a flow that immediately deploys.
2. In Neon, prepare a wedding database project with separate production and preview/test branches or databases. Preview must never share production guest records or credentials. Choose a region close to the eventual Vercel function region; record the choice for deployment setup.
3. Copy the branch-specific pooled PostgreSQL connection string from Neon's Connect panel into a private secret store. The runtime uses `pg`, which works with Neon PostgreSQL. Do not paste credentials into chat or a VITE_ variable.
4. Prepare the following Vercel variables separately for Preview and Production. If no Vercel project exists yet, keep the values privately until a later authorized project setup/deployment.

| Name | Value / handling |
| --- | --- |
| VITE_RSVP_API_URL | /api/rsvp (public) |
| DATABASE_URL | Neon pooled connection string for that environment; server-only |
| HMAC_SECRET | High-entropy random server secret, at least 43 characters; use a distinct value per environment |
| RSVP_DEADLINE | 2026-11-15T23:59:59+08:00 |
| RSVP_DISABLED | true until the separately approved cutover |

A new secret is appropriate for Neon because old sessions are not migrated. Do not rotate or alter the old Apps Script secret. Preserve the old Google configuration for controlled rollback.

Eventual Vercel settings: Vite framework, Node 22.x, `npm run build`, output `dist`, repository root as project root. vercel.json already configures the function duration. DATABASE_URL and HMAC_SECRET must remain server-only. Do not add RSVP_MIGRATION_ALLOWED to the website runtime: it is a one-off operator CLI safeguard.

Sources: [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js), [Neon connections](https://neon.com/docs/connect/connect-from-any-app), [Neon on Vercel Marketplace](https://vercel.com/marketplace/neon).

## Later: snapshot and dry-run

The snapshot format is `wedding-rsvp-migration-v1`, with capturedAt and three header-first arrays: invitations, guest_names, responses. Exact headers are defined in server/migration.js. Use the prepared owner helper to obtain a complete private JSON snapshot; do not log it publicly. A snapshot from the older getGuestImportSnapshot_ helper is insufficient because it omits Responses. No real snapshot was retrieved for this task.

Save the snapshot under ignored `private-rsvp/` and run:

```powershell
node scripts/migrate-rsvp.mjs private-rsvp/snapshot.json
```

Default mode uses only an ephemeral local database, even if DATABASE_URL exists. It prints counts and a SHA-256 review digest, never guest data. Review rejects privately; do not delete legitimate historical responses merely to make an import pass.

## Later: approved launch procedure (not executed)

1. Test Vercel + Neon connectivity in an isolated preview using dummy data, including concurrent requests from separate database connections. Confirm TLS, environment separation, HTTPS, deadline and expected response contract.
2. Apply db/001-rsvp.sql once to a new empty target database using the Neon SQL Editor. It intentionally fails on existing tables and leaves the launch gate disabled. Rehearse imports in an isolated preview first; never truncate a live target to retry.
3. Temporarily disable submissions in the old Apps Script deployment and coordinate a freeze on manual Sheet edits. Wait for in-flight writes to finish, then capture a fresh final snapshot. Export a private backup. The helper works while RSVP_DISABLED=true.
4. Run the dry-run again, review its counts/digest, then execute the gated import with the target DATABASE_URL loaded privately:

```powershell
$env:RSVP_MIGRATION_ALLOWED='true'
node scripts/migrate-rsvp.mjs private-rsvp/snapshot.json --apply REVIEWED_DIGEST
Remove-Item Env:RSVP_MIGRATION_ALLOWED
```

The CLI does not create schema. It requires empty tables and a disabled database; it locks all import tables and verifies every imported field before commit. On a connection failure or uncertain commit, inspect counts/records privately before retrying. Existing data is never overwritten.

5. Keep the old Sheets writer disabled. Set `UPDATE rsvp_control SET enabled=true WHERE id=1;` after verifying the target data. Configure the Vercel runtime with RSVP_DISABLED=false and the /api/rsvp frontend route, then perform the separately approved deployment/switch. Both the database gate and environment gate must be enabled.
6. Verify the deployed flow with an explicitly approved test invitation and monitor errors. Retain the Sheets snapshot as a private historical backup.

Rollback before any Neon submissions can restore the old route/writer. After Neon has accepted responses, first disable new writes and reconcile those responses back into the old system before switching; simply pointing back to Sheets would lose visibility of new RSVPs. Do not run two authoritative writers concurrently.

## Verification and limits

- 44 Node tests passed, including 15 new migration/API/database tests.
- Four real Chrome browser cases passed: desktop/mobile acceptance and decline, through the real local HTTP handler and SQL database, followed by private repeat lookup.
- Migration CLI dry-run passed against a dummy snapshot; digest, row counts and local SQL import verified.
- Browser command exits cleanly after fixture-server shutdown (4 passed in 19.8 seconds).
- Production Vite build passed with VITE_RSVP_API_URL=/api/rsvp.
- PGlite runs PostgreSQL queries and constraints locally; it serializes transactions within one process. Its parallel-call tests do not prove multi-connection Neon lock behavior. The pg adapter's commit/rollback/release lifecycle has an additional unit test.
- No deployed Vercel routing, real Neon network/TLS/pooling, live dataset compatibility or production concurrency has been verified yet.
- Existing npm audit finding: Vite 6.4.3 development dependency has high-severity advisories; dependency upgrade remains separate from this migration. Newly installed pg/PGlite were not reported as vulnerable in that audit.
- Name-only verification retains the existing identity limitation: knowing an invited name can claim the first response. This migration does not add OTP or identity verification.
- No organizer admin UI was added. Future guest changes should use a reviewed private workflow; table edits must maintain the same name/seat/response rules.
