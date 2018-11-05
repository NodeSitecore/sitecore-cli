const placeholders = require('../src/placeholders');
const { Sinon, expect } = require('../../test/tools');

describe('Placeholders', () => {
  describe('/<([a-zA-Z\\\\-]*):(\\w*)>/', () => {
    let result, nconf;

    before(() => {
      nconf = {
        stores: {
          storeName: {
            get: Sinon.stub().returns('storedValue')
          }
        }
      };
      const placeholder = placeholders('rootDir', 'contextDir').find(p => p.name === 'parent:value');

      result = placeholder.replacement(nconf)('matched', 'storeName', 'value');
    });

    it('should return the right value', () => {
      expect(result).to.eq('storedValue');
    });
  });
});
