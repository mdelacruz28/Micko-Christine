# Live RSVP operations

The Vercel API uses Neon PostgreSQL. Set RSVP_DATABASE_URL separately for Production and Preview; this dedicated variable takes precedence over the Marketplace-managed DATABASE_URL. Never share production database credentials with test environments. HMAC_SECRET is server-only and distinct per environment. VITE_RSVP_API_URL is /api/rsvp. RSVP_DEADLINE is 2026-11-15T23:59:59+08:00.

Submissions require both RSVP_DISABLED=false in the deployed environment and rsvp_control.enabled=true in the selected database. Environment changes require redeployment.

The previous Google Apps Script writer must stay disabled. New submissions are stored in Neon; Google Sheets and its RSVP Summary are historical data and are not automatically synchronized. Do not switch back to Sheets after Neon accepts responses without reconciling the new records.

Private migration backups and runtime credentials are excluded from Git. Temporary connectivity probes are not part of the production source. Error logging uses configuration booleans and allowlisted database error codes only.
