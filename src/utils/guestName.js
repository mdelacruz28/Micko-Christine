export const cleanGuestName = value => value.normalize('NFKC').trim().replace(/\s+/gu, ' ');
export const normalizeGuestName = value => cleanGuestName(value).toLocaleLowerCase('en-US');
export function validGuestName(value) {
  if (typeof value !== 'string' || value.length > 120 || /[\p{Cc}\p{Cf}]/u.test(value)) return false;
  const name = cleanGuestName(value);
  return name.length <= 120 && /^[\p{L}][\p{L}\p{M} .'\u2019-]*$/u.test(name) && name.split(' ').filter(part => /\p{L}/u.test(part)).length >= 2;
}
