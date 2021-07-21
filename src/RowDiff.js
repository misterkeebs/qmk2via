const _ = require('lodash');
const Kle = require('./Kle');
const diff = require('array-diff')();

const COLORS = [
  '#aaaaaa',
  '#888888',
  '#333333',
];

class RowDiff {
  constructor(base, rowNum = 0) {
    this.base = base;
    this.rowNum = rowNum;
  }

  diff(...rows) {
    const rowDiffs = rows.map(r => diff(this.base, r));
    // I want all the keys with = on all rows
    const keys = _.clone(this.base);
    // console.log('keys', new Kle(keys).toKle());
    const lastKey = keys[keys.length - 1];
    let cx = lastKey.x + lastKey.w;
    const keyProps = {};
    rowDiffs.forEach((row, i) => {
      cx += 0.25;
      const baseKeys = row.filter(([type]) => type === '-').map(([__, key]) => {
        return keys.find(k => k === key);
      });

      const uniqueId = baseKeys.map(k => k.hashCode()).join('::');
      keyProps[uniqueId] = {
        uses: _.get(keyProps, `${uniqueId}.uses`, 0) + 1,
        color: _.get(keyProps, `${uniqueId}.color`) || COLORS.shift(),
      };

      const n = Object.keys(keyProps).indexOf(uniqueId);
      const { color, uses } = keyProps[uniqueId];

      baseKeys.forEach(key => {
        key.c = color;
        key.label = `${key.label.split('\n\n\n')[0]}\n\n\n${n},0`;
      });

      const adds = row.filter(([type]) => type === '+').forEach(([__, key]) => {
        const newKey = _.clone(key);
        key.x = cx;
        key.c = color;
        key.label = `${key.label}\n\n\n${n},${uses}`
        cx += key.w;
        keys.push(key);
      });
    });
    return new Kle(keys).toKle();
  }
}

module.exports = RowDiff;
