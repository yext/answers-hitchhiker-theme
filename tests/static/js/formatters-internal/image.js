import Formatters from 'static/js/formatters.js';

describe('image formatter', () => {
  const photoUrl = 'https://dynm.mktgcdn.com/p/FOO/2000x1000.jpg/';
  const photoWithPaddingUrl = 'https://dynm.mktgcdn.com/p/FOO/1.0000/2000x1000.jpg/';
  const oldFileUrl = 'https://a.mktgcdn.com/f/0/FOO.jpg';
  const newFileUrl = 'https://a.mktgcdn.com/f/FOO.jpg';
  const euFileUrl = 'https://a.eu.mktgcdn.com/f/0/FOO.jpg';

  const defaultSize = {width: 2000, height: 1000};

  const photoImg = {...defaultSize, url: photoUrl};
  const photoWithPaddingImg = {...defaultSize, url: photoWithPaddingUrl};
  const oldFileImg = {...defaultSize, url: oldFileUrl};
  const newFileImg = {...defaultSize, url: newFileUrl};
  const euFileImg = {...defaultSize, url: euFileUrl}

  describe('when both dimensions are specified and atLeastAsLarge is true', () => {
    it('atLeastAsLarge is default to true if not provided by caller', () => {
      const photoImgUrl = Formatters.image(photoImg, '1000x200').url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000,height=500');
      const photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '1000x200').url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000,height=500');
      const oldFileImgUrl = Formatters.image(oldFileImg, '200x500').url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=1000,height=500');
      const newFileImgUrl = Formatters.image(newFileImg, '3000x1000').url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000,height=1500');
      const euFileImgUrl = Formatters.image(euFileImg, '3000x4000').url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=8000,height=4000');
    });

    it('if can get original ratio, preserve ratio and cover the specified space', () => {
      const photoImgUrl = Formatters.image(photoImg, '1000x200', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000,height=500');
      const photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '1000x200', true).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000,height=500');
      const oldFileImgUrl = Formatters.image(oldFileImg, '200x500', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=1000,height=500');
      const newFileImgUrl = Formatters.image(newFileImg, '3000x1000', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000,height=1500');
      const euFileImgUrl = Formatters.image(euFileImg, '3000x4000', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=8000,height=4000');
    });

    it('if can\'t get original ratio, use desired dimensions', () => {
      const photoImgUrl = Formatters.image({url: photoUrl}, '1000x200', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000,height=200');
      const photoWithPaddingImgUrl = Formatters.image({url: photoWithPaddingUrl}, '1000x200', true).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000,height=200');
      const oldFileImgUrl = Formatters.image({url: oldFileUrl}, '200x500', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=200,height=500');
      const newFileImgUrl = Formatters.image({url: newFileUrl}, '3000x2000', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000,height=2000');
      const euFileImgUrl = Formatters.image({url: euFileUrl}, '3000x3000', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=3000,height=3000');
    });
  });

  describe('when both dimensions are specified and atLeastAsLarge is false', () => {
    it('if can get original ratio, preserve ratio and return the largest image within the space', () => {
      const photoImgUrl = Formatters.image(photoImg, '1000x200', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=400,height=200');
      const photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '1000x200', false).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=400,height=200');
      const oldFileImgUrl = Formatters.image(oldFileImg, '200x500', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=200,height=100');
      const newFileImgUrl = Formatters.image(newFileImg, '3000x1000', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=2000,height=1000');
      const euFileImgUrl = Formatters.image(euFileImg, '3000x4000', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=3000,height=1500');
    });

    it('if can\'t get original ratio, use desired dimensions', () => {
      const photoImgUrl = Formatters.image({url: photoUrl, width: 100}, '1000x200', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000,height=200');
      const photoWithPaddingImgUrl = Formatters.image({url: photoWithPaddingUrl, width: 0}, '1000x200', false).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000,height=200');
      const oldFileImgUrl = Formatters.image({url: oldFileUrl, width: undefined}, '200x500', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=200,height=500');
      const newFileImgUrl = Formatters.image({url: newFileUrl, height: 0}, '3000x2000', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000,height=2000');
      const euFileImgUrl = Formatters.image({url: euFileUrl, width: 0, height: 0}, '3000x3000', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=3000,height=3000');
    });
  });

  describe('when image has only one dimension specified', () => {
    it('can restrict the dimensions by width, regardless of atLeastAsLarge', () => {
      let photoImgUrl = Formatters.image(photoImg, '1000x', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000');
      let photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '1000x', false).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000');
      let oldFileImgUrl = Formatters.image(oldFileImg, '1000x', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=1000');
      let newFileImgUrl = Formatters.image(newFileImg, '3000x', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000');
      let euFileImgUrl = Formatters.image(euFileImg, '3000x', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=3000');

      photoImgUrl = Formatters.image(photoImg, '1000x', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=1000');
      photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '1000x', true).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=1000');
      oldFileImgUrl = Formatters.image(oldFileImg, '1000x', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=1000');
      newFileImgUrl = Formatters.image(newFileImg, '3000x', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=3000');
      euFileImgUrl = Formatters.image(euFileImg, '3000x', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=3000');
    });

    it('can restrict the dimensions by height, regardless of atLeastAsLarge', () => {
      let photoImgUrl = Formatters.image(photoImg, 'x500', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,height=500');
      let photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, 'x500', false).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,height=500');
      let oldFileImgUrl = Formatters.image(oldFileImg, 'x500', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,height=500');
      let newFileImgUrl = Formatters.image(newFileImg, 'x2000', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,height=2000');
      let euFileImgUrl = Formatters.image(euFileImg, 'x2000', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,height=2000');

      photoImgUrl = Formatters.image(photoImg, 'x500', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,height=500');
      photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, 'x500', true).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,height=500');
      oldFileImgUrl = Formatters.image(oldFileImg, 'x500', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,height=500');
      newFileImgUrl = Formatters.image(newFileImg, 'x2000', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,height=2000');
      euFileImgUrl = Formatters.image(euFileImg, 'x2000', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,height=2000');
    });
  });

  describe('when image has no dimensions specified', () => {
    it('by default chooses the smallest image with width >= 200', () => {
      const photoImgUrl = Formatters.image(photoImg).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain,width=200');
      const photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain,width=200');
      const oldFileImgUrl = Formatters.image(oldFileImg).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=200');
      const newFileImgUrl = Formatters.image(newFileImg).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain,width=200');
      const euFileImgUrl = Formatters.image(euFileImg).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain,width=200');
    });

    it('do not transform image regardless of atLeastAsLarge', () => {
      let photoImgUrl = Formatters.image(photoImg, 'x', false).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain');
      let photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, '0x0', false).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain');
      let oldFileImgUrl = Formatters.image(oldFileImg, '0x', false).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain');
      let newFileImgUrl = Formatters.image(newFileImg, 'x0', false).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain');
      let euFileImgUrl = Formatters.image(euFileImg, 'x', false).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain');

      photoImgUrl = Formatters.image(photoImg, 'x', true).url;
      expect(photoImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/fit=contain');
      photoWithPaddingImgUrl = Formatters.image(photoWithPaddingImg, 'x', true).url;
      expect(photoWithPaddingImgUrl).toEqual('https://dyn.mktgcdn.com/p/FOO/1.0000/fit=contain');
      oldFileImgUrl = Formatters.image(oldFileImg, 'x', true).url;
      expect(oldFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/0/FOO.jpg/fit=contain');
      newFileImgUrl = Formatters.image(newFileImg, 'x', true).url;
      expect(newFileImgUrl).toEqual('https://dyn.mktgcdn.com/f/FOO.jpg/fit=contain');
      euFileImgUrl = Formatters.image(euFileImg, 'x', true).url;
      expect(euFileImgUrl).toEqual('https://dyn.eu.mktgcdn.com/f/0/FOO.jpg/fit=contain');
    });
  });

  describe('when desiredSize is not parseable', () => {
    it('throws an error', () => {
      expect(() => {Formatters.image(photoImg, 'ax')}).toThrowError();
    });

    it('throws an error', () => {
      expect(() => {Formatters.image(photoImg, 'xa')}).toThrowError();
    });

    it('throws an error', () => {
      expect(() => {Formatters.image(photoImg, '')}).toThrowError();
    });
  });
});