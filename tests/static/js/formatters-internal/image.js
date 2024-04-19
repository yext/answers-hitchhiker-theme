import Formatters from 'static/js/formatters.js';

describe('image formatter', () => {
  const photoUrl = 'https://a.mktgcdn.com/p/FOO/1024x768.jpg';
  const oldFileUrl = 'https://a.mktgcdn.com/f/0/FOO.jpg';
  const newFileUrl = 'https://a.mktgcdn.com/f/FOO.jpg';
  const euFileUrl = 'https://a.eu.mktgcdn.com/f/0/FOO.jpg';

  const photoImg = {
    url: photoUrl,
    width: 1024,
    height: 768,
  };

  const oldFileImg = {
    url: oldFileUrl,
    width: 1024,
    height: 768,
  };

  const newFileImg = {
    url: newFileUrl,
    width: 1024,
    height: 768,
  };

  const euFileImg = {
    url: euFileUrl,
    width: 1024,
    height: 768,
  }

  describe('when choosing the smallest image over threshold', () => {
    it('By default chooses the smallest image with width >= 200', () => {
      const photoImgUrl = Formatters.image(photoImg).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=200,fit=cover');
      const oldFileImgUrl = Formatters.image(oldFileImg).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=200,fit=cover');
      const newFileImgUrl = Formatters.image(newFileImg).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=200,fit=cover');
      const euFileImgUrl = Formatters.image(euFileImg).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=200,fit=cover');
    });

    it('Can restrict the dimensions by width', () => {
      const photoImgUrl = Formatters.image(photoImg, '601x').url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=601,fit=cover');
      const oldFileImgUrl = Formatters.image(oldFileImg, '601x').url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=601,fit=cover');
      const newFileImgUrl = Formatters.image(newFileImg, '601x').url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=601,fit=cover');
      const euFileImgUrl = Formatters.image(euFileImg, '601x').url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,fit=cover');
    });

    it('Can restrict the dimensions by height', () => {
      const photoImgUrl = Formatters.image(photoImg, 'x338').url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/height=338,fit=cover');
      const oldFileImgUrl = Formatters.image(oldFileImg, 'x338').url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/height=338,fit=cover');
      const newFileImgUrl = Formatters.image(newFileImg, 'x338').url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/height=338,fit=cover');
      const euFileImgUrl = Formatters.image(euFileImg, 'x338').url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/height=338,fit=cover');
    });

    it('Can restrict by both dimensions', () => {
      const photoImgUrl = Formatters.image(photoImg, '601x338').url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=601,height=338,fit=cover');
      const oldFileImgUrl = Formatters.image(oldFileImg, '601x338').url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=601,height=338,fit=cover');
      const newFileImgUrl = Formatters.image(newFileImg, '601x338').url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=601,height=338,fit=cover');
      const euFileImgUrl = Formatters.image(euFileImg, '601x338').url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,height=338,fit=cover');
    });

    it('returns the smallest image when no dimensions given', () => {
      const photoImgUrl = Formatters.image(photoImg, 'x').url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=cover');
      const oldFileImgUrl = Formatters.image(oldFileImg, 'x').url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=cover');
      const newFileImgUrl = Formatters.image(newFileImg, 'x').url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=cover');
      const euFileImgUrl = Formatters.image(euFileImg, 'x').url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=cover');
    });
  });

  describe('when choosing the biggest image under threshold', () => {
    it('Can restrict the dimensions by width', () => {
      const photoImgUrl = Formatters.image(photoImg, '601x', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=601,height=768,fit=contain');
      const oldFileImgUrl = Formatters.image(oldFileImg, '601x', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=601,height=768,fit=contain');
      const newFileImgUrl = Formatters.image(newFileImg, '601x', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=601,height=768,fit=contain');
      const euFileImgUrl = Formatters.image(euFileImg, '601x', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=601,height=768,fit=contain');
    });

    it('Can restrict the dimensions by height', () => {
      const photoImgUrl = Formatters.image(photoImg, 'x338', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=1024,height=338,fit=contain');
      const oldFileImgUrl = Formatters.image(oldFileImg, 'x338', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=1024,height=338,fit=contain');
      const newFileImgUrl = Formatters.image(newFileImg, 'x338', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=1024,height=338,fit=contain');
      const euFileImgUrl = Formatters.image(euFileImg, 'x338', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,height=338,fit=contain');
    });

    it('Can restrict by both dimensions', () => {
      const photoImgUrl = Formatters.image(photoImg, '999x338', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=999,height=338,fit=contain');
      const oldFileImgUrl = Formatters.image(oldFileImg, '999x338', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=999,height=338,fit=contain');
      const newFileImgUrl = Formatters.image(newFileImg, '999x338', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=999,height=338,fit=contain');
      const euFileImgUrl = Formatters.image(euFileImg, '999x338', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=999,height=338,fit=contain');
    });

    it('return the largest image when no dimensions given', () => {
      const photoImgUrl = Formatters.image(photoImg, 'x', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=1024,height=768,fit=contain');
      const oldFileImgUrl = Formatters.image(oldFileImg, 'x', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=1024,height=768,fit=contain');
      const newFileImgUrl = Formatters.image(newFileImg, 'x', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=1024,height=768,fit=contain');
      const euFileImgUrl = Formatters.image(euFileImg, 'x', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,height=768,fit=contain');
    });
  });

  describe('when image has no dimensions specified', () => {
    it('when choosing the biggest image under threshold, use the width and height on the image object if exists', () => {
      const photoImgUrl = Formatters.image({url: photoUrl, width: 1024}, 'x', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/width=1024,fit=contain');
      const oldFileImgUrl = Formatters.image({url: oldFileUrl, width: 1024}, 'x', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/width=1024,fit=contain');
      const newFileImgUrl = Formatters.image({url: newFileUrl, width: 1024}, 'x', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/width=1024,fit=contain');
      const euFileImgUrl = Formatters.image({url: euFileUrl, width: 1024}, 'x', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/width=1024,fit=contain');
    });

    it('when choosing the smallest image over threshold, omit width/height if can\'t parse it from the image object', () => {
      const photoImgUrl = Formatters.image({url: photoUrl}, 'x', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=cover');
      const oldFileImgUrl = Formatters.image({url: oldFileUrl}, 'x', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=cover');
      const newFileImgUrl = Formatters.image({url: newFileUrl}, 'x', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=cover');
      const euFileImgUrl = Formatters.image({url: euFileUrl}, 'x', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=cover');
    });
  });
});