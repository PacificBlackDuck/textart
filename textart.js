function handleImage(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
        img = new Image();
        img.onload = drawPicture;
        img.src = event.target.result;
    }
    if (e.target.files[0]){
        reader.readAsDataURL(e.target.files[0]);
    }
}


document.getElementById("imageLoader").addEventListener("change", handleImage, false);
var threshold = document.getElementById("threshold");
var width = document.getElementById("width");
var trim = document.getElementById("trim");
var dither = document.getElementById("dither");
var invert = document.getElementById("invert");

width.addEventListener("change", drawPicture);
width.addEventListener("input", drawPicture);

threshold.addEventListener("change", generateTextArt);
threshold.addEventListener("input", generateTextArt);

trim.addEventListener("change", generateTextArt);

dither.addEventListener("change", generateTextArt);

invert.addEventListener("change", generateTextArt);

var textarea = document.getElementById("textarea");
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d", {
    alpha: false
});
var img;

var worker = new Worker('worker.js');
var working = false;
var workPending = false;

worker.addEventListener("message", workerMsg);

function workerMsg(e){
    textarea.value = e.data;
    textarea.style.width = canvas.width * 12 + "px";
    textarea.style.height = canvas.height * 12 + "px";
    working = false;
    if (workPending) {
        generateTextArt();
        workPending = false;
    }
}

function drawPicture() {
    canvas.width = (width.value >= 1) ? width.value : 1;
    canvas.height = (width.value >= 1) ? Math.round(width.value * (img.height / img.width)) : 1;
    context.imageSmoothingEnabled = false;
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log(canvas.toDataURL());
    generateTextArt();
}

function generateTextArt() {

    var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    if (!working) {
        worker.postMessage([imgData, threshold.value, dither.checked, invert.checked, trim.checked]);
        working = true;
    } else {
        workPending = true;
    }
    

    
}