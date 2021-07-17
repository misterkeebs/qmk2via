const fs = require('fs');

const readFixture = name => fs.readFileSync(`${__dirname}/fixtures/${name}`, 'utf8');

module.exports = { readFixture };
