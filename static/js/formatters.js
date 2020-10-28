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
  generateCTAFieldTypeLink
} from './formatters-internal.js';

/**
 * Contains some of the commonly used formatters for parsing pieces of profile
 * information. To remove a formatter from the bundle, comment the desired
 * line below.
 */
const Formatters = {
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
  generateCTAFieldTypeLink
};

export { Formatters as default };
