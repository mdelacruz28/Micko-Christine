# Guest List tab: owner entry and validation

The SAME existing spreadsheet now has a fifth tab, Guest List, with 200 prepared blank name rows. Enter one invited person's full first and last name in B2:B201. Columns A:E are No., Full Name, Validation Status, Import Status, Notes. Column E is optional private owner notes. The header is frozen, filters are available and names are formatted as plain text. Existing RSVP tabs and records were not changed.

Initial Needs Review / Not Imported values are placeholders, not validation. There is no formula, onEdit trigger or automatic invitation creation. Do not manually label rows Valid or Imported. Ask to validate Guest List after entering names, or use the owner workflow below. No real names have been entered or imported by this work.

## Read the current input and validate locally

Capture a fresh private snapshot as described below, now including guestList: { sheetId, rows, formulaRows }. rows is the exact A:E row arrays including the header; formulaRows is an explicit array of 1-based sheet row numbers whose B cells contain formulas (empty when none). Obtain formula metadata with get_spreadsheet_cells using userEnteredValue, not just rendered values; a formula returning a plausible full name must still be rejected. The read-only GuestImport.gs snapshot helper includes this information, but remains LOCAL and has not been uploaded to the live Apps Script project.

~~~powershell
node apps-script/guest-list-workflow.mjs --snapshot private-rsvp/current-snapshot.json --out private-rsvp/guest-list-review-001
~~~

This produces private preview.json, status-requests.json and, when there are candidate names, plan.json. It performs no live writes. Canonical validation uses the same NFKC/space folding/en-US lowercase rules as RSVP. Duplicates within the input, formula-backed cells and conflicts with existing GuestNames (including disabled mappings) are detected. The preview includes names, actual Guest List row numbers/rejections, generated invitation/name IDs, and one reserved seat per candidate in plan.json. Rejected rows block confirming the whole import plan. Blank prepared rows remain Needs Review / Not Imported.

After re-reading and comparing the current Full Name cells/formula metadata, the owner or an authorized connector action may apply the generated status requests to C:D only. These requests preserve full names, numbering and Notes, and put detailed reasons in cell notes rather than overwriting owner notes. Do not apply stale status requests after names have changed or rows have moved. A Valid / Ready row means validation passed; it does not mean an invitation was imported or that import permission was granted.

## Separate approval for invitations

Review the actual plan and obtain explicit approval for importing those names. Then use the existing provision-invitations.mjs --plan / --snapshot / --confirm workflow documented below to generate LOCAL append artifacts. Guest List names and formula metadata are fingerprinted in addition to Invitations/GuestNames, so editing or reordering names invalidates the old plan; status/notes changes alone do not. Actual application of the append batch remains a separately approved live action. Never automatically import when a name is entered.

## Verify after an approved import

Capture a new live snapshot after an approved append, then reconcile against the exact approved plan:

~~~powershell
node apps-script/guest-list-workflow.mjs --snapshot private-rsvp/post-import-snapshot.json --reconcile private-rsvp/guest-list-review-001/plan.json --out private-rsvp/guest-list-reconciled-001
~~~

Imported is emitted only when both exact approved IDs, all planned field values, one active individual seat, one enabled primary mapping and an unambiguous canonical name are verified in the actual new snapshot. Missing, partial, changed or duplicate records show Error / Needs Review. An unrelated pre-existing name conflict never proves an import. Apply reconciled C:D status requests only after checking that the input cells still match that snapshot. Do not infer success from a request acknowledgement or write optimistic Imported labels.

The CLI does not prove that a local snapshot is live or apply any request itself. Use current connector reads, retain the private reviewed plan, reconcile uncertain appends before retrying, and follow the exclusive-editing/atomic-batch limitations below. No import, live source change or deployment has been performed.

---

# Owner-operated individual guest preparation

No actual guest names have been supplied, prepared or imported. Do not use the historical fictional fixture as a guest list. The CLI has no fixture mode and never contacts Google. All private inputs and outputs belong under the ignored private-rsvp folder; do not commit or attach these files publicly.

## One person, one seat

Every prepared guest receives a random UUID invitation_id, a distinct UUID name_id, one primary name mapping, invitation_type individual, reserved_seats 1, active true and lookup_enabled true. group_label and display_name both contain the complete invited name. code_version remains numeric 1; the required code_digest column gets a unique cryptographic random digest-shaped placeholder, unused by name-only RSVP. No plaintext invitation code or secret is needed or issued. updates_allowed is false. Existing columns, invitations and responses are never rewritten.

