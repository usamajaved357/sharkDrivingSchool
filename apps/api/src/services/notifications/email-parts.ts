/**
 * Email-safe building blocks (tables + inline styles) used inside emailLayout().
 * All text values are escaped here; only pass trusted HTML where a parameter says so.
 */
import { BRAND, EMAIL_FONT as F, esc } from './email-layout';

export interface EmailButton {
  label: string;
  href: string;
  bg: string;
  /** Text colour; defaults to white. */
  fg?: string;
  /** Optional border colour (for outline buttons). */
  border?: string;
}

/** Equal-width buttons side by side (they stack on small screens). */
export function buttonRow(buttons: EmailButton[]): string {
  const cells = buttons
    .map((b, i) => {
      const gap = i < buttons.length - 1 ? 'padding:0 10px 0 0' : 'padding:0';
      return `<td class="stack stack-gap" width="${Math.floor(100 / buttons.length)}%" style="${gap}">
      <a href="${esc(b.href)}" style="display:block;padding:14px 10px;border-radius:12px;background:${b.bg};border:1.5px solid ${b.border ?? b.bg};color:${b.fg ?? BRAND.white};font:800 15px ${F};text-align:center;text-decoration:none">${esc(b.label)}</a></td>`;
    })
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0"><tr>${cells}</tr></table>`;
}

/** Calendar tile + lesson summary: the "what and when" at a glance. */
export function summaryCard(o: {
  weekday: string;
  day: string;
  month: string;
  title: string;
  tag: string;
  lines: [label: string, value: string][];
}): string {
  const lines = o.lines
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 10px 3px 0;font:600 13px ${F};color:${BRAND.muted};white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:3px 0;font:700 14px/1.45 ${F};color:${BRAND.ink}">${esc(v)}</td></tr>`,
    )
    .join('');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-radius:16px;background:${BRAND.paper}"><tr>
  <td width="92" valign="top" style="padding:18px 0 18px 18px">
    <table role="presentation" width="74" cellpadding="0" cellspacing="0" style="border-radius:14px;overflow:hidden;background:${BRAND.white};border:1px solid ${BRAND.line};text-align:center">
      <tr><td style="background:${BRAND.red};padding:5px 0;font:800 11px ${F};letter-spacing:.12em;text-transform:uppercase;color:${BRAND.white}">${esc(o.month)}</td></tr>
      <tr><td style="padding:6px 0 0;font:800 30px/1 ${F};color:${BRAND.navy}">${esc(o.day)}</td></tr>
      <tr><td style="padding:3px 0 8px;font:700 12px ${F};color:${BRAND.muted}">${esc(o.weekday)}</td></tr>
    </table>
  </td>
  <td valign="top" style="padding:18px 18px 18px 6px">
    <p style="margin:0;font:800 18px/1.3 ${F};color:${BRAND.ink}">${esc(o.title)}
      <span style="display:inline-block;margin-left:6px;padding:3px 9px;border-radius:999px;background:${BRAND.navy};color:${BRAND.white};font:700 11px ${F};letter-spacing:.04em;vertical-align:2px">${esc(o.tag)}</span></p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:8px">${lines}</table>
  </td>
</tr></table>`;
}

/** A titled card of label/value rows. Values keep line breaks. */
export function detailCard(title: string, rows: [label: string, value: string][]): string {
  const body = rows
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:11px 16px;width:118px;vertical-align:top;font:600 13px ${F};color:${BRAND.muted};${i ? `border-top:1px solid ${BRAND.line}` : ''}">${esc(k)}</td>` +
        `<td style="padding:11px 16px 11px 0;vertical-align:top;font:600 15px/1.5 ${F};color:${BRAND.ink};white-space:pre-line;${i ? `border-top:1px solid ${BRAND.line}` : ''}">${esc(v)}</td></tr>`,
    )
    .join('');
  return (
    `<p style="margin:26px 0 10px;font:800 12px ${F};letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(title)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-radius:14px">${body}</table>`
  );
}

/** Numbered steps with red circles. `items` may contain trusted HTML. */
export function stepList(title: string, items: string[]): string {
  const rows = items
    .map(
      (html, i) =>
        `<tr><td width="40" valign="top" style="padding:7px 0"><span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:${BRAND.red};color:${BRAND.white};font:800 13px/28px ${F};text-align:center">${i + 1}</span></td>` +
        `<td valign="top" style="padding:11px 0 7px;font:500 15px/1.5 ${F};color:${BRAND.ink}">${html}</td></tr>`,
    )
    .join('');
  return (
    `<p style="margin:26px 0 6px;font:800 12px ${F};letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(title)}</p>` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`
  );
}

/** Three-stage tracker; stages up to `done` (1-based) are ticked. */
export function progressTracker(stages: [string, string, string], done: number): string {
  const cell = (label: string, i: number) => {
    const on = i < done;
    const dot = on
      ? `<span style="display:inline-block;width:30px;height:30px;border-radius:50%;background:${BRAND.green};color:${BRAND.white};font:800 15px/30px ${F}">&#10003;</span>`
      : `<span style="display:inline-block;width:26px;height:26px;border-radius:50%;border:2px solid ${BRAND.line};background:${BRAND.white};color:${BRAND.muted};font:800 13px/26px ${F}">${i + 1}</span>`;
    return `<td width="33%" align="center" valign="top" style="padding:0 4px">${dot}<p style="margin:8px 0 0;font:${on ? 800 : 600} 13px/1.35 ${F};color:${on ? BRAND.ink : BRAND.muted}">${esc(label)}</p></td>`;
  };
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;padding:18px 8px;border-radius:16px;background:${BRAND.paper}"><tr>${stages.map(cell).join('')}</tr></table>`;
}

/** Soft highlighted box (tips, notes). `html` is trusted. */
export function noteBox(html: string, tone: 'red' | 'paper' = 'paper'): string {
  const bg = tone === 'red' ? BRAND.redTint : BRAND.paper;
  const bar = tone === 'red' ? BRAND.red : BRAND.blue;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 0"><tr><td style="padding:14px 18px;border-radius:12px;background:${bg};border-left:4px solid ${bar};font:500 14px/1.6 ${F};color:${BRAND.ink}">${html}</td></tr></table>`;
}

/** Small muted line of text. `html` is trusted. */
export const smallPrint = (html: string): string => `<p style="margin:22px 0 0;font:500 12px/1.6 ${F};color:${BRAND.muted}">${html}</p>`;
