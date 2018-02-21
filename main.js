'use strict';

let electron = require('electron');

let app = electron.app;

let BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

var appWidth = 400;

var appHeight = 725;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        height: appHeight,
        width: appWidth,
        resizable: false,
        frame: false
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});