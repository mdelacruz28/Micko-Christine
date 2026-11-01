// OWNER-ONLY: paste into the existing Apps Script editor only at a later approved cutover.
// Read-only; works even while RSVP_DISABLED=true. Never expose through doPost.
function getVercelMigrationSnapshot_() {
  const lock=LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Snapshot busy.');
  try {
    const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    if (!id) throw new Error('Missing spreadsheet configuration.');
    const book=SpreadsheetApp.openById(id);
    const result={format:'wedding-rsvp-migration-v1',capturedAt:new Date().toISOString()};
    [['Invitations','invitations'],['GuestNames','guest_names'],['Responses','responses']].forEach(function(pair) {
      const table=table_(book,pair[0]);
      result[pair[1]]=[HEADERS_[pair[0]]].concat(table.rows.map(function(row) {
        return HEADERS_[pair[0]].map(function(key) { return row[key] instanceof Date ? row[key].toISOString() : row[key]; });
      }));
    });
    return JSON.stringify(result);
  } finally { lock.releaseLock(); }
}
