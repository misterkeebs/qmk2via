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

  try {
    const [mainPath] = result.filePaths;
    name = mainPath.split(path.sep).pop();
    const header = fs.readFileSync(`${mainPath}/${name}.h`, 'utf8');
    const config = fs.readFileSync(`${mainPath}/config.h`, 'utf8');
    const info = fs.readFileSync(`${mainPath}/info.json`, 'utf8');
    console.log('before board');
    board = new Board(header, config, info);
    console.log('after board');
    event.reply('keyboard-selected', {
      config: board.config,
      layouts: Object.keys(board.layouts),
    });
  } catch (err) {
    console.error(err);
    event.reply('error', err);
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
