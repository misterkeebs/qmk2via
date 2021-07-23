const { expect } = require('chai');
const _ = require('lodash');

const Board = require('../src/Board');
const Via = require('../src/Via');
const { loadBoard } = require('./utils');

describe('Via', async () => {
  describe('generating the Via file for board with two variations', async () => {
    let contents;

    beforeEach(async () => {
      const board = loadBoard('signature65');
      const via = new Via(board);
      contents = JSON.parse(via.toString());
    });

    it('generates the keymap with row,col and label information', async () => {
      const { keymap } = contents.layouts;
      expect(keymap[4].filter(_.isString).length).to.eql(14);
      expect(keymap[4][1]).to.eql('4,0\n\n\n1,0');
      expect(keymap[4][3]).to.eql('4,1\n\n\n1,0');
      expect(keymap[4][3]).to.eql('4,1\n\n\n1,0');
      expect(keymap[4][14]).to.eql('4,13');
      expect(keymap[4][17]).to.eql('4,0\n\n\n1,1');
    });

    it('generates the labels', async () => {
      const { labels } = contents.layouts;
      expect(labels).to.eql([
        ['Label 1', 'Option 1', 'Option 2'],
        ['Label 2', 'Option 1', 'Option 2'],
      ]);
    });
  });

  describe('generating the Via file for board with multiple variations', async () => {
    let contents;

    beforeEach(async () => {
      const board = loadBoard('dz60');
      const via = new Via(board);
      contents = JSON.parse(via.toString());
    });

    it('generates the labels', async () => {
      const { labels } = contents.layouts;
      expect(labels[12]).to.eql(['Label 13', 'Option 1', 'Option 2', 'Option 3', 'Option 4']);
    });
  });
});
