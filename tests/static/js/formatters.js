import Formatters from 'static/js/formatters.js';

describe('Formatters', () => {
  describe('toLocalizedDistance', () => {
    const profile = { d_distance: 100000 }; // Distance in meters
    const distanceKey = 'd_distance';

    it('Formats a distance in kilometers', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'km');
      expect(distance).toEqual('100.0 km');
    });

    it('Formats a distance in miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'mi');
      expect(distance).toEqual('62.1 mi');
    });

    it('Fallbacks to miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'unknown-unit');
      expect(distance).toEqual('62.1 mi');
    });

    it('Infer unit from document locale', () => {
      document.documentElement.lang = 'es';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('100.0 km');
    });
  })
});
