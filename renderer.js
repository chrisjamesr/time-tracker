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


// Populate Select bar with tasks from DB
ipcRenderer.on('populate-task-select', (e,{tasks})=> {
  addTasksToSelect(tasks, selectEl)
});


function selectElementChange(event){
  const body = document.getElementsByTagName('body')[0]
  if (event.target.value === "new-task"){
    let inputEl = createInputElement()
    replaceElement(inputEl)

    inputEl.addEventListener('click', e=> e.stopPropagation());

    selectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      taskName = document.getElementById('task-input').value
      ipcRenderer.send('create-new-task', {task: taskName}); 
      replaceElement(selectEl);
      body.removeEventListener('click', clickOffInput)
    }, {once:true});
    body.addEventListener('click', clickOffInput, {once:true});
  } else {
    ipcRenderer.send('task-selection', {task: event.target.value})
    taskName = event.target.value;
  }
}

function clickOffInput(e){
  replaceElement(selectEl)
  selectEl.selectedIndex = 0
}
function removeBodyEventListener(){
  debugger
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
  inputEl.setAttribute('class', 'task-display')
  return inputEl;  
}

// optNodes[optNodes.length-1].setAttribute('selected', true)

function replaceElement(elem){
  return selectForm.replaceChild(elem, selectForm.children[0])
}

function createTitleDiv(){
  let selectedOption = Array.from(selectEl).find(ele=> ele.selected)
  let titleDiv = document.createElement('div')
  titleDiv.setAttribute('class', 'task-display');
  titleDiv.innerText = selectedOption.innerText
  return titleDiv;
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
    replaceElement(createTitleDiv())
  } else {
    ipcRenderer.send('stop-counter', { 
      stopTime: Date.now(), 
      taskName: taskName,
      spanId: span.spanId
    });
    replaceElement(selectEl)
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




