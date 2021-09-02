
addEventListener("message", msg);

function msg(e){
    postMessage(makeArt(e.data[0], e.data[1], e.data[2], e.data[3], e.data[4]));
}


function makeArt(imgData, threshold, dither, invert, trim){
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
                pixel2 = pixel1;
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

    if (trim) {
        result = trimLeft(result);
        result = trimRight(result);
    }

    return result;
}

function trimLeft(text){
    var lines = text.split("\n");
    var linecount = lines.length;
    var smallest;

    for (var i = 0; i < linecount; i++) {
        var chars = Array.from(lines[i]);
        var charcount = chars.length;

        var counter = 0;

        for (var j = 0; j < charcount; j++) {
            if (chars[j] == " "){
                counter++;
            } else {
                if (smallest == undefined) {
                    smallest = counter;
                } else if (counter < smallest) {
                    smallest = counter;
                }
                break;
            }
        }

    }

    if (smallest == undefined) {return text};

    for (var i = 0; i < linecount; i++) {
        lines[i] = lines[i].substr(smallest);
    }

    return lines.join("\n");
}

function trimRight(text){
    return text.replace(/ *$/gm, "");
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