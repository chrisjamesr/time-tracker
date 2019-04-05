const {app} = require('electron');

const Datastore = require('nedb-promises');
const dbFactory = (fileName) => Datastore.create({
  filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/data/${fileName}`, 
  timestampData: true,
  autoload: true
});

const db = {
  tasks: dbFactory('tasks.js'),
  spans: dbFactory('spans.js')
  // projects: dbFactory('projects.js'),
  // clients: dbFactory('client.js')
}
.ensureIndex({fieldName : 'year'});



let task = {
  task_id: 0
  project_name: 0 
  task_name: '', 
}

let spans = {
  task_id:
  start_time:
  end_time:
}

