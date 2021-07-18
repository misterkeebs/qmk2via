const fs = require('fs');
const _ = require('lodash');
const { fileURLToPath } = require('url');

class Layout {
  constructor(info, matrix) {
    this.info = JSON.parse(info);
    this.lines = matrix.split('\n');
  }

  processInfo() {
    const { layouts } = this.info;
    const name = Object.keys(layouts)[0];
    const layout = _.sortBy(layouts[name].layout, ['y', 'x']);
    const rows = [...Array(this.info.height)].map(e => []);

    let col = 0;
    let row = 0;
    let cx = 0;
    layout.forEach(({ x, y, w, label }) => {
      if (row !== y) {
        row = y;
        col = 0;
        cx = 0;
      };
      const pos = this.matrix[row][col];
      const opts = {};
      if (w) {
        opts.w = w;
      }
      if (x > cx) {
        opts.x = x - cx;
      }

      if (Object.keys(opts).length) rows[row].push(opts);

      rows[row].push(`${parseInt(pos.charAt(1), 16)},${parseInt(pos.charAt(2), 16)}`);
      col++;
      cx += w;
    });
    fs.writeFileSync(`${__dirname}/via.json`, JSON.stringify(rows));
    console.log('rows', rows);
  }

  processMatrix() {
    const processors = [
      [/^\s*#define (.*?)?\(/, matches => ({ key: 'name', value: matches[1] })],
      [/{(.*)?}/, matches => ({ key: 'rows', value: matches.slice(1).map(m => m.trim().split(',').map(s => s.trim()).filter(s => s !== 'KNO')) })],
    ];
    let name;
    const data = this.lines.reduce((prev, line) => {
      const processor = processors.find(processor => processor[0].test(line));
      if (processor) {
        const matches = line.match(processor[0]);
        const result = processor[1](matches);
        if (prev[result.key] && _.isArray(prev[result.key])) {
          result.value = _.concat(prev[result.key], result.value);
        }
        return { ...prev, [result.key]: result.value };
      }
      return prev;
    }, {});

    this.name = data.name;
    this.matrix = data.rows;
  }
}

const l = new Layout(
  fs.readFileSync(__dirname + '/info.json', 'utf8'),
  fs.readFileSync(__dirname + '/layout1.txt', 'utf8')
);
l.processMatrix();
l.processInfo();
