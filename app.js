// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")

/* / New variables
var ACCESS_TOKEN = "sl.Abz6mqUVcgeA9VYcMQ3h7uHV003gF31S48oHHQwSeJkiWyTRv4JDJXsVnXRdV2CvZZKXbjjTYG8r8J5RQgXO_sFGt5X_KYYi9vLxIIWaDmVWeYgTYbIfiqLIlC-Rk21PxVsvad0";
var dbx = new Dropbox({
    accessToken: ACCESS_TOKEN
  });
var fileInput = document.getElementById('file-upload');
var file = fileInput.files[0];
*/


/**
 * Two variables should already be set.
 * dropboxToken = OAuth token received then signing in with OAuth.
 * file = file object selected in the file widget.
 */

var snap = cameraSensor;
var flatten = snap.getContext('2d');
dropboxToken = "WkxLpWo7IDAAAAAAAAAAGtgMq1cQMcMrjK3oMBE8l6pXE7tA4sSZ7zug0ZtSlhUR"; // make sure to change the how long you want this to be valid for in dropbox oauth settings


/* Convert canvas to file attempt 1
var blobBin = atob(dataURL.split(',')[1]);
var array = [];
for(var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
}
var file=new Blob([new Uint8Array(array)], {type: 'image/png'});*/


var xhr = new XMLHttpRequest();


// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
    .catch(function(error) {
        console.error("Oops. Something is broken.", error);
    });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");
    
    window.location.href=cameraSensor.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.

    // ---------------------------------------- new code

    // Convert canvas to file attempt 2 cont.
    // Convert canvas image to Base64
    var img = snap.toDataURL();
    // Convert Base64 image to binary
    var file = dataURItoBlob(img);

xhr.upload.onprogress = function(evt) {
    var percentComplete = parseInt(100.0 * evt.loaded / evt.total);
    // Upload in progress. Do something here with the percent complete.
};

xhr.onload = function() {
    if (xhr.status === 200) {
        var fileInfo = JSON.parse(xhr.response);
        // Upload succeeded. Do something here with the file info.
    }
    else {
        var errorMessage = xhr.response || 'Unable to upload file';
        // Upload failed. Do something here with the error.
    }
};

xhr.open('POST', 'https://content.dropboxapi.com/2/files/upload');
xhr.setRequestHeader('Authorization', 'Bearer ' + dropboxToken);
xhr.setRequestHeader('Content-Type', 'application/octet-stream');
xhr.setRequestHeader('Dropbox-API-Arg', JSON.stringify({
    path: '/' +  file.name,
    mode: 'add',
    autorename: true,
    mute: false
}));

xhr.send(file);
  /* /Get data from canvas
  var imageSringData = cameraSensor.toDataURL('image/png');
  //Convert it to an arraybuffer
  var imageData = _base64ToArrayBuffer(imageSringData);


  dbx.filesUpload({
      path: '/' + "test.png",
      contents: imageData
    })
    .then(function(response) {
      //var results = document.getElementById('results');
      //results.appendChild(document.createTextNode('File uploaded!'));
      console.log(response);
    })
    .catch(function(error) {
      console.error(error);
    });
  //return false;*/

};

// Convert canvas to file attempt 2
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

function _base64ToArrayBuffer(base64) {
  base64 = base64.split('data:image/png;base64,').join('');
  var binary_string = window.atob(base64),
    len = binary_string.length,
    bytes = new Uint8Array(len),
    i;

  for (i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
// -----------------------------

// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);