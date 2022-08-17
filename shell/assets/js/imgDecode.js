function drop(e, id, setSrc) {
  let img;
  id = document.getElementById(id);
  e.stopPropagation();
  e.preventDefault();
  //
  var url = e.dataTransfer.getData("text/plain");
  // for img elements, url is the img src so
  // create an Image Object & draw to canvas
  if (url) {
    if (setSrc) {
      id.src = url;
    } else {
      sendMsg(`<img src="${url}"/>`);
    }
    console.log(url);
    // for img file(s), read the file & draw to canvas
  } else {
    if (setSrc) {
      handleFiles(e.dataTransfer.files, id, true);
    } else {
      handleFiles(e.dataTransfer.files, id, false);
    }
  }
}
// read & create an image from the image file
function handleFiles(files, id, setSrc) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /image.*/;
    if (!file.type.match(imageType)) {
      continue;
    }
    var reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        // convert image file to base64 string
        if (setSrc) {
          id.src = reader.result;
        } else {
          sendMsg(`<img src="${reader.result}"/>`);
        }
      },
      false
    );
    reader.readAsDataURL(file);
  } // end for
} // end handleFiles
function allowDrop(ev) {
  ev.preventDefault();
}
