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
}