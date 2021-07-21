const Board = require('../src/Board');
const Via = require('../src/Via');
const { loadBoard } = require('./utils');

describe('Via', async () => {
  it('does something', async () => {
    const board = loadBoard('db60');
    const via = new Via(board);
    console.log('via.toString()', via.toString());
  });
});
