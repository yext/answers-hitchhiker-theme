import Formatters from 'static/js/formatters.js';

describe('Formatters', () => {
  describe('toLocalizedDistance', () => {
    const profile = { d_distance: 10000000 }; // Distance in meters
    const distanceKey = 'd_distance';
    document.documentElement.lang = 'en';

    it('Formats a distance in kilometers', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'km');
      expect(distance).toEqual('10,000.0 km');
    });

    it('Formats a distance in miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'mi');
      expect(distance).toEqual('6,213.7 mi');
    });

    it('Fallbacks to miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'unknown-unit');
      expect(distance).toEqual('6,213.7 mi');
    });

    it('Corectly formats distance for French display', () => {
      document.documentElement.lang = 'fr';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10 000,0 km');
    });

    it('Corectly formats distance for Spanish display', () => {
      document.documentElement.lang = 'es';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Corectly formats distance for Italian display', () => {
      document.documentElement.lang = 'it';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Corectly formats distance for German display', () => {
      document.documentElement.lang = 'de';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Corectly formats distance for Japan display', () => {
      document.documentElement.lang = 'ja';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10,000.0 km');
    });
  })
});
