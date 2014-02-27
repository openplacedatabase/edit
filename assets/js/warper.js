$(window).ready(function(){
  resizeContainers(); 
  setupImageControls();
});

// Reset height of columns when window changes size
$(window).resize(resizeContainers);

/**
 * Sets up the container, events, and controls for the original image
 */
function setupImageControls(){
  
  var fileIn = document.getElementById('file-in'),
      fileReader = new FileReader(),
      image = document.getElementById('loaded-image'),
      jImage = $(image);
  
  fileIn.addEventListener('change', function(){
    loadImage(this.files[0], fileReader);
  }, false);
  
  fileReader.addEventListener('load', function (e) {
    image.src = e.target.result;
  }, false);
  
  image.addEventListener('load', function () {
    // Reset image zoom
    jImage.css('width', '100%').data('zoom_percent', 1);
  }, false);
  
  $('#image-zoom-in').click(function(){
    changeImageZoom(.1);
  });
  $('#image-zoom-out').click(function(){
    changeImageZoom(-.1);
  });
};

/**
 * Change the image zoom by a given percentage
 */
function changeImageZoom(changePercent){
  var image = $('#loaded-image'),
      newZoom = image.data('zoom_percent') + changePercent,
      scale = 'scale(' + newZoom + ')';
  image.css({
    'transform': scale,
    '-ms-transform': scale,
    '-webskit-transform': scale
  }).data('zoom_percent', newZoom);
};

/**
 * Called when the user selects a file
 */
function loadImage(file, fileReader) {
  var rFltr = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
  if (rFltr.test(file.type)) {
    fileReader.readAsDataURL(file);
  } else {
    console.error(file.name + ' is not a valid image');
  }
};

/**
 * Make containers and columns fit the screen
 * Mostly worried about height; width is
 * handled with CSS
 */
function resizeContainers(){
  var headerHeight = $('#header').outerHeight(true),
      screenHeight = $(window).height(),
      columnHeight = screenHeight - headerHeight;
  $('#main').height(columnHeight);  
};