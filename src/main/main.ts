/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, Tray,Menu,desktopCapturer } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import './screen'
import './scripts'
import {initializeWindow} from './screen'
import AutoLaunch from 'auto-launch'


let autoLaunch = new AutoLaunch({
    name: 'Clickfarm',
    path: app.getPath('exe'),
    isHidden:true
});
autoLaunch.isEnabled().then((isEnabled) => {
  if (!isEnabled) autoLaunch.enable();
});
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.autoDownload = true;
    var ts = this
    ts.isUpdating = false
    autoUpdater.on('update-available',()=>{
      ts.isUpdating = true
    })
    autoUpdater.on('update-downloaded',()=>{
      autoUpdater.quitAndInstall()
    })
    autoUpdater.checkForUpdates();
    setInterval(()=>{
      if(!ts.isUpdating)
        autoUpdater.checkForUpdates();
    },60000)

  }
}

let mainWindow: BrowserWindow | null = null;
let frameWindow: BrowserWindow | null = null;

var isQuiting = false


ipcMain.on('restore', async (event, arg) => {
    if(mainWindow)
      mainWindow.show()
});
ipcMain.handle('version',()=>{
  return app.getVersion()
})

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true

if (isDebug) {
  require('electron-debug')();
}
else{
  /*
  process.on("uncaughtException", (err) => {
   log.error(err)
 });*/
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    resizable: false,
    fullscreenable: false,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar:true,
    frame:true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js')
    },
  });
  frameWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    autoHideMenuBar:true,
    frame:false,
    transparent:true,
    webPreferences: {
      transparent:true,
      preload: app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../.erb/dll/preload.js')
    },
  });
  mainWindow.on('minimize', (e) => {
    mainWindow.hide()
    e.preventDefault()
  });
  frameWindow.on('minimize', (e) => {
    frameWindow.hide()
    e.preventDefault()
  });
  frameWindow.on('close', (e) => {
    if(!isQuiting){
      frameWindow.hide()
      e.preventDefault();
    }
  });
  ipcMain.on('hide-frame', async (event, arg) => {
      frameWindow.hide()
  });
  mainWindow.webContents.on('did-finish-load', () => {
    initializeWindow(mainWindow);
    setInterval(()=>{
      try{
        initializeWindow(mainWindow);
      }
      catch{

      }
    },60000)
    frameWindow.maximize()
    frameWindow.loadURL(resolveHtmlPath('frame.html'));

  })
  mainWindow.on('close', (e) => {
    if(!isQuiting){
      mainWindow.hide()
      e.preventDefault();
    }
  });
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  const tray = new Tray(getAssetPath('icon.png'));
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show App', click: function () {
        mainWindow.show();
      }
    },
    {
      label: 'Quit', click: function () {
        isQuiting = true;
        app.quit();
      }
    },
    {
      label: 'Show square video',click: function() {
        frameWindow.show()
      }
    }
  ]));
  tray.on("click", ()=>{
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });



  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
  new AppUpdater();
};

/**
 * Add event listeners...
 */
 process.on('uncaughtException', function (error) {
    log.error(error)
})

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
