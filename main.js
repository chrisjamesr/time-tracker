const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const {findOrCreateTask, insertTask, insertSpan, updateSpan, loadTasks, findTask} = require('./lib/db.js')
// const {findOrCreateTask, insertTask, insertSpan, updateSpan, loadTasks, findTask} = findOrCreateTaske('./lib/db.js')
const createMainWindow = require('./renderer/window.js')
const createDashWindow = require('./renderer/dashboard/dash-window.js')
// state variables
let counting
let win;
let span;


app.on('ready', ()=>{  
  win = createMainWindow()
  loadTasks()
    .then(tasks => {
      win.webContents.on('did-finish-load', ()=> {
        win.webContents.send('populate-task-select', {tasks})
      });
    });
});

ipcMain.on("start-counter", (e, {taskName, taskId, startTime})=>{
  counting = true
  console.log(`${taskName}: ${taskId} : ${startTime} `)
  insertSpan(taskName, taskId, startTime)
    .then(taskSpan=> {
      e.sender.send("start-counter",{
        spanId: taskSpan._id,
        startTime: taskSpan.startTime, 
        counting
      });
    })
    .catch(e=> console.log(e));  
});

ipcMain.on('populate-task-select', (e)=>{
  loadTasks()
    .then(tasks => {
      e.sender.send('populate-task-select',{tasks})
    });  
});

ipcMain.on("stop-counter", (e, args)=>{
  counting = false
  let {taskId, stopTime, spanId} = args;  
  e.sender.send("stop-counter",{counting});
  updateSpan(args)
});

//not in use, sends task loaded from db
ipcMain.on("task-selection",(e,{task})=>{
  findOrCreateTask(task)
    .then((t)=>{
      return t
    })
    .catch(e=> console.log(e));
})

ipcMain.on("create-new-task", (e, {task}) => {
  // insertTask( {taskName:task} )
  findOrCreateTask( {taskName:task} )
  .then(newTask=> {
    e.sender.send("create-new-task", { task: newTask })
  });
});

ipcMain.on("show-dashboard", (e)=>{
  if (BrowserWindow.getAllWindows().length > 1) return BrowserWindow.getAllWindows()[0].moveTop()
  let dash = createDashWindow()
  loadTasks()
    .then(tasks=>{
      dash.webContents.on("did-finish-load", (e)=>{
        dash.webContents.send("load-dashboard",{tasks})
      })
    })
})