/**
 * Branded HTML email shell: logo header, navy hero, content and contact footer.
 * Email clients don't support CSS variables and only partly support <style>, so colours
 * are inline and mirror apps/web tokens.css. Building blocks live in email-parts.ts.
 */
import { BUSINESS } from '@shark/shared';
import { EMAIL_LOGO } from './email-logo';

/** Mirrors --navy, --navy-2, --red, --blue, --ink, --muted, --line, --paper in apps/web/src/styles/tokens.css. */
export const BRAND = {
  navy: '#06142e',
  navy2: '#0a2152',
  red: '#e10600',
  redTint: '#ffe1df',
  blue: '#0b4dba',
  ink: '#0b1530',
  muted: '#4e5d78',
  soft: '#b9c6e0',
  line: '#e2e8f3',
  paper: '#f4f7fc',
  white: '#ffffff',
  green: '#1fa855',
} as const;

export const EMAIL_FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const F = EMAIL_FONT;

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

/** The inline (CID) logo. Resend attaches it (see resend.notifier.ts), so it works before the site is live. */
export function logoImg(width: number): string {
  const height = Math.round((width * EMAIL_LOGO.height) / EMAIL_LOGO.width);
  return `<img src="cid:${EMAIL_LOGO.contentId}" alt="${esc(BUSINESS.name)}" width="${width}" height="${height}" style="display:block;border:0;outline:none;width:${width}px;height:${height}px">`;
}

export interface LayoutOptions {
  /** Grey preview line shown next to the subject in the inbox. */
  preheader: string;
  /** Small red label above the heading, e.g. "New booking request". */
  eyebrow: string;
  heading: string;
  /** One or two sentences under the heading (HTML allowed, escape values first). */
  intro: string;
  /** Reference chip in the header, e.g. "SHK-3CGFFC". */
  badge?: string;
  /** Main content (built with email-parts.ts). */
  body: string;
}

export function emailLayout(o: LayoutOptions): string {
  const { street, city, postcode } = BUSINESS.address;
  const site = BUSINESS.url.replace(/^https?:\/\/(www\.)?/, '');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BUSINESS.name}, ${street}, ${city} ${postcode}`)}`;
  const link = (href: string, label: string) => `<a href="${esc(href)}" style="color:${BRAND.white};text-decoration:none">${esc(label)}</a>`;
  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>${esc(o.heading)}</title>
<style>
  @media only screen and (max-width:520px){
    .px{padding-left:20px!important;padding-right:20px!important}
    .stack{display:block!important;width:100%!important;box-sizing:border-box}
    .stack-gap{padding:0 0 10px!important}
    .h1{font-size:24px!important}
  }
</style></head>
<body style="margin:0;padding:0;background:${BRAND.paper};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(o.preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.paper}">
<tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:${BRAND.white};border-radius:22px;overflow:hidden;border:1px solid ${BRAND.line};box-shadow:0 12px 40px rgba(6,20,46,.08)">

  <tr><td class="px" style="padding:18px 32px;background:${BRAND.white}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td valign="middle"><a href="${esc(BUSINESS.url)}" style="text-decoration:none">${logoImg(150)}</a></td>
      ${
        o.badge
          ? `<td valign="middle" align="right" style="font:700 10px ${F};color:${BRAND.muted};letter-spacing:.12em;text-transform:uppercase">Reference<br>
        <span style="display:inline-block;margin-top:5px;padding:6px 12px;border-radius:999px;border:1.5px solid ${BRAND.navy};color:${BRAND.navy};font:800 13px ${F};letter-spacing:.06em">${esc(o.badge)}</span></td>`
          : ''
      }
    </tr></table>
  </td></tr>
  <tr><td style="height:4px;line-height:4px;font-size:0;background:${BRAND.red}">&nbsp;</td></tr>

  <tr><td class="px" style="padding:26px 32px 28px;background:${BRAND.navy};background-image:linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navy2} 100%)">
    <p style="margin:0 0 8px;font:800 11px ${F};letter-spacing:.16em;text-transform:uppercase;color:#ff6a63">${esc(o.eyebrow)}</p>
    <h1 class="h1" style="margin:0;font:800 26px/1.25 ${F};color:${BRAND.white}">${esc(o.heading)}</h1>
    <p style="margin:10px 0 0;font:500 15px/1.6 ${F};color:${BRAND.soft}">${o.intro}</p>
  </td></tr>

  <tr><td class="px" style="padding:24px 32px 30px">${o.body}</td></tr>

  <tr><td class="px" style="padding:26px 32px;background:${BRAND.navy};font:500 13px/1.7 ${F};color:${BRAND.soft}">
    <p style="margin:0 0 6px;font:800 15px ${F};color:${BRAND.white}">${esc(BUSINESS.name)}</p>
    ${link(mapsUrl, `${street}, ${city} ${postcode}`)}<br>
    ${link(`tel:${BUSINESS.phone.tel}`, BUSINESS.phone.display)} &nbsp;·&nbsp; ${link(`mailto:${BUSINESS.email}`, BUSINESS.email)} &nbsp;·&nbsp; ${link(BUSINESS.url, site)}
    <p style="margin:12px 0 0;font:500 11px ${F};color:#7f8fb0">DVSA-approved driving lessons across ${esc(BUSINESS.region)}.</p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;
}
