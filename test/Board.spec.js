const { expect } = require('chai');
const { readFixture } = require('./utils');

const Board = require('../src/Board');

describe('Board', async () => {
  let board;

  beforeEach(async () => {
    const layouts = readFixture('rekt1800.h');
    const info = readFixture('rekt1800.json');
    board = await Board.parse(layouts, info);
  });

  it('reads all layouts that are both on header and info files', async () => {
    expect(Object.keys(board.layouts)).to.eql([
      'fc65_625_full_bs',
      'fc65_625_split_bs',
      'fc65_700_full_bs',
      'fc65_700_split_bs',
    ]);
  });

  // it('parses the matrix information', async () => {
  //   const matrix = board.getMatrix('fc65_625_full_bs');
  //   expect(matrix[1][2]).to.eql('K12');
  // });

  it.only('transforms to via format', async () => {
    board.toVia();
  });
});
