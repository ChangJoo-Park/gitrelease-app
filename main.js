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
    console.log('db:initialize')
    db.find({}, function (err, docs){
      console.log('send db')
      event.sender.send('db:responseDB', docs)
    })
  })
  db.find({}, function (err, docs) {

  })
})

mb.on('after-create-window', function () {
  mb.window.openDevTools()
})

