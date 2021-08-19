import { DayNames } from './hours/constants.js';
import { OpenStatusStrings } from './hours/open-status/constants.js';
import { parseLocale } from './utils';

/**
 * Provides translation data for the openStatus formatter.
 * @param {string} locale
 */
export default function provideOpenStatusTranslation (locale) {
  const { language, modifier }  = parseLocale(locale);
  const languageAndModifier =  modifier ? `${language}-${modifier}` : language;

  return {
    ...provideTodaysMessageTranslation(languageAndModifier),
    ...provideDayTranslation(languageAndModifier)
  }
}

function provideTodaysMessageTranslation(languageAndModifier) {
  switch (languageAndModifier) {
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
    case 'ar':
      return {
        [OpenStatusStrings.CLOSED]: 'مغلق',
        [OpenStatusStrings.OPEN_24_HOURS]: 'مفتوح على مدار 24 ساعة',
        [OpenStatusStrings.OPENS_AT]: 'يُفتح في',
        [OpenStatusStrings.OPEN_NOW]: 'مفتوح الآن',
        [OpenStatusStrings.CLOSES_AT]: 'يُغلق في',
      }
    case 'hi':
      return {
        [OpenStatusStrings.CLOSED]: 'बंद हो गया',
        [OpenStatusStrings.OPEN_24_HOURS]: '24 घंटे खुला रहता है',
        [OpenStatusStrings.OPENS_AT]: 'इस समय खुलता है',
        [OpenStatusStrings.OPEN_NOW]: 'अभी खुला है',
        [OpenStatusStrings.CLOSES_AT]: 'इस समय बंद होता है',
      }
    case 'ko':
      return {
        [OpenStatusStrings.CLOSED]: '닫힘',
        [OpenStatusStrings.OPEN_24_HOURS]: '24시간 영업',
        [OpenStatusStrings.OPENS_AT]: '개장 시간:',
        [OpenStatusStrings.OPEN_NOW]: 'अ지금 열기',
        [OpenStatusStrings.CLOSES_AT]: '종료 시간:',
      }
    case 'nl':
      return {
        [OpenStatusStrings.CLOSED]: 'Gesloten',
        [OpenStatusStrings.OPEN_24_HOURS]: '24 uur geopend',
        [OpenStatusStrings.OPENS_AT]: 'Geopend vanaf',
        [OpenStatusStrings.OPEN_NOW]: 'Nu geopend',
        [OpenStatusStrings.CLOSES_AT]: 'Gesloten vanaf',
      }
    case 'pl':
      return {
        [OpenStatusStrings.CLOSED]: 'Zamknięte',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Otwarte całodobowo',
        [OpenStatusStrings.OPENS_AT]: 'Zamknięcie',
        [OpenStatusStrings.OPEN_NOW]: 'Czynne teraz',
        [OpenStatusStrings.CLOSES_AT]: 'Otwarcie',
      }
    case 'pt':
      return {
        [OpenStatusStrings.CLOSED]: 'Fechado',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Aberto 24 horas',
        [OpenStatusStrings.OPENS_AT]: 'Abre às',
        [OpenStatusStrings.OPEN_NOW]: 'Aberto agora',
        [OpenStatusStrings.CLOSES_AT]: 'Fecha às',
      }
    case 'ru':
      return {
        [OpenStatusStrings.CLOSED]: 'Закрыто',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Открыто круглосуточно',
        [OpenStatusStrings.OPENS_AT]: 'Открывается в',
        [OpenStatusStrings.OPEN_NOW]: 'Открыто',
        [OpenStatusStrings.CLOSES_AT]: 'Закрывается в',
      }
    case 'sv':
      return {
        [OpenStatusStrings.CLOSED]: 'Stängt',
        [OpenStatusStrings.OPEN_24_HOURS]: 'Öppet 24 timmar om dygnet',
        [OpenStatusStrings.OPENS_AT]: 'Öppnar kl.',
        [OpenStatusStrings.OPEN_NOW]: 'Öppet nu',
        [OpenStatusStrings.CLOSES_AT]: 'Stänger kl.',
      }
    case 'zh-Hans':
      return {
        [OpenStatusStrings.CLOSED]: '休业中',
        [OpenStatusStrings.OPEN_24_HOURS]: '24 小时营业',
        [OpenStatusStrings.OPENS_AT]: '开店时间：',
        [OpenStatusStrings.OPEN_NOW]: '现正营业',
        [OpenStatusStrings.CLOSES_AT]: '闭店时间：',
      }
    case 'zh-Hant':
      return {
        [OpenStatusStrings.CLOSED]: '休息',
        [OpenStatusStrings.OPEN_24_HOURS]: '24 小時營業',
        [OpenStatusStrings.OPENS_AT]: '營業時間：',
        [OpenStatusStrings.OPEN_NOW]: '營業中',
        [OpenStatusStrings.CLOSES_AT]: '休息時間：',
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

function provideDayTranslation(languageAndModifier) {
  switch (languageAndModifier) {
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
    case 'ar':
      return {
        [DayNames.MONDAY]: 'الاثنين',
        [DayNames.TUESDAY]: 'يوم الثلاثاء',
        [DayNames.WEDNESDAY]: 'الأربعاء',
        [DayNames.THURSDAY]: 'يوم الخميس',
        [DayNames.FRIDAY]: 'يوم الجمعة',
        [DayNames.SATURDAY]: 'يوم السبت',
        [DayNames.SUNDAY]: 'يوم الأحد',
      }
    case 'hi':
      return {
        [DayNames.MONDAY]: 'सोमवार',
        [DayNames.TUESDAY]: 'मंगलवार',
        [DayNames.WEDNESDAY]: 'बुधवार',
        [DayNames.THURSDAY]: 'गुरुवार',
        [DayNames.FRIDAY]: 'शुक्रवार',
        [DayNames.SATURDAY]: 'शनिवार',
        [DayNames.SUNDAY]: 'रविवार का दिन',
      }
    case 'ko':
      return {
        [DayNames.MONDAY]: '월요일',
        [DayNames.TUESDAY]: '화요일',
        [DayNames.WEDNESDAY]: '수요일',
        [DayNames.THURSDAY]: '목요일',
        [DayNames.FRIDAY]: '금요일',
        [DayNames.SATURDAY]: '토요일',
        [DayNames.SUNDAY]: '일요일',
      }
    case 'nl':
      return {
        [DayNames.MONDAY]: 'Maandag',
        [DayNames.TUESDAY]: 'Dinsdag',
        [DayNames.WEDNESDAY]: 'Woensdag',
        [DayNames.THURSDAY]: 'Donderdag',
        [DayNames.FRIDAY]: 'Vrijdag',
        [DayNames.SATURDAY]: 'Zaterdag',
        [DayNames.SUNDAY]: 'Zondag',
      }
    case 'pl':
      return {
        [DayNames.MONDAY]: 'Poniedziałek',
        [DayNames.TUESDAY]: 'Wtorek',
        [DayNames.WEDNESDAY]: 'Środa',
        [DayNames.THURSDAY]: 'Czwartek',
        [DayNames.FRIDAY]: 'Piątek',
        [DayNames.SATURDAY]: 'Sobota',
        [DayNames.SUNDAY]: 'Niedziela',
      }
    case 'pt':
      return {
        [DayNames.MONDAY]: 'Segunda-feira',
        [DayNames.TUESDAY]: 'Terça-feira',
        [DayNames.WEDNESDAY]: 'Quarta-feira',
        [DayNames.THURSDAY]: 'quinta-feira',
        [DayNames.FRIDAY]: 'Sexta-feira',
        [DayNames.SATURDAY]: 'Sábado',
        [DayNames.SUNDAY]: 'Domingo',
      }
    case 'ru':
      return {
        [DayNames.MONDAY]: 'понедельник',
        [DayNames.TUESDAY]: 'вторник',
        [DayNames.WEDNESDAY]: 'среда',
        [DayNames.THURSDAY]: 'четверг',
        [DayNames.FRIDAY]: 'Пятница',
        [DayNames.SATURDAY]: 'Суббота',
        [DayNames.SUNDAY]: 'Воскресенье',
      }
    case 'sv':
      return {
        [DayNames.MONDAY]: 'Måndag',
        [DayNames.TUESDAY]: 'Tisdag',
        [DayNames.WEDNESDAY]: 'Onsdag',
        [DayNames.THURSDAY]: 'Torsdag',
        [DayNames.FRIDAY]: 'Fredag',
        [DayNames.SATURDAY]: 'Lördag',
        [DayNames.SUNDAY]: 'Söndag',
      }
    case 'zh-Hans':
      return {
        [DayNames.MONDAY]: '周一',
        [DayNames.TUESDAY]: '周二',
        [DayNames.WEDNESDAY]: '周三',
        [DayNames.THURSDAY]: '周四',
        [DayNames.FRIDAY]: '星期五',
        [DayNames.SATURDAY]: '周六',
        [DayNames.SUNDAY]: '星期日',
      }
    case 'zh-Hant':
      return {
        [DayNames.MONDAY]: '週一',
        [DayNames.TUESDAY]: '週二',
        [DayNames.WEDNESDAY]: '週三',
        [DayNames.THURSDAY]: '週四',
        [DayNames.FRIDAY]: '星期五',
        [DayNames.SATURDAY]: '週六',
        [DayNames.SUNDAY]: '星期日',
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