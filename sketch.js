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

// FPS sınırlama seçenekleri
const fpsOptions = [10, 15, 20, 25, 30];
let selectedFPSIndex = 2; // Varsayılan 20 FPS

let sizeDropdown;
let cameraDropdown;
let fpsDropdown;

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
  
  // FPS seçim dropdown
  fpsDropdown = createSelect();
  fpsDropdown.position(10, 70);
  for (let fps of fpsOptions) {
    fpsDropdown.option(fps);
  }
  fpsDropdown.selected(fpsOptions[selectedFPSIndex]); // Varsayılan 20 FPS
  fpsDropdown.changed(updateFPS);
  
  setupVideo();
  frameRate(fpsOptions[selectedFPSIndex]); // Başlangıç FPS ayarı
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

function updateFPS() {
  selectedFPSIndex = fpsDropdown.elt.selectedIndex;
  frameRate(fpsOptions[selectedFPSIndex]); // FPS'i güncelle
}

function draw() {
  background(0);
  image(flippedVideo, 0, 0, width, height);
  
  // FPS için siyah arka planlı kutu (font büyüyünce kutu da büyüdü)
  fill(0);
  rect(width - 210, 0, 210, 75); // 3 kat büyük font için kutu boyutunu artırdık
  
  // FPS kırmızı yazı (font 3 katına çıktı: 16 -> 48)
  fps = frameRate();
  fill(255, 0, 0);
  textSize(48); // 16'nın 3 katı
  textAlign(RIGHT);
  text(`FPS: ${fps.toFixed(1)}`, width - 15, 54); // Y koordinatı kutuya uyumlu
  
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
