// Teachable Machine and ml5.js
// Intro to ML for the Arts, IMA Fall 2021
// https://github.com/ml5js/Intro-ML-Arts-IMA-F21

// Classifier Variable
let classifier;
// Model URL
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/_y1fWFlQL/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Load the model first
function preload() {
  // eslint-disable-next-line prefer-template
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(320*2, 260*2);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320*2, 240*2);
  video.hide();
  

//-------------------------
/*
// Ekranın gerçek genişliğini ve yüksekliğini al
createCanvas(windowWidth, windowHeight);

// Kamerayı oluştur ve boyutlarını ayarla
video = createCapture(VIDEO);

// Video akışının doğal en-boy oranını al (isteğe bağlı, ancak orantıyı daha hassas kontrol etmek için faydalı olabilir)
// const aspectRatio = video.width / video.height;

// Videoyu ekran boyutlarına sığdır (orantıyı koruyarak)
video.size(width, height); // Genişlik ve yüksekliği ekran boyutlarına ayarla
video.hide();
*/
//-------------------------

  
  flippedVideo = ml5.flipImage(video)
  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  // Draw the video
  image(flippedVideo, 0, 0);

  // Draw the label
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video)
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}
