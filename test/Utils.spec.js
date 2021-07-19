const { expect } = require('chai');
const { getLayoutName } = require('../src/Utils');

describe('getLayoutName', async () => {
  const expectParse = (name, parsed) => {
    it(`parses ${name} as ${parsed}`, () => {
      expect(getLayoutName(name)).to.equal(parsed);
    });
  };

  describe('with LAYOUT prefix', async () => {
    expectParse('LAYOUT', 'main');
    expectParse('LAYOUT_', 'main');
    expectParse('LAYOUT_one', 'one');
  });

  describe('with no LAYOUT prefix', async () => {
    expectParse(undefined, 'main');
    expectParse('', 'main');
    expectParse('_', 'main');
    expectParse('_underscore', 'underscore');
    expectParse('no_underscore', 'no_underscore');
  });
});
