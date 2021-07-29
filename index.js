const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const log = require('electron-log');
const path = require('path');
const unhandled = require('electron-unhandled');
const temp = require('temp').track();

unhandled({
  showDialog: true,
});
console.log = log.log;

const Board = require('./src/Board');
const MissingMatrixError = require('./src/errors/MissingMatrixError');
const MissingRequiredFileError = require('./src/errors/MissingRequiredFileError');
const NotQMKError = require('./src/errors/NotQMKError');

try {
  require('electron-reloader')(module)
} catch (_) { }

let mainWindow;
let board;
let name;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });

  mainWindow.loadFile('public/index.html');
  // mainWindow.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  console.log('created');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// app.on('unhandledRejection', err => {
//   console.error('Unhandled rejection', err);
// });

// app.on('uncaughtException', err => {
//   console.error('Unhandled error', err);
// });

const getRedirectFile = url => {
  const contents = `
  <script>
  location.href = "${url}";
  </script>
  `;
  const tmpPath = temp.mkdirSync('qmktools');
  const file = path.join(tmpPath, 'redirect.html');
  console.log('writing temp file', file);
  fs.writeFileSync(file, contents);
  return file;
};

ipcMain.on('select-keyboard', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (result.canceled) return;

  const tryAndRead = (file, error) => {
    if (!fs.existsSync(file)) {
      const expected = path.basename(file);
      throw new MissingRequiredFileError(file);
    }
    return fs.readFileSync(file, 'utf8');
  }

  try {
    const [mainPath] = result.filePaths;
    // name = mainPath.split(path.sep).pop();
    // const header = tryAndRead(`${mainPath}/${name}.h`);
    // const config = tryAndRead(`${mainPath}/config.h`);
    // const info = tryAndRead(`${mainPath}/info.json`);
    // console.log('before board');
    // board = new Board(header, config, info, { name });
    board = Board.fromPath(mainPath);
    name = board.name;
    const images = {};
    const tmpPath = temp.mkdirSync('qmktools');
    for (let i = 0; i < Object.values(board.layouts).length; i++) {
      const layout = Object.values(board.layouts)[i];
      const fileName = path.join(tmpPath, `${layout.name}.png`);
      console.log('Creating', fileName);
      await layout.toPNG(fileName);
      const image = fs.readFileSync(fileName).toString('base64');
      images[layout.name] = image;
    }
    console.log('after board');
    event.reply('keyboard-selected', {
      config: board.config,
      layouts: Object.keys(board.layouts),
      images
    });
  } catch (error) {
    console.error(error);
    if (error instanceof MissingMatrixError) {
      console.log('missing matrix error', { message: error.message });
      event.reply('error', { message: error.message });
    }
    else if (error instanceof NotQMKError) {
      console.log(error);
      event.reply('error', { message: error.message, details: error.details });
    }
    else if (error instanceof MissingRequiredFileError) {
      console.log('sending', error);
      event.reply('error', error);
    } else {
      console.log('sending', { error });
      event.reply('error', { error });
    }
  }
});

ipcMain.on('convert-keyboard', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (result.canceled) return;

  const [savePath] = result.filePaths;
  const file = `${savePath}/${name}.json`;
  console.log('file', file);
  fs.writeFileSync(file, board.toVia());
  event.reply('keyboard-converted', file);
});

ipcMain.on('load-layout', (event, name) => {
  console.log('loading layout', name);
  const layout = board.layouts[name].toString();
  console.log(layout);
  event.reply('layout-loaded', layout);
});

ipcMain.on('load-via-preview', event => {
  const url = board.toPermalink();
  log.log('VIA KLE URL', url);
  event.reply('kle-permalink-loaded', `file://${getRedirectFile(url)}`);
});

ipcMain.on('load-kle-permalink', (event, name) => {
  const url = board.layouts[name].toPermalink();
  log.log('KLE URL', url);
  event.reply('kle-permalink-loaded', `file://${getRedirectFile(url)}`);
});

ipcMain.on('load-settings', event => {
  const via = board.toVia();
  const labels = JSON.parse(via).layouts.labels;
  event.reply('settings-loaded', labels);
});
