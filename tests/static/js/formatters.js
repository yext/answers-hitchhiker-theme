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

    it('Correctly formats distance for French display', () => {
      document.documentElement.lang = 'fr';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10 000,0 km');
    });

    it('Correctly formats distance for Spanish display', () => {
      document.documentElement.lang = 'es';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for Italian display', () => {
      document.documentElement.lang = 'it';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for German display', () => {
      document.documentElement.lang = 'de';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for Japan display', () => {
      document.documentElement.lang = 'ja';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10,000.0 km');
    });
  })

  describe('image formatter', () => {
    const img = {
      url: 'https://a.mktgcdn.com/p/6190x3480.jpg',
      width: 6190,
      height: 3480,
      thumbnails: [
        {
          url: 'https://a.mktgcdn.com/p/6190x3480.jpg',
          width: 6190,
          height: 3480
        },
        {
          url: 'https://a.mktgcdn.com/p/619x348.jpg',
          width: 619,
          height: 348
        },
        {
          url: 'https://a.mktgcdn.com/p/600x337.jpg',
          width: 600,
          height: 337
        },
        {
          url: 'https://a.mktgcdn.com/p/6000x3370.jpg',
          width: 6000,
          height: 3370
        },
      ]
    }

    it('By default chooses the smallest image with width >= 200', () => {
      const imageUrl = Formatters.image(img).url;
      expect(imageUrl).toEqual('https://a.mktgcdn.com/p/600x337.jpg');
    });

    it('Can restrict the dimensions by width', () => {
      const imageUrl = Formatters.image(img, '601x').url;
      expect(imageUrl).toEqual('https://a.mktgcdn.com/p/619x348.jpg');
    });

    it('Can restrict the dimensions by height', () => {
      const imageUrl = Formatters.image(img, 'x338').url;
      expect(imageUrl).toEqual('https://a.mktgcdn.com/p/619x348.jpg');
    });
  });
});
