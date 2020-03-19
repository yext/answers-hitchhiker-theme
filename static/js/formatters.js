/**
 * Contains some of the commonly used formatters for parsing pieces
 * of profile information.
 */
export default class Formatters {
    static phoneLink(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `tel:${profile[key]}`;
    }

    static phoneDisplay(profile, key = 'mainPhone') {
        if (!profile[key]) {
            return '';
        }
        return `${profile[key]}`;
    }

    static emailLink(profile) {
        return profile.emails ? "mailto:" + profile.emails[0] : ''
    }

    static getDirectionsUrl(profile, key = 'address') {
        const addr = profile[key];
        if (!addr) {
          return '';
        }

        const line2 = addr.line2 ? ` ${addr.line2},` : ``;
        const rawQuery = `${addr.line1},${line2} ${addr.city},${addr.region} ${addr.postalCode} ${addr.countryCode}`;
        const query = encodeURIComponent(rawQuery);
        return `https://www.google.com/maps/search/?api=1&query=${query}&output=classic`
    }
}