const Board = require('../src/Board');
const Via = require('../src/Via');
const { loadBoard } = require('./utils');

describe('Via', async () => {
  it.only('does something', async () => {
    const board = loadBoard('an_c');
    const via = new Via(board);
    console.log('via.toString()', via.toString());
  });
});
