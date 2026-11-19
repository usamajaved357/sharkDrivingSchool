/**
 * Email-safe building blocks (tables + inline styles) used inside emailLayout().
 * All text values are escaped here; only pass trusted HTML where a parameter says so.
 */
import { BRAND, EMAIL_FONT as F, esc } from './email-layout';

export interface EmailButton {
  label: string;
  href: string;
  bg: string;
}

/** Compact pill buttons that sit side by side and wrap on small screens. */
export function pillButtons(buttons: EmailButton[]): string {
  return buttons
    .map(
      (b) =>
        `<a href="${esc(b.href)}" style="display:inline-block;margin:10px 8px 0 0;padding:9px 18px;border-radius:999px;background:${b.bg};color:${BRAND.white};font:700 13px/18px ${F};text-decoration:none;white-space:nowrap">${esc(b.label)}</a>`,
    )
    .join('');
}

/** Small red label used as a card or section title. */
const label = (text: string, top = 0) =>
  `<p style="margin:${top}px 0 10px;font:800 11px ${F};letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(text)}</p>`;

/** A soft rounded card. `inner` is trusted HTML. */
const card = (inner: string, top = 16) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:${top}px 0 0;border:1px solid ${BRAND.line};border-radius:16px;background:${BRAND.paper}"><tr><td style="padding:18px 20px">${inner}</td></tr></table>`;

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
        `<tr><td style="padding:3px 12px 3px 0;font:600 13px/20px ${F};color:${BRAND.muted};white-space:nowrap;vertical-align:top">${esc(k)}</td>` +
        `<td style="padding:3px 0;font:700 14px/20px ${F};color:${BRAND.ink}">${esc(v)}</td></tr>`,
    )
    .join('');
  return card(
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
  <td width="80" valign="top" style="padding:0 16px 0 0">
    <table role="presentation" width="66" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;background:${BRAND.white};border:1px solid ${BRAND.line};text-align:center">
      <tr><td style="background:${BRAND.red};padding:4px 0;font:800 10px/14px ${F};letter-spacing:.14em;text-transform:uppercase;color:${BRAND.white}">${esc(o.month)}</td></tr>
      <tr><td style="padding:7px 0 0;font:800 26px/1 ${F};color:${BRAND.navy}">${esc(o.day)}</td></tr>
      <tr><td style="padding:2px 0 8px;font:700 11px/14px ${F};color:${BRAND.muted}">${esc(o.weekday)}</td></tr>
    </table>
  </td>
  <td valign="top">
    <p style="margin:0 0 6px;font:800 17px/24px ${F};color:${BRAND.ink}">${esc(o.title)}
      <span style="display:inline-block;margin-left:6px;padding:2px 9px;border-radius:999px;background:${BRAND.navy};color:${BRAND.white};font:700 10px/16px ${F};letter-spacing:.05em;vertical-align:2px">${esc(o.tag)}</span></p>
    <table role="presentation" cellpadding="0" cellspacing="0">${lines}</table>
  </td>
</tr></table>`,
    0,
  );
}

/** A titled card of label/value rows, with optional trusted HTML underneath (e.g. pill buttons). */
export function infoCard(title: string, rows: [label: string, value: string][], footer = ''): string {
  const body = rows
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:9px 14px 9px 0;width:104px;vertical-align:top;font:600 13px/20px ${F};color:${BRAND.muted};${i ? `border-top:1px solid ${BRAND.line}` : ''}">${esc(k)}</td>` +
        `<td style="padding:9px 0;vertical-align:top;font:700 14px/20px ${F};color:${BRAND.ink};white-space:pre-line;${i ? `border-top:1px solid ${BRAND.line}` : ''}">${esc(v)}</td></tr>`,
    )
    .join('');
  return card(
    label(title) + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>` + (footer ? `<div style="margin-top:4px">${footer}</div>` : ''),
  );
}

/** Numbered steps with small red circles. `items` may contain trusted HTML. */
export function stepList(title: string, items: string[]): string {
  const rows = items
    .map(
      (html, i) =>
        `<tr><td width="34" valign="top" style="padding:6px 0"><span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:${BRAND.red};color:${BRAND.white};font:800 11px/22px ${F};text-align:center">${i + 1}</span></td>` +
        `<td valign="top" style="padding:7px 0 6px;font:500 14px/21px ${F};color:${BRAND.ink}">${html}</td></tr>`,
    )
    .join('');
  return label(title, 26) + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}

/** Three-stage tracker; stages up to `done` (1-based) are ticked. */
export function progressTracker(stages: [string, string, string], done: number): string {
  const cell = (text: string, i: number) => {
    const on = i < done;
    const dot = on
      ? `<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${BRAND.green};color:${BRAND.white};font:800 13px/26px ${F}">&#10003;</span>`
      : `<span style="display:inline-block;width:22px;height:22px;border-radius:50%;border:2px solid ${BRAND.line};background:${BRAND.white};color:${BRAND.muted};font:800 11px/22px ${F}">${i + 1}</span>`;
    return `<td width="33%" align="center" valign="top" style="padding:0 4px">${dot}<p style="margin:7px 0 0;font:${on ? 800 : 600} 12px/16px ${F};color:${on ? BRAND.ink : BRAND.muted}">${esc(text)}</p></td>`;
  };
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;border-radius:16px;background:${BRAND.paper};border:1px solid ${BRAND.line}"><tr><td style="padding:16px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${stages.map(cell).join('')}</tr></table></td></tr></table>`;
}

/** A quoted note (e.g. the learner's message). `html` is trusted. */
export function noteBox(title: string, html: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0"><tr><td style="padding:14px 18px;border-radius:14px;background:${BRAND.white};border:1px solid ${BRAND.line};border-left:4px solid ${BRAND.red}">
  <p style="margin:0 0 4px;font:800 11px ${F};letter-spacing:.14em;text-transform:uppercase;color:${BRAND.red}">${esc(title)}</p>
  <p style="margin:0;font:500 14px/21px ${F};color:${BRAND.ink};white-space:pre-line">${html}</p></td></tr></table>`;
}

/** Navy call-to-action card with a line of text and pill buttons. `html` is trusted. */
export function helpCard(title: string, html: string, buttons: EmailButton[]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;border-radius:16px;background:${BRAND.navy}"><tr><td style="padding:20px 22px">
  <p style="margin:0;font:800 16px/22px ${F};color:${BRAND.white}">${esc(title)}</p>
  <p style="margin:4px 0 0;font:500 14px/21px ${F};color:${BRAND.soft}">${html}</p>
  ${pillButtons(buttons)}</td></tr></table>`;
}

/** Small muted line of text. `html` is trusted. */
export const smallPrint = (html: string): string => `<p style="margin:22px 0 0;font:500 12px/18px ${F};color:${BRAND.muted}">${html}</p>`;