Names use NFKC, trimmed/folded whitespace and en-US lowercase for lookup. Complete first/last names are required, with letters, combining marks, spaces, apostrophes, periods and hyphens. Blank, single-part, formula-like and control-character names are rejected for owner correction. Accents and punctuation remain significant. Genuine guests with identical normalized names require an owner decision; do not silently merge or assign shared invitations. Both occurrences in an input duplicate are rejected. Existing disabled mappings and group labels also block collisions.

## Prepare a private snapshot

Before preparation, use the connected Drive tools to re-read the SAME existing spreadsheet metadata and all populated Invitations and GuestNames rows. Confirm the four required tabs and headers and check Responses for duplicate invitation IDs. Do not write anything. Save a private local JSON snapshot with this shape:

- format: wedding-guest-snapshot-v1
- capturedAt: actual ISO capture time
- spreadsheetId: the verified existing spreadsheet ID
- sheetIds: numeric Invitations and GuestNames tab IDs from metadata
- invitations: complete row arrays, including the exact existing header row
- guestNames: complete row arrays, including the exact existing header row

Snapshot data must come from current connector reads, not hand-invented values or a test workbook. It contains private names but excludes response answers and Script Properties. When names are supplied, Codex can prepare this local snapshot from authorized connector reads. The optional getGuestImportSnapshot_ helper in GuestImport.gs provides the same read-only shape for owner use AFTER a separately approved source merge; it has not been uploaded or run against Google. Never expose it through doPost. An owner may inspect its returned object with the Apps Script debugger and save it privately; do not log full guest records.

## Dry run

Create private-rsvp/guests.txt yourself with one complete invited name per line, no heading. Keep invalid blank rows for correction rather than silently dropping them. Then run:

~~~powershell
node apps-script/provision-invitations.mjs --input private-rsvp/guests.txt --snapshot private-rsvp/current-snapshot.json --out private-rsvp/review-001
~~~

The new output directory contains plan.json and preview.json only. Review names, rejected input row numbers/reasons, IDs and the one-seat count. No records are imported. IDs/digests are checked against existing records and each other, with bounded retries for collisions. Existing duplicate IDs or schema mismatches stop preparation. Any rejected row blocks confirmation of the whole plan. Fix the list and prepare a NEW directory/plan; do not edit generated records by hand.

## Explicit artifact confirmation

After reviewing and approving the exact plan, obtain a fresh private snapshot through another live read. Use the confirmation digest shown in preview.json:

~~~powershell
node apps-script/provision-invitations.mjs --plan private-rsvp/review-001/plan.json --snapshot private-rsvp/fresh-snapshot.json --confirm REVIEWED_DIGEST --out private-rsvp/approved-001
~~~

This checks the exact reviewed digest, snapshot fingerprint, IDs, names, one-seat policy and primary mappings again. If Invitations or GuestNames changed, it rejects the plan; rerun preparation. A changed capture time alone does not invalidate an otherwise identical snapshot. The CLI cannot prove a local snapshot is current: obtain it through a real live read. Confirmation here prepares LOCAL files only and is not permission to change Google or deploy anything.

Confirmed artifacts are Invitations.csv, GuestNames.csv and batch-requests.json. CSVs have exact headers and safe cell values. The batch uses typed string/number/boolean values and two appendCells requests addressed to the existing tab IDs. No replacement sheet, updateCells, delete, Responses or SecurityState write is generated. Existing rows remain intact.

## Separately authorized live import

Do not execute the batch until the owner supplies and approves the actual list and explicitly authorizes a live import. Immediately before that write, re-read the actual workbook and compare the reviewed fingerprint, IDs and names again, check duplicate response rows, confirm a private backup, and coordinate exclusive editing with other owners/writers. The connector has no conditional revision write for this request: a fresh read alone cannot protect against a simultaneous external editor. Keep the sheet otherwise unchanged during the import window.

With that approval and a controlled editing window, use ONE Google Sheets batchUpdate containing both append requests so either both tables append or the request fails. Never blindly retry an uncertain live write: first read back IDs/mappings and reconcile whether the batch committed. A repeated append would duplicate records. Verify every new ID/name mapping, one-seat count, and unchanged original responses afterward. The existing response records are not part of the import payload.

If an atomic connector write or exclusive editing cannot be ensured, deliver the validated files to the owner and explain that import remains unperformed. For manual CSV use, append data rows only to the exact existing columns, never replace a tab or paste headers into the data, preserve typed numbers/booleans, and reconcile both tables before any retry. Do not claim a manual import succeeded without readback. No import has been attempted in this implementation.
