const {app, BrowserWindow} = require('electron');
const electron = require('electron')
const path = require('path');

function createMainWindow(options){
  console.log('creating browser window')

  mainWindow = new BrowserWindow({
    width: 300, 
    height:200,
    x: electron.screen.getPrimaryDisplay().bounds.width,
    y: 0,
    fullscreenable: false,
    title: 'time tracker',
    resizable: false,
    maximizable: false,
    alwaysOnTop:true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));
  mainWindow.on('close', ()=>{
    mainWindow = null;
    console.log('main window closed')
  })
  return mainWindow;
}



module.exports = createMainWindow