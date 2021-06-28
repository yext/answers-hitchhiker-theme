import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';
import Pagination from '../blocks/pagination';

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)

test('Pagination scrolls the results to the top', async t => {
  await VerticalResults.scrollToBottom();
  const scrollTop = await VerticalResults.getScrollTop();
  await t.expect(scrollTop).notEql(0);
  await Pagination.nextResults();
  const scrollTopAfterPagination = await VerticalResults.getScrollTop();
  await t.expect(scrollTopAfterPagination).eql(0);
});