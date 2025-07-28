const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const path = require('path');

class HomeRenderer {
  window;

  position = {
    width: 1000,
    height: 600,
    maximized: false,
  };

  constructor() {
    console.log(path.join(__dirname, '../preload.js'));
    this.window = new BrowserWindow({
      width: this.position.width,
      height: this.position.height,
      title: 'This is a test application',
      show: false,
      removeMenu: true,
      acceptFirstMouse: true,
      autoHideMenuBar: true,
      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, '../preload.js'),
      },
    });

    this.window.once('ready-to-show', () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    let wc = this.window.webContents;
    wc.openDevTools({ mode: 'undocked' });

    this.window.loadFile('./src/renderers/home/home.html');

    this.handleMessages();
  }

  showMessage(message) {
    console.log('showMessage recieved');
    console.log(message);
    this.window.webContents.send('updateMessage', message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
}

module.exports = HomeRenderer;
