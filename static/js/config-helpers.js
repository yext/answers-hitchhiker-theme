/**
 * Contains some helpers for adding SDK configuration.
 */
export function getDefaultMapApiKey(mapProvider) {
    const _mapProvider = mapProvider.toLowerCase();
    let defaultMapApiKey = '';
    if (_mapProvider === 'google') {
      defaultMapApiKey = 'AIzaSyB5D45ghF1YMfqTLSzWubmlCN1euBVPhFw';
    } else if (_mapProvider === 'mapbox') {
      defaultMapApiKey = 'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw';
    }
    return defaultMapApiKey;
}