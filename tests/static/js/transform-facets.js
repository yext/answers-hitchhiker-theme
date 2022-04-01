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
    displayName: 'Meal type',
    fieldId: 'c_mealType',
    searchable: true,
    placeholderText: 'Search...',
    options: [{
      ...defaultOption,
      displayName: 'BREAKFAST!!!',
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
    displayName: 'Meal type',
    fieldId: 'c_mealType',
    options: [defaultOption],
    placeholderText: 'Search',
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
    displayName: 'Meal type',
    fieldId: 'c_mealType',
    options: [{
      ...defaultOption,
      displayName: 'BREAKFAST!!!',
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
    displayName: 'Meal type',
    fieldId: 'c_mealType',
    options: [defaultOption]
  }];
  const actualTransformedFacets = transformFacets(facets, {});
  expect(actualTransformedFacets).toEqual(facets);
});

describe('optionsOrder', () => {
  const facets = [
    {
      fieldId: 'c_mealType',
      displayName: 'Meal type',
      options: [
        {
          ...defaultOption,
          displayName: 'Breakfast',
          value: 'breakfast'
        },
        {
          ...defaultOption,
          displayName: 'Lunch',
          value: 'lunch'
        },
        {
          ...defaultOption,
          displayName: 'Dinner',
          value: 'dinner'
        }
      ]
    }
  ];

  function createFacetsConfig(optionsOrder, fieldLabels) {
    return {
      fields: {
        c_mealType: {
          fieldLabels: fieldLabels || {
            Breakfast: 'ze breakfast',
            Lunch: 'a lunch',
            Dinner: 'duh dinner'
          },
          optionsOrder
        }
      }
    }
  };

  it('works for ASC order', () => {
    const actualOptions = transformFacets(facets, createFacetsConfig('ASC'))[0].options;
    expect(actualOptions[0].displayName).toEqual('a lunch');
    expect(actualOptions[1].displayName).toEqual('duh dinner');
    expect(actualOptions[2].displayName).toEqual('ze breakfast');
  });

  it('works for DESC order', () => {
    const actualOptions = transformFacets(facets, createFacetsConfig('DESC'))[0].options;
    expect(actualOptions[0].displayName).toEqual('ze breakfast');
    expect(actualOptions[1].displayName).toEqual('duh dinner');
    expect(actualOptions[2].displayName).toEqual('a lunch');
  });

  it('logs an error if you use an unknown optionsOrder', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(consoleError).toHaveBeenCalledTimes(0);
    transformFacets(facets, createFacetsConfig('PACER'))[0].options;
    expect(consoleError).toHaveBeenCalledWith(
      'Unknown facet optionsOrder "PACER" for the "c_mealType" facet.');
    consoleError.mockRestore();
  });
});

describe('sorting facets using optionsOrderList', () => {
  function createFacets(displayNames) {
    return [
      {
        fieldId: 'c_mealType',
        options: displayNames.map(d => ({ displayName: d }))
      }
    ];
  }

  function createFacetsConfig(optionsOrderList) {
    return {
      fields: {
        c_mealType: {
          optionsOrderList
        }
      }
    }
  };

  it('will assign priority based on the optionsOrderList', () => {
    const displayNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const transformedFacets = transformFacets(createFacets(displayNames), createFacetsConfig(['e', 'g']));
    const actualOptions = transformedFacets[0].options;
    expect(actualOptions.map(o => o.displayName)).toEqual(['e', 'g', 'a', 'b', 'c', 'd', 'f'])
  });
});