import Formatters from 'static/js/formatters.js';

describe('image formatter', () => {
  const img = {
    url: 'https://a.mktgcdn.com/p/1024x768.jpg'
  }

  describe('when choosing the smallest image over threshold', () => {
    it('By default chooses the smallest image with width >= 200', () => {
      const imageUrl = Formatters.image(img).url;
      expect(imageUrl).toEqual('https://dynl.mktgcdn.com/p/200x1.jpg');
    });

    it('Can restrict the dimensions by width', () => {
      const imageUrl = Formatters.image(img, '601x').url;
      expect(imageUrl).toEqual('https://dynl.mktgcdn.com/p/601x1.jpg');
    });

    it('Can restrict the dimensions by height', () => {
      const imageUrl = Formatters.image(img, 'x338').url;
      expect(imageUrl).toEqual('https://dynl.mktgcdn.com/p/1x338.jpg');
    });

    it('Can restrict by both dimensions', () => {
      const imageUrl = Formatters.image(img, '601x338').url;
      expect(imageUrl).toEqual('https://dynl.mktgcdn.com/p/601x338.jpg');
    });

    it('returns the smallest image when no dimensions given', () => {
      const imageUrl = Formatters.image(img, 'x').url;
      expect(imageUrl).toEqual('https://dynl.mktgcdn.com/p/1x1.jpg');
    });
  });

  describe('when choosing the biggest image under threshold', () => {
    it('Can restrict the dimensions by width', () => {
      const imageUrl = Formatters.image(img, '601x', false).url;
      expect(imageUrl).toEqual('https://dynm.mktgcdn.com/p/601x768.jpg');
    });

    it('Can restrict the dimensions by height', () => {
      const imageUrl = Formatters.image(img, 'x338', false).url;
      expect(imageUrl).toEqual('https://dynm.mktgcdn.com/p/1024x338.jpg');
    });

    it('Can restrict by both dimensions', () => {
      const imageUrl = Formatters.image(img, '999x338', false).url;
      expect(imageUrl).toEqual('https://dynm.mktgcdn.com/p/999x338.jpg');
    });

    it('return the largest image when no dimensions given', () => {
      const imageUrl = Formatters.image(img, 'x', false).url;
      expect(imageUrl).toEqual('https://dynm.mktgcdn.com/p/1024x768.jpg');
    });
  });
});