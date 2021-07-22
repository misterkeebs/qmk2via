const { expect } = require('chai');
const Board = require('../src/Board');
const Via = require('../src/Via');
const { loadBoard } = require('./utils');

describe('Via', async () => {
  it('generates a Via file', async () => {
    const board = loadBoard('db60');
    const via = new Via(board);
    const res = via.toString();
    // console.log('res', JSON.stringify(JSON.parse(res).layouts.keymap));
    // console.log('res', res);
  });
});
