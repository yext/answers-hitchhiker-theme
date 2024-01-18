import Formatters from 'static/js/formatters.js';

describe('image formatter', () => {
  const usUrl = 'https://a.mktgcdn.com/p/1024x768.jpg';
  const euUrl = 'https://dyn.eu.mktgcdn.com/f/0/FOO.jpg';
  const usImg = {url: usUrl};
  const euImg = {
    url: euUrl,
    width: 1024,
    height: 768,
    sourceUrl: 'https://a.mktgcdn.com/p/FOO/1024x768.jpg',
  }

  describe('when choosing the smallest image over threshold', () => {
    it('By default chooses the smallest image with width >= 200', () => {
      const usImageUrl = Formatters.image(usImg).url;
      expect(usImageUrl).toEqual('https://dynl.mktgcdn.com/p/200x1.jpg');
      const euImageUrl = Formatters.image(euImg).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=200,fit=cover');
    });

    it('Can restrict the dimensions by width', () => {
      const usImageUrl = Formatters.image(usImg, '601x').url;
      expect(usImageUrl).toEqual('https://dynl.mktgcdn.com/p/601x1.jpg');
      const euImageUrl = Formatters.image(euImg, '601x').url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,fit=cover');
    });

    it('Can restrict the dimensions by height', () => {
      const usImageUrl = Formatters.image(usImg, 'x338').url;
      expect(usImageUrl).toEqual('https://dynl.mktgcdn.com/p/1x338.jpg');
      const euImageUrl = Formatters.image(euImg, 'x338').url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/height=338,fit=cover');
    });

    it('Can restrict by both dimensions', () => {
      const usImageUrl = Formatters.image(usImg, '601x338').url;
      expect(usImageUrl).toEqual('https://dynl.mktgcdn.com/p/601x338.jpg');
      const euImageUrl = Formatters.image(euImg, '601x338').url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,height=338,fit=cover');
    });

    it('returns the smallest image when no dimensions given', () => {
      const usImageUrl = Formatters.image(usImg, 'x').url;
      expect(usImageUrl).toEqual('https://dynl.mktgcdn.com/p/1x1.jpg');
      const euImageUrl = Formatters.image(euImg, 'x').url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=cover');
    });
  });

  describe('when choosing the biggest image under threshold', () => {
    it('Can restrict the dimensions by width', () => {
      const usImageUrl = Formatters.image(usImg, '601x', false).url;
      expect(usImageUrl).toEqual('https://dynm.mktgcdn.com/p/601x768.jpg');
      const euImageUrl = Formatters.image(euImg, '601x', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,height=768,fit=contain');
    });

    it('Can restrict the dimensions by height', () => {
      const usImageUrl = Formatters.image(usImg, 'x338', false).url;
      expect(usImageUrl).toEqual('https://dynm.mktgcdn.com/p/1024x338.jpg');
      const euImageUrl = Formatters.image(euImg, 'x338', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,height=338,fit=contain');
    });

    it('Can restrict by both dimensions', () => {
      const usImageUrl = Formatters.image(usImg, '999x338', false).url;
      expect(usImageUrl).toEqual('https://dynm.mktgcdn.com/p/999x338.jpg');
      const euImageUrl = Formatters.image(euImg, '999x338', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=999,height=338,fit=contain');
    });

    it('return the largest image when no dimensions given', () => {
      const usImageUrl = Formatters.image(usImg, 'x', false).url;
      expect(usImageUrl).toEqual('https://dynm.mktgcdn.com/p/1024x768.jpg');
      const euImageUrl = Formatters.image(euImg, 'x', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,height=768,fit=contain');
    });
  });

  describe('when image is served from EU with no dimensions specified', () => {
    it('when choosing the biggest image under threshold, use the width and height on the image object if exists', () => {
      const euImageUrl = Formatters.image(
        { url: euUrl,
          width: 1024,
          height: 768,
          sourceUrl: 'https://a.mktgcdn.com/p/FOO/516x384.jpg',
        }, 'x', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,height=768,fit=contain');
    });

    it('when choosing the biggest image under threshold, use dimensions from the sourceUrl if width/height does not exist', () => {
      const euImageUrl = Formatters.image(
        { url: euUrl,
          width: 1024,
          sourceUrl: 'https://a.mktgcdn.com/p/FOO/516x384.jpg'
        }, 'x', false).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=516,height=384,fit=contain');
    });

    it('when choosing the smallest image over threshold, omit width/height if can\'t parse it from the image object', () => {
      const euImageUrl = Formatters.image({url: euUrl}, 'x', true).url;
      expect(euImageUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=cover');
    });
  });
});