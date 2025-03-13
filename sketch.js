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
let selectedSizeIndex = 0; // Varsayılan olarak ilk seçenek
let dropdown;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  // Canvas'ı başlangıç boyutuyla oluştur
  createCanvas(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  
  // Dropdown menü oluştur
  dropdown = createSelect();
  dropdown.position(10, 10);
  for (let option of sizeOptions) {
    dropdown.option(option.name);
  }
  dropdown.changed(updateVideoSize);
  
  // Video oluştur
  setupVideo();
  
  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function setupVideo() {
  if (video) video.remove(); // Eski videoyu kaldır
  
  video = createCapture({
    video: {
      width: sizeOptions[selectedSizeIndex].width,
      height: sizeOptions[selectedSizeIndex].height
    }
  });
  video.size(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  video.hide();
}

function updateVideoSize() {
  selectedSizeIndex = dropdown.elt.selectedIndex;
  resizeCanvas(sizeOptions[selectedSizeIndex].width, sizeOptions[selectedSizeIndex].height);
  setupVideo();
  flippedVideo = ml5.flipImage(video);
}

function draw() {
  background(0);
  
  // Videoyu orantılı şekilde çiz
  image(flippedVideo, 0, 0, width, height);
  
  // FPS hesaplama ve görüntüleme (üstte kalacak)
  fps = frameRate();
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`FPS: ${fps.toFixed(1)}`, 10, 30); // Dropdown'un altına yerleştiriyoruz
  
  // Label'ı alt kısımda gösterme
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
