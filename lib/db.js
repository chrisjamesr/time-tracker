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
 
 // task db methods
// const findOrCreateTask({})
const findOrCreateTask = async ({taskName}) => {
  let foundTask = await taskDb.find({taskName})
  if (!!foundTask.length) {
    console.log(foundTask[0])
    return foundTask[0]

  } else {
    return taskDb.insert({taskName})
      .then(task => task)
      .catch(e => console.log(e));
  }
}

const insertSpan =  (taskName, taskId, startTime) => {
  return spanDb.insert({taskName, taskId, startTime})
    .then(span => span)
    .catch(e => console.log(e));
}

const updateSpan = ({taskId, spanId, stopTime}) => {
  spanDb.update(
    {taskId: taskId, _id: spanId},
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
  return await taskDb.find().sort({taskName:1})
}

const findTask = async (name) => {
  return await taskDb.find({taskName: name})
}

const findSpan = async ({taskName, spanId, stopTime}) => {
  return await spanDb.find({taskName, spanId})
}

const taskSpanDuration = (taskId) => {
  // let tasks = {}
  return spanDb.find(taskId)
    .then(spans=> spans.reduce((acc, ele) => {
      let {taskName, taskId, stopTime, startTime} = ele;
      if (acc.hasOwnProperty(taskName)) {
          acc[taskName]["duration"] += (stopTime-startTime)
      } else {
        acc[taskName] = {
          taskId,
          duration: (stopTime - startTime)
        }
      }    
      return acc
    },{})
  )
}

const parseTaskSpan = ({taskName, taskId, startTime, stopTime}) => {
  return {}
}

module.exports = {
  findOrCreateTask, /*insertTask,*/ insertSpan, taskSpanDuration, updateSpan, /*loadAllTasks,*/ loadTasks, findTask
}

// let task = {
//   task_name: ''
// }

// let spans = {
//   task_name: '',
//   start_time:null,
//   end_time:null
// }