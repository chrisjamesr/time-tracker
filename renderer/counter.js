  function createCounter(){

    let tick = null;
    let start=null;
    let time = {
      seconds:0,
      minutes:0,
      hours:0
    }

    const pad = (x) => {
      if(Math.log10(x) < 1 ) return `0${x}`
      return x.toString();
    }

    function setTime(timerNode, {seconds, minutes, hours}){
      timerNode.innerText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`; 
    }

    function clearTime(){
      start = null
      timer.innerText = "00:00:00"
    }

    function loadTimer({seconds, minutes, hours}){
      start = null
    }    

  return class Counter{
    constructor(timer){ 
      this.timerNode = timer;
    }

    elapsedTime(){          
      let seconds = Math.floor(Math.abs((start - Date.now())/1000)) % 60;
      let minutes = Math.floor(Math.abs((start - Date.now())/1000)/ 60);
      let hours = Math.floor(minutes/60) || 0;
      time = {seconds, minutes, hours}
      setTime(timer, time);
    }

    startTimer(startTime){
      start = startTime; 
      tick = setInterval(this.elapsedTime, 1000);
    }

    stopTimer(){
      clearInterval(tick);
      tick = 0;
    }
  }
}

const counter = new createCounter()
module.exports = counter