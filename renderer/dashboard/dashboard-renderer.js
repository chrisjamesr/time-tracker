const { ipcRenderer, BrowserWindow } = require('electron');

let taskUl = document.getElementById('tasks-list') 

ipcRenderer.on("load-dashboard", (e,{tasks}) => {
  if (!Object.entries(tasks).length) return taskUl.append(document.createTextNode("no tasks to display"))
  Object.entries(tasks).forEach( t => {
    taskUl.appendChild(createTaskLi(t))
  })
})

ipcRenderer.on("reload-dashboard", (e,{tasks}) => {
  console.log('reloading...')
  taskUl.innerHTML = ''
  if (!Object.entries(tasks).length) return taskUl.append(document.createTextNode("no tasks to display"))
  Object.entries(tasks).forEach( t => {
    taskUl.appendChild(createTaskLi(t))
  })
})

function createTaskLi(t){
  let [taskName, {taskId, duration}] = t
  let task = document.createElement('li')
  task.value = taskId
  // task.id = t.taskName.split(' ').map(t=> t.toLowerCase()).join('-')
  task.classList.add('task-li')

  let taskNameSpan = document.createElement('span')
  taskNameSpan.innerText = taskName
  taskNameSpan.classList.add('task-li-name')
  
  let taskDurationSpan = document.createElement('span')
  taskDurationSpan.innerText = parseSpanTime(duration)
  taskDurationSpan.classList.add('task-li-duration')

  task.appendChild(taskNameSpan)
  task.appendChild(taskDurationSpan)

  return task
}

function clearTaskLi(){
  taskUl.innerHTML = ''
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

const parseSpanTime = (duration) => {
  return displaySpanTime({
      seconds: Math.floor(duration / 1000) % 60,
      minutes: Math.floor(duration / 1000  / 60),
      hours: Math.floor(duration / 1000 / 60 / 60)
    });
}

const displaySpanTime = ({seconds, minutes, hours}) => {
  let spanString = !!seconds ? `${seconds} seconds` : ''
  if (minutes > 0) {
    spanString = `${minutes} min, ${spanString}`
  }
  if (!!hours) {
    spanString = `${hours} hours, ${spanString}`
  }
  return spanString;
}
