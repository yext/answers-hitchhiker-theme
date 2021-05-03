const { PORT } = require('../constants');
const VerticalPage = require('../pageobjects/verticalpage');

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)

test('A search can be performed', async () => {
  const searchComponent = VerticalPage.getSearchComponent();
  await searchComponent.enterQuery('virginia');
})