import { DayNames } from './hours/constants.js';
import { OpenStatusStrings } from './hours/open-status/constants.js';

/**
 * Provides translation data for the openStatus formatter.
 * @param {string} locale
 */
export default function provideOpenStatusTranslation (locale) {
  const language = locale.substring(0,2);
  return {
    ...provideTodaysMessageTranslation(language),
    ...provideDayTranslation(language)
  }
}

function provideTodaysMessageTranslation(language) {
  switch (language) {
    case 'fr':
      return {
        [OpenStatusStrings.CLOSED]: 'Fermé',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Ouvert 24h/24',
        [OpenStatusStrings.OPENS_AT]: 'Ouvre à',
        [OpenStatusStrings.OPEN_NOW]: 'Ouvert maintenant',
        [OpenStatusStrings.CLOSES_AT]: 'Ferme à',
      }
    case 'de':
      return {
        [OpenStatusStrings.CLOSED]: 'Geschlossen',
        [OpenStatusStrings.OPEN_24_HOURS]: '24 Stunden geöffnet',
        [OpenStatusStrings.OPENS_AT]: 'Öffnet um',
        [OpenStatusStrings.OPEN_NOW]: 'Jetzt geöffnet',
        [OpenStatusStrings.CLOSES_AT]: 'Schließt um',
      }
    case 'es':
      return {
        [OpenStatusStrings.CLOSED]: 'Cerrado',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Abierto las 24 horas',
        [OpenStatusStrings.OPENS_AT]: 'Abre a las',
        [OpenStatusStrings.OPEN_NOW]: 'Abierto ahora',
        [OpenStatusStrings.CLOSES_AT]: 'Cierra a las',
      }
    case 'it':
      return {
        [OpenStatusStrings.CLOSED]: 'Chiuso',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Aperto 24 ore su 24',
        [OpenStatusStrings.OPENS_AT]: 'Apre alle',
        [OpenStatusStrings.OPEN_NOW]: 'Aperto ora',
        [OpenStatusStrings.CLOSES_AT]: 'Chiude alle',
      }
    case 'ja':
      return {
        [OpenStatusStrings.CLOSED]: '休業',
        [OpenStatusStrings.OPEN_24_HOURS]: '24時間営業',
        [OpenStatusStrings.OPENS_AT]: '営業開始',
        [OpenStatusStrings.OPEN_NOW]: '現在営業中',
        [OpenStatusStrings.CLOSES_AT]: '営業終了',
      }
    default:
      return {
        [OpenStatusStrings.CLOSED]: 'Closed',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Open 24 Hours',
        [OpenStatusStrings.OPENS_AT]: 'Opens at',
        [OpenStatusStrings.OPEN_NOW]: 'Open Now',
        [OpenStatusStrings.CLOSES_AT]: 'Closes at',
      }
  }
}

function provideDayTranslation(language) {
  switch (language) {
    case 'fr':
      return {
        [DayNames.MONDAY]: 'Lundi',
        [DayNames.TUESDAY]: 'Mardi',
        [DayNames.WEDNESDAY]: 'Mercredi',
        [DayNames.THURSDAY]: 'Jeudi',
        [DayNames.FRIDAY]: 'Vendredi',
        [DayNames.SATURDAY]: 'Samedi',
        [DayNames.SUNDAY]: 'Dimanche',
      }
    case 'de':
      return {
        [DayNames.MONDAY]: 'Montag',
        [DayNames.TUESDAY]: 'Dienstag',
        [DayNames.WEDNESDAY]: 'Mittwoch',
        [DayNames.THURSDAY]: 'Donnerstag',
        [DayNames.FRIDAY]: 'Freitag',
        [DayNames.SATURDAY]: 'Samstag',
        [DayNames.SUNDAY]: 'Sonntag',
      }
    case 'es':
      return {
        [DayNames.MONDAY]: 'Lunes',
        [DayNames.TUESDAY]: 'Martes',
        [DayNames.WEDNESDAY]: 'Miércoles',
        [DayNames.THURSDAY]: 'Jueves',
        [DayNames.FRIDAY]: 'Viernes',
        [DayNames.SATURDAY]: 'Sabado',
        [DayNames.SUNDAY]: 'Domingo',
      }
    case 'it':
      return {
        [DayNames.MONDAY]: 'Lunedí',
        [DayNames.TUESDAY]: 'Martedí',
        [DayNames.WEDNESDAY]: 'Mercoledí',
        [DayNames.THURSDAY]: 'Giovedí',
        [DayNames.FRIDAY]: 'Venerdí',
        [DayNames.SATURDAY]: 'Sabato',
        [DayNames.SUNDAY]: 'Domenica',
      }
    case 'ja':
      return {
        [DayNames.MONDAY]: '月曜日',
        [DayNames.TUESDAY]: '火曜日',
        [DayNames.WEDNESDAY]: '水曜日',
        [DayNames.THURSDAY]: '木曜日',
        [DayNames.FRIDAY]: '金曜日',
        [DayNames.SATURDAY]: '土曜日',
        [DayNames.SUNDAY]: '日曜日',
      }
    default:
      return {
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