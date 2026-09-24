export function passwordErrors(password: string, locale = "fr"): string | null {
  if (password.length < 10) return "short";
  if (!/[a-z]/.test(password)) return "lower";
  if (!/[A-Z]/.test(password)) return "upper";
  if (!/[0-9]/.test(password)) return "digit";
  if (!/[^A-Za-z0-9]/.test(password)) return "special";
  return null;
}

export function isStrongPassword(password: string) {
  return passwordErrors(password) === null;
}

export function ageFromBirthDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export const MIN_AGE = 13;
