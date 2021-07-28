const fs = require('fs');
const _ = require('lodash');

const Key = require('../src/Key');
const Board = require('../src/Board');

const getFixture = name => `${__dirname}/fixtures/${name}`;

const readFixture = name => fs.readFileSync(getFixture(name), 'utf8');

const loadBoard = name => {
  const layouts = readFixture(`${name}/${name}.h`);
  const info = readFixture(`${name}/info.json`);
  const config = readFixture(`${name}/config.h`);
  return new Board(layouts, config, info);
};

const makeRow = (...labels) => {
  let x = 0;
  const row = 0;
  let col = 0;
  return labels.map(l => {
    const [label, opts] = _.isArray(l) ? l : [l, {}];
    opts.y = opts.y || 0;
    opts.w = opts.w || 1;
    opts.x = opts.x || x;
    opts.x += opts.dx || 0;
    opts.row = row;
    opts.col = col++;
    delete opts.dx;
    x = opts.x + opts.w;
    return Key.build({ label, ...opts });
  });
};

module.exports = { getFixture, readFixture, loadBoard, makeRow };
