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
      return {
        'Closed': 'Fermé',
        'Open 24 Hours': 'Ouvert 24h/24',
        'Opens at': 'Ouvre à',
        'Open Now': 'Ouvert maintenant',
        'Closes at': 'Ferme à',
      }
    case 'de':
    case 'de-de':
      return {
        'Closed': 'Geschlossen',
        'Open 24 Hours': '24 Stunden geöffnet',
        'Opens at': 'Öffnet um',
        'Open Now': 'Jetzt geöffnet',
        'Closes at': 'Schließt um',
      }
    case 'es':
    case 'es-es':
      return {
        'Closed': 'Cerrado',
        'Open 24 Hours': 'Abierto las 24 horas',
        'Opens at': 'Abre a las',
        'Open Now': 'Abierto ahora',
        'Closes at': 'Cierra a las',
      }
    case 'it':
    case 'it-it':
      return {
        'Closed': 'Chiuso',
        'Open 24 Hours': 'Aperto 24 ore su 24',
        'Opens at': 'Apre alle',
        'Open Now': 'Aperto ora',
        'Closes at': 'Chiude alle',
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

function provideDayTranslation(locale) {
  switch (locale) {
    case 'fr':
    case 'fr-fr':
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
    case 'de-de':
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
    case 'es-es':
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
    case 'it-it':
      return {
        'MONDAY': 'Lunedí',
        'TUESDAY': 'Martedí',
        'WEDNESDAY': 'Mercoledí',
        'THURSDAY': 'Giovedí',
        'FRIDAY': 'Venerdí',
        'SATURDAY': 'Sabato',
        'SUNDAY': 'Domenica',
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