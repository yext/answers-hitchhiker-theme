import CtaFormatter from '@yext/cta-formatter';

/**
 * @param {Object} cta Call To Action field type
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

/**
 * Normalizes a CTA's linkType to an enum by translating it to english,
 * so it can be used by the @yext/cta-formatter library.
 * 
 * @param {string} linkType 
 * @returns {string}
 */
function normalizeCtaLinkType(linkType) {
  if (isTranslationForEmail(linkType)) {
    return 'Email';
  } else if (isTranslationForPhone(linkType)) {
    return 'Phone'
  }
  return linkType;
}

// These translations were taken from the schema for the "Calls To Action" built-in field type
// http://cms-app05.nj1.yext.com:17952/testy?endpoint=composeAbstractSchema&proto=business_id%3A%203343086%0A
const localeToPhoneTranslation = {
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

/**
 * Whether or not the given CTA linkType is a translation for "Phone".
 * 
 * @param {string} linkType 
 * @returns {boolean}
 */
function isTranslationForPhone(linkType) {
  return !!Object.values(localeToPhoneTranslation).find(translation => {
    return translation.toLowerCase() === linkType.toLowerCase()
  });
}

const localeToEmailTranslation = {
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
 * Whether or not the given CTA linkType is a translation for "Email".
 * 
 * @param {string} linkType 
 * @returns {boolean}
 */
function isTranslationForEmail(linkType) {
  return !!Object.values(localeToEmailTranslation).find(translation => {
    return translation.toLowerCase() === linkType.toLowerCase()
  });
}