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

let task = {
  task_name: ''
}

let spans = {
  task_name: '',
  start_time:null,
  end_time:null
}
module.exports = db
