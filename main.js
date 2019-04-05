const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const {taskDb, spanDb } = require('./lib/db.js')
const createMainWindow = require('./renderer/window.js')
let counting
app.on('ready', ()=>{  
  createMainWindow()
});

ipcMain.on("start-counter", (e, args)=>{
  counting = true
  e.sender.send("start-counter",{startTime: Date.now(), counting});  
})

ipcMain.on("stop-counter", (e, args)=>{
  counting = false
  e.sender.send("stop-counter",{stopTime: Date.now(), counting });  
})

