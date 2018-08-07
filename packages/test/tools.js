const Chai = require('chai');
const ChaiAsPromised = require('chai-as-promised');
const Sinon = require('sinon');
const SinonChai = require('sinon-chai');

Chai.should();
Chai.use(SinonChai);
Chai.use(ChaiAsPromised);

const { expect, assert } = Chai;

module.exports = {
  expect,
  assert,
  Sinon,
  Chai,
  SinonChai
};
