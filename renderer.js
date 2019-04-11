const { ipcRenderer, BrowserWindow } = require('electron');
require('devtron').install()

const buttonEl = document.getElementById("stop-start-button");
let selectEl = document.getElementById("task-select");
const timerEl = document.getElementById("timer");
const selectForm = document.getElementById('select-form')

let counting=  false;
let taskName;
let span;
const Counter = require('./renderer/counter.js')
const counter = new Counter(timerEl);

buttonEl.addEventListener('click', toggleTimer);

selectEl.addEventListener('change', selectElementChange);

ipcRenderer.on('stop-counter', (e,args)=>{
  counter.stopTimer();
  counting = args.counting;    
});

ipcRenderer.on('start-counter', (e,args)=>{
  let {spanId, startTime} = args
  counter.startTimer(startTime);  
  counting = args.counting;      
  span = {spanId, startTime}
});

ipcRenderer.on('populate-task-select', (e,{tasks})=> {
  addTasksToSelect(tasks, selectEl)
});

function selectElementChange(event){
  if (event.target.value === "new-task"){
    replaceElement(createInputElement())
    selectForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      taskName = document.getElementById('task-input').value
      ipcRenderer.send('create-new-task', {task: taskName}); 
      replaceElement(selectEl);
  })
  } else {
    ipcRenderer.send('task-selection', {task: event.target.value})
    taskName = event.target.value;
  }
}

ipcRenderer.on('create-new-task', (e, {task}) => {
  let newTask = createTaskElement(task)
  newTask.setAttribute('selected', true);
  selectEl.appendChild(newTask)
});

function newTaskInput(){
  return document.getElementById('task-input')  
}

function createInputElement(){
  let inputEl = document.createElement('input')
  inputEl.setAttribute('type', 'text')
  inputEl.setAttribute('style', 'width:100%;')
  inputEl.setAttribute('placeholder', 'Enter A Taskname...')
  inputEl.setAttribute('id', 'task-input')
  return inputEl;  
}

// optNodes[optNodes.length-1].setAttribute('selected', true)

function replaceElement(elem){
  return selectForm.replaceChild(elem, selectForm.children[0])
}

function toggleTimer(){
  if (!taskName) return alert('Select a task');
  if(!counting){
    ipcRenderer.send('start-counter', { 
      startTime: Date.now(), 
      taskName: taskName,
    })
    buttonEl.classList.replace('button-start','button-stop');
    buttonEl.innerText = "stop";  
  } else {
    ipcRenderer.send('stop-counter', { 
      stopTime: Date.now(), 
      taskName: taskName,
      spanId: span.spanId
    });
    buttonEl.classList.replace('button-stop','button-start');
    buttonEl.innerText = "start";
  }
}

function addTasksToSelect(tasks, element){
  let taskElements = tasks.forEach(ele => {
    element.appendChild(createTaskElement(ele))
  });
} 

function createTaskElement(task){
  let optionEl = document.createElement('option');
  optionEl.value = task.taskName;
  optionEl.innerText = task.taskName;
  return optionEl
}




