/**
 * The rules every public form applies to the same four fields.
 *
 * Two layers, deliberately separate:
 *
 * 1. `sanitizeField` refuses a character that can never be valid — it is
 *    stripped before it reaches state, so nothing appears in the input whether
 *    it was typed or pasted.
 * 2. `validateTextField` judges the value as a whole, which is the part no
 *    filter can do: a half-finished number and an empty field both pass every
 *    character test.
 *
 * `rejectionReason` bridges the two. Filtering silently is what people misread
 * as a broken field, so a refused keystroke gets a message of its own.
 *
 * Both forms — the contact intake and the job application — share this file so
 * a name means the same thing on either.
 */

export type TextFieldKind =
  | "name"
  | "company"
  | "mobile"
  | "email"
  | "experience"
  | "linkedin";

/** Letters plus the punctuation real names carry — no digits, no symbols. */
const NAME_PATTERN = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
/** Indian mobile: ten digits, the first one 6–9. */
const MOBILE_PATTERN = /^[6-9][0-9]{9}$/;
/** name@domain.tld — real domain labels and a TLD of at least two letters. */
const EMAIL_PATTERN =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;
/** Years, whole or to one decimal: 0, 7, 12.5. */
const EXPERIENCE_PATTERN = /^\d{1,2}(\.\d)?$/;
/**
 * A LinkedIn *profile*, not any LinkedIn page. The scheme, `www.`, a country
 * subdomain, a trailing slash and a query string are all optional; the vanity
 * slug under /in/ (or the older /pub/) is what makes it a profile.
 */
const LINKEDIN_PATTERN =
  /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[A-Za-z0-9](?:[A-Za-z0-9._%-]*[A-Za-z0-9])?\/?(?:\?.*)?$/i;

/** Longest a company name or profile URL is allowed to get. */
const MAX_COMPANY = 100;
const MAX_LINKEDIN = 200;

/**
 * Give a validated LinkedIn URL its scheme back.
 *
 * `linkedin.com/in/name` is what people type and it is accepted as valid, but
 * the admin panel renders the stored value as an `href` — without a scheme the
 * browser reads it as a path relative to the panel and the link goes nowhere.
 * Storing the absolute form is what makes it clickable there.
 */
