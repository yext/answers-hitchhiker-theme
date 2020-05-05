// Import all SCSS
import Scss from './scss/answers/_default.scss';

// Import all JS assets
import Formatters from './js/formatters';
export { Formatters };
export { getDefaultMapApiKey } from './js/default-map-api-key';
export { isStaging } from './js/is-staging';

// TODO seems not great to hardcode the location of the jambo config
// import JamboConfig from '../jambo.json';

// import km from '../desktop/km.html';
// Import all jambo build html files
// function importAll (r) {
//   r.keys().forEach(r);
// }
// const jamboHtml = require.context(`../${JamboConfig.dirs.output}`, true, /\.html$/i);
// importAll(jamboHtml);