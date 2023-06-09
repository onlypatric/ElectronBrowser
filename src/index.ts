
const { app, ipcMain,BrowserWindow } = require('electron');
const path = require('path');
const { setVibrancy } = require('electron-acrylic-window');
const contextMenu = require('electron-context-menu')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
app.on("web-contents-created", (e, contents) => {
  contextMenu({
     window: contents,
     showSaveImageAs: true,
     showInspectElement: true
  });
})
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    frame:false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag:true
    },
  });
  setVibrancy(mainWindow,{
    theme:'dark',
    effect: 'acrylic',
    useCustomWindowRefreshMethod:true,
    maximumRefreshRate: 60,
    disableOnBlur: true
 })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('minimize-window', () => {
    mainWindow.minimize();
  });
  ipcMain.on('close-window', () => {
    mainWindow.close();
  });
  ipcMain.on('resize-window', () => {
    if(mainWindow.isMaximized()){
      mainWindow.unmaximize();
    }
    else{
      mainWindow.maximize();
    }
  });

};

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", createWindow);

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
