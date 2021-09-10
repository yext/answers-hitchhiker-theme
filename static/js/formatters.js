/**
 * The Formatters are a combination of the internal formatters like
 * directions/address formatting and the custom formatters defined by the user.
 * The custom formatters always take precedence if it exists in both internal and
 * custom formatters.
 */

import {
  address,
  phoneLink,
  phoneDisplay,
  nationalizedPhoneDisplay,
  emailLink,
  getDirectionsUrl,
  toLocalizedDistance,
  toKilometers,
  toMiles,
  isTodayHoliday,
  bigDate,
  betterTime,
  dateRange,
  snakeToTitle,
  prettyPrintObject,
  joinList,
  image,
  truncate,
  openStatus,
  hoursList,
  generateCTAFieldTypeLink,
  price,
  priceRange,
  highlightField,
  getYoutubeUrl,
  getUrlWithTextHighlight,
  getCategoryNames
} from './formatters-internal.js';
import * as CustomFormatters from './formatters-custom.js';

/**
 * Contains some of the commonly used formatters for parsing pieces of profile
 * information. To remove a formatter from the bundle, comment the desired
 * line below.
 */
let Formatters = {
  address,
  phoneLink,
  phoneDisplay,
  nationalizedPhoneDisplay,
  emailLink,
  getDirectionsUrl,
  toLocalizedDistance,
  toKilometers,
  toMiles,
  isTodayHoliday,
  bigDate,
  betterTime,
  dateRange,
  snakeToTitle,
  prettyPrintObject,
  joinList,
  image,
  truncate,
  openStatus,
  hoursList,
  generateCTAFieldTypeLink,
  price,
  priceRange,
  highlightField,
  getYoutubeUrl,
  getUrlWithTextHighlight,
  getCategoryNames
};
Formatters = Object.assign(Formatters, CustomFormatters);

export { Formatters as default };
