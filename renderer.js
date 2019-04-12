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

// handle response from main process on timer start
ipcRenderer.on('start-counter', (e,args)=>{
  let {spanId, startTime} = args
  counter.startTimer(startTime);  
  counting = args.counting;      
  span = {spanId, startTime}
});

// handle response from main process on timer stop
ipcRenderer.on('stop-counter', (e,args)=>{
  counter.stopTimer();
  counting = args.counting;    
});

// populate select bar with tasks from DB
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

function replaceElement(elem){
  return selectForm.replaceChild(elem, selectForm.children[0])
}

function createTitleDiv(){

  // find current selected option
  let selectedOption = Array.from(selectEl).find(ele=> ele.selected)

  // create div w/ relevant attributes
  let titleDiv = document.createElement('div')
  titleDiv.setAttribute('class', 'task-display');
  titleDiv.setAttribute('id', 'task-title');
  titleDiv.innerText = selectedOption.innerText

  // return element
  return titleDiv;
}

function toggleTimer(){
  if (!taskName) return alert('Select a task');

  if(!counting){

    // send taskname and start time to main process
    ipcRenderer.send('start-counter', { 
      startTime: Date.now(), 
      taskName: taskName,
    })

    // change class name & text on start button 
    buttonEl.classList.replace('button-start','button-stop');
    buttonEl.innerText = "stop";

    // change select bar to div w/ task name displayed
    replaceElement(createTitleDiv())

  } else {

    // send taskName, stoptime and span Id to main process
    ipcRenderer.send('stop-counter', { 
      stopTime: Date.now(), 
      taskName: taskName,
      spanId: span.spanId
    });

    // replace title div w/ select bar
    replaceElement(selectEl)

    // change class name & text on stop button 
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




