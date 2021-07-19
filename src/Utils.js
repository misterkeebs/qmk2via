const getLayoutName = (raw = '') => {
  const name = (raw.startsWith('LAYOUT') ? raw.substring(7) : raw).replace(/^_/, '');
  if (name === '') return 'main';
  return name;
};

module.exports = { getLayoutName };
