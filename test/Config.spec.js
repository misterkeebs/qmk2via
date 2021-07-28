const { expect } = require('chai');
const { readFixture } = require('./utils');

const Config = require('../src/Config');

describe('Config', async () => {
  it('parses variables', async () => {
    expect(new Config(readFixture('db60/config.h')).rows).to.equal(5);
    expect(new Config(readFixture('db60/config.h')).product).to.equal('DB60');
    expect(new Config(readFixture('mechmini/v2/config.h')).rows).to.equal(4);
    expect(new Config(readFixture('mechmini/v2/config.h')).cols).to.equal(12);
    expect(new Config(readFixture('mechmini/v2/config.h')).vendorId).to.equal('0xAF99');
    expect(new Config(readFixture('mechmini/v2/config.h')).productId).to.equal('0xCA40');
    expect(new Config(readFixture('mechmini/v2/config.h')).manufacturer).to.equal('MECHKEYS');
    expect(new Config(readFixture('mechmini/v2/config.h')).product).to.equal('Mechmini 2');
  });
});
