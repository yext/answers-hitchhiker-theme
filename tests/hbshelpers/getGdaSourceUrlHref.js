import getGdaSourceUrlHref from '../../hbshelpers/getGdaSourceUrlHref';

const NOT_FOUND_URL = '';
const withHref = (url) => `href="${url}"`;

describe('Values are found when present on raw data', () => {
  it('top level field', () => {
    const fieldId = 'website';
    const rawData = {
      website: 'https://www.example.com',
      name: 'Example',
      description: 'This is an example',
      c_otherUrl: 'https://www.example.com/other'
    }
    const expectedUrl = 'https://www.example.com'

    expect(getGdaSourceUrlHref(fieldId, rawData)).toEqual(withHref(expectedUrl));
  });

  it('nested field', () => {
    const fieldId = 'c_myStruct.website';
    const rawData = {
      name: 'Example',
      description: 'This is an example',
      c_myStruct: {
        name: 'My Struct',
        website: 'https://www.example.com'
      }
    }
    const expectedUrl = 'https://www.example.com'

    expect(getGdaSourceUrlHref(fieldId, rawData)).toEqual(withHref(expectedUrl));
  });
});

describe('Fallback fields are used when primary is not found', () => {
  it('top level field', () => {
    const fieldIds = ['does_not_exist', 'website'];
    const rawData = {
      website: 'https://www.example.com',
      name: 'Example',
      description: 'This is an example',
      c_otherUrl: 'https://www.example.com/other'
    }
    const expectedUrl = 'https://www.example.com'

    expect(getGdaSourceUrlHref(fieldIds, rawData)).toEqual(withHref(expectedUrl));
  });

  it('nested field', () => {
    const fieldIds = ['does_not_exist', 'c_myStruct.website'];
    const rawData = {
      name: 'Example',
      description: 'This is an example',
      c_myStruct: {
        name: 'My Struct',
        website: 'https://www.example.com'
      }
    }
    const expectedUrl = 'https://www.example.com'

    expect(getGdaSourceUrlHref(fieldIds, rawData)).toEqual(withHref(expectedUrl));
  });
});

describe('Does not find URL if not present or invalid', () => {
  it('not present in raw data top level', () => {
    const fieldIds = ['does_not_exist', 'also_does_not_exist'];
    const rawData = {
      website: 'https://www.example.com',
      name: 'Example',
      description: 'This is an example',
      c_otherUrl: 'https://www.example.com/other'
    }

    expect(getGdaSourceUrlHref(fieldIds, rawData)).toEqual(NOT_FOUND_URL);
  });

  it('not present in raw data nested field', () => {
    const fieldIds = ['does_not_exist', 'c_myStruct.does_not_exist'];
    const rawData = {
      name: 'Example',
      description: 'This is an example',
      c_myStruct: {
        name: 'My Struct',
        website: 'https://www.example.com'
      }
    }

    expect(getGdaSourceUrlHref(fieldIds, rawData)).toEqual(NOT_FOUND_URL);
  });

  it('field exists but URL is invalid', () => {
    const fieldIds = ['c_myStruct.website'];
    const rawData = {
      name: 'Example',
      description: 'This is an example',
      c_myStruct: {
        name: 'My Struct',
        website: 'Do not get blue shelled'
      }
    }

    expect(getGdaSourceUrlHref(fieldIds, rawData)).toEqual(NOT_FOUND_URL);
  });
});
