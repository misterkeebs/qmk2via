const { getLayoutName } = require('./Utils');

const PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\((?<matrix>.*?)\)[\s\n\\]+\{[\s\\]+(?<pool>.*?)\}\n*$/gms;

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
    const matrices = {};
    const parsePosition = s => {
      if (s.match(/^[Kk][0-9A-Fa-f]{2}$/)) {
        return [parseInt(s.charAt(1), 16), parseInt(s.charAt(2), 16)];
      }
      return [parseInt(s.charAt(1), 10), parseInt(s.slice(2), 10)];
    };
    let match = PARSER_RE.exec(this.raw);
    do {
      const { name: rawName, matrix: rawMatrix } = match.groups;
      const matrix = rawMatrix
        .replace(/\\/g, '')
        .trim()
        .split(',')
        .map(s => parsePosition(s.trim()));
      const name = getLayoutName(rawName);
      matrices[name] = matrix;
    } while ((match = PARSER_RE.exec(this.raw)) !== null);
    return matrices;
  }

  getLayouts() {
    return Object.keys(this.matrices);
  }
}

module.exports = Header;
