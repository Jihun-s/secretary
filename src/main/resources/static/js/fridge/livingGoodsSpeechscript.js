document.addEventListener("DOMContentLoaded", function() {
    let audioContext;
    
    // 각 필드별 음성 입력 버튼과 입력란에 대한 참조를 가져옵니다.
    const buttons = {
        itemName: {
            btn: document.getElementById('recordFoodName'),
            input: document.getElementById('itemName'),
        },
        itemQuantity: {
            btn: document.getElementById('recordFoodQuantity'),
            input: document.getElementById('itemQuantity'),
        },
        itemPrice: {
            btn: document.getElementById('recordFoodPrice'),
            input: document.getElementById('itemPrice'),
        },
        itemCategory: {
            btn: document.getElementById('recordFoodCategory'),
            input: document.getElementById('itemCategory'),
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
            if (input.id === 'itemCategory') {
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

    /*

    영수증
    
    */

    // 전역 변수로 선언
    let combinedCategories = [];

    function fetchCategories() {
        return $.ajax({
            url: 'livingCategories',
            method: 'GET'
        })
    }
    
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
            // 상품명 추출
            let productNames = extractProductNames(data); // 정규식을 사용하는 함수
            // 서버에서 카테고리 목록 가져오기
            return fetchCategories().then(categories => {
                // 카테고리 목록 결합 (한 번만 실행)
                if (combinedCategories.length === 0) {
                    combinedCategories = [...DEFAULT_CATEGORIES, ...categories.map(cat => cat.itemCategory)];
                }
                // 추출된 상품명과 카테고리 목록을 HTML에 추가
                appendProductNamesToHTML(productNames);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    // 상품명 추출 함수 (여기서 정규식을 사용합니다.)
    function extractProductNames(ocrText) {
        // 상품 코드를 찾기 위한 정규식 패턴
        const productCodePattern = /\[\s*(\d+)\s*\]/g;
        
        // 상품 코드들을 배열로 저장
        const productCodes = [];
        let match;
        while ((match = productCodePattern.exec(ocrText)) !== null) {
            productCodes.push(match[1]);
        }

        // 추출된 상품명을 저장할 배열
        const productNames = [];
        
        // 각 상품 코드를 기반으로 상품명을 추출
        for (let i = 0; i < productCodes.length; i++) {
            // 현재 상품 코드와 다음 상품 코드 사이의 텍스트를 추출하는 정규식 패턴
            const pattern = new RegExp(
                '\\[\\s*' + productCodes[i] + '\\s*\\]' +
                '(.*?)' +
                (i < productCodes.length - 1 ? '\\[\\s*' + productCodes[i + 1] + '\\s*\\]' : '($|\\Z)'),
                's'
            );

            // 정규식으로 텍스트 섹션을 찾음
            const sectionMatch = ocrText.match(pattern);
            
            if (sectionMatch) {
                // 한글과 한글이 아닌 글자를 함께 추출하는 정규식 패턴
                const koreanPartMatch = sectionMatch[1].match(/([가-힣]+[^가-힣]*[가-힣]+)/);
                
                // 한글 부분이 있으면 상품명 배열에 추가
                if (koreanPartMatch) {
                    productNames.push(koreanPartMatch[0]);
                }
            }
        }

        // null이나 빈 문자열을 제거하고 상품명 배열을 반환
        return productNames.filter(name => name);
    }


    
    
    // 추출된 상품명을 HTML에 추가하는 함수
    const DEFAULT_CATEGORIES = ['욕실용품', '주방용품', '청소용품', '세탁용품', '일반물품'];

    function appendProductNamesToHTML(productNames) {
        let productsContainer = document.getElementById('productsContainer');
        console.log("appendProductNamesToHTML called", productNames);
        console.log("productsContainer:", productsContainer);  // Null이 아닌지 확인

        // 헤더 생성
        let headerDiv = document.createElement('div');
        headerDiv.classList.add('d-flex', 'mb-2', 'bg-light', 'p-2');
        headerDiv.innerHTML = `
            <div style="width: 30%;" class="text-center"><strong>카테고리</strong></div>
            <div style="width: 30%;" class="text-center"><strong>상품명</strong></div>
            <div style="width: 20%;" class="text-center"><strong>수량</strong></div>
            <div style="width: 20%;" class="text-center"><strong>가격</strong></div>
            <div style="width: 7%;" class="text-center"><strong>삭제</strong></div>
            `;
        productsContainer.appendChild(headerDiv);

        productNames.forEach((product, index) => {
            let productDiv = document.createElement('div');
            productDiv.classList.add('d-flex', 'mb-2');
            productDiv.style.height = '40px';  // 높이 추가

            // 카테고리 입력
            let categorySelect = document.createElement('select');
            categorySelect.setAttribute('name', `livingGoods[${index}].itemCategory`);
            categorySelect.classList.add('form-control', 'flex-fill');

            combinedCategories.forEach(category => {
                let option = document.createElement('option');
                option.value = category;
                option.text = category;
                categorySelect.appendChild(option);
            });
            productDiv.appendChild(categorySelect);
            
            // 상품명 입력
            let nameInput = document.createElement('input');
            nameInput.value = product;
            nameInput.setAttribute('name', `livingGoods[${index}].itemName`);
            nameInput.classList.add('form-control', 'flex-fill');
            productDiv.appendChild(nameInput);
    
            // 수량 입력
            let quantityInput = document.createElement('input');
            quantityInput.value = '1'; // Default 값
            quantityInput.setAttribute('name', `livingGoods[${index}].itemQuantity`);
            quantityInput.setAttribute('type', 'number');
            quantityInput.setAttribute('min', '1');
            quantityInput.classList.add('form-control');
            quantityInput.style.width = '60px';
            productDiv.appendChild(quantityInput);

            // 가격 입력
            let priceInput = document.createElement('input');
            priceInput.value = '0'; // Default 값
            priceInput.setAttribute('name', `livingGoods[${index}].itemPrice`);
            priceInput.setAttribute('type', 'number');
            priceInput.setAttribute('min', '0');
            priceInput.classList.add('form-control');
            priceInput.style.width = '60px';
            productDiv.appendChild(priceInput);
            
            // 기존 상품 행의 삭제 텍스트
            let deleteText = document.createElement('span');
            deleteText.textContent = 'X';
            deleteText.classList.add('delete-text', 'ml-2');
            productDiv.appendChild(deleteText);

            deleteText.addEventListener('click', function(event) {
                productsContainer.removeChild(productDiv);
            });
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
            newProductDiv.style.height = '40px';  // 높이 추가

            let categorySelect = document.createElement('select');
            categorySelect.setAttribute('name', `livingGoods[${index}].itemCategory`);
            categorySelect.classList.add('form-control', 'flex-fill');

            combinedCategories.forEach(category => {
                let option = document.createElement('option');
                option.value = category;
                option.text = category;
                categorySelect.appendChild(option);
            });
            newProductDiv.appendChild(categorySelect);
    
            let nameInput = document.createElement('input');
            nameInput.setAttribute('name', `livingGoods[${index}].itemName`);
            nameInput.classList.add('form-control', 'flex-fill');
            newProductDiv.appendChild(nameInput);
    
            let quantityInput = document.createElement('input');
            quantityInput.value = '1';
            quantityInput.setAttribute('name', `livingGoods[${index}].itemQuantity`);
            quantityInput.setAttribute('type', 'number');
            quantityInput.setAttribute('min', '1');
            quantityInput.classList.add('form-control');
            quantityInput.style.width = '60px';
            newProductDiv.appendChild(quantityInput);

            let priceInput = document.createElement('input');
            priceInput.value = '0';
            priceInput.setAttribute('name', `livingGoods[${index}].itemPrice`);
            priceInput.setAttribute('type', 'number');
            priceInput.setAttribute('min', '0');
            priceInput.classList.add('form-control');
            priceInput.style.width = '60px';
            newProductDiv.appendChild(priceInput);

            // 새로 추가된 상품 행의 삭제 텍스트
            let newDeleteText = document.createElement('span');
            newDeleteText.textContent = 'X';
            newDeleteText.classList.add('delete-text', 'ml-2');
            newProductDiv.appendChild(newDeleteText);

            newDeleteText.addEventListener('click', function(event) {
                productsContainer.removeChild(newProductDiv);
            });
    
            productsContainer.insertBefore(newProductDiv, addButton);
        });
        productsContainer.appendChild(addButton);
    }
});