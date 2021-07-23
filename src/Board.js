const _ = require('lodash');
const _diff = require('array-diff')();

const Config = require('./Config');
const Header = require('./Header');
const Info = require('./Info');
const Layout = require('./Layout');
const { getLayoutName } = require('./Utils');
const Via = require('./Via');

const PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\(.*?\)[\s\n\\]+\{[\s\\]+(?<matrix>.*?)\}\n*$/gms;
const fmti = v => _.isObject(v) ? JSON.stringify(v) : `"${v}"`;
const fmt = arr => arr.map(fmti).join(',');
const iskno = s => ['KC_NO', 'KNO', '____'].includes(s);

class Board {
  constructor(header, config, info, debug) {
    this.layouts = {};
    this.debug = debug;
    this.header = new Header(header);
    this.config = new Config(config);
    this.info = new Info(info);
    this.layouts = this.makeLayouts();
  }

  log(...s) {
    if (this.debug) console.log(...s);
  }

  makeLayouts() {
    return Object.keys(this.info.layouts).reduce((obj, layoutName) => {
      const name = getLayoutName(layoutName);
      const layout = this.info.layouts[layoutName].layout;
      const { rows, cols } = this.config;
      const matrix = this.header.matrices[name];
      obj[name] = new Layout(name, rows, cols, matrix, layout);
      return obj;
    }, {});
  }

  toVia(baseLayout) {
    return new Via(this, baseLayout).toString();
  }

  toPermalink(baseLayout) {
    return new Via(this, baseLayout).toPermalink();
  }
}

module.exports = Board;
