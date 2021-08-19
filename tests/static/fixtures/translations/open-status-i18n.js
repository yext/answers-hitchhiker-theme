
import { DayNames } from './hours/constants.js';
import { OpenStatusStrings } from './hours/open-status/constants.js';
import { getLanguageFromLocale } from './utils';

export default function provideOpenStatusTranslation (locale) {
  const language = getLanguageFromLocale(locale);
  switch (language) {
    case 'es':
      return {
        [OpenStatusStrings.CLOSED]: 'Cerrado',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Abierto las 24 horas',
        [OpenStatusStrings.OPENS_AT]: 'Abre a las',
        [OpenStatusStrings.OPEN_NOW]: 'Abierto ahora',
        [OpenStatusStrings.CLOSES_AT]: 'Cierra a las',
        [DayNames.MONDAY]: 'Lunes',
        [DayNames.TUESDAY]: 'Martes',
        [DayNames.WEDNESDAY]: 'Miércoles',
        [DayNames.THURSDAY]: 'Jueves',
        [DayNames.FRIDAY]: 'Viernes',
        [DayNames.SATURDAY]: 'Sabado',
        [DayNames.SUNDAY]: 'Domingo',
      }
    default:
      return {
        [OpenStatusStrings.CLOSED]: 'Closed',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Open 24 Hours',
        [OpenStatusStrings.OPENS_AT]: 'Opens at',
        [OpenStatusStrings.OPEN_NOW]: 'Open Now',
        [OpenStatusStrings.CLOSES_AT]: 'Closes at',
        [DayNames.MONDAY]: 'Monday',
        [DayNames.TUESDAY]: 'Tuesday',
        [DayNames.WEDNESDAY]: 'Wednesday',
        [DayNames.THURSDAY]: 'Thursday',
        [DayNames.FRIDAY]: 'Friday',
        [DayNames.SATURDAY]: 'Saturday',
        [DayNames.SUNDAY]: 'Sunday',
      }
  }
}
