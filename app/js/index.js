//
// document.body.appendChild(downloadItem);
// console.log(downloadItem.innerHTML);
//
// var downloadItem2 = document.createElement('div');
// downloadItem2.innerHTML = downloadItem.innerHTML;
//
// document.body.appendChild(downloadItem2);


function createDOMDownloadItem(item) {
    var downloadItem = document.createElement("div");
    var downloadImage = document.createElement("img");
    var downloadTitle = document.createElement("div");
    var downloadURL = document.createElement("a");
    var downloadDetails = document.createElement("div");

    downloadItem.className += ' download-item';
    downloadImage.className += ' download-item__image';
    downloadTitle.className += 'download-item__title';
    downloadURL.className += 'download-item__url';
    downloadDetails.className += 'download-item__details';

    downloadItem.appendChild(downloadImage);
    downloadItem.appendChild(downloadTitle);
    downloadItem.appendChild(downloadURL);
    downloadItem.appendChild(downloadDetails);

    downloadTitle.innerText = item.name;
    downloadImage.src = item.image;
    downloadImage.style.width = '40px';
    downloadImage.style.height = 'auto';

    downloadURL.href = item.downloadLink;
    downloadURL.innerText = 'Download File';
    return downloadItem;
}


function downloadItem(filename = 'Filename', link = 'http://www.pdf995.com/samples/pdf.pdf', image = 'img/downloadPlaceholder.svg') {
    this.name = filename;
    this.image = image;
    this.downloadLink = link;


}

function populateDownloads() {
    var item1 = new downloadItem('PDF');
    var item2 = new downloadItem('Txt', 'http://25.io/toau/audio/sample.txt', 'img/TXT.png');

    var downloadList = [item1, item2];

    for(var i = 0; i < downloadList.length; i++)
    {
        document.body.appendChild(createDOMDownloadItem(downloadList[i]));
    }
}


populateDownloads();