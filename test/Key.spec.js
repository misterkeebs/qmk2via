const { expect } = require('chai');
const dedent = require('dedent-js');
const Key = require('../src/Key');

describe('Key', async () => {
  describe.only('toString', async () => {
    it('renders 1u', async () => {
      const key = new Key(0, 0);
      exp = dedent`
      ┌──────┐
      │      │
      │      │
      └──────┘
      `.trim();
      expect(key.toString()).to.eql(exp);
    });

    it('renders 1.25u', async () => {
      const key = new Key(0, 0);
      key.w = 1.25;
      exp = dedent`
      ┌────────┐
      │        │
      │        │
      └────────┘
      `.trim();
      expect(key.toString()).to.eql(exp);
    });


    it('renders 1.5u', async () => {
      const key = new Key(0, 0);
      key.w = 1.5;
      exp = dedent`
      ┌──────────┐
      │          │
      │          │
      └──────────┘
      `.trim();
      expect(key.toString()).to.eql(exp);
    });
  });
});
