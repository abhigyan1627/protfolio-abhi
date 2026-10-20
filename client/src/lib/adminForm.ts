// Converts between textarea-friendly text and the structured values the API expects.

export const linesToArray = (value: string): string[] =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

export const arrayToLines = (items: string[]): string => items.join('\n');

// Parses "Question :: Answer" lines. Lines without the separator are ignored.
export function parseFaqLines(value: string): { question: string; answer: string }[] {
  return linesToArray(value).flatMap((line) => {
    const [question, ...rest] = line.split('::');
    const answer = rest.join('::').trim();
    return question && answer ? [{ question: question.trim(), answer }] : [];
  });
}

export const faqsToLines = (faqs: { question: string; answer: string }[]): string =>
  faqs.map((faq) => `${faq.question} :: ${faq.answer}`).join('\n');

// Prices are entered in rupees and stored as integer paise. An empty value means "Contact for Quotation".
export function rupeesToPaise(value: string): number | null | 'invalid' {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const amount = Number(trimmed.replace(/,/g, ''));
  if (!Number.isFinite(amount) || amount < 0) return 'invalid';
  return Math.round(amount * 100);
}

export const paiseToRupees = (paise: number | null): string => (paise === null ? '' : String(paise / 100));

export const nullIfBlank = (value: string): string | null => (value.trim() ? value.trim() : null);

export const toSlugInput = (value: string): string | undefined => (value.trim() ? value.trim() : undefined);
