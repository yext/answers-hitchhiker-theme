import Formatters from '../../../../static/js/formatters';
const { generateCTAFieldTypeLink } = Formatters;

describe('generateCtaFieldTypeLinks can handle translated link types', () => {
  it('understands teléfono as Phone', () => {
    const cta = {
      linkType: 'teléfono',
      link: 'slap'
    }
    expect(generateCTAFieldTypeLink(cta)).toEqual('tel:slap');
  });
  
  it('understands Eメール as Email', () => {
    const cta = {
      linkType: 'Eメール',
      link: 'slap'
    }
    expect(generateCTAFieldTypeLink(cta)).toEqual('mailto:slap');
  });

  it('will pass the link through if linkType other than Email or Phone', () => {
    const cta = {
      linkType: 'URL',
      link: 'slap'
    }
    expect(generateCTAFieldTypeLink(cta)).toEqual('slap');
  });
});