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

// add event listener to open task show page
// document.getElementsByClassName('task-li-name').addEventListener('click', showTask);

function showTask(e){
  let taskId = e.target.parentElement.getAttribute('value');
  ipcRenderer.send('show-dash-task', {taskId});
}

ipcRenderer.on("show-dash-task", (e, args)=>{
  console.log(e,args)  ;
})

function createTaskLi(t){
  let [taskName, {taskId, duration}] = t
  let taskLi = document.createElement('li')  
  // task.id = t.taskName.split(' ').map(t=> t.toLowerCase()).join('-')
  
  let taskNameSpan = document.createElement('span')
  taskNameSpan.innerText = taskName
  taskNameSpan.classList.add('task-li-name')
  taskNameSpan.addEventListener('click', showTask)
  
  let taskDurationSpan = document.createElement('span')
  taskDurationSpan.innerText = parseSpanTime(duration)
  taskDurationSpan.classList.add('task-li-duration')

  taskLi.appendChild(taskNameSpan);
  taskLi.appendChild(taskDurationSpan);
  taskLi.classList.add('task-li');
  taskLi.setAttribute('value', taskId);
  return taskLi;

}

function clearTaskLi(){
  taskUl.innerHTML = ''
}


function parseSpanTime(duration){
  return displaySpanTime({
      seconds: Math.floor(duration / 1000) % 60,
      minutes: Math.floor(duration / 1000  / 60),
      hours: Math.floor(duration / 1000 / 60 / 60)
    });
}

function displaySpanTime({seconds, minutes, hours}){
  let spanString = !!seconds ? `${seconds} seconds` : ''
  if (minutes > 0) {
    spanString = `${minutes} min, ${spanString}`
  }
  if (!!hours) {
    spanString = `${hours} hours, ${spanString}`
  }
  return spanString;
}
