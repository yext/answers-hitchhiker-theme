import { getNormalizedLongitude } from 'static/js/theme-map/Util/helpers.js';

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
