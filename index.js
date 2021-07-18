const fs = require('fs');
const Board = require('./src/Board');

const path = process.argv[2];
const name = path.split('/').pop();
const info = fs.readFileSync(`${path}/info.json`, 'utf8');
const header = fs.readFileSync(`${path}/${name}.h`, 'utf8');
const config = fs.readFileSync(`${path}/config.h`, 'utf8');

const board = new Board(header, config, info);
console.log(board.toVia());
