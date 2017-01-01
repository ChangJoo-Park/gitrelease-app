'use strict'

const electron = require('electron')
const path = require('path')
const open = require('open')
const app = electron.app
const ipcMain = electron.ipcMain
const BrowserWindow = electron.BrowserWindow
const Menubar = require('menubar')

// DB

let config = {}
if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
  config.dbPath = './'
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
  config.dbPath = app.getAppPath()
}

const Datastore = require('nedb')
const db = {};
const settingFileName = path.join(config.dbPath, 'setting.json');
const repoFileName = path.join(config.dbPath, 'repo.json');
db.setting = new Datastore({ filename: settingFileName, autoload: true });
db.repos = new Datastore({ filename: repoFileName, autoload: true });


const mb = Menubar({
  width: 400,
  height: 400,
  minWidth: 400,
  minHeight: 400,
  preloadWindow: true,
  alwaysOnTop: true
})

mb.on('ready', function () {
  mb.window.loadURL(config.url)

  ipcMain.on('db:initialize', function (event, arg) {

    db.setting.findOne({ id: 'default' }, function (err, doc) {
      if(doc) {
        console.log('exist setting');
        event.sender.send('db:response-setting', doc);
      } else {
        const defaultSetting = {
          id: 'default',
          sort: 'name-desc',
          refresh: 30
        }
        db.setting.insert(defaultSetting, function (err, newSetting) {
          console.log('new setting', newSetting);
          event.sender.send('db:response-setting', newSetting);
        })
      }
    });
    db.repos.find({}, function(err, docs){
      event.sender.send('db:response-repo', docs);
    })
  })


  // Open link with default browser
  mb.window.webContents.on('new-window', function (event, url) {
    console.log(url);
    open(url);
    event.preventDefault();
  });

})


ipcMain.on('db:add-repository', function(event, repo) {
  console.log(repo.id)
  db.repos.findOne({ id: repo.id }, function (err, doc) {
    if(doc) {
      console.log('is Exists', doc);
      event.sender.send('db:add-repository-response-error', {
        message: `${repo.full_name} is already exists.`
      });
      return;
    }
    console.log('Start Add', repo.id)
    db.repos.insert(repo, function (err, newDoc) {
      console.log('Add Success', repo.id)
      event.sender.send('db:add-repository-response-success', newDoc);
    })
  })
})

ipcMain.on('db:remove-repository', function(event, repo) {
  console.log('db:remove-repository', repo._id)
  db.repos.remove({ _id: repo._id }, {}, function (err, numRemoved) {
    console.log('Remove!!', numRemoved)
    event.sender.send('db:remove-repository-response', repo.index)
  })
})

ipcMain.on('db:update-setting', function(event, newSetting) {
  console.log(newSetting);
  db.setting.update({ _id: newSetting._id }, { $set: { sort: newSetting.sort, refresh: newSetting.refresh }}, {} , function (){
    event.sender.send('db:update-setting-response')
  })
})
