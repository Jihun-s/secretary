const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
const transcription = document.getElementById('transcription');
const visualizer = document.getElementById('visualizer');
const audioContext = new AudioContext();
const canvasContext = visualizer.getContext('2d');

let mediaRecorder;
let audioChunks = [];

recordButton.onclick = () => {
    audioContext.resume().then(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioSource = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                audioSource.connect(analyser);
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                function draw() {
                    requestAnimationFrame(draw);
                    analyser.getByteFrequencyData(dataArray);
                    canvasContext.fillStyle = 'rgb(200, 200, 200)';
                    canvasContext.fillRect(0, 0, visualizer.width, visualizer.height);
                    const barWidth = (visualizer.width / bufferLength) * 2.5;
                    let barHeight;
                    let x = 0;
                    for(let i = 0; i < bufferLength; i++) {
                        barHeight = dataArray[i]/2;
                        canvasContext.fillStyle = 'rgb(50,50,50)';
                        canvasContext.fillRect(x, visualizer.height-barHeight/2, barWidth, barHeight);
                        x += barWidth + 1;
                    }
                }
                draw();

                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    sendDataToServer(audioBlob);
                };
                mediaRecorder.start();
                stopButton.disabled = false;
                recordButton.disabled = true;
            });
    });
};

stopButton.onclick = () => {
    mediaRecorder.stop();
    stopButton.disabled = true;
    recordButton.disabled = false;
};

function sendDataToServer(audioBlob) {
    const formData = new FormData();
    formData.append('file', audioBlob);

    fetch('http://localhost:8888/secretary/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        transcription.textContent = 'Transcription: ' + data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}