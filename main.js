const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const {insertTask, insertSpan, updateSpan, loadTasks, findTask} = require('./lib/db.js')
const createMainWindow = require('./renderer/window.js')
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
      console.log(tasks)
    });
});

ipcMain.on("start-counter", (e, {taskName, startTime})=>{
  counting = true

  console.log(`start-counter\ntaskName: ${taskName}\nstartTime: ${startTime}\n`)

  insertSpan(taskName, startTime)
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
  let {taskName, stopTime, spanId} = args
  
  console.log(`stop-counter \ntaskName: ${taskName}\nstopTime: ${stopTime}\n`)
  
  e.sender.send("stop-counter",{counting});
  updateSpan(args)
});

ipcMain.on("task-selection",(e,{task})=>{
  console.log("task-selection" + "\n" +task)
  findTask(task)
    .then((t)=>{
      return t
    })
    .catch(e=> console.log(e));
})

ipcMain.on("create-new-task", (e, {task}) => {
  newTask = insertTask( {taskName:task} );
  e.sender.send("create-new-task", { task: task })
});

// testTasks.forEach(ele=>insertTask({taskName: ele, startTime:Date.now(), endTime:null}))