const KeySitecore = require('../src/key-sitecore');
const { Sinon, expect } = require('../../test/tools');

describe('KeySitecore', () => {
  describe('install', () => {
    let Vue;
    before(() => {
      Vue = {
        mixin: Sinon.stub()
      };
      KeySitecore.install(Vue);
    });

    it('should register the mixin', () => {
      Vue.mixin.should.have.been.calledWithExactly(
        Sinon.match({
          beforeMount: Sinon.match.func,
          mounted: Sinon.match.func
        })
      );
    });
  });

  describe('beforeMount()', () => {
    const ctx = {};
    let childElem;

    before(() => {
      childElem = {
        id: 'main-container-2',
        getAttribute: Sinon.stub().returns('keyValue2')
      };

      ctx.$el = {
        id: 'main-container',
        getElementsByTagName: Sinon.stub().returns([childElem]),
        getAttribute: Sinon.stub().returns('keyValue')
      };

      KeySitecore.prototype.beforeMount.call(ctx);
      KeySitecore.prototype.beforeMount.call({});
    });

    it('should $el.getElementsByTagName', () => {
      ctx.$el.getElementsByTagName.should.have.been.calledWithExactly('*');
    });

    it('should $el.getAttribute', () => {
      ctx.$el.getAttribute.should.have.been.calledWithExactly('key');
    });

    it('should childElem.getAttribute', () => {
      childElem.getAttribute.should.have.been.calledWithExactly('key');
    });

    it('should store current element and child element in domObj', () => {
      expect(ctx.domObj).to.deep.eq({
        'main-container': 'keyValue',
        'main-container-2': 'keyValue2'
      });
    });
  });

  describe('mounted()', () => {
    const ctx = {};
    let childElem;

    before(() => {
      childElem = {
        id: 'main-container-2',
        setAttribute: Sinon.stub()
      };

      ctx.$el = {
        id: 'main-container',
        getElementsByTagName: Sinon.stub().returns([childElem]),
        setAttribute: Sinon.stub()
      };

      ctx.domObj = {
        'main-container': 'keyValue',
        'main-container-2': 'keyValue2'
      };

      KeySitecore.prototype.mounted.call(ctx);
    });

    it('should $el.getElementsByTagName', () => {
      ctx.$el.getElementsByTagName.should.have.been.calledWithExactly('*');
    });

    it('should $el.setAttribute', () => {
      ctx.$el.setAttribute.should.have.been.calledWithExactly('key', 'keyValue');
    });

    it('should childElem.setAttribute', () => {
      childElem.setAttribute.should.have.been.calledWithExactly('key', 'keyValue2');
    });

    it('should reset domObj', () => {
      expect(ctx.domObj).to.deep.eq({});
    });
  });
});
