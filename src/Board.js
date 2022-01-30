const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const _diff = require('array-diff')();

const Config = require('./Config');
const Header = require('./Header');
const Info = require('./Info');
const Layout = require('./Layout');
const MissingMatrixError = require('./errors/MissingMatrixError');
const { getLayoutName } = require('./Utils');
const Via = require('./Via');
const MissingRequiredFileError = require('./errors/MissingRequiredFileError');
const NotQMKError = require('./errors/NotQMKError');

const PARSER_RE = /#define LAYOUT(?<name>[^\(]*?)?\(.*?\)[\s\n\\]+\{[\s\\]+(?<matrix>.*?)\}\n*$/gms;
const fmti = v => _.isObject(v) ? JSON.stringify(v) : `"${v}"`;
const fmt = arr => arr.map(fmti).join(',');
const iskno = s => ['KC_NO', 'KNO', '____'].includes(s);

class Board {
  static fromPath(keyboardPath) {
    const resolveName = keyboardPath => {
      const name = path.basename(keyboardPath);
      const parentName = path.basename(path.join(keyboardPath, '..'));
      const headerPath = path.join(keyboardPath, `${name}.h`);
      const headerParentPath = path.join(keyboardPath, '..', `${parentName}.h`);

      if (fs.existsSync(headerPath)) {
        const displayName = /^rev\d+$|^v\d+$/i.test(name) ? `${parentName} ${name}` : name;
        return [name, displayName];
      }

      if (fs.existsSync(headerParentPath)) {
        return [parentName, parentName];
      }

      return [];
    };

    const getFile = file => {
      const filePath = path.join(keyboardPath, file);
      const fileParentPath = path.join(keyboardPath, '..', file);
      const fileToRead = fs.existsSync(filePath)
        ? filePath
        : (fs.existsSync(fileParentPath) ? fileParentPath : null);
      if (!fileToRead) {
        throw new MissingRequiredFileError(file, filePath, fileParentPath);
      }
      return fs.readFileSync(fileToRead, 'utf8');
    }

    const [name, displayName] = resolveName(keyboardPath);

    if (!name) {
      throw new NotQMKError(keyboardPath);
    }

    const header = getFile(`${name}.h`);
    const config = getFile('config.h');
    const info = getFile('info.json');

    return new Board(header, config, info, { name: displayName });
  }

  constructor(header, config, info, { name, debug } = {}) {
    this.layouts = {};
    this.debug = debug;
    this.name = name;
    this.header = new Header(header);
    this.config = new Config(config, name);
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
      if (!matrix) {
        const boardName = this.name ? `${this.name}.h ` : ``;
        throw new MissingMatrixError(`Found a layout called "${layoutName}" on info.json that is missing from the ${boardName}header file.`);
      }
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
