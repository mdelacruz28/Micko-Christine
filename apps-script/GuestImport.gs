// Owner-only READ helper. Not reachable from doPost or google.script.run.
// No sheet creation, writes, real guest generation or import is performed here.
function getGuestImportSnapshot_() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Please retry the owner snapshot.');
  try {
    const cfg = config_();
    const book = SpreadsheetApp.openById(cfg.spreadsheetId);
    invitations_(book); table_(book, 'GuestNames'); table_(book, 'Responses'); table_(book, 'SecurityState');
    const data = name => {
      const sheet = book.getSheetByName(name);
      return sheet.getRange(1, 1, sheet.getLastRow(), HEADERS_[name].length).getValues();
    };
    const input = book.getSheetByName('Guest List');
    const guestList = input ? { sheetId: input.getSheetId(), rows: input.getRange(1, 1, input.getLastRow(), 5).getValues(), formulaRows: input.getRange(1, 2, input.getLastRow(), 1).getFormulas().map((row, index) => row[0] ? index + 1 : null).filter(row => row !== null) } : null;
    return { guestList: guestList, format: 'wedding-guest-snapshot-v1', capturedAt: new Date().toISOString(), spreadsheetId: cfg.spreadsheetId,
      sheetIds: { Invitations: book.getSheetByName('Invitations').getSheetId(), GuestNames: book.getSheetByName('GuestNames').getSheetId() },
      invitations: data('Invitations'), guestNames: data('GuestNames') };
  } finally { lock.releaseLock(); }
}
