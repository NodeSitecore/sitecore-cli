/* eslint-disable import/order */
const { Sinon } = require('../tools');

const execaStub = Sinon.stub();
execaStub.returns({
  stdout: {
    on: Sinon.stub()
  },
  stderr: {
    on: Sinon.stub()
  },
  catch: Sinon.stub()
});
const nuget = require('proxyquire')('../../src/nuget', {
  execa: execaStub
});


describe('NuGet', () => {
  before(() => {
    nuget.exec('restore', 'test');
  });

  after(() => {

  });

  it('should call execa', () => {
    execaStub.should.have.been.calledWithExactly(Sinon.match('nuget.exe'), [ 'restore', 'test' ], { maxBuffer: 512000 });
  });
});
