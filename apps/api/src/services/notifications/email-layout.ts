/**
 * Branded HTML email shell (logo, colours, contact footer). Email clients don't support
 * CSS variables or <style> reliably, so colours are inline and mirror apps/web tokens.css.
 */
import { BUSINESS, BUSINESS_LOGO_URL } from '@shark/shared';

/** Mirrors --navy, --red, --blue, --ink, --muted, --line, --paper in apps/web/src/styles/tokens.css. */
export const BRAND = {
  navy: '#06142e',
  red: '#e10600',
  blue: '#0b4dba',
  ink: '#0b1530',
  muted: '#4e5d78',
  line: '#e2e8f3',
  paper: '#f4f7fc',
  white: '#ffffff',
  green: '#1fa855',
} as const;

const FONT = "'Plus Jakarta Sans', 'Segoe UI', Helvetica, Arial, sans-serif";

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

/** A rounded, bulletproof email button. */
export function emailButton(label: string, href: string, bg: string): string {
  return `<a href="${esc(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;background:${bg};color:${BRAND.white};font:700 14px ${FONT};text-decoration:none">${esc(label)}</a>`;
}

/** Rows of label/value pairs as an email-safe table. */
export function factTable(title: string, rows: [string, string][]): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;width:120px;vertical-align:top;color:${BRAND.muted};font:600 13px ${FONT}">${esc(k)}</td>` +
        `<td style="padding:8px 0;color:${BRAND.ink};font:600 15px ${FONT};white-space:pre-line">${esc(v)}</td></tr>`,
    )
    .join('');
  return (
    `<p style="margin:24px 0 4px;color:${BRAND.red};font:800 12px ${FONT};letter-spacing:.12em;text-transform:uppercase">${esc(title)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${BRAND.line}">${body}</table>`
  );
}

/** Wraps content in the branded layout. `preheader` is the grey preview line in inboxes. */
export function emailLayout(opts: { preheader: string; heading: string; badge?: string; body: string }): string {
  const { street, city, postcode } = BUSINESS.address;
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.paper}">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper};padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${BRAND.white};border-radius:20px;overflow:hidden;border:1px solid ${BRAND.line}">
  <tr><td style="background:${BRAND.navy};padding:22px 28px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td><span style="display:inline-block;background:${BRAND.white};border-radius:12px;padding:6px 10px"><img src="${BUSINESS_LOGO_URL}" alt="${esc(BUSINESS.name)}" width="120" style="display:block;border:0;width:120px;height:auto"></span></td>
      ${opts.badge ? `<td align="right"><span style="display:inline-block;background:${BRAND.red};color:${BRAND.white};border-radius:999px;padding:6px 12px;font:800 12px ${FONT};letter-spacing:.06em">${esc(opts.badge)}</span></td>` : ''}
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;background:${BRAND.red}"></td></tr>
  <tr><td style="padding:28px">
    <h1 style="margin:0;color:${BRAND.ink};font:800 24px ${FONT}">${esc(opts.heading)}</h1>
    ${opts.body}
  </td></tr>
  <tr><td style="background:${BRAND.paper};padding:18px 28px;color:${BRAND.muted};font:500 12px/1.6 ${FONT}">
    <b style="color:${BRAND.ink}">${esc(BUSINESS.name)}</b> · ${esc(`${street}, ${city} ${postcode}`)}<br>
    ${esc(BUSINESS.phone.display)} · <a href="mailto:${esc(BUSINESS.email)}" style="color:${BRAND.blue}">${esc(BUSINESS.email)}</a> ·
    <a href="${esc(BUSINESS.url)}" style="color:${BRAND.blue}">${esc(BUSINESS.url.replace(/^https?:\/\//, ''))}</a>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export { FONT as EMAIL_FONT };
