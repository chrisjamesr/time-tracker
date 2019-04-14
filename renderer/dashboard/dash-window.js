const {app, BrowserWindow} = require('electron');
const electron = require('electron')
const path = require('path');

function createDashWindow(options){
  console.log('creating dashboard window')

  dashWindow = new BrowserWindow({
    // width: 300, 
    // height:200,
    // x: electron.screen.getPrimaryDisplay().bounds.width,
    // y: 0,
    fullscreenable: true,
    title: 'Task Dashboard',
    resizable: false,
    maximizable: false,
    alwaysOnTop:false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  dashWindow.loadURL(path.join('file://', __dirname, 'dashboard.html'));
  dashWindow.on('close', ()=>{
    dashWindow = null;
    console.log('dashboard window closed')
  })
  return dashWindow;
}



module.exports = createDashWindow