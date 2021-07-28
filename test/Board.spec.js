const { expect } = require('chai');
const { readFixture, getFixture } = require('./utils');

const Board = require('../src/Board');

describe('Board', async () => {
  let board;

  describe('fromPath', async () => {
    describe('with a regular board', async () => {
      it('creates a Board instance with the proper paths', async () => {
        const board = Board.fromPath(getFixture('db60'));
        expect(board.name).to.eql('db60');
      });
    });

    describe('with a board with versioning', async () => {
      it('creates a Board instance with the proper paths', async () => {
        const board = Board.fromPath(getFixture('deltasplit75/v2'));
        expect(board.name).to.eql('deltasplit75 v2');
      });
    });

    describe('with an invalid folder', async () => {
      it('raises an error', async () => {
        expect(() => Board.fromPath(getFixture('.'))).to.throw(/Directory doesn't seem to have files for a valid QMK keyboard./);
      });
    });
  });

  describe('board with different bottom rows', async () => {
    beforeEach(async () => {
      const layouts = readFixture('tmo50/tmo50.h');
      const info = readFixture('tmo50/info.json');
      const config = readFixture('tmo50/config.h');
      board = new Board(layouts, config, info);
    });

    it('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.keymap[3][5]).to.eql({ w: 2.25, c: '#aaaaaa' });
      expect(json.layouts.keymap[3][15]).to.eql('3,10\n\n\n0,1');
    });
  });

  describe('board with kXXXX for the matrix', async () => {
    beforeEach(async () => {
      const layouts = readFixture('xelus/snap96/snap96.h');
      const info = readFixture('xelus/snap96/info.json');
      const config = readFixture('xelus/snap96/config.h');
      board = new Board(layouts, config, info);
    });

    it('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.keymap[1][1]).to.eql('1,1');
    });
  });

  describe('board with a mismatch between layouts and matrices', async () => {
    it('throws an error', async () => {
      const layouts = readFixture('xelus/kangaroo/kangaroo.h');
      const info = readFixture('xelus/kangaroo/info.json');
      const config = readFixture('xelus/kangaroo/config.h');
      expect(() => board = new Board(layouts, config, info, { name: 'kangaroo' }))
        .to.throw('Found a layout called "LAYOUT" on info.json that is missing from the kangaroo.h header file.');
    });
  });

  describe('board with lowercase kXX for the matrix', async () => {
    beforeEach(async () => {
      const layouts = readFixture('noah/noah.h');
      const info = readFixture('noah/info.json');
      const config = readFixture('noah/config.h');
      board = new Board(layouts, config, info);
    });

    it('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.keymap[0][16]).to.eql('0,14\n\n\n0,0');
    });
  });

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

    describe('resulting VIA json', async () => {
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

    it('generates the via file', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.labels.length).to.eql(0);
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

    it('keeps the y offsets', async () => {
      const json = JSON.parse(board.toVia());
      expect(json.layouts.keymap[1][0].y).to.eql(0.5);
      expect(json.layouts.keymap[1][1].y).to.be.undefined;
      expect(json.layouts.keymap[2][0].y).to.be.undefined;
    });
  });
});
