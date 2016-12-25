const electron = require('electron')
const Menubar = require('menubar')
// DB
const Datastore = require('nedb')
const ipcMain = electron.ipcMain

let db

const mb = Menubar({
  minWidth: 400, minHeight: 400
})

mb.on('ready', function () {
  db = new Datastore({filename: '~/database.db', autoload: true})
  ipcMain.on('db:initialize', function (event, arg) {
    db.find({}, function (err, docs){
      event.sender.send('db:responseDB', docs)
    })
  })
  db.find({}, function (err, docs) {

  })
})

mb.on('after-create-window', function () {
  mb.window.openDevTools()
})


ipcMain.on('db:add-repository', function(event, repo) {
  db.insert(repo, function(err, newRepo) {
    event.sender.send('db:add-repository-response')
  })
})

ipcMain.on('db:remove-repository', function(event, repo) {
  db.remove({full_name : repo.full_name}, function(err, numRemoved) {
    event.sender.send('db:remove-repository-response')
  })
})
