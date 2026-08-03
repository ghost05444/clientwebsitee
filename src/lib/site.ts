/**
 * Single source of truth for client details, contact links and site metadata.
 * Change it here and it updates everywhere — header, footer, contact page,
 * enquiry form, structured data and sitemap.
 */

export const site = {
  name: "Krushnam Fire",
  legalName: "Krushnam Fire & Safety",
  tagline: "Industrial Safety & Fire Protection Equipment",
  description:
    "Supplier of certified industrial safety and fire protection equipment — helmets, eye and face protection, gloves, safety footwear, fall protection, respiratory protection and workplace safety systems.",

  /** Update to the live domain before launch (used for canonical URLs + sitemap). */
  url: "https://krushnamfire.in",

  email: "support@krushnamfire.in",

  /** E.164, digits only — used to build tel: and wa.me links. */
  phoneE164: "+919624200234",
  phoneDisplay: "+91 96242 00234",
  whatsappDigits: "919624200234",

  address: {
    street: "Vaghamshi Vadi, Vidi Road",
    city: "Anjar",
    district: "Kachchh",
    state: "Gujarat",
    country: "India",
    postalCode: "370110",
  },

  hours: "Mon – Sat: 9:30 – 19:00",

  social: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
} as const;

export const addressLines = [
  site.address.street,
  `${site.address.city}, ${site.address.district}`,
  `${site.address.state}, ${site.address.country}`,
] as const;

export const addressSingleLine = [
  site.address.street,
  site.address.city,
  site.address.district,
  site.address.state,
].join(", ");

/** tel: link for click-to-call. */
export const telHref = `tel:${site.phoneE164}`;

/** mailto: link. */
export const mailHref = `mailto:${site.email}`;

/**
 * Builds a wa.me deep link with a prefilled message.
 * Works on both mobile app and WhatsApp Web.
 */
export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${site.whatsappDigits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Prefilled enquiry message for a specific product. */
export function productEnquiryMessage(productName: string): string {
  return `Hi ${site.name}, I would like to enquire about "${productName}". Please share pricing and availability.`;
}

export const GENERAL_ENQUIRY_MESSAGE = `Hi ${site.name}, I would like to enquire about your safety products.`;

/** Google Maps embed + directions for the Anjar location. */
export const mapQuery = encodeURIComponent(
  `${site.address.street}, ${site.address.city}, ${site.address.district}, ${site.address.state} ${site.address.postalCode}`,
);
export const mapEmbedSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
export const mapDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;
