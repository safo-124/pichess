/**
 * Shared WhatsApp and phone utilities for customer-facing Pi Chess flows.
 */

export const PICHESS_WHATSAPP_DIGITS = "233554534646";
export const PICHESS_PHONE_INTL = "+233 55 453 4646";
export const PICHESS_PHONE_LOCAL = "055 453 4646";
export const PICHESS_EMAIL = "officialpichess@gmail.com";

export function cleanPhoneDigits(value?: string | null): string {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length >= 9 ? digits : PICHESS_WHATSAPP_DIGITS;
}

export function buildWhatsAppUrl(message: string, customPhone?: string | null): string {
  const digits = cleanPhoneDigits(customPhone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildLessonWhatsAppUrl(opts?: {
  program?: string;
  age?: string;
  level?: string;
  goal?: string;
}): string {
  const programPart = opts?.program ? ` about "${opts.program}"` : "";
  const extraParts = [
    opts?.age ? `Student: ${opts.age}` : "",
    opts?.level ? `Level: ${opts.level}` : "",
    opts?.goal ? `Goal: ${opts.goal}` : "",
  ].filter(Boolean);
  const details = extraParts.length ? ` (${extraParts.join(", ")})` : "";
  return buildWhatsAppUrl(
    `Hi Pi Chess! I'd like to ask about chess lessons${programPart}${details}. Please share your current class times and fees.`
  );
}

export function buildTournamentWhatsAppUrl(opts: {
  title: string;
  dateLabel?: string;
  isWaitlist?: boolean;
}): string {
  const action = opts.isWaitlist ? "join the waitlist" : "register";
  const datePart = opts.dateLabel ? ` (${opts.dateLabel})` : "";
  return buildWhatsAppUrl(
    `Hi Pi Chess! I'd like to ${action} for "${opts.title}"${datePart}. Please share the registration details.`
  );
}

export function buildDonationWhatsAppUrl(tierAmount?: string): string {
  const tierPart = tierAmount ? ` (${tierAmount})` : "";
  return buildWhatsAppUrl(
    `Hi Pi Chess Foundation! I'd like to make a donation${tierPart}. Please share your Mobile Money / Bank details and receipt info.`
  );
}
