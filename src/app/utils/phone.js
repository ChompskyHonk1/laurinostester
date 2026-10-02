// One normaliser for every phone the site captures. US formats in, E.164 out;
// null when the value can't be trusted to text. Mirrors the drawer-auth backend
// helper so a number this site accepts is guaranteed sendable.

export function normalisePhone(raw) {
  if (!raw) return null;
  const clean = String(raw).trim();
  if (!clean) return null;
  const digits = clean.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (clean.startsWith("+") && digits.length >= 11) return `+${digits}`;
  return null;
}

export function isUsablePhone(raw) {
  return normalisePhone(raw) !== null;
}
