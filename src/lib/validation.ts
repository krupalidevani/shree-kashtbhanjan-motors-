/** Strips spaces, dashes and an optional +91 / 0 prefix from an Indian mobile number. */
export function normalizeIndianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function validateName(value: string) {
  const name = value.trim();
  if (!name) return "Please enter your name.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  if (!/^[\p{L} .'-]+$/u.test(name)) return "Name can only contain letters and spaces.";
  return undefined;
}

export function validatePhone(value: string) {
  if (!value.trim()) return "Please enter your phone number.";
  if (!/^[6-9]\d{9}$/.test(normalizeIndianPhone(value))) {
    return "Enter a valid 10-digit mobile number.";
  }
  return undefined;
}

/** Returns today's date as YYYY-MM-DD in the visitor's local time zone. */
export function todayIsoDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

export function formatDisplayDate(isoDate: string) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
