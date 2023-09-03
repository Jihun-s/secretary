document.addEventListener("DOMContentLoaded", function() {
    let audioContext;
    
    // 각 필드별 음성 입력 버튼과 입력란에 대한 참조를 가져옵니다.
    const buttons = {
        foodName: {
            btn: document.getElementById('recordFoodName'),
            input: document.getElementById('foodName'),
        },
        foodQuantity: {
            btn: document.getElementById('recordFoodQuantity'),
            input: document.getElementById('foodQuantity'),
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

    document.getElementById('submitDataButton').addEventListener('click', function(event) {
        alert("Fridge ID before submitting: " + $('.fridgeSelect').val());
        let selectedFridgeId = Number($('.fridgeSelect').val());  // 선택된 냉장고의 ID 값을 가져옵니다.
        
        if (!selectedFridgeId || isNaN(parseInt(selectedFridgeId))) {
            event.preventDefault();  // 폼 제출 중단
            return;
        }
    
        // 선택된 냉장고 ID로 모든 hidden input 값을 설정
        let productsContainer = document.getElementById('productsContainer');
        let hiddenInputs = productsContainer.querySelectorAll('[name^="fridgeFoods["][name$="].fridgeId"]');
        hiddenInputs.forEach(input => {
            input.value = selectedFridgeId;
        });
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
            // 임시로 OCR 결과 출력 (이 부분을 상품명 추출로 변경해야 합니다.)
            //document.getElementById('ocrResult').innerText = data;
    
            // 상품명 추출 (이 부분에서 정규식을 사용하게 될 것입니다.)
            let productNames = extractProductNames(data); // 정규식을 사용하는 함수
    
            // 추출된 상품명을 HTML에 추가
            appendProductNamesToHTML(productNames);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    // 상품명 추출 함수 (여기서 정규식을 사용합니다.)
    function extractProductNames(ocrText) {
        const productLines = ocrText.match(/^\d{3}\sP.*$/gm);
        
        // 상품명만 추출하기 위한 정규식 패턴
        const productNamePattern = /^\d{3}\sP\s(.+?)(?:\s\*\d+|\s\d{13}|\s\d{3,4})?$/;
    
        const productNames = productLines.map(line => {
            const match = line.match(productNamePattern);
            return match ? match[1].trim() : null;
        }).filter(name => name); // null 값을 제거
    
        return productNames;
    }
    
    // 추출된 상품명을 HTML에 추가하는 함수
    function appendProductNamesToHTML(productNames) {
        let productsContainer = document.getElementById('productsContainer');
    
        // 헤더 생성
        let headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'mb-2', 'bg-light', 'p-2');
        headerDiv.innerHTML = `
            <div style="width: 20%;" class="text-center"><strong>카테고리</strong></div>
            <div style="width: 60%;" class="text-center"><strong>상품명</strong></div>
            <div style="width: 20%;" class="text-center"><strong>수량</strong></div>
        `;
        productsContainer.appendChild(headerDiv);
    
        productNames.forEach((product, index) => {
            let productDiv = document.createElement('div');
            productDiv.classList.add('d-flex', 'mb-2');
    
            

            // 카테고리 입력
            let categorySelect = document.createElement('select');
            categorySelect.setAttribute('name', `fridgeFoods[${index}].foodCategory`);
            categorySelect.classList.add('form-control', 'flex-fill');
            const categories = ['일반', '야채', '생선', '육류'];
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category;
                option.text = category;
                categorySelect.appendChild(option);
            });
            productDiv.appendChild(categorySelect);
    
            // 상품명 입력
            let nameInput = document.createElement('input');
            nameInput.value = product;
            nameInput.setAttribute('name', `fridgeFoods[${index}].foodName`);
            nameInput.classList.add('form-control', 'flex-fill');
            productDiv.appendChild(nameInput);
    
            // 수량 입력
            let quantityInput = document.createElement('input');
            quantityInput.value = '1'; // Default 값
            quantityInput.setAttribute('name', `fridgeFoods[${index}].foodQuantity`);
            quantityInput.setAttribute('type', 'number');
            quantityInput.setAttribute('min', '1');
            quantityInput.classList.add('form-control');
            quantityInput.style.width = '60px';
            productDiv.appendChild(quantityInput);

            // 냉장고 ID의 hidden input 생성 (값은 아직 설정하지 않음)
            let fridgeIdInput = document.createElement('input');
            fridgeIdInput.setAttribute('type', 'hidden');
            fridgeIdInput.setAttribute('name', `fridgeFoods[${index}].fridgeId`);
            productDiv.appendChild(fridgeIdInput);
    
            productsContainer.appendChild(productDiv);
        });
    
        // + 버튼 추가
        let addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.classList.add('btn', 'btn-primary', 'mt-2');
        addButton.addEventListener('click', function(event) {
            event.preventDefault();
    
            let index = productsContainer.children.length - 2;  // Adjust index for added products
    
            let newProductDiv = document.createElement('div');
            newProductDiv.classList.add('d-flex', 'mb-2');
    
            let categorySelect = document.createElement('select');
            categorySelect.setAttribute('name', `fridgeFoods[${index}].foodCategory`);
            categorySelect.classList.add('form-control', 'flex-fill');
            const categories = ['일반', '야채', '생선', '육류'];
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category;
                option.text = category;
                categorySelect.appendChild(option);
            });
            newProductDiv.appendChild(categorySelect);
    
            let nameInput = document.createElement('input');
            nameInput.setAttribute('name', `fridgeFoods[${index}].foodName`);
            nameInput.classList.add('form-control', 'flex-fill');
            newProductDiv.appendChild(nameInput);
    
            let quantityInput = document.createElement('input');
            quantityInput.value = '1';
            quantityInput.setAttribute('name', `fridgeFoods[${index}].foodQuantity`);
            quantityInput.setAttribute('type', 'number');
            quantityInput.setAttribute('min', '1');
            quantityInput.classList.add('form-control');
            quantityInput.style.width = '60px';
            newProductDiv.appendChild(quantityInput);
    
            productsContainer.insertBefore(newProductDiv, addButton);
        });
        productsContainer.appendChild(addButton);
    }
});