const { ipcRenderer, BrowserWindow } = require('electron');
// require('devtron').install()
const buttonEl = document.getElementById("stop-start-button");
const timerEl = document.getElementById("timer");
let counting= false;
const Counter = require('./renderer/counter.js')
const counter = new Counter(timerEl);

buttonEl.addEventListener('click', toggleTimer);

function toggleTimer(){
  if(!counting){
    ipcRenderer.send('start-counter', { startTime: Date.now(), /*counting: false*/})
  } else {
    ipcRenderer.send('stop-counter', { endTime: Date.now(), /*counting: true*/ });
  }
}

ipcRenderer.on('stop-counter', (e,args)=>{
  console.log(args)
  counter.stopTimer();  
  buttonEl.classList.replace('button-stop','button-start');
  buttonEl.innerText = "start";
  counting = args.counting;    
});

ipcRenderer.on('start-counter', (e,args)=>{
  console.log(args)
  counter.startTimer(args.startTime); 
  buttonEl.classList.replace('button-start','button-stop');
  buttonEl.innerText = "stop";
  counting = args.counting;      
});