import { canonicalizeBoolean, parseLocale } from '../../../static/js/utils';
 
describe('canonicalizeBoolean works properly', () => {
  it('case-insensitive string representations of "true" return true', () => {
    const result = canonicalizeBoolean('TrUe');
    expect(result).toEqual(true);
  });

  it('the string "false" returns false', () => {
    const result = canonicalizeBoolean('false');
    expect(result).toEqual(false);
  });

  it('boolean "true" returns true', () => {
    const result = canonicalizeBoolean(true);
    expect(result).toEqual(true);
  });

  it('boolean "false" returns false', () => {
    const result = canonicalizeBoolean(true);
    expect(result).toEqual(true);
  });

  it('data types other than a string or a boolean returns false', () => {
    const result = canonicalizeBoolean({});
    expect(result).toEqual(false);
  });
})

describe('parseLocale', () => {
  it('performs case formatting', () => {
    expect(parseLocale('Zh-hans-Ch')).toEqual({
      language: 'zh',
      modifier: 'Hans',
      region: 'CH'
    })
  });

  it('chinese with modifier only', () => {
    expect(parseLocale('ZH_HANS')).toEqual({
      language: 'zh',
      modifier: 'Hans'
    })
  });

  it('chinese with region only', () => {
    expect(parseLocale('ZH-cH')).toEqual({
      language: 'zh',
      region: 'CH'
    })
  });

  it('2 section non-chinese locale', () => {
    expect(parseLocale('FR-freE')).toEqual({
      language: 'fr',
      region: 'FREE'
    });
  });

  it('simple language', () => {
    expect(parseLocale('FR')).toEqual({
      language: 'fr'
    });
  });
});
