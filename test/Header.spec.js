const { expect } = require('chai');
const _ = require('lodash');

const { readFixture } = require('./utils');

const Header = require('../src/Header');

describe('Header', async () => {
  let header;

  describe('weirdly formatted header', async () => {
    beforeEach(async () => {
      const raw = readFixture('wd60_d/wd60_d.h');
      header = new Header(raw);
    });

    it('parses the matrix', async () => {
      expect(header.matrices['all'][10]).to.eql([0, 12]);
      expect(header.matrices['all'].filter(arr => _.isNaN(parseInt(arr[0], 10)) || _.isNaN(parseInt(arr[1], 10))).length).to.eql(0);
    });
  });

  describe('with invalid matrix', async () => {
    it('raises an error', async () => {
      const raw = readFixture('invalid.h');
      expect(() => new Header(raw)).to.throw(/The matrix for layout LAYOUT_all has a missing definition for key K014./);
    });
  });

  describe('header with KFF notation', async () => {
    beforeEach(async () => {
      const raw = readFixture('an_c/an_c.h');
      header = new Header(raw);
    });

    it('parses the matrix', async () => {
      expect(header.matrices['60_ansi'][10]).to.eql([0, 10]);
      expect(header.matrices['60_ansi'].filter(arr => _.isNaN(parseInt(arr[0], 10)) || _.isNaN(parseInt(arr[1], 10))).length).to.eql(0);
    });
  });

  describe('header with kXXXX notation', async () => {
    beforeEach(async () => {
      header = new Header(readFixture('xelus/kangaroo/kangaroo.h'));
    });

    it('generates the via file', async () => {
      const matrix = header.matrices['all'];
      expect(matrix[1]).to.eql([1, 0]);
      expect(header.matrices['all'].filter(arr => _.isNaN(parseInt(arr[0], 10)) || _.isNaN(parseInt(arr[1], 10))).length).to.eql(0);
    });
  });

  describe('header with notation using alphas', async () => {
    beforeEach(async () => {
      header = new Header(readFixture('octagon/v2/v2.h'));
    });

    it('generates the via file', async () => {
      const matrix = header.matrices['75_ansi'];
      expect(matrix[20]).to.eql([1, 4]);
      expect(header.matrices['75_ansi'].filter(arr => _.isNaN(parseInt(arr[0], 10)) || _.isNaN(parseInt(arr[1], 10))).length).to.eql(0);
    });
  });

  describe('header with multiple layouts', async () => {
    beforeEach(async () => {
      const raw = readFixture('dz60/dz60.h');
      header = new Header(raw);
    });

    it('return the parsed layouts', async () => {
      expect(header.getLayouts()).to.eql([
        'main',
        '60_ansi_arrow',
        'true_hhkb',
        '60_hhkb',
        '60_ansi_split_bs_rshift',
        'directional',
        'all',
        '60_ansi',
        '60_ansi_split',
        '60_ansi_split_space_rshift',
        '60_iso',
        '60_abnt2',
        '60_iso_5x1u',
        '60_iso_5x1u_split_rshift',
        '60_iso_split',
        '60_b_ansi',
        '60_b_iso',
        '60_tsangan',
        '60_tsangan_hhkb',
        '60_calbatr0ss',
        '60_iso_split_space_bs_rshift',
        '60_2_function',
        '60_iso_5x1u_split_bs_rshift_spc',
        'olivierko',
        '60_iso_4th_row_all_1u',
      ]);
    });

    it('parses the matrix', async () => {
      expect(header.matrices.true_hhkb[16]).to.eql([1, 2]);
    });
  });

  describe('header with lowercase kXX', async () => {
    beforeEach(async () => {
      const raw = readFixture('noah/noah.h');
      header = new Header(raw);
    });

    it('return the parsed layouts', async () => {
      expect(header.getLayouts()).to.eql([
        'default',
        'wkl',
        'iso',
        '65_iso_blocker',
        'default_splitspace',
      ]);
    });

    it('parses the matrix', async () => {
      expect(header.matrices['default'][15]).to.eql([4, 14]);
    });
  });

  describe('header with one named layout', async () => {
    beforeEach(async () => {
      const raw = readFixture('wd60_d/wd60_d.h');
      header = new Header(raw);
    });

    it('return the parsed layouts', async () => {
      expect(header.getLayouts()).to.eql(['all']);
    });

    it('parses the matrix', async () => {
      expect(header.matrices['all'][0]).to.eql([0, 0]);
      expect(header.matrices['all'][1]).to.eql([0, 3]);
      expect(header.matrices['all'][2]).to.eql([0, 2]);
      expect(header.matrices['all'][3]).to.eql([0, 1]);
      expect(header.matrices['all'][4]).to.eql([0, 4]);
      expect(header.matrices['all'][5]).to.eql([0, 5]);
      expect(header.matrices['all'][6]).to.eql([0, 6]);
      expect(header.matrices['all'][7]).to.eql([0, 7]);
      expect(header.matrices['all'][8]).to.eql([0, 8]);
      expect(header.matrices['all'][9]).to.eql([0, 9]);
      expect(header.matrices['all'][10]).to.eql([0, 12]);
      expect(header.matrices['all'][11]).to.eql([0, 11]);
      expect(header.matrices['all'][12]).to.eql([0, 10]);
      expect(header.matrices['all'][13]).to.eql([0, 13]);
      expect(header.matrices['all'][14]).to.eql([2, 13]);
    });
  });
});
