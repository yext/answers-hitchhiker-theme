/**
 * Gets the default api key given a specific map provider.
 * @param {String} mapProvider
 * @returns {String}
 */
export function getDefaultMapApiKey(mapProvider) {
    switch (mapProvider.toLowerCase()) {
      case 'google':
        return 'AIzaSyB5D45ghF1YMfqTLSzWubmlCN1euBVPhFw';
      case 'mapbox':
        return 'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw';
      default:
        throw new Error(
          `Given mapProvider: '${mapProvider}' is invalid. Expects either 'google' or 'mapbox'.`
        );
    }
}
