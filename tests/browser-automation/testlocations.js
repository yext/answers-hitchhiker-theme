const queryConfig = require('./queries.json');

const universalSearchTests = (queries) => [
  {
    name: 'universal-search',
  },
  {
    name: 'universal-search--no-results',
    queryParams: { query: 'a' }
  },
  {
    name: 'universal-search--spellcheck',
    queryParams: { query: 'office sparce' }
  },
  {
    name: 'universal-search--faq-accordion',
    queryParams: { query: queries.faq },
    commands: [{ type: 'click', params: ['.HitchhikerFaqAccordion-toggle'] }]
  },
  {
    name: 'universal-search--product-prominentimage',
    queryParams: { query: 'yext answers' }
  }
];

const verticalSearchTests = (queries) => [
  {
    name: 'vertical-search',
    page: 'events'
  },
  {
    name: 'vertical-search--no-results',
    page: 'events',
    queryParams: { query: 'a' }
  },
  {
    name: 'vertical-search--spellcheck',
    page: 'events',
    queryParams: { query: 'vrginia' }
  },
  {
    name: 'vertical-search--custom-cta-icons',
    page: 'events_custom_cta_icons'
  },
  {
    name: 'vertical-search--financial-professional-location',
    page: 'financial_professionals',
    queryParams: { query: 'connor' }
  },
  {
    name: 'vertical-search--healthcare-professional-location',
    page: 'healthcare_professionals',
    queryParams: { query: 'bob' }
  },
  {
    name: 'vertical-search--job-standard',
    page: 'jobs',
    queryParams: { query: queries.job }
  },
  {
    name: 'vertical-search--document-standard',
    page: 'help_articles',
    queryParams: { query: 'slap chop' }
  },
  {
    name: 'vertical-search--menuitem-standard',
    page: 'menu_items',
    queryParams: { query: queries.menu_item }
  }
];

const verticalGridSearchTests = () => [
  {
    name: 'vertical-grid-search',
    page: 'people',
    queryParams: { query: 'a' }
  },
  {
    name: 'vertical-grid-search--spellcheck',
    page: 'people',
    queryParams: { query: 'vrginia' }
  },
  {
    name: 'vertical-grid-search--product-prominentvideo',
    page: 'products',
    queryParams: { query: 'yext answers' }
  },
  {
    name: 'vertical-grid-search--product-prominentimage-clickable',
    page: 'products_clickable_image',
    queryParams: { query: 'yext answers' }
  }
];

const verticalMapSearchTests = () => [
  {
    name: 'vertical-map-search',
    page: 'locations',
    queryParams: { query: 'a' }
  },
  {
    name: 'vertical-map-search--google',
    page: 'locations_google',
    queryParams: { query: 'virginia' }
  }
];

const verticalFullPageMapSearchTests = () => [
  {
    name: 'vertical-full-page-map__desktop-view',
    page: 'locations_full_page_map',
    queryParams: { query: '' }
  },
  {
    name: 'vertical-full-page-map__mobile-list-view',
    page: 'locations_full_page_map',
    queryParams: { query: '' },
    viewport: 'mobile'
  },
  {
    name: 'vertical-full-page-map__mobile-map-view',
    page: 'locations_full_page_map',
    queryParams: { query: '' },
    viewport: 'mobile',
    commands: [{ type: 'click', params: ['.Answers-mobileToggle'] }]
  },
  {
    name: 'vertical-full-page-map__mobile-detail-view',
    page: 'locations_full_page_map',
    queryParams: { query: '' },
    viewport: 'mobile',
    commands: [
      { type: 'click', params: ['.Answers-mobileToggle'] },
      { type: 'click', params: ['.js-answersMap button'] }
    ]
  },
  {
    name: 'vertical-full-page-map--alternative-verticals',
    page: 'locations_full_page_map_with_filters',
    queryParams: { query: 'people' }
  },
  {
    name: 'vertical-full-page-map--spellcheck__desktop-view',
    page: 'locations_full_page_map',
    queryParams: { query: 'office sparce' }
  },
  {
    name: 'vertical-full-page-map--spellcheck__mobile-list-view',
    page: 'locations_full_page_map',
    queryParams: { query: 'office sparce' },
    viewport: 'mobile'
  },
  {
    name: 'vertical-full-page-map--nlp-filters__desktop-view',
    page: 'locations_full_page_map',
    queryParams: { query: 'virginia' }
  },
  {
    name: 'vertical-full-page-map-with-filters--nlp-filters__desktop-view',
    page: 'locations_full_page_map_with_filters',
    queryParams: { query: 'virginia' }
  }
];

const directAnswersTests = (queries) => [
  {
    name: 'field-direct-answer',
    queryParams: { query: queries.field_direct_answers }
  },
  {
    name: 'documentsearch-direct-answer',
    queryParams: { query: 'where was joe exotic born?' }
  },
  {
    name: 'documentsearch-rich-text-direct-answer',
    queryParams: { query: 'how to get rich text' }
  },
  {
    name: 'documentsearch-rich-text-picture-direct-answer',
    queryParams: { query: 'who is howard?' }
  }
];

const multilangDirectAnswersTests = (queries) => [
  {
    name: 'field-direct-answer',
    queryParams: { query: queries.field_direct_answers }
  }
];

const getTestingLocations = (locale='en') => [
 ...universalSearchTests(queryConfig[locale]),
 ...verticalSearchTests(queryConfig[locale]), 
 ...verticalGridSearchTests(),
 ...verticalMapSearchTests(),
 ...verticalFullPageMapSearchTests(),
 ...(locale === 'en' ? directAnswersTests(queryConfig[locale]) : multilangDirectAnswersTests(queryConfig[locale]))
]

module.exports = getTestingLocations;
