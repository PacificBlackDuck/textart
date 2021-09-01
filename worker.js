
addEventListener("message", msg);

function msg(e){
    postMessage(makeArt(e.data[0], e.data[1], e.data[2], e.data[3]));
}


function makeArt(imgData, threshold, dither, invert){
    var i = 0;
    var bwArray = [];
    var length = imgData.width * imgData.height * 4;
    if (dither) {
        imgData.data = dither_atkinson(imgData, imgData.width, threshold);
    }
    while (i < length) {
        var avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;

        bwArray.push((avg >= threshold) ^ invert);

        i += 4;
    }

    var length = bwArray.length;
    var i = 0;
    var result = "";
    while (i < length) {
        for (var j = 0; j < imgData.width; j++) {
            var pixel1 = bwArray[i + j];
            var pixel2 = bwArray[i + j + imgData.width];
            if (pixel2 == undefined) {
                pixel2 = true ^ invert;
            }
            if (pixel1 && pixel2) {
                result += " ";
            } else if (!pixel1 && !pixel2) {
                result += "█";
            } else if (pixel1 && !pixel2) {
                result += "▄";
            } else if (!pixel1 && pixel2) {
                result += "▀";
            }
        }

        result += "\n";
        i += imgData.width * 2;
    }

    return result;
}

function dither_atkinson(image, imageWidth, threshold) {
    skipPixels = 4;

    imageLength = image.data.length;

    for (currentPixel = 0; currentPixel <= imageLength; currentPixel += skipPixels) {

        if (image.data[currentPixel] <= threshold) {

            newPixelColour = 0;

        } else {

            newPixelColour = 255;

        }

        err = parseInt((image.data[currentPixel] - newPixelColour) / 8, 10);
        image.data[currentPixel] = newPixelColour;

        image.data[currentPixel + 4] += err;
        image.data[currentPixel + 8] += err;
        image.data[currentPixel + (4 * imageWidth) - 4] += err;
        image.data[currentPixel + (4 * imageWidth)] += err;
        image.data[currentPixel + (4 * imageWidth) + 4] += err;
        image.data[currentPixel + (8 * imageWidth)] += err;

        image.data[currentPixel + 1] = image.data[currentPixel + 2] = image.data[currentPixel];

    }

    return image.data;
}