import relativePathHandler from '../../hbshelpers/relativePathHandler';

it('works for undefined url', () => {
  const hash = {
    url: undefined,
    relativePath: '.'
  };
  expect(relativePathHandler({ hash })).toEqual(undefined);
});

it('works for null url', () => {
  const hash = {
    url: null,
    relativePath: '.'
  };
  expect(relativePathHandler({ hash })).toEqual(null);
});

it('works for blank string url', () => {
  const hash = {
    url: '',
    relativePath: '.'
  };
  expect(relativePathHandler({ hash })).toEqual('');
});

it('works for relative url with relativePath', () => {
  const hash = {
    url: 'mySpecialAsset.jpg',
    relativePath: '.'
  };
  expect(relativePathHandler({ hash })).toEqual('./mySpecialAsset.jpg');
});

it('works for relative url with relativePath that points back a level', () => {
  const hash = {
    url: 'mySpecialAsset.jpg',
    relativePath: '../..'
  };
  expect(relativePathHandler({ hash })).toEqual('../../mySpecialAsset.jpg');
});

it('works when no relativePath', () => {
  const hash = {
    url: 'mySpecialAsset.jpg'
  };
  expect(relativePathHandler({ hash })).toEqual('mySpecialAsset.jpg');
});

it('works with absolute url', () => {
  const hash = {
    url: '/mySpecialAsset.jpg',
    relativePath: '../../'
  };
  expect(relativePathHandler({ hash })).toEqual('/mySpecialAsset.jpg');
});