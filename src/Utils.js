const _ = require('lodash');

const getLayoutName = (raw = '') => {
  const name = (raw.startsWith('LAYOUT') ? raw.substring(7) : raw).replace(/^_/, '');
  if (name === '') return 'main';
  return name;
};

const sortKeys = keys => _.sortBy(keys, [k => parseInt(k.y, 10), k => k.x])

module.exports = { getLayoutName, sortKeys };
