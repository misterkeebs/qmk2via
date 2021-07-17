const { expect } = require('chai');
const { readFixture } = require('./utils');

const Layout = require('../src/Layout');

describe('Layout', async () => {
  it('reads all layouts', async () => {
    const layoutStr = readFixture('signature65.h');
    const layouts = await Layout.parse(layoutStr);
    expect(Object.keys(layouts.matrices)).to.eql([]);
  });
});
