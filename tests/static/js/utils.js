import { canonicalizeBoolean } from '../../../static/js/utils';
 
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