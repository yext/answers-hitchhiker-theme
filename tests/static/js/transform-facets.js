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
  })

  it('works for DESC order', () => {
    const actualOptions = transformFacets(facets, createFacetsConfig('DESC'))[0].options;
    expect(actualOptions[0].displayName).toEqual('ze breakfast');
    expect(actualOptions[1].displayName).toEqual('duh dinner');
    expect(actualOptions[2].displayName).toEqual('a lunch');
  })

  it('logs an error if you use an unknown optionsOrder, and does not try to sort', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(consoleError).toHaveBeenCalledTimes(0);
    const actualOptions = transformFacets(facets, createFacetsConfig('PACER'))[0].options;
    expect(consoleError).toHaveBeenCalledWith(
      'Unknown facet optionsOrder "PACER" for the "c_mealType" facet.');
    consoleError.mockRestore();
    expect(actualOptions[0].displayName).toEqual('ze breakfast');
    expect(actualOptions[1].displayName).toEqual('a lunch');
    expect(actualOptions[2].displayName).toEqual('duh dinner');
  })

  it('works with ASC number display names', () => {
    const actualOptions = transformFacets(facets, createFacetsConfig('ASC', {
      Breakfast: 3,
      Lunch: 2,
      Dinner: 1
    }))[0].options;
    expect(actualOptions[0].displayName).toEqual(1);
    expect(actualOptions[1].displayName).toEqual(2);
    expect(actualOptions[2].displayName).toEqual(3);
  })

  it('works with DESC number display names', () => {
    const actualOptions = transformFacets(facets, createFacetsConfig('DESC', {
      Breakfast: 2,
      Lunch: 3,
      Dinner: 1
    }))[0].options;
    expect(actualOptions[0].displayName).toEqual(3);
    expect(actualOptions[1].displayName).toEqual(2);
    expect(actualOptions[2].displayName).toEqual(1);
  })
});