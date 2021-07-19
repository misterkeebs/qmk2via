const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const log = require('electron-log');
const unhandled = require('electron-unhandled');

unhandled({
  showDialog: true,
});
console.log('process.type', process.type);
console.log = log.log;

const Board = require('./src/Board');

try {
  require('electron-reloader')(module)
} catch (_) { }

let mainWindow;
let board;
let name;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
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

ipcMain.on('select-keyboard', async (event, arg) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  if (result.canceled) return;

  class MissingRequiredFileError extends Error { }

  const tryAndRead = (file, error) => {
    if (!fs.existsSync(file)) {
      const expected = path.basename(file);
      throw new MissingRequiredFileError(`Directory doesn't seem to have a valid QMK keyboard definition. Required file missing: ${expected}.`);
    }
    return fs.readFileSync(file, 'utf8');
  }

  try {
    const [mainPath] = result.filePaths;
    name = mainPath.split(path.sep).pop();
    const header = tryAndRead(`${mainPath}/${name}.h`);
    const config = tryAndRead(`${mainPath}/config.h`);
    const info = tryAndRead(`${mainPath}/info.json`);
    console.log('before board');
    board = new Board(header, config, info);
    console.log('after board');
    event.reply('keyboard-selected', {
      config: board.config,
      layouts: Object.keys(board.layouts),
    });
  } catch (error) {
    console.error(error);
    if (error instanceof MissingRequiredFileError) {
      console.log('sending', { message: error.message });
      event.reply('error', { message: error.message });
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