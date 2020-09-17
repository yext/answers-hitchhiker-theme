import { getDistanceUnit } from 'static/js/units-i18n.js';

describe('getDistanceUnit', () => {
  it('A known locale and know region work', () => {
    const unit = getDistanceUnit('en-GB');
    expect(unit).toEqual('km');
  });

  it('A known locale and unknown region returns the default for the language', () => {
    const unit = getDistanceUnit('en-AA');
    expect(unit).toEqual('mi');
  });

  it('An unkown language defaults to imperial units', () => {
    const unit = getDistanceUnit('en-AA');
    expect(unit).toEqual('mi');
  });
});
