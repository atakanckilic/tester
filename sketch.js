// Teachable Machine and ml5.js
let classifier;
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/_y1fWFlQL/';
let video;
let flippedVideo;
let label = "";
let fps = 0;

// Kamera boyutu seçenekleri
const sizeOptions = [
  { width: 320, height: 240, name: "320x240" },
  { width: 640, height: 480, name: "640x480" },
  { width: 1280, height: 960, name: "1280x960" }
];
let selectedSizeIndex = 0;

// Kamera yönü seçenekleri
const facingModes = [
  { name: "Arka Kamera", value: "environment" },
  { name: "Ön Kamera", value: "user" }
];
let selectedFacingMode = 0;

let sizeDropdown;
let cameraDropdown;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  
  // Boyut seçim dropdown
  sizeDropdown = createSelect();
  sizeDropdown.position(10, 10);
  for (let option of sizeOptions) {
    sizeDropdown.option(option.name);
  }
  sizeDropdown.changed(updateVideoSize);
  
  // Kamera yönü seçim dropdown
  cameraDropdown = createSelect();
  cameraDropdown.position(10, 40);
  for (let mode of facingModes) {
    cameraDropdown.option(mode.name);
  }
  cameraDropdown.changed(updateCameraFacing);
  
  setupVideo();
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function setupVideo() {
  if (video) video.remove();
  
  video = createCapture({
    video: {
      width: sizeOptions[selectedSizeIndex].width,
      height: sizeOptions[selectedSizeIndex].height,
      facingMode: facingModes[selectedFacingMode].value
    }
  });
  video.size(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  video.hide();
}

function updateVideoSize() {
  selectedSizeIndex = sizeDropdown.elt.selectedIndex;
  resizeCanvas(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  setupVideo();
  flippedVideo = ml5.flipImage(video);
}

function updateCameraFacing() {
  selectedFacingMode = cameraDropdown.elt.selectedIndex;
  setupVideo();
  flippedVideo = ml5.flipImage(video);
}

function draw() {
  background(0);
  image(flippedVideo, 0, 0, width, height);
  
  // FPS için siyah arka planlı kutu
  fill(0); // Siyah arka plan
  rect(width - 70, 0, 70, 25); // Sağ üstte 70x25 boyutunda kutu
  
  // FPS kırmızı yazı
  fps = frameRate();
  fill(255, 0, 0); // Kırmızı renk
  textSize(16);
  textAlign(RIGHT);
  text(`FPS: ${fps.toFixed(1)}`, width - 5, 18);
  
  // Label'ı alt kısımda beyaz yazıyla gösterme
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
