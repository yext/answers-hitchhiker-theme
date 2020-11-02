import { LOCALE_UNIT_MAP, getDistanceUnit } from 'static/js/units-i18n.js';

describe('getDistanceUnit', () => {
  it('A known locale works', () => {
    const unit = getDistanceUnit('en-GB');
    expect(unit).toEqual('km');
  });

  it('A known language and unknown region returns the default for that language', () => {
    const unit = getDistanceUnit('en-AA');
    expect(unit).toEqual('mi');
  });

  it('An unkown language defaults to metric units', () => {
    const unit = getDistanceUnit('ye');
    expect(unit).toEqual('km');
  });
});

describe('unit map', () => {
  it('All languages must have a default unit', () => {
    Object.entries(LOCALE_UNIT_MAP).forEach(([languageMap, regionMap]) => {
      expect('default' in regionMap).toBeTruthy();
    });
  });
});