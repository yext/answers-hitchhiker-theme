import { PORT } from '../constants';
import RuntimeConfigWrapper from '../blocks/runtimeconfigwrapper';
import Page from '../blocks/page';

fixture`Runtime Config`
  .page(`http://localhost:${PORT}/iframe_test`)

test('Parent runtime config is passed to the child', async t => {
  const parentRuntimeConfig = new RuntimeConfigWrapper({isParent: true});
  const childRuntimeConfig = new RuntimeConfigWrapper({isParent: false});
  await parentRuntimeConfig.set('linkTarget', '_blank');
  await Page.switchToIframe();
  const linkTarget = await childRuntimeConfig.get('linkTarget');
  await t.expect(linkTarget).eql('_blank');
});