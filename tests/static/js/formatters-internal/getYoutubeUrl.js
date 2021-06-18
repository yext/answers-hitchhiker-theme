import Formatters from 'static/js/formatters.js';

describe('getYoutubeUrl formatter', () => {
  it('returns null for no results', () => {
    const actualResult = Formatters.getYoutubeUrl();
    expect(actualResult).toEqual(null);
  });

  it('correctly gets the embedded youtube url', () => {
    const videos = [
      {
        video: {
          url: 'https://www.youtube.com/watch?v=Ww4EqJ1YUmw'
        }
      }
    ];
    const actualUrl = Formatters.getYoutubeUrl(videos);
    const expectedUrl = 'https://www.youtube.com/embed/Ww4EqJ1YUmw?enablejsapi=1'
    expect(actualUrl).toEqual(expectedUrl);
  })
});
