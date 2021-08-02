const { map } = require('lodash');
const _ = require('lodash');
const Kle = require('./Kle');
const diff = require('array-diff')();

const COLORS = ['#aaaaaa', '#cccccc', '#888888'];

class RowDiffer {
  constructor(base, lastLabelNum = 0) {
    this.base = base;
    this.lastLabelNum = lastLabelNum;
  }

  diff(...rows) {
    const keyMap = new Map();
    const rowToString = row => row.map(k => {
      const hash = k.hashCode();
      keyMap.set(hash, k);
      return hash;
    });
    const baseStr = rowToString(this.base);
    const rowStrs = rows.map(rowToString);

    const tempDiff = rowStrs.map(r => diff(baseStr, r));
    const rowDiffs = _.uniqBy(tempDiff, rd => rd.map(d => `${d[0]}::${d[1]}`).join('||'));
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
      console.log('row', row);
      const baseKeys = row.filter(([type]) => type === '-').map(([__, hash]) => {
        console.log('hash', hash);
        return keyMap.get(hash);
      });

      console.log('baseKeys', baseKeys);
      const uniqueId = baseKeys.map(k => k.hashCode()).join('::');
      keyProps[uniqueId] = {
        uses: _.get(keyProps, `${uniqueId}.uses`, 0) + 1,
        color: _.get(keyProps, `${uniqueId}.color`) || COLORS[cc++ % COLORS.length],
      };

      const n = this.lastLabelNum + Object.keys(keyProps).indexOf(uniqueId);
      const { color, uses } = keyProps[uniqueId];

      baseKeys.forEach(key => {
        key.c = color;
        key.label = `${key.label.split('\n\n\n')[0]}\n\n\n${n},0`;
        key.viaLabel = [n, 0];
      });

      // console.log('row', row.map(([t, hash]) => `${t}${JSON.stringify(keyMap.get(hash).toMatrixJSON())}`));

      row.filter(([type]) => type === '+').forEach(([__, hash]) => {
        const key = keyMap.get(hash);
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
