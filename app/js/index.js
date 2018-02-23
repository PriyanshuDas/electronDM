//
// document.body.appendChild(downloadItem);
// console.log(downloadItem.innerHTML);
//
// var downloadItem2 = document.createElement('div');
// downloadItem2.innerHTML = downloadItem.innerHTML;
//
// document.body.appendChild(downloadItem2);

let fs = require('fs');
let path = require('path');
let {shell} = require('electron');

var ipcRenderer = require('electron').ipcRenderer;
var remote = require('electron').remote;

var downloadMap = new Map();

var downloadDir = remote.getGlobal('sharedObj').downloadDir;


function CreateDOMDownloadItem(item) {
    this.downloadItem = document.createElement("div");
    this.downloadImage = document.createElement("img");
    this.downloadTitle = document.createElement("div");
    this.downloadURL = document.createElement("a");
    this.downloadDetails = document.createElement("div");
    this.downloadButton = document.createElement('button');
    this.downloadFolder = document.createElement('button');
    this.downloadButtonImg = document.createElement('img');
    this.downloadFolderImg = document.createElement('img');
    this.downloadBar = document.createElement('div');
    this.progressBar = document.createElement('div');
    this.channel = item.channel;

    this.downloadBar.appendChild(this.downloadFolder);
    this.downloadBar.appendChild(this.progressBar);
    this.downloadButton.appendChild(this.downloadButtonImg);
    this.downloadFolder.appendChild(this.downloadFolderImg);
    this.downloadItem.className += ' download-item';
    this.downloadImage.className += ' download-item__image';
    this.downloadTitle.className += ' download-item__title';
    this.downloadURL.className += ' download-item__url';
    this.downloadDetails.className += ' download-item__details';
    this.downloadButton.className += ' download-item__button';
    this.downloadFolder.className += ' download-item__folder';
    this.downloadButtonImg.className += ' button__skin';
    this.downloadButtonImg.src = 'img/download.svg';
    this.downloadFolderImg.className += ' button__skin';
    this.downloadFolderImg.src = 'img/folder.svg';
    this.downloadBar.className += ' download-item__downloadBar';
    this.progressBar.className += ' progressBar';

    this.downloadFolder.style.display = 'none';

    this.downloadItem.appendChild(this.downloadImage);
    this.downloadItem.appendChild(this.downloadTitle);
    this.downloadItem.appendChild(this.downloadURL);
    this.downloadItem.appendChild(this.downloadDetails);
    this.downloadItem.appendChild(this.downloadButton);
    this.downloadItem.appendChild(this.downloadBar);
    this.downloadItem.appendChild(this.downloadFolder);

    this.downloadTitle.innerText = item.name;
    this.downloadImage.src = item.image;
    this.downloadImage.style.width = '40px';
    this.downloadImage.style.height = 'auto';

    this.downloadURL.href = item.downloadLink;
    this.downloadURL.innerText = 'Download File';

    // this.downloadExists = false;
    this.verify = function() {
        var filePath = path.join(downloadDir, path.basename(this.downloadURL.href));
        if (fs.existsSync(filePath)) {
            this.downloadFolder.style.display = 'inline-block';
            this.progressBar.style.width = '100%';
        } else {
            this.downloadFolder.style.display = 'none';
        }
    };

    this.showInFolder = function() {
        var filePath = path.join(downloadDir, path.basename(this.downloadURL.href));
        shell.showItemInFolder(filePath);
    }
    this.verify();
}


function DownloadItem(filename = 'Filename', link = 'http://www.pdf995.com/samples/pdf.pdf', image = 'img/downloadPlaceholder.svg', channel = '#pdffile') {
    this.name = filename;
    this.image = image;
    this.downloadLink = link;
    this.channel = channel;
}

function populateDownloads() {
    var item1 = new DownloadItem('PDF');
    var item2 = new DownloadItem('Txt', 'http://25.io/toau/audio/sample.txt', 'img/TXT.png', '#txtfile');

    var downloadList = [item1, item2];

    for(var i = 0; i < downloadList.length; i++)
    {
        (function() {
            var newDownloadItem = new CreateDOMDownloadItem(downloadList[i]);
            var downloadButton = newDownloadItem.downloadButton;
            downloadMap.set(newDownloadItem.channel, newDownloadItem);
            downloadButton.addEventListener('click', function () {
                return onClickDownload(newDownloadItem);
            });
            newDownloadItem.downloadFolder.addEventListener('click', function() {
                newDownloadItem.showInFolder();
            });
            document.body.appendChild(newDownloadItem.downloadItem);
        })();
    }
}


populateDownloads();

function updateDownloadPercentage(item, percentage)
{
    var progressBar = item.getElementsByClassName('progressBar')[0];
    progressBar.style.width = `${percentage}%`;
}

function onClickDownload(item) {

    item.verify();
    updateDownloadPercentage(item.downloadItem, 0);
    console.log('sending Item Download Request : ', item);
    ipcRenderer.send('download-request', item.downloadURL.href, item.channel);
    // downloadUrl(item.downloadURL.href);
    // updateDownloadPercentage(item.downloadItem, 100);
}



    ipcRenderer.on('download-monitor', function(event, channel, percentage) {
    // var percentage = done*100/total;
    // console.log('Received Update! : ', id, ' ', done, '/', total);
    // console.log(downloadMap);
    var item = downloadMap.get(channel.toString());
    // console.log('item : ', item);
    updateDownloadPercentage(downloadMap.get(channel).downloadItem, percentage);
    if(percentage == 100)
    {
        // item.finished = true;
        item.verify();
    }
});