import { TableHeaders } from '../constants';

export default function provideTableHeadersTranslation(locale) {
  const language = locale.substring(0, 2);
  switch (language) {
    case 'fr':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Jour de la semaine',
        [TableHeaders.HOURS]: 'Horaires'
      }
    case 'de':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Wochentag',
        [TableHeaders.HOURS]: 'Zeiten'
      }
    case 'es':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Día de la semana',
        [TableHeaders.HOURS]: 'Horarios'
      }
    case 'it':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Giorno della settimana',
        [TableHeaders.HOURS]: 'Orari'
      }
    case 'ja':
      return {
        [TableHeaders.DAY_OF_WEEK]: '曜日',
        [TableHeaders.HOURS]: '営業時間'
      }
    default:
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Day of the Week',
        [TableHeaders.HOURS]: 'Hours'
      }
  }
}