/**
 * Provides translation data for the openStatus formatter.
 * @param {string} locale 
 */
export default function provideOpenStatusTranslation (locale) {
  return {
    ...provideTodaysMessageTranslation(locale),
    ...provideDayTranslation(locale)
  }
}

function provideTodaysMessageTranslation(locale) {
  switch (locale) {
    case 'fr':
    case 'fr-fr':
    case 'de':
    case 'de-de':
    case 'es':
    case 'es-es':
    case 'it':
    case 'it-it':
    default:
      return {
        'Closed': 'Closed',
        'Open 24 Hours': 'Open 24 Hours',
        'Opens at': 'Opens at',
        'Open Now': 'Open Now',
        'Closes at': 'Closes at',
      }
  }
}

function provideDayTranslation(locale) {
  switch (locale) {
    case 'fr':
    case 'fr-fr':
    case 'de':
    case 'de-de':
    case 'es':
    case 'es-es':
    case 'it':
    case 'it-it':
    default:
      return {
        'MONDAY': 'Monday',
        'TUESDAY': 'Tuesday',
        'WEDNESDAY': 'Wednesday',
        'THURSDAY': 'Thursday',
        'FRIDAY': 'Friday',
        'SATURDAY': 'Saturday',
        'SUNDAY': 'Sunday',
      }
  }
}