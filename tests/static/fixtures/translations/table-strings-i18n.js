
import { TableHeaders } from '../constants';
import { parseLocale } from '../../utils';

export default function provideTableHeadersTranslation(locale) {
  const { language, modifier } = parseLocale(locale);
  const writtenLanguage =  modifier ? `${language}-${modifier}` : language;
  switch (writtenLanguage) {
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
