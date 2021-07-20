const diff = require('array-diff')();

const { getLayoutName } = require('./Utils');

class Via {
  constructor(board, mainLayout) {
    this.board = board;
    this.mainLayout = getLayoutName(mainLayout || board.info.mainLayout);
    this.layouts = board.layouts;
    this.config = board.config;
  }

  getLayoutRow(name, row) {
    const layout = this.layouts[name];
    if (layout) return layout.getRow(row);
  }

  diff(row1, row2) {
    const json = [row1, row2].map(r => r.map(k => k.toString('json')));
    return diff(json[0], json[1]);
  }

  toString() {
    const layoutNames = Object.keys(this.layouts);
    const baseLayout = this.layouts[this.mainLayout];
    for (let i = 0; i < baseLayout.rows; i++) {
      const baseRow = baseLayout.getRow(i);
      layoutNames.forEach(name => {
        if (name === baseLayout) return;
        const row = this.getLayoutRow(name, i);
        const rowDiff = this.diff(baseRow, row);
        console.log('row', i, name, rowDiff.map(r => r[0]).join(''));
      });
    }
  }
}

module.exports = Via;
