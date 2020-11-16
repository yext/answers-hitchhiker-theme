import Formatters from 'static/js/formatters.js';

describe('image formatter', () => {
  const img = {
    url: 'https://a.mktgcdn.com/p/1024x768.jpg',
    width: 1024,
    height: 768,
    thumbnails: [
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
        url: 'https://a.mktgcdn.com/p/196x110.jpg',
        width: 196,
        height: 110
      }
    ]
  }

  describe('when choosing the smallest image at least as large as', () => {
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

    it('return "" when no image fits the dimensions', () => {
      const imageUrl = Formatters.image(img, '99999x99999').url;
      expect(imageUrl).toEqual('');
    });
  });

  describe('when choosing the biggest image at most as large as', () => {
    it('Can restrict the dimensions by width', () => {
      const imageUrl = Formatters.image(img, '601x', false).url;
      expect(imageUrl).toEqual('https://a.mktgcdn.com/p/600x337.jpg');
    });

    it('Can restrict the dimensions by height', () => {
      const imageUrl = Formatters.image(img, 'x338', false).url;
      expect(imageUrl).toEqual('https://a.mktgcdn.com/p/600x337.jpg');
    });

    it('returns "" when no image fits the dimensions', () => {
      const imageUrl = Formatters.image(img, '-1x-1', false).url;
      expect(imageUrl).toEqual('');
    });
  });
});