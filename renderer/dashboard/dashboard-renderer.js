const { ipcRenderer, BrowserWindow } = require('electron');

let taskUl = document.getElementById('tasks-list') 

ipcRenderer.on("load-dashboard", (e,tasks) => {
  console.log(tasks)
  if (!Object.entries(tasks).length) return taskUl.append(document.createTextNode("no tasks to display"))
  Object.entries(tasks).forEach( t => {
    console.log(t);
    taskUl.appendChild(createTaskLi(t))
  })
})

function createTaskLi(t){
  debugger
  let [taskName, {taskId, duration}] = t
  let task = document.createElement('li')
  task.value = taskId
  // task.id = t.taskName.split(' ').map(t=> t.toLowerCase()).join('-')
  task.classList.add('task-li')

  let taskNameSpan = document.createElement('span')
  taskNameSpan.innerText = taskName
  taskNameSpan.classList.add('task-li-name')
  
  let taskDurationSpan = document.createElement('span')
  taskDurationSpan.innerText = `${duration/1000} seconds`
  taskDurationSpan.classList.add('task-li-duration')

  task.appendChild(taskNameSpan)
  task.appendChild(taskDurationSpan)

  return task
}

// function createTaskLiContent({taskName, duration}){
//   let taskName = document.createElement('span')
//   taskName.innerText = t.taskName
//   taskName.classList.add('task-li-name')
//   let taskDuration = document.createElement('span')
//   taskDuration.innerText = 0
//   taskDuration.classList.add('task-li-duration')
//   return {taskName, taskDuration}
// }

// const parseSpanTime = ({startTime, stopTime}) => {
//   return {
//     seconds: Math.floor(Math.abs((start - Date.now())/1000)) % 60,
//     minutes: Math.floor(Math.abs((start - Date.now())/1000)/ 60)
//     hours: Math.floor(Math.abs((start - Date.now())/1000)/ 60 / 60)
//   }
// }

// const displaySpanTime = ({minutes, hours}) => {
//   let spanString = ''
//   if (minutes < 0) spanString = seconds > 1 ? `${seconds}`
// }