export function normalizeLinkedInUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** Strip whatever this field can never legitimately contain. */
export function sanitizeField(kind: TextFieldKind, value: string): string {
  switch (kind) {
    case "name":
      // Letters, single spaces, and the punctuation names carry — nothing else
      // lands, and neither space nor punctuation may open the name.
      return value
        .replace(/[^A-Za-z '-]/g, "")
        .replace(/^[\s'-]+/, "")
        .replace(/\s{2,}/g, " ");
    case "company":
      // A company name is not a person's name: digits and the punctuation on a
      // letterhead are both legitimate. Only the symbols no registered name
      // carries are refused, and it still opens with a letter or a digit.
      return value
        .replace(/[^A-Za-z0-9 &.,'()/-]/g, "")
        .replace(/^[^A-Za-z0-9]+/, "")
        .replace(/\s{2,}/g, " ")
        .slice(0, MAX_COMPANY);
    case "mobile":
      // Digits only, ten at most, and a leading 0–5 is dropped rather than
      // typed — an Indian mobile can only open with 6, 7, 8 or 9.
      return value
        .replace(/[^0-9]/g, "")
        .replace(/^[0-5]+/, "")
        .slice(0, 10);
    case "email":
      // The character set an address is actually allowed to use.
      return value.replace(/[^A-Za-z0-9._%+@-]/g, "");
    case "experience":
      // A number of years: digits, at most one decimal point, and never more
      // than two digits in front of it. A career is not 300 years long.
      return value
        .replace(/[^0-9.]/g, "")
        .replace(/^\./, "")
        .replace(/(\..*)\./g, "$1")
        .replace(/^(\d{2})\d+/, "$1")
        .replace(/(\.\d)\d+$/, "$1");
    case "linkedin":
      // A URL has no spaces. Everything one can legitimately contain stays.
      return value.replace(/\s+/g, "").slice(0, MAX_LINKEDIN);
  }
}

/**
 * Why a keystroke was refused, given the raw value the field would have held.
 * Call it only when `sanitizeField` actually changed something.
 */
export function rejectionReason(kind: TextFieldKind, raw: string): string | null {
  switch (kind) {
    case "name":
      if (/[0-9]/.test(raw)) return "Numbers aren't allowed in a name — letters only.";
      if (/[^A-Za-z '-]/.test(raw))
        return "Letters only — special characters aren't allowed here.";
      if (/^[\s'-]/.test(raw)) return "A name has to start with a letter.";
      if (/\s{2,}/.test(raw)) return "Just one space between names.";
      return null;
    case "company":
      if (/^[^A-Za-z0-9]/.test(raw)) return "Start with a letter or a number.";
      if (/\s{2,}/.test(raw)) return "Just one space between words.";
      return "That character isn't allowed in a company name.";
    case "mobile":
      if (/[^0-9]/.test(raw)) return "Digits only — no letters, spaces or symbols.";
      if (/^[0-5]/.test(raw)) return "An Indian mobile number starts with 6, 7, 8 or 9.";
      return "A mobile number is 10 digits — that's all of them.";
    case "email":
      if (/\s/.test(raw)) return "An email address can't contain spaces.";
      return "That character isn't allowed in an email address.";
    case "experience":
      if (/[^0-9.]/.test(raw)) return "Numbers only — enter the years, like 4 or 4.5.";
      if (/\..*\./.test(raw)) return "Just one decimal point.";
      if (/^\./.test(raw)) return "Start with a number.";
      if (/^\d{3}/.test(raw)) return "That's more years than a career runs to.";
      return "One decimal place is enough — 4.5, not 4.55.";
    case "linkedin":
      if (/\s/.test(raw)) return "A URL can't contain spaces.";
      return "That's longer than a LinkedIn URL gets.";
  }
}

/**
 * Judge a finished value. Returns the message to show, or null if it passes.
 *
 * The character-level branches are unreachable through a field that filters as
 * it is typed. They stay as the backstop for a value arriving another way —
 * autofill, or a caller that skipped the filter.
 */
export function validateTextField(kind: TextFieldKind, raw: string): string | null {
  const value = raw.trim();

  switch (kind) {
    case "name":
      if (!value) return "Please enter your full name.";
      if (/[0-9]/.test(value)) return "Names can't contain numbers — letters only.";
      if (!NAME_PATTERN.test(value))
        return "Letters only — no numbers or special characters.";
      if (value.length < 2) return "That looks too short — please enter your full name.";
      return null;

    case "company":
      if (!value) return "Please enter your company name.";
      if (value.length < 2) return "That looks too short — please enter the full name.";
      return null;

    case "mobile":
      if (!value) return "Please enter your mobile number.";
      if (/[^0-9]/.test(value)) return "Digits only — no spaces, letters or symbols.";
      if (!/^[6-9]/.test(value)) return "An Indian mobile number starts with 6, 7, 8 or 9.";
      if (value.length < 10) return "That's too short — a mobile number is 10 digits.";
      if (value.length > 10)
        return "That's too long — enter the 10 digits without the country code.";
      if (!MOBILE_PATTERN.test(value)) return "Please enter a valid 10-digit mobile number.";
      return null;

    case "email":
      if (!value) return "Please enter your email address.";
      if (!value.includes("@")) return "An email needs an @ — like name@company.com.";
      if (!EMAIL_PATTERN.test(value))
        return "Please enter a valid email address — like name@company.com.";
      return null;

    case "experience":
      if (!value) return "Please enter your years of experience.";
      if (!EXPERIENCE_PATTERN.test(value))
        return "Enter it as a number of years — 4, or 4.5.";
      if (Number(value) > 60) return "Please enter a realistic number of years.";
      return null;

    case "linkedin":
      // Optional wherever it is used, so an empty value is the caller's call:
      // it never reaches here unless something was typed.
      if (!value) return null;
      if (!/linkedin\.com/i.test(value))
        return "That isn't a LinkedIn URL — it should contain linkedin.com.";
      if (!LINKEDIN_PATTERN.test(value))
        return "Link to your profile — like linkedin.com/in/your-name.";
      return null;
  }
}
