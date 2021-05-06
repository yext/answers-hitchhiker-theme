import Formatters from 'static/js/formatters.js';

describe('Formatters', () => {
  describe('toLocalizedDistance', () => {
    const profile = { d_distance: 10000000 }; // Distance in meters
    const distanceKey = 'd_distance';
    document.documentElement.lang = 'en';

    it('Formats a distance in kilometers', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'km');
      expect(distance).toEqual('10,000.0 km');
    });

    it('Formats a distance in miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'mi');
      expect(distance).toEqual('6,213.7 mi');
    });

    it('Fallbacks to miles', () => {
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'unknown-unit');
      expect(distance).toEqual('6,213.7 mi');
    });

    it('Correctly formats distance for French display', () => {
      document.documentElement.lang = 'fr';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10 000,0 km');
    });

    it('Correctly formats distance for Spanish display', () => {
      document.documentElement.lang = 'es';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for Italian display', () => {
      document.documentElement.lang = 'it';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for German display', () => {
      document.documentElement.lang = 'de';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10.000,0 km');
    });

    it('Correctly formats distance for Japan display', () => {
      document.documentElement.lang = 'ja';
      const distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10,000.0 km');
    });
  })

  describe('price', () => {
    const priceField = {
      value: '100.99',
      currencyCode: 'USD-US Dollar'
    };
    it('Formats a price in USD', () => {
      const price = Formatters.price(priceField, 'en');
      expect(price).toEqual('$100.99');
    });
    it('Formats a price in USD with no provided locale', () => {
      const price = Formatters.price(priceField);
      expect(price).toEqual('$100.99');
    });
    it('Formats a price in USD with a non-en locale', () => {
      const price = Formatters.price(priceField, 'fr');
      expect(price).toEqual('100,99 $US');
    });

    it('Formats a price in EUR', () => {
      priceField.currencyCode = 'EUR-Euro';
      const price = Formatters.price(priceField);
      expect(price).toEqual('€100.99');
    });
    it('Formats a price in EUR with a non-en locale', () => {
      priceField.currencyCode = 'EUR-Euro';
      const price = Formatters.price(priceField, 'fr');
      expect(price).toEqual('100,99 €');
    });

    it('Returns value when no price or currency code', () => {
      const consoleWarn = jest.spyOn(console, 'warn')
        .mockImplementation();

      let price = Formatters.price({});
      expect(price).toBeUndefined();
      expect(consoleWarn).toHaveBeenCalled();

      price = Formatters.price({currencyCode: 'USD-US Dollar'});
      expect(price).toBeUndefined();
      expect(consoleWarn).toHaveBeenCalled();

      price = Formatters.price({value: '100'});
      expect(price).toEqual('100');
      expect(consoleWarn).toHaveBeenCalled();
    });

    it('Returns value when non-number price', () => {
      const consoleWarn = jest.spyOn(console, 'warn')
        .mockImplementation();

      const price = Formatters.price({value: 'String', currencyCode: 'USD-US Dollar'});
      expect(price).toEqual('String');
      expect(consoleWarn).toHaveBeenCalled();
    });
  });

  describe('highlightField', () => {
    it('Behaves correctly when there are no matchedSubstrings', () => {
      const plainText = 'No more straws';
      const actual = Formatters.highlightField(plainText, []);

      expect(actual).toEqual(plainText);
    });

    it('Highlights single substring correctly', () => {
      const plainText = 'No more straws';
      const matchedSubstrings = [
        {
           "offset": 8,
           "length": 6
        }
     ];
      const actual = Formatters.highlightField(plainText, matchedSubstrings);

      const expected = 'No more <mark>straws</mark>'
      expect(actual).toEqual(expected);
    });

    it('Highlights multiple substrings correctly', () => {
      const plainText = 'How does mask wearing prevent COVID-19';
      const matchedSubstrings = [
        {
           "offset": 9,
           "length": 4
        },
        {
           "offset": 30,
           "length": 8
        },
        {
           "offset": 14,
           "length": 7
        }
     ];
      const actual = Formatters.highlightField(plainText, matchedSubstrings);

      const expected = 
        'How does <mark>mask</mark> <mark>wearing</mark> prevent <mark>COVID-19</mark>';
      expect(actual).toEqual(expected);
    });
  });
});
