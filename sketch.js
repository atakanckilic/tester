// Teachable Machine and ml5.js
let classifier;
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/_y1fWFlQL/';
let video;
let flippedVideo;
let label = "";
let fps = 0;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  // Kamera çözünürlüğünü 4:3 oranına uygun hale getiriyoruz
  createCanvas(320, 240);  // Canvas boyutu video ile aynı olmalı
  video = createCapture({
    video: {
      width: 320,
      height: 240
    }
  });
  video.size(320, 240);
  video.hide();
  
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function draw() {
  background(0);
  
  // Videoyu orantılı şekilde çiziyoruz
  image(flippedVideo, 0, 0, width, height);
  
  // FPS hesaplama ve görüntüleme
  fps = frameRate();
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`FPS: ${fps.toFixed(1)}`, 10, 20);
  
  // Label'ı gösterme
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(label, width / 2, height - 10);
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo();
}
