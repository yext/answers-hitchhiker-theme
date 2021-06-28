import { PORT } from '../constants';
import ParentRuntimeConfig from '../blocks/parentruntimeconfig';
import ChildRuntimeConfig from '../blocks/childruntimeconfig';
import Page from '../blocks/page';

fixture`Runtime Config`
  .page(`http://localhost:${PORT}/iframe_test`)

test('Parent runtime config is passed to the child', async t => {
  await ParentRuntimeConfig.set('linkTarget', '_blank');
  await Page.switchToIframe();
  const linkTarget = await ChildRuntimeConfig.get('linkTarget');
  await t.expect(linkTarget).eql('_blank');
});