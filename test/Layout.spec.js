const { expect } = require('chai');
const dedent = require('dedent-js');

const Header = require('../src/Header');
const Layout = require('../src/Layout');
const { readFixture } = require('./utils');

describe('Layout', async () => {
  describe('with a board with multiple bottom rows', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('an_c/an_c.h'));
      const info = JSON.parse(readFixture('an_c/info.json'));
      const matrix = header.matrices['60_ansi'];
      layout = new Layout('ansi', 5, 14, matrix, info.layouts.LAYOUT_60_ansi.layout);
    });

    it('sets the layout keys', async () => {
      expect(layout.keys[13].row).to.equal(0);
      expect(layout.keys[13].x).to.equal(13);
      expect(layout.keys[13].y).to.equal(0);
      expect(layout.keys[14].row).to.equal(1);
      expect(layout.keys[14].x).to.equal(0);
      expect(layout.keys[14].y).to.equal(1);
    });

    it('returns a row', async () => {
      const row = layout.getRow(0);
      expect(row.length).to.eql(14);
      expect(row[0].label).to.eql(`~`);
      expect(row[13].label).to.eql(`Backspace`);
    });
  });

  describe('with 60 layout', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('db60/db60.h'));
      const info = JSON.parse(readFixture('db60/info.json'));
      const matrix = header.matrices['60_tsangan_hhkb'];
      layout = new Layout('tsangan60__hhkb', 5, 14, matrix, info.layouts.LAYOUT_60_tsangan_hhkb.layout);
    });

    it('returns the row', async () => {
      const row = layout.getRow(2);
      expect(row.pop().label).to.eql('Enter');
    });
  });

  describe('with 65 layout', () => {
    let header, info, matrices;

    beforeEach(async () => {
      header = new Header(readFixture('signature65/signature65.h'));
      info = JSON.parse(readFixture('signature65/info.json'));
      matrices = header.matrices;
    });

    it('returns the row and column for full BS layout', async () => {
      const layout = new Layout('fc65_625_full_bs', 5, 14, matrices['fc65_625_full_bs'], info.layouts.LAYOUT_fc65_625_full_bs.layout);
      const row = layout.getRow(0);
      const key = row.pop();
      expect(key.row).to.eql(0);
      expect(key.col).to.eql(15);
    });

    it('returns the row and column for split BS layout', async () => {
      const layout = new Layout('fc65_625_split_bs', 5, 14, matrices['fc65_625_split_bs'], info.layouts.LAYOUT_fc65_625_split_bs.layout);
      const row = layout.getRow(0);
      const key = row.pop();
      expect(key.row).to.eql(0);
      expect(key.col).to.eql(15);
    });
  });

  describe('with y offsets', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('reviung39/reviung39.h'));
      const info = JSON.parse(readFixture('reviung39/info.json'));
      const matrix = header.matrices.reviung39;
      layout = new Layout('reviung39', 5, 14, matrix, info.layouts.LAYOUT_reviung39.layout);
    });

    it('set offsets', async () => {
      const row = layout.getRow(0);
      expect(row[0].y).to.equal(0.54);
    });
  });

  describe('with a non-linear matrix', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('wd60_d/wd60_d.h'));
      const info = JSON.parse(readFixture('wd60_d/info.json'));
      const matrix = header.matrices.all;
      layout = new Layout('all', 5, 14, matrix, info.layouts.LAYOUT_all.layout);
    });

    it('returns the row', async () => {
      const row = layout.getRow(0);
      expect(row.length).to.eql(15);
    });

    it('sets the layout keys', async () => {
      expect(layout.keys[13].row).to.equal(0);
      expect(layout.keys[13].x).to.equal(13);
      expect(layout.keys[13].y).to.equal(0);
      expect(layout.keys[14].row).to.equal(2);
      expect(layout.keys[14].x).to.equal(14);
      expect(layout.keys[14].y).to.equal(0);
    });

    it('generates KLE string', async () => {
      const rows = JSON.parse(`[${layout.toKle()}]`);
      expect(rows[3][14]).to.eql('Shift');
    });

    it('generates KLE string with matrix info', async () => {
      const rows = JSON.parse(`[${layout.toKle('matrix')}]`);
      expect(rows[1][2]).to.eql('1,1');
    });
  });

  describe('with complex layout', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('hb85/hb85.h'));
      const info = JSON.parse(readFixture('hb85/info.json'));
      const matrix = header.matrices.stt;
      layout = new Layout('stt', 8, 4, matrix, info.layouts.LAYOUT_stt.layout);
    });
  });

  describe('with dispersed rows', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('cstpad/cstpad.h'));
      const info = JSON.parse(readFixture('cstpad/info.json'));
      const matrix = header.matrices.main;
      layout = new Layout('main', 6, 4, matrix, info.layouts.LAYOUT.layout);
    });

    it('sets the layout keys', async () => {
      expect(layout.keyAt(1, 0).y).to.equal(1.5);
    });

    it('generates KLE string', async () => {
      const rows = JSON.parse(`[${layout.toKle()}]`);
      expect(rows[1][0]).to.eql({ y: 0.5 });
    });

    it('generates KLE string with matrix info', async () => {
      const rows = JSON.parse(`[${layout.toKle('matrix')}]`);
      expect(rows[1][2]).to.eql('1,1');
    });
  });

  describe('toString', async () => {
    it('renders iso', async () => {
      const header = new Header(readFixture('dz60/dz60.h'));
      const info = JSON.parse(readFixture('dz60/info.json'));
      const matrix = header.matrices['60_iso'];
      const layout = new Layout('60_iso', 5, 14, matrix, info.layouts.LAYOUT_60_iso.layout);

      expect(layout.toString()).to.eql(dedent`
      ┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────────────┐
      │      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││              │
      │      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││              │
      └──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────────────┘
      ┌──────────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────────┐
      │          ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││          │
      │          ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││          │
      └──────────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└─┐        │
      ┌────────────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐│        │
      │            ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││        │
      │            ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││        │
      └────────────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└────────┘
      ┌────────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌────────────────────┐
      │        ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││                    │
      │        ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││      ││                    │
      └────────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└──────┘└────────────────────┘
      ┌────────┐┌────────┐┌────────┐┌────────────────────────────────────────────────┐┌────────┐┌────────┐┌────────┐┌────────┐
      │        ││        ││        ││                                                ││        ││        ││        ││        │
      │        ││        ││        ││                                                ││        ││        ││        ││        │
      └────────┘└────────┘└────────┘└────────────────────────────────────────────────┘└────────┘└────────┘└────────┘└────────┘
      `);
    });
  });
});
