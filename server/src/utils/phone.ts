// Returns an E.164 number (+91XXXXXXXXXX style) or null when the input is not a valid Indian mobile or international number.
export function normalizePhone(raw: string): string | null {
  const compact = raw.replace(/[\s\-().]/g, '');

  if (/^[6-9]\d{9}$/.test(compact)) return `+91${compact}`;
  if (/^0[6-9]\d{9}$/.test(compact)) return `+91${compact.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(compact)) return `+${compact}`;
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact;

  return null;
}
