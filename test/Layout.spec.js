const { expect } = require('chai');
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

  describe('with a non-linear matrix', async () => {
    let layout;

    beforeEach(async () => {
      const header = new Header(readFixture('wd60_d/wd60_d.h'));
      const info = JSON.parse(readFixture('wd60_d/info.json'));
      const matrix = header.matrices.all;
      layout = new Layout('all', 5, 14, matrix, info.layouts.LAYOUT_all.layout);
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
});
