// Teachable Machine and ml5.js
let classifier;
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/_y1fWFlQL/';
let img;
let label = "";
let fileInput;
let classifyButton;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(640, 480); // Varsayılan bir canvas boyutu
  
  // Dosya yükleme inputu
  fileInput = createFileInput(handleFile);
  fileInput.position(10, 10);
  
  // Sınıflandırma butonu
  classifyButton = createButton('Fotoğrafı Sınıflandır');
  classifyButton.position(10, 40);
  classifyButton.mousePressed(classifyImage);
  
  // Başlangıç mesajı
  textAlign(CENTER);
  textSize(20);
  fill(255);
  text("Bir fotoğraf yükleyin ve sınıflandırın", width/2, height/2);
}

function handleFile(file) {
  if (file.type === 'image') {
    img = createImg(file.data, '');
    img.hide();
    // Görüntüyü canvas boyutuna sığdır
    image(img, 0, 0, width, height);
  } else {
    console.log('Lütfen bir resim dosyası seçin');
  }
}

function classifyImage() {
  if (img) {
    classifier.classify(img, gotResult);
  } else {
    label = "Önce bir fotoğraf yükleyin";
  }
}

function draw() {
  background(0);
  
  // Eğer bir resim yüklendiyse göster
  if (img) {
    image(img, 0, 0, width, height);
  }
  
  // Label'ı alt kısımda beyaz yazıyla gösterme
  fill(255);
  textSize(20);
  textAlign(CENTER);
  text(label, width / 2, height - 10);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
}
