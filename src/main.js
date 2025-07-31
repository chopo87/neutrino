const { app, BrowserWindow } = require('electron');
const HomeRenderer = require('./renderers/home/homeRenderer');
const { autoUpdater, AppUpdater } = require('electron-updater');

let homeWindow;

/**
 * electron-updater configuration
 */
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
  homeWindow = new HomeRenderer();
  homeWindow.window.webContents.on('did-finish-load', () => {
    // Safe to interact with the loaded content here
    console.log('Window has finished loading the file!');
    homeWindow.showMessage(
      `Checking for updates. Current version ${app.getVersion()}`
    );
  });
};

app.whenReady().then(() => {
  createWindow();

  autoUpdater.checkForUpdates();
});

/*New Update Available*/
autoUpdater.on('update-available', (info) => {
  let udinfo = JSON.stringify(info);
  homeWindow?.showMessage(
    `Update available. Current version ${app.getVersion()}\n${udinfo}`
  );
  let pth = autoUpdater.downloadUpdate();
  homeWindow?.showMessage(pth);
});

autoUpdater.on('update-not-available', (info) => {
  homeWindow?.showMessage(
    `No update available. Current version ${app.getVersion()}`
  );
});

/*Download Completion Message*/
autoUpdater.on('update-downloaded', (info) => {
  let udpath = info?.files?.[0]?.url || info?.path;
  let udinfo = JSON.stringify(info);
  homeWindow.showMessage(
    `Update downloaded. Current version ${app.getVersion()} at path ${udpath}\n${udinfo}`
  );
});

autoUpdater.on('error', (info) => {
  homeWindow.showMessage(info);
});

//Global exception handler
process.on('uncaughtException', function (err) {
  console.log(err);
});

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') app.quit();
});
