import Formatters from '../../../../static/js/formatters';
const { highlightField } = Formatters;

describe('highlightField properly handle snippets', () => {
  it('snippet with empty matched substrings', () => {
    const fieldValue = 'morbi tristique senectus et netus et malesuada fames ac turpis egestas.';
    const matchedSubstrings = [];
    expect(highlightField(fieldValue, matchedSubstrings)).toEqual(fieldValue);
  });

  it('snippet with matched substrings at beginning of field value', () => {
    const fieldValue = 'morbi tristique senectus et netus et malesuada fames ac turpis egestas.';
    const matchedSubstrings = [{ offset: 0, length: 5 }];

    const expectedString = '<mark>morbi</mark> tristique senectus et netus et malesuada fames ac turpis egestas.';
    expect(highlightField(fieldValue, matchedSubstrings)).toEqual(expectedString);
  });

  it('snippet with matched substrings at end of field value', () => {
    const fieldValue = 'morbi tristique senectus et netus et malesuada fames ac turpis egestas.';
    const matchedSubstrings = [{ offset: 56, length: 15 }];

    const expectedString = 'morbi tristique senectus et netus et malesuada fames ac <mark>turpis egestas.</mark>';
    expect(highlightField(fieldValue, matchedSubstrings)).toEqual(expectedString);
  });

  it('handle snippet with non-html brackets and multiple matched substrings', () => {
    const fieldValue = '... script>  some stuff 2</script> Joe Exotic was born Joseph Allen Schreibvogel in Garden City, '
    + 'Kansas, on March 5, 1963.[6][7][8], to parents Francis and Shirley Schreibvogel.[9] He grew up on a working farm '
    + 'in Kansas. <script>  some ampersand stuff & & </script> He was Joseph Allen Schreibvogel in Garden City ...';
    const matchedSubstrings = [{ offset: 144, length: 32 }, { offset: 84, length: 19 }];

    const expectedString = '... script&gt;  some stuff 2&lt;/script&gt; Joe Exotic was born Joseph Allen Schreibvogel in'
    + ' <mark>Garden City, Kansas</mark>, on March 5, 1963.[6][7][8], to parents <mark>Francis and Shirley Schreibvogel'
    + '</mark>.[9] He grew up on a working farm in Kansas. &lt;script&gt;  some ampersand stuff &amp; &amp; &lt;/script&gt;'
    + ' He was Joseph Allen Schreibvogel in Garden City ...';
    expect(highlightField(fieldValue, matchedSubstrings)).toEqual(expectedString);
  });
});