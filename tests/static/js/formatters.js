import Formatters from 'static/js/formatters.js';
import * as useragent from 'static/js/useragent.js';

describe('Formatters', () => {
  describe('toLocalizedDistance', () => {
    const profile = { d_distance: 10000000 }; // Distance in meters
    const distanceKey = 'd_distance';
    
    beforeEach(() => {
      document.documentElement.lang = '';
    });

    it('Formats a distance in kilometers', () => {
      document.documentElement.lang = 'en';
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'km');
      expect(distance).toEqual('10,000.0 km');
    });

    it('Formats a distance in miles', () => {
      document.documentElement.lang = 'en';
      const distance = Formatters.toLocalizedDistance(profile, distanceKey, 'mi');
      expect(distance).toEqual('6,213.7 mi');
    });

    it('Fallbacks to miles', () => {
      document.documentElement.lang = 'en';
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

    it('Correctly formats distance for Chinese display', () => {
      document.documentElement.lang = 'zh-CN';
      let distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10,000.0 km');
      document.documentElement.lang = 'zh-Hant_TW';
      distance = Formatters.toLocalizedDistance(profile);
      expect(distance).toEqual('10,000.0 km');
    });
  })

  describe('price', () => {
    const priceField = {
      value: '100.99',
      currencyCode: 'USD-US Dollar'
    };

    beforeEach(() => {
      document.documentElement.lang = '';
    });

    it('Formats a price in USD', () => {
      const price = Formatters.price(priceField, 'en');
      expect(price).toEqual('$100.99');
    });

    it('Formats a price in USD with no provided locale', () => {
      document.documentElement.lang = 'en';
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

  describe('priceRange', () => {
    it('Formats a price range in USD', () => {
      const price = Formatters.priceRange('$', 'US');
      expect(price).toEqual('$');
    });

    it('Formats a price range in EUR', () => {
      const price = Formatters.priceRange('$$', 'BE');
      expect(price).toEqual('€€');
    });

    it('Formats a price range in JPY', () => {
      const price = Formatters.priceRange('$$$', 'JP');
      expect(price).toEqual('¥¥¥');
    });

    it('Formats a price range in KRW', () => {
      const price = Formatters.priceRange('$$$$', 'KR');
      expect(price).toEqual('₩₩₩₩');
    });

    it('Formats a price range in GBP', () => {
      const price = Formatters.priceRange('$', 'GB');
      expect(price).toEqual('£');
    });

    it('Formats a price range in invalid country code, use page\'s locale', () => {
      document.documentElement.lang = 'jp'
      const price = Formatters.priceRange('$$$', 'IDK');
      expect(price).toEqual('¥¥¥');
    });

    it('Formats a price range in undefined country code, use page\'s locale', () => {
      document.documentElement.lang = 'zh-CN'
      let price = Formatters.priceRange('$$$', undefined);
      expect(price).toEqual('¥¥¥');
      document.documentElement.lang = 'zh-Hant_TW'
      price = Formatters.priceRange('$$$', undefined);
      expect(price).toEqual('NT$NT$NT$');
    });

    it('Formats a price range in invalid country code and invalid page\'s locale', () => {
      document.documentElement.lang = 'IDKK'
      const price = Formatters.priceRange('$', 'IDK');
      expect(price).toEqual('$');
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

  describe('getUrlWithTextHighlight', () => {
    const link = 'www.dummy-link.com/test'
    const isChrome = jest.spyOn(useragent, 'isChrome');
    isChrome.mockReturnValue(true);

    it('Behaves correctly when baseUrl is not defined', () => {
      const snippet = {
        value: 'this is a sentence, for testing purposes.',
        matchedSubstrings: [
          {
            offset: 5, 
            length: 10 
          }
        ]
      };
      const actual = Formatters.getUrlWithTextHighlight(snippet, undefined);
      expect(actual).toBeUndefined();
    });
    
    it('Behaves correctly when there is no matchedSubstring', () => {
      const snippet = {
        value: 'this is a sentence, for testing purposes.',
        matchedSubstrings: []
      };
      const actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(link);
    });

    it('Behaves correctly when there is a matchedSubstring with a surrounding sentence', () => {
      const snippet = {
        value: 'this is a sentence, for testing purposes.',
        matchedSubstrings: [
          {
            offset: 5, 
            length: 10 
          }
        ]
      };
      const url = link + '#:~:text=this%20is%20a%20sentence%2C%20for%20testing%20purposes'
      const actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
    });

    it('Behaves correctly when there is a matchedSubstring with a surrounding'
      + ' sentence end with different punctuation marks', () => {
      const matchedSubstrings = [{offset: 5, length: 10}];
      let snippet = {
        value: 'this is a sentence for testing purposes? more text',
        matchedSubstrings: matchedSubstrings
      };
      const url = link + '#:~:text=this%20is%20a%20sentence%20for%20testing%20purposes'
      let actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
      
      snippet = {
        value: 'this is a sentence for testing purposes! and more',
        matchedSubstrings: matchedSubstrings
      };
      actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);

      snippet = {
        value: 'this is a sentence for testing purposes\n some more text',
        matchedSubstrings: matchedSubstrings
      };
      actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
    });


    it('Behaves correctly when there is a matchedSubstring at beginning of the string', () => {
      const snippet = {
        value: 'this is a sentence for testing purposes. and more more text',
        matchedSubstrings: [
          {
            offset: 0, 
            length: 10 
          }
        ]
      };
      const url = link + '#:~:text=this%20is%20a%20sentence%20for%20testing%20purposes'
      const actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
    });

    it('Behaves correctly when there is a matchedSubstring with no ending punctuation in string', () => {
      const snippet = {
        value: 'this is a sentence for testing purpo',
        matchedSubstrings: [
          {
            offset: 0, 
            length: 10 
          }
        ]
      };
      const url = link + '#:~:text=this%20is%20a%20sentence%20for%20testing%20purpo'
      const actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
    });

    it('Behaves correctly when there is a matchedSubstring that contain parts of multiple sentences', () => {
      const snippet = {
        value: 'more more. This is a sentence for testing purposes. and more random text! some more?',
        matchedSubstrings: [
          {
            offset: 30, 
            length: 30 
          }
        ]
      };
      const url = link + '#:~:text=This%20is%20a%20sentence%20for%20testing%20purposes.%20and%20more%20random%20text'
      const actual = Formatters.getUrlWithTextHighlight(snippet, link);
      expect(actual).toEqual(url);
    });
  });

  describe('getCategoryNames', () => {
    const categoryMap = [ 
      {
        "id": "1",
        "category": "Neurology"
      },
      {
        "id": "2",
        "category": "Dermatology"
      },
      {
        "id": "3",
        "category": "Psychiatry"
      },
      {
        "id": "4",
        "category": "Surgery"
      }
    ];

    it('Handle undefined categoryIds and categoryMap', () => {
      let categoryNames = Formatters.getCategoryNames(null, categoryMap);
      expect(categoryNames).toEqual([]);
      categoryNames = Formatters.getCategoryNames(['1'], null);
      expect(categoryNames).toEqual([]);
    });

    it('return empty list for no matching category names', () => {
      const categoryIds = ['5', '0'];
      const consoleWarn = jest.spyOn(console, 'error')
        .mockImplementation();
      const categoryNames = Formatters.getCategoryNames(categoryIds, categoryMap);
      expect(categoryNames).toEqual([]);
      expect(consoleWarn).toHaveBeenCalledTimes(2);
      console.error.mockClear();
    });

    it('return a list of matching category names', () => {
      const categoryIds = ['1', '3'];
      const categoryNames = Formatters.getCategoryNames(categoryIds, categoryMap);
      expect(categoryNames).toEqual(['Neurology', 'Psychiatry']);
    });

    it('return a list of category names given non-matching and matching ids', () => {
      const categoryIds = ['1', '10', '4'];
      const consoleWarn = jest.spyOn(console, 'error')
        .mockImplementation();
      const categoryNames = Formatters.getCategoryNames(categoryIds, categoryMap);
      expect(categoryNames).toEqual(['Neurology', 'Surgery']);
      expect(consoleWarn).toHaveBeenCalledTimes(1);
    });
  });
});
