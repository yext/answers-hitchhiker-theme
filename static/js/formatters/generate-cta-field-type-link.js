import CtaFormatter from '@yext/cta-formatter';

/**
 * @param {{link: string, linkType: string}} cta the Calls To Action field object
 * @returns {string} The formatted url associated with the Call to Action object if the cta object exists, null otherwise
 */
export function generateCTAFieldTypeLink(cta) {
  if (!cta) {
    return null;
  }
  const normalizedCTA = {
    ...cta,
    linkType: normalizeCtaLinkType(cta.linkType)
  }
  return CtaFormatter.generateCTAFieldTypeLink(normalizedCTA);
}

// These translations were taken from the schema for the "Calls To Action" built-in field type
const phoneTranslations = {
  cs: 'Telefon',
  da: 'Telefonnummer',
  de: 'Telefon',
  en: 'Phone',
  es: 'teléfono',
  et: 'Telefon',
  fi: 'Puhelin',
  fr: 'Numéro de téléphone',
  hr: 'Telefon',
  hu: 'Telefonszám',
  it: 'Telefono',
  ja: '電話番号',
  lt: 'Telefonas',
  lv: 'Tālruņa numurs',
  nb: 'Telefon',
  nl: 'Telefoonnummer',
  pl: 'Telefon',
  pt: 'Telefone',
  ro: 'Telefon',
  sk: 'Telefón',
  sv: 'Telefon',
  tr: 'Telefon',
  zh: '电话',
  zh_TW: 'Phone'
};

const emailTranslations = {
  cs: 'E-mail',
  da: 'E-mailadresse',
  de: 'E-Mail',
  en: 'Email',
  es: 'Correo electrónico',
  et: 'E-post',
  fi: 'Sähköposti',
  fr: 'Email',
  hr: 'Email',
  hu: 'E-mail-cím',
  it: 'E-mail',
  ja: 'Eメール',
  lt: 'El. paštas',
  lv: 'E-pasts',
  nb: 'E-post',
  nl: 'E-mail',
  pl: 'E-mail',
  pt: 'E-mail',
  ro: 'E-mail',
  sk: 'E-mail',
  sv: 'E-post',
  tr: 'E-posta',
  zh: '电子邮件',
  zh_TW: 'Email'
}

/**
 * Normalizes a CTA's linkType to an enum by translating it to english,
 * so it can be used by the @yext/cta-formatter library.
 * 
 * @param {string} linkType 
 * @returns {string}
 */
function normalizeCtaLinkType(linkType) {
  if (isLinkTypeInTranslations(linkType, Object.values(emailTranslations))) {
    return 'Email';
  } else if (isLinkTypeInTranslations(linkType, Object.values(phoneTranslations))) {
    return 'Phone'
  }
  return linkType;
}

/**
 * Whether or not the given CTA linkType is included in a translations object's values.
 * 
 * @param {string} linkType 
 * @param {Array<string>} translations
 * @returns {boolean}
 */
function isLinkTypeInTranslations(linkType, translations) {
  return !!translations.find(translation => {
    return translation.toLowerCase() === linkType.toLowerCase()
  });
}
