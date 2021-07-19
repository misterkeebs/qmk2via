const { expect } = require('chai');
const { readFixture } = require('./utils');

const Info = require('../src/Info');

describe('Info', async () => {
  it('sets the data', async () => {
    const info = new Info(readFixture('signature65/info.json'));
    expect(info.data.width).to.eql(16);
  });
});
