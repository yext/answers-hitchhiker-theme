import { setupServer, shutdownServer } from '../server';

fixture`Vertical Full Page Map`
  .before(setupServer)
  .after(shutdownServer)
  .page('http://localhost:9999/locations_full_page_map')

test('The test runs', async () => {

})