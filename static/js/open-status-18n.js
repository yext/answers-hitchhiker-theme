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
        'MONDAY': 'Lundi',
        'TUESDAY': 'Mardi',
        'WEDNESDAY': 'Mercredi',
        'THURSDAY': 'Jeudi',
        'FRIDAY': 'Vendredi',
        'SATURDAY': 'Samedi',
        'SUNDAY': 'Dimanche',
      }
    case 'de':
      return {
        'MONDAY': 'Montag',
        'TUESDAY': 'Dienstag',
        'WEDNESDAY': 'Mittwoch',
        'THURSDAY': 'Donnerstag',
        'FRIDAY': 'Freitag',
        'SATURDAY': 'Samstag',
        'SUNDAY': 'Sonntag',
      }
    case 'es':
      return {
        'MONDAY': 'Lunes',
        'TUESDAY': 'Martes',
        'WEDNESDAY': 'Miércoles',
        'THURSDAY': 'Jueves',
        'FRIDAY': 'Viernes',
        'SATURDAY': 'Sabado',
        'SUNDAY': 'Domingo',
      }
    case 'it':
      return {
        'MONDAY': 'Lunedí',
        'TUESDAY': 'Martedí',
        'WEDNESDAY': 'Mercoledí',
        'THURSDAY': 'Giovedí',
        'FRIDAY': 'Venerdí',
        'SATURDAY': 'Sabato',
        'SUNDAY': 'Domenica',
      }
    case 'ja': 
      return {
        'MONDAY': '月曜日',
        'TUESDAY': '火曜日',
        'WEDNESDAY': '水曜日',
        'THURSDAY': '木曜日',
        'FRIDAY': '金曜日',
        'SATURDAY': '土曜日',
        'SUNDAY': '日曜日',
      }
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