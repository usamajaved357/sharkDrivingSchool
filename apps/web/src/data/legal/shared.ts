/** Building blocks shared by the legal documents. */
import { legal, mailtoHref, site, telHref } from '@/config/site';

export const emailLink = `[${site.email}](${mailtoHref})`;
export const phoneLink = `[${site.phone.display}](${telHref})`;

/** "Shark Driving School" or "Shark Driving School (owned by X)" once the owner is filled in. */
export const businessName = legal.ownerName ? `${site.name}, a trading name of ${legal.ownerName}` : site.name;

/** Contact lines for the "Who we are" / "Contact us" sections, skipping details not yet filled in. */
export const contactItems: string[] = [
  `Email: ${emailLink}`,
  `Phone or WhatsApp: ${phoneLink}`,
  ...(legal.address ? [`Post: ${legal.address}`] : []),
  ...(legal.icoNumber ? [`ICO registration number: ${legal.icoNumber}`] : []),
];
