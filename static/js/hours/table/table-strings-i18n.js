import { TableHeaders } from '../constants';
import { parseLocale } from '../../utils';

export default function provideTableHeadersTranslation(locale) {
  const { language, modifier } = parseLocale(locale);
  const languageAndModifier =  modifier ? `${language}-${modifier}` : language;

  switch (languageAndModifier) {
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
    case 'ar':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'يوم من الأسبوع',
        [TableHeaders.HOURS]: 'ساعات'
      }
    case 'hi':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'सप्ताह का दिन',
        [TableHeaders.HOURS]: 'घंटे'
      }
    case 'ko':
      return {
        [TableHeaders.DAY_OF_WEEK]: '요일',
        [TableHeaders.HOURS]: '시간'
      }
    case 'nl':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'dag van de week',
        [TableHeaders.HOURS]: 'uur'
      }
    case 'pl':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Dzień tygodnia',
        [TableHeaders.HOURS]: 'godziny'
      }
    case 'pt':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Dia da semana',
        [TableHeaders.HOURS]: 'Horas'
      }
    case 'ru':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'День недели',
        [TableHeaders.HOURS]: 'Часы'
      }
    case 'sv':
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Veckodag',
        [TableHeaders.HOURS]: 'Timmar'
      }
    case 'zh-Hans':
      return {
        [TableHeaders.DAY_OF_WEEK]: '一周中的天',
        [TableHeaders.HOURS]: '小时'
      }
    case 'zh-Hant':
      return {
        [TableHeaders.DAY_OF_WEEK]: '一週中的天',
        [TableHeaders.HOURS]: '小時'
      }
    default:
      return {
        [TableHeaders.DAY_OF_WEEK]: 'Day of the Week',
        [TableHeaders.HOURS]: 'Hours'
      }
  }
}