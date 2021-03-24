import transformFacets from '../../../static/js/transform-facets';

const defaultOption = {
  displayName: 'Breakfast',
  count: 3,
  matcher: '$eq',
  selected: false,
  value: 'breakfast'
}

const defaultFacets = [{
  fieldId: 'c_mealType',
  displayName: 'Meal type',
  options: [defaultOption]
}]

it('can specify both filterOptionsConfig values and fieldLabels', () => {
  const facetsConfig = {
    fields: {
      c_mealType: {
        searchable: true,
        placeholderText: 'Search...',
        fieldLabels: {
          Breakfast: 'BREAKFAST!!!'
        }
      }
    }
  }
  const expectedTransformedFacets = [{
    displayName: "Meal type",
    fieldId: "c_mealType",
    searchable: true,
    placeholderText: 'Search...',
    options: [{
      ...defaultOption,
      displayName: "BREAKFAST!!!",
    }]
  }];
  const actualTransformedFacets = transformFacets(defaultFacets, facetsConfig);
  expect(actualTransformedFacets).toEqual(expectedTransformedFacets);
});

it('can specify filterOptionsConfig values', () => {
  const facetsConfig = {
    fields: {
      c_mealType: {
        searchable: true,
        placeholderText: 'Search',
        showMoreLimit: 5
      }
    }
  }
  const expectedTransformedFacets = [{
    displayName: "Meal type",
    fieldId: "c_mealType",
    options: [defaultOption],
    placeholderText: "Search",
    searchable: true,
    showMoreLimit: 5
  }];
  const actualTransformedFacets = transformFacets(defaultFacets, facetsConfig);
  expect(actualTransformedFacets).toEqual(expectedTransformedFacets);
});

it('fieldLabels updates option displayNames', () => {
  const facets = [{
    fieldId: 'c_mealType',
    displayName: 'Meal type',
    options: [{
      ...defaultOption,
      displayName: 'Breakfast',
      value: 'breakfast'
    }, {
      ...defaultOption,
      displayName: 'Lunch',
      value: 'lunch'
    }, {
      ...defaultOption,
      displayName: 'Dinner',
      value: 'dinner'
    }]
  }]
  const facetsConfig = {
    fields: {
      c_mealType: {
        fieldLabels: {
          Breakfast: 'BREAKFAST!!!',
          Lunch: 'LUNCH!!!'
        }
      }
    }
  }
  const expectedTransformedFacets = [{
    displayName: "Meal type",
    fieldId: "c_mealType",
    options: [{
      ...defaultOption,
      displayName: "BREAKFAST!!!",
      value: 'breakfast'
    }, {
      ...defaultOption,
      displayName: 'LUNCH!!!',
      value: 'lunch'
    }, {
      ...defaultOption,
      displayName: 'Dinner',
      value: 'dinner'
    }]
  }];
  const actualTransformedFacets = transformFacets(facets, facetsConfig);
  expect(actualTransformedFacets).toEqual(expectedTransformedFacets);
});

it('facets do not change if fields is not specified in in the config', () => {
  const facets = [{
    displayName: "Meal type",
    fieldId: "c_mealType",
    options: [defaultOption]
  }];
  const actualTransformedFacets = transformFacets(facets, {});
  expect(actualTransformedFacets).toEqual(facets);
});