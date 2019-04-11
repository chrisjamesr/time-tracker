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
}


let {taskDb, spanDb} = db

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

// const loadAllTasks = (cb) => {
//   return taskDb.find().then(tasks=> cb(tasks))
// }

const loadTasks = async () => {
  return await taskDb.find().sort({taskName:1});
}

const findTask = async (name) => {
  return await taskDb.find({taskName: name})
}

const findSpan = async ({taskName, spanId, stopTime}) => {
  return await spanDb.find({taskName, spanId})
}

module.exports = {
  insertTask, insertSpan, updateSpan, /*loadAllTasks,*/ loadTasks, findTask
}

// let task = {
//   task_name: ''
// }

// let spans = {
//   task_name: '',
//   start_time:null,
//   end_time:null
// }