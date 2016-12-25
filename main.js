const electron = require('electron')
const Menubar = require('menubar')
const ipcMain = electron.ipcMain
const app = electron.app
const path = require('path')


// DB
const Datastore = require('nedb')
const db = {};
const settingFileName = path.join(app.getAppPath(), 'setting.json');
const repoFileName = path.join(app.getAppPath(), 'repo.json');
db.setting = new Datastore({ filename: settingFileName, autoload: true });
db.repos = new Datastore({ filename: repoFileName, autoload: true });

const mb = Menubar({
  minWidth: 400, minHeight: 400, preloadWindow: true
})

mb.on('ready', function () {
  ipcMain.on('db:initialize', function (event, arg) {
    db.repos.find({}, function(err, docs){
      event.sender.send('db:responseDB', docs);
    })
  })
})

mb.on('after-create-window', function () {
  // mb.window.openDevTools()
})


ipcMain.on('db:add-repository', function(event, repo) {
  db.repos.findOne({ id: repo.id }, function (err, doc) {
    if(doc) {
      console.log('is Exists', doc);
      event.sender.send('db:add-repository-response-error', {
        message: `${repo.full_name} is already exists.`
      });
      return;
    }

    db.repos.insert(repo, function (err, newDoc) {
      event.sender.send('db:add-repository-response-success', newDoc);
    })
  })
})

ipcMain.on('db:remove-repository', function(event, repo) {
  db.repos.remove({ _id: repo._id }, {}, function (err, numRemoved) {
    console.log('Remove!!', numRemoved)
    event.sender.send('db:remove-repository-response')
  })
})
