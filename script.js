const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo());
function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject=stream,
        err => console.error(err)
    )
}


startVideo();
video.addEventListener('play', ()=>{
    const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender();
console.log(detections[0].age);
console.log(detections[0].gender);
console.log(detections);
const resizedDetections = faceapi.resizeResults(detections, displaySize)
// console.log(faceapi.draw.drawFaceLandmarks(canvas, resizedDetections));
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    const ageGender= document.getElementById('ageAndGender');
    ageGender.innerHTML="<h2>Age:"+parseInt(detections[0].age)+" Gender:"+detections[0].gender+"</h2>"
    },100)
})