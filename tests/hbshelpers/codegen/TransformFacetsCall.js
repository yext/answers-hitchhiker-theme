import TransformFacetsCall from '../../../hbshelpers/codegen/TransformFacetsCall';

it('generates transform facet calls', () => {
  const fields = {
    c_acceptingNewPatients: {
      fieldLabels: {
        True: 'Accepting New Patients',
        False: 'Not Accepting New Patients'
      }
    },
    c_puppyPreference: {
      searchable: true,
      placeholderText: 'Search here',
      fieldLabels: {
        Frodo: 'FRODO !!!'
      }
    }
  }
  const expectedCode = 
   `(facets, config) => {
      return facets.map(facet => {
        let options = facet.options;
        if (facet.fieldId === 'c_acceptingNewPatients') {
          options = options.map(option => {
            let displayName = option.displayName;
            if (displayName === 'True' ) { displayName = 'Accepting New Patients'; }
            if (displayName === 'False' ) { displayName = 'Not Accepting New Patients'; }
            return Object.assign({}, option, { displayName });
          });
        } 
        if (facet.fieldId === 'c_puppyPreference') {
          facet['searchable'] = true;
          facet['placeholderText'] = 'Search here';
          options = options.map(option => {
            let displayName = option.displayName;
            if (displayName === 'Frodo' ) { displayName = 'FRODO !!!'; }
            return Object.assign({}, option, { displayName });
          });
        } return Object.assign({}, facet, { options });
      });
    }`;
  const actualCode = TransformFacetsCall.generate(fields);
  expect(standardizeWhitespace(actualCode)).toEqual(standardizeWhitespace(expectedCode));
});

it('generates filter options setter code', () => {
  const filterOptions = {
    searchable: true,
    placeholderText: 'Search here',
    control: 'singleoption',
    showMoreLimit: 6
  }
  const expectedCode =
   `facet['searchable'] = true;
    facet['placeholderText'] = 'Search here';
    facet['control'] = 'singleoption';
    facet['showMoreLimit'] = 6; `;
  const actualCode = TransformFacetsCall._generateFilterOptionsSetterCode(filterOptions);
  expect(standardizeWhitespace(actualCode)).toEqual(standardizeWhitespace(expectedCode));
});

it('generates facet option modification code', () => {
  const fieldLabels = {
    Frodo: 'FRODO',
    Marty: 'MARTY'
  }
  const expectedCode = `options = options.map(option => {
    let displayName = option.displayName;
    if (displayName === 'Frodo' ) { displayName = 'FRODO'; } 
    if (displayName === 'Marty' ) { displayName = 'MARTY'; }
    return Object.assign({}, option, { displayName });
  }); `;
  const actualCode = TransformFacetsCall._generateFacetOptionsModificationCode(fieldLabels);
  expect(standardizeWhitespace(actualCode)).toEqual(standardizeWhitespace(expectedCode));
});

function standardizeWhitespace (str) {
  return str.replace(/\s+/g, ' ');
}