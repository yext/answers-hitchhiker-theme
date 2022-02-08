/**
 * Transforms the data from the answers API to the live api format the Locator code expects
 * @param {Object} data The results from the answers API
 * @return {Object} The results formatted for the Locator code
 */
const transformDataToUniversalData = (data) => {
  const universalData = (data.map ? (data.map.mapMarkers || []) : []).map(marker => ({
    profile: {
      ...marker.item,
      meta: {
        accountId: '',
        countryCode: marker.item.address?.countryCode || '',
        entityType: marker.item.type,
        folderId: '',
        id: marker.item.id,
        labels: '',
        language: '',
        schemaTypes: '',
        timestamp: '',
        uid: '',
        utcOffsets: '',
        yextId: marker.item.id,
      }
    }
  }));
  return universalData;
};

/**
 * Transforms the data from the answers API to the live api format the Locator code expects
 * @param {Object} data The results from the answers API
 * @return {Object} The results formatted for the Locator code
 */
const transformDataToVerticalData = (data) => {
  const verticalData = (data.results || []).map(ent => ({
    profile: {
      ...ent._raw,
      meta: {
        accountId: '',
        countryCode: ent._raw.address?.countryCode || '',
        entityType: ent._raw.type,
        folderId: '',
        id: ent.id,
        labels: '',
        language: '',
        schemaTypes: '',
        timestamp: '',
        uid: '',
        utcOffsets: '',
        yextId: ent.id,
      },
    }
  }));
  return verticalData;
};

export {
  transformDataToUniversalData,
  transformDataToVerticalData
}
