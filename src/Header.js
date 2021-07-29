const InvalidMatrixError = require('./errors/InvalidMatrixError');
const { getLayoutName } = require('./Utils');

/**
 * Parses a QMK header file.
 *
 */
class Header {
  constructor(raw) {
    this.raw = raw;
    this.matrices = this.parse();
  }

  parse() {
    const LAYOUT_PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\((?<matrix>.*?)\)[\s\n\\]*\{[\s\\]+(?<pool>.*?)\}\n*$/gms;
    const MATRIX_PARSER_RE = /\{[\s\\]*(.*?)[\s\\]*\}/gm;

    const matrices = {};
    let match = LAYOUT_PARSER_RE.exec(this.raw);
    do {
      const { name: rawName, matrix: rawMatrix, pool: rawPool } = match.groups;
      const pool = [];
      const regex = new RegExp(MATRIX_PARSER_RE);
      let m;
      while ((m = regex.exec(rawPool)) !== null) {
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        const contents = m[1].trim().split(',').map(i => i.trim());
        pool.push(contents);
      }

      const posMap = pool.reduce((obj, row, i) => {
        row.reduce((obj, col, j) => {
          obj[col] = [i, j];
          return obj;
        }, obj);
        return obj;
      }, {});

      const matrix = rawMatrix
        .replace(/\\/g, '')
        .trim()
        .split(',')
        .map(s => {
          const pos = posMap[s.trim()];
          if (!pos) {
            throw new InvalidMatrixError(rawName, s.trim());
          }
          return pos;
        });

      const name = getLayoutName(rawName);
      matrices[name] = matrix;
    } while ((match = LAYOUT_PARSER_RE.exec(this.raw)) !== null);
    return matrices;
  }

  getLayouts() {
    return Object.keys(this.matrices);
  }
}

module.exports = Header;
