import CssRelativeUrlTransformer from '../../../static/webpack/CssRelativeUrlTransformer';
import postcss from 'postcss';

function transformCss(cssContents, relativePath) {
  const postcssPlugins = [ CssRelativeUrlTransformer(relativePath) ];
  const processedCss = postcss(postcssPlugins).process(cssContents).css;
  return processedCss;
}

describe('when relativePath = ".."', () => {
  it('can transform url without quotes', () => {
    const originalCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url(opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff) format("woff");
      }`;

    const expectedCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url(../opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff) format("woff");
      }`;
    const processedCss = transformCss(originalCss, '..');
    expect(expectedCss).toEqual(processedCss);
  });

  it('can transform url with single quotes', () => {
    const originalCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url('opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff') format("woff");
      }`;

    const expectedCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url('../opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff') format("woff");
      }`;
    const processedCss = transformCss(originalCss, '..');
    expect(expectedCss).toEqual(processedCss);
  });

  it('can transform url with double quotes', () => {
    const originalCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url("opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff") format("woff");
      }`;

    const expectedCss = 
      `@font-face {
        font-family: "Open Sans";
        src: url("../opensans-regular-webfont.6b75153a018f7f12125b5a57823f4bdd.woff") format("woff");
      }`;
    const processedCss = transformCss(originalCss, '..');
    expect(expectedCss).toEqual(processedCss);
  });
});