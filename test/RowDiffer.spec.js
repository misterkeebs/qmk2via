const { expect } = require('chai');
const _ = require('lodash');

const Key = require('../src/Key');
const Kle = require('../src/Kle');
const RowDiffer = require('../src/RowDiffer');
const { loadBoard } = require('./utils');

describe('RowDiffer', async () => {
  const makeRow = (...labels) => {
    let x = 0;
    const row = 0;
    let col = 0;
    return labels.map(l => {
      const [label, opts] = _.isArray(l) ? l : [l, {}];
      opts.y ||= 0;
      opts.w ||= 1;
      opts.x ||= x;
      opts.x += opts.dx || 0;
      opts.row = row;
      opts.col = col++;
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
    const rd = new RowDiffer(base);
    const res = new Kle(rd.diff(row1, row2, row3)).toKle();
    expect(res).to.eql(`[{"w":2.25,"c":"#957DAD"},"Shift\\n\\n\\n1,0",{"c":"#cccccc"},"Z","X","C","V","B","N","M","<",">","?",{"w":2.25,"c":"#E0BBE4"},"Shift\\n\\n\\n0,0",{"w":1.75,"x":0.25},"Shift\\n\\n\\n0,1","Fn\\n\\n\\n0,1",{"x":0.25},"Fn\\n\\n\\n0,2",{"w":1.75},"Shift\\n\\n\\n0,2",{"w":1.25,"x":0.25,"c":"#957DAD"},"Shift\\n\\n\\n1,1","|\\n\\n\\n1,1"]`);
  });

  it('renders completely different rows in different new rows', async () => {
    const base = makeRow(['Ctrl', { w: 1.25 }], ['Win', { w: 1.25 }], ['Alt', { w: 1.25 }], ['', { w: 6.25 }], ['Win', { w: 1.25 }], ['Alt', { w: 1.25 }], ['Menu', { w: 1.25 }], ['Ctrl', { w: 1.25 }]);
    const row1 = makeRow(['Ctrl', { w: 1.5 }], ['Win', { w: 1 }], ['Alt', { w: 1.5 }], ['', { w: 7 }], ['Win', { w: 1.5 }], ['Alt', { w: 1 }], ['Ctrl', { w: 1.5 }]);
    const rd = new RowDiffer(base, 4);
    const res = new Kle(rd.diff(row1)).toKle();
    expect(res).to.eql(`[{"w":1.25,"c":"#FFDFD3"},"Ctrl\\n\\n\\n4,0",{"w":1.25},"Win\\n\\n\\n4,0",{"w":1.25},"Alt\\n\\n\\n4,0",{"w":6.25},"\\n\\n\\n4,0",{"w":1.25},"Win\\n\\n\\n4,0",{"w":1.25},"Alt\\n\\n\\n4,0",{"w":1.25},"Menu\\n\\n\\n4,0",{"w":1.25},"Ctrl\\n\\n\\n4,0",{"w":1.5,"x":0.25},"Ctrl\\n\\n\\n4,1","Win\\n\\n\\n4,1",{"w":1.5},"Alt\\n\\n\\n4,1",{"w":7},"\\n\\n\\n4,1",{"w":1.5},"Win\\n\\n\\n4,1","Alt\\n\\n\\n4,1",{"w":1.5},"Ctrl\\n\\n\\n4,1"]`);
  });
});
