document.addEventListener("DOMContentLoaded", function() {
    let audioContext;
    
    // 각 필드별 음성 입력 버튼과 입력란에 대한 참조를 가져옵니다.
    const buttons = {
        foodName: {
            btn: document.getElementById('recordFoodName'),
            input: document.getElementById('foodName'),
        },
        foodAmount: {
            btn: document.getElementById('recordFoodAmount'),
            input: document.getElementById('foodAmount'),
        },
        foodPrice: {
            btn: document.getElementById('recordFoodPrice'),
            input: document.getElementById('foodPrice'),
        },
        foodCategory: {
            btn: document.getElementById('recordFoodCategory'),
            input: document.getElementById('foodCategory'),
        },
    };
    
    function startRecording(btn, input) {
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mediaRecorder = new MediaRecorder(stream);
    
                let audioChunks = [];
    
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
    
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    sendDataToServer(audioBlob, input);
                };
    
                btn.onclick = () => {
                    mediaRecorder.stop();
                    btn.src = 'images/fridgeimg/MikeButton.png';
                    btn.onclick = () => startRecording(btn, input);  // 이벤트 핸들러를 원래의 상태로 복원
                };
    
                mediaRecorder.start();
                btn.src = 'images/fridgeimg/MikeButtonOn.png';
            });
    }
    
    function sendDataToServer(audioBlob, input) {
        const formData = new FormData();
        formData.append('file', audioBlob);
    
        fetch('http://localhost:8888/secretary/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (input.id === 'foodCategory') {
                let isCategoryValid = false;
                const options = input.querySelectorAll('option');
                options.forEach(option => {
                    if (option.value === data) {
                        isCategoryValid = true;
                    }
                });
                
                if (!isCategoryValid) {
                    alert(`'${data}' 카테고리는 존재하지 않습니다.`);
                    return;
                }
            }
            input.value = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    Object.values(buttons).forEach(({ btn, input }) => {
        btn.onclick = () => startRecording(btn, input);
    });
    document.getElementById('uploadReceiptButton').addEventListener('click', function() {
        let fileInput = document.getElementById('receiptUpload');
        if (!fileInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }
    
        let formData = new FormData();
        formData.append('file', fileInput.files[0]);
    
        fetch('detect-text', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById('ocrResult').innerText = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});