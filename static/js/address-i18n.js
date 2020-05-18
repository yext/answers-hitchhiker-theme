import { components__address__fields__postalCode } from './address-fields.js';
import { components__address__fields__city } from './address-fields.js';
import { components__address__fields__address2 } from './address-fields.js';
import { components__address__fields__country } from './address-fields.js';
import { components__address__fields__region } from './address-fields.js';
import { components__address__fields__address1 } from './address-fields.js';
import { components__address__fields__sublocality } from './address-fields.js';

// This file was automatically generated from templates/components/address/i18n.soy.
// Please don't edit this file by hand.

if (typeof components == 'undefined') { var components = {}; }
if (typeof components.address == 'undefined') { components.address = {}; }
if (typeof components.address.i18n == 'undefined') { components.address.i18n = {}; }

export function components__address__i18n__addressForCountry(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.profile.address.countryCode) {
    case 'AD':
    case 'AM':
    case 'AT':
    case 'AX':
    case 'AZ':
    case 'BA':
    case 'BY':
    case 'CY':
    case 'CZ':
    case 'DK':
    case 'DZ':
    case 'EC':
    case 'EH':
    case 'ET':
    case 'FI':
    case 'FR':
    case 'GE':
    case 'GF':
    case 'GI':
    case 'GP':
    case 'GW':
    case 'HT':
    case 'KE':
    case 'KV':
    case 'KW':
    case 'LA':
    case 'LU':
    case 'MC':
    case 'MD':
    case 'ME':
    case 'MG':
    case 'MK':
    case 'MQ':
    case 'MZ':
    case 'NC':
    case 'NL':
    case 'NO':
    case 'PL':
    case 'PT':
    case 'PY':
    case 'RE':
    case 'RS':
    case 'SA':
    case 'SE':
    case 'SJ':
    case 'SM':
    case 'SN':
    case 'TC':
    case 'TJ':
    case 'TM':
    case 'TN':
    case 'TZ':
    case 'UY':
    case 'VG':
    case 'ZM':
      output += components__address__i18n__ad(opt_data, opt_sb, opt_ijData);
      break;
    case 'AE':
    case 'GD':
    case 'HN':
    case 'KN':
    case 'LC':
    case 'PA':
    case 'SS':
    case 'SV':
      output += components__address__i18n__ae(opt_data, opt_sb, opt_ijData);
      break;
    case 'AF':
    case 'IR':
      output += components__address__i18n__af(opt_data, opt_sb, opt_ijData);
      break;
    case 'AG':
    case 'AO':
    case 'AW':
    case 'BJ':
    case 'BO':
    case 'BS':
    case 'BZ':
    case 'CI':
    case 'CW':
    case 'DJ':
    case 'FJ':
    case 'GA':
    case 'GH':
    case 'GM':
    case 'GY':
    case 'JM':
    case 'KI':
    case 'LY':
    case 'MW':
    case 'NA':
    case 'NR':
    case 'PS':
    case 'QA':
    case 'RW':
    case 'SC':
    case 'SR':
    case 'SX':
    case 'TG':
    case 'TT':
    case 'UG':
    case 'VU':
      output += components__address__i18n__ag(opt_data, opt_sb, opt_ijData);
      break;
    case 'AL':
    case 'EE':
    case 'IS':
      output += components__address__i18n__al(opt_data, opt_sb, opt_ijData);
      break;
    case 'AR':
      output += components__address__i18n__ar(opt_data, opt_sb, opt_ijData);
      break;
    case 'AS':
    case 'BB':
    case 'BD':
    case 'BM':
    case 'BN':
    case 'BT':
    case 'CR':
    case 'DO':
    case 'FK':
    case 'FM':
    case 'GR':
    case 'GU':
    case 'JO':
    case 'KZ':
    case 'LB':
    case 'LK':
    case 'LS':
    case 'MA':
    case 'MH':
    case 'MM':
    case 'MR':
    case 'MT':
    case 'MV':
    case 'NG':
    case 'PG':
    case 'PK':
    case 'PR':
    case 'RO':
    case 'SG':
    case 'VC':
    case 'WS':
      output += components__address__i18n__as(opt_data, opt_sb, opt_ijData);
      break;
    case 'AU':
    case 'CA':
    case 'SZ':
    case 'US':
    case 'VI':
      output += components__address__i18n__au(opt_data, opt_sb, opt_ijData);
      break;
    case 'BE':
    case 'PE':
      output += components__address__i18n__be(opt_data, opt_sb, opt_ijData);
      break;
    case 'BF':
    case 'BI':
    case 'BQ':
    case 'BW':
    case 'CF':
    case 'CG':
    case 'CM':
    case 'DM':
    case 'ER':
    case 'GQ':
    case 'KM':
    case 'ML':
    case 'SY':
    case 'TD':
    case 'ZW':
      output += components__address__i18n__bf(opt_data, opt_sb, opt_ijData);
      break;
    case 'BG':
      output += components__address__i18n__bg(opt_data, opt_sb, opt_ijData);
      break;
    case 'BH':
      output += components__address__i18n__bh(opt_data, opt_sb, opt_ijData);
      break;
    case 'BR':
      output += components__address__i18n__br(opt_data, opt_sb, opt_ijData);
      break;
    case 'CH':
    case 'DE':
    case 'GT':
    case 'IT':
    case 'LI':
    case 'MY':
    case 'NI':
    case 'OM':
    case 'SK':
    case 'VA':
      output += components__address__i18n__ch(opt_data, opt_sb, opt_ijData);
      break;
    case 'CL':
    case 'PF':
      output += components__address__i18n__cl(opt_data, opt_sb, opt_ijData);
      break;
    case 'CN':
      output += components__address__i18n__cn(opt_data, opt_sb, opt_ijData);
      break;
    case 'CO':
    case 'ID':
    case 'IQ':
    case 'KH':
    case 'MP':
    case 'NP':
    case 'PW':
    case 'UA':
      output += components__address__i18n__co(opt_data, opt_sb, opt_ijData);
      break;
    case 'EG':
      output += components__address__i18n__eg(opt_data, opt_sb, opt_ijData);
      break;
    case 'ES':
    case 'IL':
      output += components__address__i18n__es(opt_data, opt_sb, opt_ijData);
      break;
    case 'GB':
    case 'MN':
    case 'ZA':
      output += components__address__i18n__gb(opt_data, opt_sb, opt_ijData);
      break;
    case 'GG':
    case 'IM':
    case 'JE':
      output += components__address__i18n__gg(opt_data, opt_sb, opt_ijData);
      break;
    case 'GN':
      output += components__address__i18n__gn(opt_data, opt_sb, opt_ijData);
      break;
    case 'HK':
      output += components__address__i18n__hk(opt_data, opt_sb, opt_ijData);
      break;
    case 'HR':
      output += components__address__i18n__hr(opt_data, opt_sb, opt_ijData);
      break;
    case 'HU':
    case 'SI':
      output += components__address__i18n__hu(opt_data, opt_sb, opt_ijData);
      break;
    case 'IE':
      output += components__address__i18n__ie(opt_data, opt_sb, opt_ijData);
      break;
    case 'IN':
    case 'VE':
      output += components__address__i18n__in(opt_data, opt_sb, opt_ijData);
      break;
    case 'JP':
      output += components__address__i18n__jp(opt_data, opt_sb, opt_ijData);
      break;
    case 'KR':
      output += components__address__i18n__kr(opt_data, opt_sb, opt_ijData);
      break;
    case 'KY':
      output += components__address__i18n__ky(opt_data, opt_sb, opt_ijData);
      break;
    case 'LT':
      output += components__address__i18n__lt(opt_data, opt_sb, opt_ijData);
      break;
    case 'LV':
      output += components__address__i18n__lv(opt_data, opt_sb, opt_ijData);
      break;
    case 'MO':
      output += components__address__i18n__mo(opt_data, opt_sb, opt_ijData);
      break;
    case 'MU':
      output += components__address__i18n__mu(opt_data, opt_sb, opt_ijData);
      break;
    case 'MX':
      output += components__address__i18n__mx(opt_data, opt_sb, opt_ijData);
      break;
    case 'NE':
    case 'SD':
      output += components__address__i18n__ne(opt_data, opt_sb, opt_ijData);
      break;
    case 'NZ':
      output += components__address__i18n__nz(opt_data, opt_sb, opt_ijData);
      break;
    case 'PH':
    case 'TW':
    case 'VN':
      output += components__address__i18n__ph(opt_data, opt_sb, opt_ijData);
      break;
    case 'RU':
      output += components__address__i18n__ru(opt_data, opt_sb, opt_ijData);
      break;
    case 'SB':
    case 'SL':
    case 'ST':
    case 'TL':
    case 'TO':
    case 'TV':
      output += components__address__i18n__sb(opt_data, opt_sb, opt_ijData);
      break;
    case 'TH':
    case 'TR':
      output += components__address__i18n__th(opt_data, opt_sb, opt_ijData);
      break;
    case 'UZ':
      output += components__address__i18n__uz(opt_data, opt_sb, opt_ijData);
      break;
    default:
      output += components__address__i18n__au(opt_data, opt_sb, opt_ijData);
      break;
  }
  return output;
};

