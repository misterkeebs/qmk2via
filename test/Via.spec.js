const { expect } = require('chai');
const _ = require('lodash');

const Board = require('../src/Board');
const Via = require('../src/Via');
const { loadBoard } = require('./utils');

describe('Via', async () => {
  it('generates a Via file', async () => {
    const board = loadBoard('signature65');
    const via = new Via(board);
    const res = via.toString();
    const { keymap } = JSON.parse(res).layouts;
    expect(keymap[4].filter(_.isString).length).to.eql(14);
  });
});
