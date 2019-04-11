const {app} = require('electron');

const Datastore = require('nedb-promises');
const dbFactory = (fileName) => Datastore.create({
  filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/data/${fileName}`, 
  timestampData: true,
  autoload: true
});

const db = {
  taskDb: dbFactory('tasks.js'),
  spanDb: dbFactory('spans.js')
  // projects: dbFactory('projects.js'),
  // clients: dbFactory('client.js')
}
// .ensureIndex({fieldName : 'year'});

let {taskDb, spanDb} = db

let task = {
  task_name: ''
}

let spans = {
  task_name: '',
  start_time:null,
  end_time:null
}

const insertTask = ({taskName}) => {
  return taskDb.insert({taskName}); 
}

const insertSpan =  (taskName, startTime) => {
  return spanDb.insert({taskName, startTime})
}

const updateSpan = ({taskName, spanId, stopTime}) => {
  spanDb.update(
    {taskName: taskName, _id: spanId},
    {
      $set: {
        stopTime: stopTime
      }
    }, 
    {returnUpdatedDocs: true}
  )
  .then(span=> span)
  .catch(e=> console.log(e));    
}

const loadAllTasks = (cb) => {
  return taskDb.find().then(tasks=> cb(tasks))
}

async function loadTasks(){
  return await taskDb.find();
}

async function findTask(name){
  return await taskDb.find({taskName: name})
}
const findSpan = ({taskName, spanId, stopTime}) => {
  spanDb.find({taskName, spanId})
}

module.exports = {
  insertTask, insertSpan, updateSpan, /*loadAllTasks,*/ loadTasks, findTask
}