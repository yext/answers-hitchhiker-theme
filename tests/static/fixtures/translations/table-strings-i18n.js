
import { TableHeaders } from '../constants';
import { getLanguageFromLocale } from '../../utils';

export default function provideTableHeadersTranslation(locale) {
  const language = getLanguageFromLocale(locale);
  switch (language) {
    case 'es':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Día de la semana',
        [TableHeaders.HOURS]: 'Horarios',
      }
    default:
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Day of the Week',
        [TableHeaders.HOURS]: 'Hours',
      }
  }
}
