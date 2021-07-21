const { expect } = require('chai');
const _ = require('lodash');

const Key = require('../src/Key');
const Kle = require('../src/Kle');
const RowDiff = require('../src/RowDiff');

describe('RowDiff', async () => {
  const makeRow = (...labels) => {
    let x = 0;
    return labels.map(l => {
      const [label, opts] = _.isArray(l) ? l : [l, {}];
      opts.y ||= 0;
      opts.w ||= 1;
      opts.x ||= x;
      opts.x += opts.dx || 0;
      delete opts.dx;
      x = opts.x + opts.w;
      return Key.build({ label, ...opts });
    });
  };

  it('renders row with all differences highlighted and to the side', async () => {
    const base = makeRow(['Shift', { w: 2.25 }], 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', ['Shift', { w: 2.25 }]);
    const row1 = makeRow(['Shift', { w: 2.25 }], 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', ['Shift', { w: 1.75 }], 'Fn');
    const row2 = makeRow(['Shift', { w: 2.25 }], 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'Fn', ['Shift', { w: 1.75 }]);
    const row3 = makeRow(['Shift', { w: 1.25 }], '|', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', ['Shift', { w: 2.25 }]);
    const rd = new RowDiff(base);
    const res = rd.diff(row1, row2, row3);
    expect(res).to.eql(`[{"w":2.25,"c":"#888888"},"Shift\\n\\n\\n1,0",{"c":"#cccccc"},"Z","X","C","V","B","N","M","<",">","?",{"w":2.25,"c":"#aaaaaa"},"Shift\\n\\n\\n0,0",{"w":1.75,"x":0.25},"Shift\\n\\n\\n0,1","Fn\\n\\n\\n0,1",{"x":0.25},"Fn\\n\\n\\n0,2",{"w":1.75},"Shift\\n\\n\\n0,2",{"w":1.25,"x":0.25,"c":"#888888"},"Shift\\n\\n\\n1,1","|\\n\\n\\n1,1"]`);
  });
});
