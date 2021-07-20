const { expect } = require('chai');
const { readFixture } = require('./utils');

const Board = require('../src/Board');

describe('Board', async () => {
  let board;

  describe('board with multiple layouts', async () => {
    beforeEach(async () => {
      const layouts = readFixture('signature65/signature65.h');
      const info = readFixture('signature65/info.json');
      const config = readFixture('signature65/config.h');
      board = new Board(layouts, config, info);
    });

    it('reads all layouts that are both on header and info files', async () => {
      expect(Object.keys(board.layouts)).to.eql([
        'fc65_625_full_bs',
        'fc65_625_split_bs',
        'fc65_700_full_bs',
        'fc65_700_split_bs',
      ]);
    });

    describex('resulting VIA json', async () => {
      let json;
      beforeEach(async () => {
        json = JSON.parse(board.toVia());
      });

      it('has keyboard name', () => expect(json.name).to.eql('Project Keyboard Signature65'));
      it('has product id', () => expect(json.productId).to.eql('0x0165'));
      it('has vendor id', () => expect(json.vendorId).to.eql('0x0159'));
      it('has matrix', () => expect(json.matrix).to.eql({ rows: 5, cols: 16 }));
    });

  });

  describe('board with single unnamed layout', async () => {
    beforeEach(async () => {
      const layouts = readFixture('dimple/dimple.h');
      const info = readFixture('dimple/info.json');
      const config = readFixture('dimple/config.h');
      board = new Board(layouts, config, info);
    });

    it('reads as main layout', async () => {
      expect(Object.keys(board.layouts)).to.eql(['main']);
    });
  });

  describe('board with complex multiple layouts', async () => {
    beforeEach(async () => {
      const layouts = readFixture('dz60/dz60.h');
      const info = readFixture('dz60/info.json');
      const config = readFixture('dz60/config.h');
      board = new Board(layouts, config, info);
    });

    it('reads as main layout', async () => {
      expect(Object.keys(board.layouts)).to.include.members([
        '60_2_function',
        '60_abnt2',
        '60_ansi_arrow',
        '60_ansi_split_bs_rshift',
        '60_ansi_split_space_rshift',
        '60_ansi_split',
        '60_ansi',
        '60_b_ansi',
        '60_b_iso',
        '60_calbatr0ss',
        '60_hhkb',
        '60_iso_4th_row_all_1u',
        '60_iso_5x1u_split_bs_rshift_spc',
        '60_iso_5x1u_split_rshift',
        '60_iso_5x1u',
        '60_iso_split_space_bs_rshift',
        '60_iso_split',
        '60_iso',
        '60_tsangan_hhkb',
        '60_tsangan',
        'all',
        'directional',
        'main',
        'olivierko',
        'true_hhkb',
      ]);
    });

    itx('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.labels.length).to.eql(5);
    });
  });

  describe('board with alternate matrix representation', async () => {
    beforeEach(async () => {
      const layouts = readFixture('wd60_d/wd60_d.h');
      const info = readFixture('wd60_d/info.json');
      const config = readFixture('wd60_d/config.h');
      board = new Board(layouts, config, info);
    });

    it('reads as main layout', async () => {
      expect(Object.keys(board.layouts)).to.eql(['all']);
    });

    it('generates the layout', async () => {
      const layout = board.layouts.all;
      const key = layout.keyAt(0, 11);
      expect(key.label).to.eql('+');
      expect(key.x).to.eql(12);
      expect(key.y).to.eql(0);
    });

    itx('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.labels.length).to.eql(0);
      console.log('board.toVia()', JSON.stringify(json));
    });
  });


  describe('board with non standard y positions', async () => {
    beforeEach(async () => {
      const layouts = readFixture('cstpad/cstpad.h');
      const info = readFixture('cstpad/info.json');
      const config = readFixture('cstpad/config.h');
      board = new Board(layouts, config, info);
    });

    it('reads as main layout', async () => {
      expect(Object.keys(board.layouts)).to.eql(['main']);
    });

    itx('keeps the y offsets', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.keymap[1][0].y).to.eql(0.5);
      expect(json.layouts.keymap[1][1].y).to.be.undefined;
      expect(json.layouts.keymap[2][0].y).to.be.undefined;
    });
  });
});
