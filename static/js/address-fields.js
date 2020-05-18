import { slugify as s } from 'underscore.string';

// Soy directives pulled from Pages

const slugify = (string) => {
  checktype(string, 'string');
  return s(string);
}

const nullSafe = (arg) => {
  return arg == null ? '' : arg;
}

const checktype = (thing, type = 'string') => {
  type = type.toLowerCase();
  let failed = false;
  switch (type) {
    case 'array': {
      failed = !Array.isArray(thing);
      break;
    }
    default: {
      failed = (typeof thing !== type) || (thing == null);
    }
  }
  if (failed) {
    throw new Error(`Object of type ${type} expected. Got ${typeof obj}.`);
  }
}

/*
 * Everything below this point was pulled from the fields.js file of Pages soy2js
 */

// This file was automatically generated from templates/components/address/fields.soy.
// Please don't edit this file by hand.

if (typeof components == 'undefined') { var components = {}; }
if (typeof components.address == 'undefined') { components.address = {}; }
if (typeof components.address.fields == 'undefined') { components.address.fields = {}; }

export function components__address__fields__address1(opt_data, opt_sb, opt_ijData) {
  var output = '';
  output += '\x3Cspan class=\"c-address-street-1\"\x3E';
  output += nullSafe(opt_data.profile.address.line1);
  output += '\x3C/span\x3E';
  return output;
};

export function components__address__fields__address2(opt_data, opt_sb, opt_ijData) {
  var output = '';
  output += '\x3Cspan class=\"c-address-street-2\"\x3E';
  output += nullSafe(opt_data.profile.address.line2);
  output += '\x3C/span\x3E';
  return output;
};

export function components__address__fields__sublocality(opt_data, opt_sb, opt_ijData) {
  var output = '';
  output += '\x3Cspan class=\"c-address-sublocality\"\x3E';
  output += nullSafe(opt_data.profile.address.sublocality);
  output += '\x3C/span\x3E';
  return output;
};

export function components__address__fields__city(opt_data, opt_sb, opt_ijData) {
  var output = '';
  output += '\x3Cspan class=\"c-address-city\"\x3E';
  output += nullSafe(opt_data.profile.address.city);
  output += '\x3C/span\x3E';
  return output;
};

export function components__address__fields__streetSchema(opt_data, opt_sb, opt_ijData) {
  var output = '';
  var address11 = opt_data.profile.address.line1;
  var address22 = opt_data.profile.address.line2;
  if (!(opt_data.hideSchema)) {
    output += '\x3Cmeta itemprop=\"streetAddress\" content=\"';
    output += nullSafe(address11);
    if (address22) {
      output += ' ';
      output += nullSafe(address22);
    }
    output += '\" /\x3E';
  }
  return output;
};

export function components__address__fields__localitySchema(opt_data, opt_sb, opt_ijData) {
  var output = '';
  var city3 = opt_data.profile.address.city;
  var sublocality4 = opt_data.profile.address.sublocality;
  if (!(opt_data.hideSchema)) {
    output += '\x3Cmeta itemprop=\"addressLocality\" content=\"';
    output += nullSafe(city3);
    if (((sublocality4) && (city3))) {
      output += ' ';
    }
    output += nullSafe(sublocality4);
    output += '\" /\x3E';
  }
  return output;
};

export function components__address__fields__region(opt_data, opt_sb, opt_ijData) {
  var output = '';
  var region5 = ((opt_data.profile.address.region) != null ? opt_data.profile.address.region : '');
  var regionName6 = (((opt_data.derivedData == null) ? null : (opt_data.derivedData.address == null) ? null : opt_data.derivedData.address.stateName) != null ? (opt_data.derivedData == null) ? null : (opt_data.derivedData.address == null) ? null : opt_data.derivedData.address.stateName : region5);
  var abbreviated7 = ((opt_data.regionAbbr) && (((region5) != (regionName6))));
  output += '\x3C';
  if (abbreviated7) {
    output += 'abbr title=\"';
    output += nullSafe(regionName6);
    output += '\" aria-label=\"';
    output += nullSafe(regionName6);
    output += '\"';
  } else {
    output += 'span';
  }
  output += ' ';
  output += 'class=\"c-address-state\" ';
  if (!(opt_data.hideSchema)) {
    output += 'itemprop=\"addressRegion\"';
  }
  output += '\x3E';
  output += nullSafe(((opt_data.regionAbbr) ?region5:regionName6));
  output += '\x3C/';
  output += nullSafe(((abbreviated7) ?'abbr':'span'));
  output += '\x3E';
  return output;
};

export function components__address__fields__postalCode(opt_data, opt_sb, opt_ijData) {
  var output = '';
  output += '\x3Cspan class=\"c-address-postal-code\" ';
  if (!(opt_data.hideSchema)) {
    output += 'itemprop=\"postalCode\"';
  }
  output += '\x3E';
  output += nullSafe(opt_data.profile.address.postalCode);
  output += '\x3C/span\x3E';
  return output;
};

export function components__address__fields__country(opt_data, opt_sb, opt_ijData) {
  var output = '';
  var country8 = opt_data.profile.address.countryCode;
  var countryName9 = (((opt_data.derivedData == null) ? null : (opt_data.derivedData.address == null) ? null : opt_data.derivedData.address.countryName) != null ? (opt_data.derivedData == null) ? null : (opt_data.derivedData.address == null) ? null : opt_data.derivedData.address.countryName : country8);
  output += '\x3C';
  if (((country8) != (countryName9))) {
    output += 'abbr title=\"';
    output += nullSafe(countryName9);
    output += '\" aria-label=\"';
    output += nullSafe(countryName9);
    output += '\"';
  } else {
    output += 'span';
  }
  output += ' ';
  output += 'class=\"c-address-country-name c-address-country-';
  output += slugify(nullSafe(country8));
  output += '\"';
  if (!(opt_data.hideSchema)) {
    output += ' ';
    output += 'itemprop=\"addressCountry\"';
  }
  output += '\x3E';
  output += nullSafe(country8);
  output += '\x3C/';
  output += nullSafe(((((country8) != (countryName9))) ?'abbr':'span'));
  output += '\x3E';
  return output;
};
