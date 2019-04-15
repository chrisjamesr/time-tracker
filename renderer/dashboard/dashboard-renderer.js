const { ipcRenderer, BrowserWindow } = require('electron');

let taskUl = document.getElementById('tasks-list')

// ipcRenderer.send("show-dashboard")

ipcRenderer.on("load-dashboard", (e,{tasks})=>{
  console.log(tasks)

  if (!tasks.length) return taskUl.append(document.createTextNode("no tasks to display"))
  tasks.forEach(t=>{
    taskUl.appendChild(createTaskLi(t))
  })
})

function createTaskLi(t){
  let task = document.createElement('li')
  task.value = t._id
  task.id = t.taskName.split(' ').map(t=> t.toLowerCase()).join('-')
  task.classList.add('task-li')

  let taskName = document.createElement('span')
  taskName.innerText = t.taskName
  taskName.classList.add('task-li-name')
  
  let taskDuration = document.createElement('span')
  taskDuration.innerText = 0
  taskDuration.classList.add('task-li-duration')

  task.appendChild(taskName)
  task.appendChild(taskDuration)

  return task
}

function createTaskLiContent({taskName, duration}){
  let taskName = document.createElement('span')
  taskName.innerText = t.taskName
  taskName.classList.add('task-li-name')
  let taskDuration = document.createElement('span')
  taskDuration.innerText = 0
  taskDuration.classList.add('task-li-duration')
  return {taskName, taskDuration}
}

