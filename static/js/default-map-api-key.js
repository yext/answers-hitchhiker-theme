/**
 * Gets the default api key given a specific map provider.
 * @param {String} mapProvider
 * @returns {String}
 */
export function getDefaultMapApiKey(mapProvider) {
    if (!mapProvider) {
      throw new Error(
        `Please provide a valid mapProvider. '${mapProvider}' is invalid. Expects either 'google' or 'mapbox'.`
      );
    }
    switch (mapProvider.toLowerCase()) {
      case 'google':
        return process.env.GOOGLE_API_KEY;
      case 'mapbox':
        return process.env.MAPBOX_API_KEY;
      default:
        throw new Error(
          `Given mapProvider: '${mapProvider}' is invalid. Expects either 'google' or 'mapbox'.`
        );
    }
}
