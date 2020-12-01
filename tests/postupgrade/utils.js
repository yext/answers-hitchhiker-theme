const { mergeJson } = require('postupgrade/utils.js');
const fs = require('fs');

describe('postupgrade utils', () => {
  describe('mergeJson', () => {
    it('puts together two comment JSON strings', () => {
      const config1 = fs.readFileSync('./tests/postupgrade/config1.json', 'utf-8');
      const config2 = fs.readFileSync('./tests/postupgrade/config2.json', 'utf-8');
      const expected = fs.readFileSync('./tests/postupgrade/config3.json', 'utf-8');

      // if this passes, then it is correctly not deleting any fields or comments
      // and it is giving precedence to the second parameter config
      const mergedConfig = mergeJson(config1, config2);
      expect(mergedConfig).toEqual(expected);
    });
  });
});
