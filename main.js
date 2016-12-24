const electron = require('electron')
const Menubar = require('menubar')

console.log('initialize menubar');
const menubar = Menubar();

menubar.on('ready', function () {
  console.log('Application is Ready');
})

menubar.on('after-create-window', function () {
  console.log('after-create-window');
})
