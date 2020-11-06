import { DayNames } from './hours/constants.js';

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
        'Closed': 'Fermé',
        'Open 24 Hours': 'Ouvert 24h/24',
        'Opens at': 'Ouvre à',
        'Open Now': 'Ouvert maintenant',
        'Closes at': 'Ferme à',
      }
    case 'de':
      return {
        'Closed': 'Geschlossen',
        'Open 24 Hours': '24 Stunden geöffnet',
        'Opens at': 'Öffnet um',
        'Open Now': 'Jetzt geöffnet',
        'Closes at': 'Schließt um',
      }
    case 'es':
      return {
        'Closed': 'Cerrado',
        'Open 24 Hours': 'Abierto las 24 horas',
        'Opens at': 'Abre a las',
        'Open Now': 'Abierto ahora',
        'Closes at': 'Cierra a las',
      }
    case 'it':
      return {
        'Closed': 'Chiuso',
        'Open 24 Hours': 'Aperto 24 ore su 24',
        'Opens at': 'Apre alle',
        'Open Now': 'Aperto ora',
        'Closes at': 'Chiude alle',
      }
    case 'ja':
      return {
        'Closed': '休業',
        'Open 24 Hours': '24時間営業',
        'Opens at': '営業開始',
        'Open Now': '現在営業中',
        'Closes at': '営業終了',
      }
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