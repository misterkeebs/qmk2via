const PARSER_RE = /#define LAYOUT(?<name>.*?)\(.*?\)\s+\{[\s\\]+(?<matrix>.*?)\}\n/gms;

class Layout {
  static parse(str) {
    // console.log('str', str);
    let match = PARSER_RE.exec(str);
    const matrices = {};
    do {
      const { name, matrix } = match.groups;
      matrices[name.split('').splice(1).join('')] = matrix;
    } while ((match = PARSER_RE.exec(str)) !== null);

    return new Layout(matrices);
  }

  constructor(matrices) {
    this.matrices = matrices;
  }
}

module.exports = Layout;
