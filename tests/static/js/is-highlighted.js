import { isHighlighted } from 'static/js/is-highlighted.js';

describe('isHighlighted', () => {
  const highlightedFields = {
    field1: {
      value: 'Some value',
      matchedSubstrings: [
        {
          offset: 0,
          length: 4
        }
      ]
    }
  };

  it('returns true when field is in highlightedFields', () => {
    expect(isHighlighted('field1', highlightedFields)).toBeTruthy();
  });

  it('returns false when field is not in highlightedFields', () => {
    expect(isHighlighted('field2', highlightedFields)).toBeFalsy();
  });
});
