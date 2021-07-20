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

  toString() {
    const layoutNames = Object.keys(this.layouts);
    const baseLayout = this.layouts[this.mainLayout];
    for (let i = 0; i < baseLayout.rows; i++) {
      const baseRow = baseLayout.getRow(i);
      layoutNames.forEach(name => {
        if (name === baseLayout) return;
        const row = this.getLayoutRow(name, i);
        const rowDiff = diff(baseRow, row);
        // console.log('rowDiff', rowDiff);
      });
    }
  }
}

module.exports = Via;
