const { contextBridge, ipcRenderer } = require('electron');

const rendererApi = {
  onUpdateMessage: (callback) => ipcRenderer.on('updateMessage', callback),
};

// Register the API with the contextBridge
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('rendererApi', rendererApi);
});
