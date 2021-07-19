const fs = require('fs');
const Board = require('../src/Board');

const readFixture = name => fs.readFileSync(`${__dirname}/fixtures/${name}`, 'utf8');

const loadBoard = name => {
  const layouts = readFixture(`${name}/${name}.h`);
  const info = readFixture(`${name}/info.json`);
  const config = readFixture(`${name}/config.h`);
  return new Board(layouts, config, info);
};

module.exports = { readFixture, loadBoard };