export function components__address__i18n__ad(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ae(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__af(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ag(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__al(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ar(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__as(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__au(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.city) || (opt_data.profile.address.region))) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__be(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.postalCode) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.city))) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__bf(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__bg(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__bh(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__br(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ch(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__cl(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__cn(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (((((opt_data.profile.address.region) || (opt_data.profile.address.city))) || (opt_data.profile.address.sublocality))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.sublocality))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.sublocality) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__co(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.city) || (opt_data.profile.address.region))) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__eg(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((((opt_data.profile.address.sublocality) || (opt_data.profile.address.city))) || (opt_data.profile.address.region))) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (((((opt_data.profile.address.city) || (opt_data.profile.address.region))) || (opt_data.profile.address.postalCode))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__es(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__gb(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.sublocality) || (opt_data.profile.address.city))) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__gg(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__gn(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (((((opt_data.profile.address.line1) || (opt_data.profile.address.line2))) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.line2) || (opt_data.profile.address.city))) {
          output += ' ';
        }
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__hk(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__hr(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__hu(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ie(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.city) || (opt_data.profile.address.region))) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__in(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__jp(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    case 'en':
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.line1) || (opt_data.profile.address.sublocality))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.sublocality) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
    default:
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((((opt_data.profile.address.region) || (opt_data.profile.address.city))) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.line1))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (((((opt_data.profile.address.city) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.line1))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.line1))) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.line1) {
          output += ' ';
        }
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__kr(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((((opt_data.profile.address.region) || (opt_data.profile.address.city))) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.line1))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (((((opt_data.profile.address.city) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.line1))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.line1))) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.line1) {
          output += ' ';
        }
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ky(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__lt(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((((opt_data.profile.address.city) || (opt_data.profile.address.sublocality))) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__lv(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__mo(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__mu(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__mx(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ne(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.region) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__nz(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ph(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.sublocality) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__ru(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.city) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.postalCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__sb(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.city) || (opt_data.profile.address.region))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.region) {
          output += '\x3Cyxt-comma\x3E,\x3C/yxt-comma\x3E';
          output += ' ';
        }
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__th(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.sublocality) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.sublocality) {
          output += components__address__fields__sublocality(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.postalCode) || (opt_data.profile.address.city))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.city) {
          output += ' ';
        }
        if (opt_data.profile.address.city) {
          output += components__address__fields__city(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};

export function components__address__i18n__uz(opt_data, opt_sb, opt_ijData) {
  var output = '';
  switch (opt_data.locale) {
    default:
      if (opt_data.profile.address.line1) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line1) {
          output += components__address__fields__address1(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.line2) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.line2) {
          output += components__address__fields__address2(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (((opt_data.profile.address.region) || (opt_data.profile.address.postalCode))) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.region) {
          output += components__address__fields__region(opt_data, opt_sb, opt_ijData);
        }
        if (opt_data.profile.address.postalCode) {
          output += ' ';
        }
        if (opt_data.profile.address.postalCode) {
          output += components__address__fields__postalCode(opt_data, opt_sb, opt_ijData);
        }
        output += ' ';
        output += '\x3C/div\x3E';
      }
      if (opt_data.profile.address.countryCode) {
        output += '\x3Cdiv class=c-AddressRow\x3E';
        if (opt_data.profile.address.countryCode) {
          output += components__address__fields__country(opt_data, opt_sb, opt_ijData);
        }
        output += '\x3C/div\x3E';
      }
      break;
  }
  return output;
};
