const Key = require('../src/Key');

describe('Key', async () => {
  describe('toString', async () => {
    it('renders 1u', async () => {
      const key = new Key(0, 0);
      key.w = 1;
      exp = `
      ┌──────┐
      │      │
      │      │
      └──────┘
      `;
      expect().to.eql(exp);
    });
  });
});
