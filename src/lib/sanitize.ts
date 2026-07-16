import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['strong', 'em', 'code', 'br', 'span'];
const ALLOWED_ATTR = ['class'];

export function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

export function renderSafe(
  text: string,
  format: (input: string) => string,
): string {
  return sanitize(format(text));
}
