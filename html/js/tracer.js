$(window).load(function(){

  // add reset button
  var resetbutton = document.getElementById('reset');

  resetbutton.addEventListener('click', function(evt) {
    var sourceCanvas = document.getElementById('imgSource');
    var sourceContext = sourceCanvas.getContext('2d');
    var thumbCanvas = document.getElementById('imgThumb');
    var thumbContext = thumbCanvas.getContext('2d');

    if(sourceCanvas && thumbCanvas) {
      var imgd = sourceContext.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);

      thumbContext.putImageData(imgd, 0, 0);
    }

  });

  var thumbCanvas = document.getElementById('imgThumb');

  thumbCanvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(thumbCanvas, evt);
    //console.log(message);

    var canvas = document.getElementById('imgSource');
    var context = canvas.getContext('2d');
    // Get the RGB for this pixel
    var imgd = context.getImageData(mousePos.x, mousePos.y, 1, 1);
    var origRGB = {
      r: imgd.data[0],
      g: imgd.data[1],
      b: imgd.data[2],
    };

    var origData = context.getImageData(0, 0, this.width, this.height);
    var newData = context.getImageData(0, 0, this.width, this.height);
    var origPix = origData.data;
    var newPix = newData.data;

    var lowest = Infinity;
    // Loop over each pixel and invert the color.
    for (var i = 0, n = origPix.length; i < n; i += 4) {
      var diff = getMinDiff(origRGB,origPix,i,this.width, this.height);
      if(diff < lowest) lowest = diff;
      
      if(diff < 29) {
        diff = 0;
      } else {
        diff = 255;
      }
      
      //diff = diff * 1.5;
      if(diff > 255) diff = 255;
      if(diff < 0) diff = 0;

      newPix[i  ] = diff;
      newPix[i+1] = diff;
      newPix[i+2] = diff;
    }

/*
    for (var i = 0, n = newPix.length; i < n; i += 4) {



    }
*/
    
    // Draw the ImageData at the given (x,y) coordinates.
    thumbCanvas.getContext('2d').putImageData(newData, 0, 0);
    console.log(lowest);
  }, false);


  function getMousePos(canvas, evt) {
      var rect = canvas.getBoundingClientRect();
      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  }

  function getAvgDiff(origRGB,arr,index,width, height) {
    var r = arr[index],
        g = arr[index+1],
        b = arr[index+2],
        divisor = 1,
        diff = getDiff(origRGB,{r:r,g:g,b:b}),
        tmpIdx,
        up = false,
        down = false,
        left = false,
        right = false;

    // Up
    tmpIdx = index - (width*4);
    if(tmpIdx >= 0) {
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
      up = true;
    }

    // Down
    tmpIdx = index + (width*4);
    if(tmpIdx+4 < arr.length) {
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
      down = true;
    }
   
    // Left
    tmpIdx = index - 4;
    if(index % (width*4) != 0) {
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
      left = true;
    }

    // Right
    tmpIdx = index + 4;
    if(tmpIdx % (width*4) != 0) {
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
      left = true;
    }
    
    // Up Left
    if(up && left) {
      tmpIdx = index - (width*4) - 4;
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
    }

    // Up Right
    if(up && right) {
      tmpIdx = index - (width*4) + 4;
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
    }

    // Down Left
    if(down && left) {
      tmpIdx = index + (width*4) - 4;
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
    }

    // Down Right
    if(down && right) {
      tmpIdx = index + (width*4) + 4;
      diff += getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      divisor++;
    }

    return diff/divisor;
  }

  function getMinDiff(origRGB,arr,index,width, height) {
    var r = arr[index],
        g = arr[index+1],
        b = arr[index+2],
        divisor = 1,
        diff = getDiff(origRGB,{r:r,g:g,b:b}),
        tmpIdx,
        tmpDiff,
        up = false,
        down = false,
        left = false,
        right = false;

    // Up
    tmpIdx = index - (width*4);
    if(tmpIdx >= 0) {
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
      up = true;
    }

    // Down
    tmpIdx = index + (width*4);
    if(tmpIdx+4 < arr.length) {
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
      down = true;
    }
   
    // Left
    tmpIdx = index - 4;
    if(index % (width*4) != 0) {
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
      left = true;
    }

    // Right
    tmpIdx = index + 4;
    if(tmpIdx % (width*4) != 0) {
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
      left = true;
    }
    
    // Up Left
    if(up && left) {
      tmpIdx = index - (width*4) - 4;
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
    }

    // Up Right
    if(up && right) {
      tmpIdx = index - (width*4) + 4;
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
    }

    // Down Left
    if(down && left) {
      tmpIdx = index + (width*4) - 4;
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
    }

    // Down Right
    if(down && right) {
      tmpIdx = index + (width*4) + 4;
      tmpDiff = getDiff(origRGB,{r:arr[tmpIdx],g:arr[tmpIdx+1],b:arr[tmpIdx+2]});
      if(tmpDiff < diff) diff = tmpDiff;
    }

    return diff;
  }

  function getDiff(e1,e2) {
    var rmean = ( e1.r + e2.r ) / 2;
    var r = e1.r - e2.r;
    var g = e1.g - e2.g;
    var b = e1.b - e2.b;
    return Math.sqrt((((512+rmean)*r*r)>>8) + 4*g*g + (((767-rmean)*b*b)>>8));
  }

});