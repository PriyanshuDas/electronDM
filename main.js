'use strict';

let electron = require('electron');

let app = electron.app;

let BrowserWindow = electron.BrowserWindow;

let mainWindow = null;
let axios = require('axios');

var appWidth = 400;

var appHeight = 725;
var ipcMain = require('electron').ipcMain;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        height: appHeight,
        width: appWidth,
        // resizable: false,
        // frame: false
    });

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);


    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        console.log(item);
        console.log('webContents : ', webContents);
        item.setSavePath(`/EDM/${item.getFilename()}`);
        // var replyChannel = item.getURL().substr(item.getURL().indexOf("#")+1, item.getURL().length);
        console.log('replyChannel is : ', item.getURL());
        item.on('updated', (event, state) => {
            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed');
            } else if (state === 'progressing') {
                if(item.isPaused()) {
                    console.log('Download is paused');
                } else {
                    mainWindow.webContents.send('download-monitor', item.getURL().toString(), item.getReceivedBytes(), item.getTotalBytes());
                    console.log(`Received bytes: ${item.getReceivedBytes()}`);
                }
            }
        })

        item.once('done', (event, state) => {
            if(state === 'completed') {
                console.log('Download successful');
            } else {
                console.log(`Download Failed: ${state}`);
            }
        })
    });
});


ipcMain.on('download-request', function(event, arg) {
    console.log('Received Download Request : ',arg);
})