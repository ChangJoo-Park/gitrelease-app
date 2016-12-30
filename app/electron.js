'use strict'

const electron = require('electron')
const path = require('path')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menubar = require('menubar')

let config = {}

if (process.env.NODE_ENV === 'development') {
  config = require('../config')
  config.url = `http://localhost:${config.port}`
} else {
  config.devtron = false
  config.url = `file://${__dirname}/dist/index.html`
}

const mb = Menubar({
  width: 400,
  height: 400,
  preloadWindow: true
})

mb.on('ready', function () {
  mb.window.loadURL(config.url)
})