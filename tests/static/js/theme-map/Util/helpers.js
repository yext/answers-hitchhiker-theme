import { getNormalizedLongitude, getLanguageForProvider, getMapProvider } from 'static/js/theme-map/Util/helpers.js';
import { GoogleMaps } from 'static/js/theme-map/Maps/Providers/Google.js';
import { MapboxMaps } from 'static/js/theme-map//Maps/Providers/Mapbox.js';


describe('getNormalizedLongitude', () => {
  describe('it works within normal longitude bounds', () => {
    it('works with 0', () => {
      expect(getNormalizedLongitude(0)).toEqual(0);
    });

    it('works with the boundaries', () => {
      expect(getNormalizedLongitude(179)).toEqual(179);
      expect(getNormalizedLongitude(180)).toEqual(180);
      expect(getNormalizedLongitude(-179)).toEqual(-179);
      expect(getNormalizedLongitude(-180)).toEqual(-180);
    });

    it('works with numbers between boundaries', () => {
      expect(getNormalizedLongitude(1)).toEqual(1);
      expect(getNormalizedLongitude(-1)).toEqual(-1);
      expect(getNormalizedLongitude(60)).toEqual(60);
      expect(getNormalizedLongitude(-60)).toEqual(-60);
    });
  });

  describe('it works outside of normal longitude bounds', () => {
    it('works with the boundaries', () => {
      expect(getNormalizedLongitude(180.5)).toEqual(-179.5);
      expect(getNormalizedLongitude(181)).toEqual(-179);

      expect(getNormalizedLongitude(-180.5)).toEqual(179.5);
      expect(getNormalizedLongitude(-181)).toEqual(179);
    });

    it('works with large numbers', () => {
      expect(getNormalizedLongitude(780.5)).toEqual(60.5);
      expect(getNormalizedLongitude(-780.5)).toEqual(-60.5);
      expect(getNormalizedLongitude(190)).toEqual(-170);
      expect(getNormalizedLongitude(-190)).toEqual(170);
    });

    it('works with multiples of the boundaries', () => {
      expect(getNormalizedLongitude(270)).toEqual(-90);
      expect(getNormalizedLongitude(360)).toEqual(0);
      expect(getNormalizedLongitude(450)).toEqual(90);
      expect(getNormalizedLongitude(540)).toEqual(-180);
      expect(getNormalizedLongitude(720)).toEqual(0);

      expect(getNormalizedLongitude(-270)).toEqual(90);
      expect(getNormalizedLongitude(-360)).toEqual(0);
      expect(getNormalizedLongitude(-450)).toEqual(-90);
      expect(getNormalizedLongitude(-540)).toEqual(-180);
      expect(getNormalizedLongitude(-720)).toEqual(0);
    });
  });
});

describe('getMapProvider', () => {
  it('returns the right mapProvider instance', () => {
      expect(getMapProvider('google')).toEqual(GoogleMaps);
      expect(getMapProvider('mapbox')).toEqual(MapboxMaps);
  }); 

  it('returns MapBox on unsupported mapProvider name', () => {
    expect(getMapProvider('unknown')).toEqual(MapboxMaps);
  });
});

describe('getLanguageForProvider', () => {
  describe('it works with different language/locale pairs', () => {
    it('works with map provider google', () => {
      expect(getLanguageForProvider('en', 'google')).toEqual('en');
      expect(getLanguageForProvider('a', 'google')).toEqual('en');
      expect(getLanguageForProvider('en-IDK', 'google')).toEqual('en');
      expect(getLanguageForProvider('en-GB', 'google')).toEqual('en-GB');
      expect(getLanguageForProvider('en_GB', 'google')).toEqual('en-GB');

      expect(getLanguageForProvider('zh-Hant', 'google')).toEqual('zh-TW');
      expect(getLanguageForProvider('zh-Hans', 'google')).toEqual('zh-CN');
      expect(getLanguageForProvider('zh-CN', 'google')).toEqual('zh-CN');
      expect(getLanguageForProvider('zh-TW', 'google')).toEqual('zh-TW');
      expect(getLanguageForProvider('zh-HK', 'google')).toEqual('zh-HK');
      expect(getLanguageForProvider('zh-Hans_CN', 'google')).toEqual('zh-CN');
      expect(getLanguageForProvider('zh-Hant_TW', 'google')).toEqual('zh-TW');
    });

    it('works with map provider mapbox', () => {
      expect(getLanguageForProvider('a', 'mapbox')).toEqual('en');
      expect(getLanguageForProvider('fr', 'mapbox')).toEqual('fr');
      expect(getLanguageForProvider('fr-CA', 'mapbox')).toEqual('fr');

      expect(getLanguageForProvider('zh-Hant', 'mapbox')).toEqual('zh-Hant');
      expect(getLanguageForProvider('zh-Hans', 'mapbox')).toEqual('zh-Hans');
      expect(getLanguageForProvider('zh-CN', 'mapbox')).toEqual('zh');
      expect(getLanguageForProvider('zh-TW', 'mapbox')).toEqual('zh');
      expect(getLanguageForProvider('zh-HK', 'mapbox')).toEqual('zh');
      expect(getLanguageForProvider('zh-Hans_CN', 'mapbox')).toEqual('zh-Hans');
      expect(getLanguageForProvider('zh-Hant_TW', 'mapbox')).toEqual('zh-Hant');
    });
  });
});
