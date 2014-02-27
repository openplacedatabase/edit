$(window).load(function(){
  var doc = document,
      oError = null,
      oFileIn = doc.getElementById('fileIn'),
      oFileReader = new FileReader(),
      oImage = new Image();

  // Add file event listener
  oFileIn.addEventListener('change', function() {
    var oFile = this.files[0],
        oLogInfo = doc.getElementById('logInfo'),
        rFltr = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
    
    try {
      if (rFltr.test(oFile.type)) {
        oFileReader.readAsDataURL(oFile);
        oLogInfo.setAttribute('class', 'message info');
        throw 'Preview for ' + oFile.name;
      } else {
        oLogInfo.setAttribute('class', 'message error');
        throw oFile.name + ' is not a valid image';
      }
    } catch (err) {
      if (oError) {
        oLogInfo.removeChild(oError);
        oError = null;
        $('#logInfo').fadeOut();
        $('#imgThumb').fadeOut();
      }
      oError = doc.createTextNode(err);
      oLogInfo.appendChild(oError);
      $('#logInfo').fadeIn();
    }

  }, false);
  
  // When a file is loaded point the image to it
  oFileReader.addEventListener('load', function (e) {
    oImage.src = e.target.result;
  }, false);

  // When the image is loaded put it on the canvas
  oImage.addEventListener('load', function () {
    if (oCanvas) {
      oCanvas = null;
      oContext = null;
      $('#imgThumb').fadeOut();
    }

    var oCanvas = doc.getElementById('imgThumb');
        oContext = oCanvas.getContext('2d');
        sCanvas = doc.getElementById('imgSource');
        sContext = sCanvas.getContext('2d');
        nWidth = (this.width > 500) ? this.width / 1 : this.width;
        nHeight = (this.height > 500) ? this.height / 1 : this.height;
    
    oCanvas.setAttribute('width', nWidth);
    oCanvas.setAttribute('height', nHeight);
    oContext.drawImage(this, 0, 0, nWidth, nHeight);
    sCanvas.setAttribute('width', nWidth);
    sCanvas.setAttribute('height', nHeight);
    sContext.drawImage(this, 0, 0, nWidth, nHeight);
    $('#imgThumb').fadeIn();
  }, false);
});