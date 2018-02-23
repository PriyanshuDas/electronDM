//
// document.body.appendChild(downloadItem);
// console.log(downloadItem.innerHTML);
//
// var downloadItem2 = document.createElement('div');
// downloadItem2.innerHTML = downloadItem.innerHTML;
//
// document.body.appendChild(downloadItem2);
var ipcRenderer = require('electron').ipcRenderer;

var downloadMap = new Map();

function CreateDOMDownloadItem(item) {
    this.downloadItem = document.createElement("div");
    this.downloadImage = document.createElement("img");
    this.downloadTitle = document.createElement("div");
    this.downloadURL = document.createElement("a");
    this.downloadDetails = document.createElement("div");
    this.downloadButton = document.createElement('button');
    this.downloadButtonImg = document.createElement('img');
    this.downloadBar = document.createElement('div');
    this.progressBar = document.createElement('div');

    this.downloadBar.appendChild(this.progressBar);

    this.downloadButton.appendChild(this.downloadButtonImg);
    this.downloadItem.className += ' download-item';
    this.downloadImage.className += ' download-item__image';
    this.downloadTitle.className += ' download-item__title';
    this.downloadURL.className += ' download-item__url';
    this.downloadDetails.className += ' download-item__details';
    this.downloadButton.className += ' download-item__button';
    this.downloadButtonImg.className += ' button__skin';
    this.downloadButtonImg.src = 'img/download.svg';
    this.downloadBar.className += ' download-item__downloadBar';
    this.progressBar.className += ' progressBar';

    this.downloadItem.appendChild(this.downloadImage);
    this.downloadItem.appendChild(this.downloadTitle);
    this.downloadItem.appendChild(this.downloadURL);
    this.downloadItem.appendChild(this.downloadDetails);
    this.downloadItem.appendChild(this.downloadButton);
    this.downloadItem.appendChild(this.downloadBar);

    this.downloadTitle.innerText = item.name;
    this.downloadImage.src = item.image;
    this.downloadImage.style.width = '40px';
    this.downloadImage.style.height = 'auto';

    this.downloadURL.href = item.downloadLink;
    this.downloadURL.innerText = 'Download File';
}


function downloadItem(filename = 'Filename', link = 'http://www.pdf995.com/samples/pdf.pdf#pdffile', image = 'img/downloadPlaceholder.svg') {
    this.name = filename;
    this.image = image;
    this.downloadLink = link;
}

function populateDownloads() {
    var item1 = new downloadItem('PDF');
    var item2 = new downloadItem('Txt', 'http://25.io/toau/audio/sample.txt#textfile', 'img/TXT.png');

    var downloadList = [item1, item2];

    for(var i = 0; i < downloadList.length; i++)
    {
        (function() {
            var newDownloadItem = new CreateDOMDownloadItem(downloadList[i]);
            var downloadButton = newDownloadItem.downloadButton;
            downloadMap.set(newDownloadItem.downloadURL.href, newDownloadItem);
            downloadButton.addEventListener('click', function () {
                return onClickDownload(newDownloadItem);
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
    updateDownloadPercentage(item.downloadItem, 0);
    console.log('sending Item Download Request : ', item);
    ipcRenderer.send('download-request', item);
    downloadUrl(item.downloadURL.href);
    // updateDownloadPercentage(item.downloadItem, 100);
}



    ipcRenderer.on('download-monitor', function(event, id, done, total) {
    var percentage = done*100/total;
    console.log('Received Update! : ', id, ' ', done, '/', total);
    console.log(downloadMap);
    var item = downloadMap.get(id.toString());
    console.log('item : ', item);
    updateDownloadPercentage(downloadMap.get(id).downloadItem, percentage);
});