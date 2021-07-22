const _ = require('lodash');
const Kle = require('./Kle');
const diff = require('array-diff')();

const COLORS = [
  '#E0BBE4',
  '#957DAD',
  '#D291BC',
  '#FEC8D8',
  '#FFDFD3',
  '#E1BFE3',
  '#F7D5EE',
  '#FAC2CA',
  '#D18CAF',
  '#E3E3FF',
  '#DFF2FD',
  '#E2FCE6',
  '#FCFADE',
  '#FFEEE2',
  '#FFDBDB',
];

class RowDiffer {
  constructor(base, lastLabelNum = 0) {
    this.base = base;
    this.lastLabelNum = lastLabelNum;
  }

  diff(...rows) {
    const tempDiff = rows.map(r => diff(this.base, r));
    const rowDiffs = _.uniqBy(tempDiff, rd => rd.map(d => `${d[0]}::${d[1].hashCode()}`).join('||'));
    const keys = _.clone(this.base);
    const lastKey = keys[keys.length - 1];
    let cx = lastKey.x + lastKey.w;
    let cy = _.min(keys.map(k => k.y));
    let cc = this.lastLabelNum;
    const keyProps = {};
    const diffGroups = [];
    rowDiffs.forEach((row, i) => {
      // no additions to the base row, skip this row
      if (row.filter(([type]) => type === '+').length < 1) return;

      if (row[0].y !== cy) {
        cx = lastKey.x + lastKey.w;
        cy = row[0].y
      }
      cx += 0.25;
      const baseKeys = row.filter(([type]) => type === '-').map(([__, key]) => {
        return keys.find(k => k === key);
      });

      const uniqueId = baseKeys.map(k => k.hashCode()).join('::');
      keyProps[uniqueId] = {
        uses: _.get(keyProps, `${uniqueId}.uses`, 0) + 1,
        color: _.get(keyProps, `${uniqueId}.color`) || COLORS[cc++],
      };

      const n = this.lastLabelNum + Object.keys(keyProps).indexOf(uniqueId);
      const { color, uses } = keyProps[uniqueId];

      baseKeys.forEach(key => {
        key.c = color;
        key.label = `${key.label.split('\n\n\n')[0]}\n\n\n${n},0`;
        key.viaLabel = [n, 0];
      });

      row.filter(([type]) => type === '+').forEach(([__, key]) => {
        const newKey = _.clone(key);
        key.x = cx;
        key.c = color;
        key.label = `${key.label}\n\n\n${n},${uses}`;
        key.viaLabel = [n, uses];
        cx += key.w;
        keys.push(key);
      });
    });
    return keys;
  }
}

module.exports = RowDiffer;
