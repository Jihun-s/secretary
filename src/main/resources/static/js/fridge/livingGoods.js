$(document).ready(function () {
    $('#itemCategory').change(function () {
        if ($(this).val() === 'custom') {
            $('#customCategoryInput').show();
            $('#addCategoryBtn').show();
            $('button[type="submit"]').prop('disabled', true); // Submit 버튼 비활성화
        } else {
            $('#customCategoryInput').hide();
            $('#addCategoryBtn').hide();
            $('button[type="submit"]').prop('disabled', false); // Submit 버튼 활성화
        }
    });

    $('#addCategoryBtn').click(function () {
        const newCategory = $('#customCategoryInput').val().trim();

        let isDuplicate = false;
        $('#itemCategory option').each(function () {
            if (this.value === newCategory) {
                isDuplicate = true;
                return false; // loop 중단
            }
        });

        if (!isDuplicate) {
            // 서버에 카테고리 추가 요청
            $.ajax({
                url: 'livingCategories',
                method: 'POST',
                data: JSON.stringify({ itemCategory: newCategory }),
                contentType: 'application/json',
                success: function (response) {
                    if (response === -1) {
                        alert('미리 지정된 카테고리는 추가할 수 없습니다.');
                    } else if (response > 0) {
                        // 예를 들어, 서버에서 추가된 카테고리의 ID를 반환한다고 가정
                        $('#itemCategory').append(
                            `<option value="${newCategory}" selected>${newCategory}</option>`
                        );
                        $('#customCategoryInput').hide();
                        $('#addCategoryBtn').hide();
                        $('button[type="submit"]').prop('disabled', false); // Submit 버튼 활성화
                    } else {
                        alert('카테고리 추가에 실패했습니다.');
                    }
                },
                error: function (error) {
                    console.error('Error adding category:', error);
                },
            });
        } else {
            alert('이미 존재하는 카테고리입니다.');
        }
    });

    $.ajax({
        url: 'livingCategories',
        method: 'GET',
        success: function (categories) {
            categories.forEach(function (category) {
                $('#itemCategory').append(
                    `<option value="${category.itemCategory}">${category.itemCategory}</option>`
                );
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        },
    });

    function showItemsByCategory(selectedCategory) {
        // 모든 음식 목록에서 선택된 카테고리에 해당하는 음식만 화면에 표시
        $('.living-item').each(function () {
            const itemCategory = $(this).data('category');
            if (itemCategory === selectedCategory) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // 선택된 카테고리로 버튼 텍스트 업데이트
        $('#categoryDisplayButton').text(selectedCategory);
    }
    $(document).on('click', '.drop-category', function() {
        const selectedCategory = $(this).data('category');
        showItemsByCategory(selectedCategory);
    });
    // 카테고리 목록 가져오기
    $.ajax({
        url: 'livingCategories',
        method: 'GET',
        success: function (categories) {
            // 드롭다운에 카테고리 목록 추가
            const dropdownMenu = $('#categoryDisplayButton').siblings('.categoryDropdown');
            dropdownMenu.empty(); // 기존 목록 삭제
            dropdownMenu.append(
                `<li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="욕실용품">욕실용품</a></li>
                <li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="주방용품">주방용품</a></li>
                <li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="청소용품">청소용품</a></li>
                <li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="세탁용품">세탁용품</a></li>
                <li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="일반물품">일반물품</a></li>`
            );
            categories.forEach(function (category) {
                dropdownMenu.append(
                    `<li><a class="dropdown-item drop-category" href="javascript:void(0);" data-category="${category.itemCategory}">${category.itemCategory}</a></li>`
                );
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        },
    });


    // 전역 함수로 날짜 형식 변환 함수를 정의
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear().toString().substr(2, 2);
        return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    //아이템 출력
    function displayLivingItem(item) {
        var imagePath = item.itemSavedFile
            ? 'fridgeFood/image/' + item.itemSavedFile
            : 'images/fridgeimg/DefaultItem.png';
    
        var today = new Date();
        var expiryDate = item.itemExpiryDate ? new Date(item.itemExpiryDate) : null;
        var diffDays = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
    
        var dDayColor = 'blue';
        if (diffDays !== null && diffDays <= 3) {
            dDayColor = 'red';
        }
    
        var expiryDateStr = expiryDate ? `기한: ${formatDate(item.itemExpiryDate)} (D-<span class="d-day" style="color:${dDayColor}">${diffDays}</span>)` : '';
        var purchaseDateStr = item.itemPurchaseDate ? `구매: ${formatDate(item.itemPurchaseDate)}` : `입력: ${formatDate(item.itemInputDate)}`;

        const itemModifyIcon = `
            <img src="images/fridgeimg/ModifyName.png" alt="수정" class="editIcon item-editIcon itemModifyIcon"
                data-item-id="${item.itemId}" style="position: absolute; top: 0; right: 20px; display:none; width:20px; height:20px;z-index: 30;">
        `;
        const itemDeleteIcon = `
            <img src="images/fridgeimg/Red_X.png" alt="삭제" class="editIcon item-editIcon itemDeleteIcon"
                data-item-id="${item.itemId}" style="position: absolute; top: 0; right: 0; display:none; width:20px; height:20px;z-index: 30;">
        `;
        var itemElement = `
            <div class="card mt-3 mb-4 living-item" 
                 data-item-id="${item.itemId}" 
                 data-category="${item.itemCategory}" 
                 data-item-input-date="${item.itemInputDate}"
                 data-item-expiry-date="${item.itemExpiryDate}">
                <div class="card-body itemcard">
                    ${itemModifyIcon}
                    ${itemDeleteIcon}
                    <div class="item-image-container">
                        <img src="${imagePath}" alt="${item.itemName}" class="item-image">
                    </div>
                    <div class="item-details">
                        <span class="badge rounded-pill bg-label-primary item-category">${item.itemCategory}</span>
                        <div class="item-name">${item.itemName}</div>
                        <div class="purchase-date">
                            ${purchaseDateStr}
                        </div>
                        <div class="expiry-date">
                            ${expiryDateStr}
                        </div>
                    </div>
                </div>
            </div>
        `;
    
        $('#livingItemsContainer').append(itemElement);
    }

    // 검색창 요소 선택
    let $itemSearchInput = $('#itemSearchInput');

    // 검색창에 키 입력 이벤트 추가
    $itemSearchInput.on('keyup', function () {
        let searchTerm = $(this).val(); // 사용자가 입력한 검색어

        $.ajax({
            url: 'livingGoods/search', // 생활용품 검색을 위한 백엔드 엔드포인트. 실제 엔드포인트 경로로 수정 필요
            method: 'GET',
            data: { query: searchTerm }, // 검색어를 쿼리 파라미터로 전달
            success: function (response) {
                // 응답에서 받아온 검색 결과를 화면에 표시
                $('#livingItemsContainer').empty(); // 기존에 표시되던 생활용품 항목을 모두 제거합니다.
                response.forEach(displayLivingItem); // 각 검색된 생활용품 항목을 화면에 표시합니다.
            },
            error: function (error) {
                console.error('Error fetching search results:', error);
            },
        });
    });
    
    //아이템 출력
    $.get(`livingGoods/getLivingGoods`, function (items) {
        $('#livingItemsContainer').empty();
        items.forEach(displayLivingItem);
    });

    //아이템 모달 띄우기
    $(document).on('click', '.living-item', function (e) {
        e.stopPropagation();
        let itemId = $(this).data('item-id');
    
        // 서버로부터 상세 정보를 가져옴 (이 부분은 서버와 통신하는 실제 코드에 따라 다름)
        $.ajax({
            url: 'livingGoods/item/' + itemId,
            type: 'GET',
            success: function (data) {
                // 버튼의 data 속성 업데이트
                $('.consume-btn').data('item-id', data.itemId);
                $('.consume-btn').data('item-quantity', data.itemQuantity);
                $('.consume-btn').data('family-id', data.familyId);
                $('.consume-btn').data('item-name', data.itemName);
                $('.consume-btn').data('item-category', data.itemCategory);
    
                // 모달에 들어갈 내용 설정
                const imagePath = data.itemSavedFile
                    ? 'fridgeFood/image/' + data.itemSavedFile
                    : 'images/fridgeimg/DefaultItem.png';
    
                // 유효기간이 없을 경우 빈 문자열로 설정
                const expiryDateStr = data.itemExpiryDate ? `유효기간: ${formatDate(data.itemExpiryDate)}` : '';
                
                // 구매일이 없을 경우 입력일로 대체
                const purchaseDateStr = data.itemPurchaseDate ? `구매일: ${formatDate(data.itemPurchaseDate)}` : `입력일: ${formatDate(data.itemInputDate)}`;
        
                $('#itemModal .modal-body').html(`
                    <div class="row">
                        <div class="col-md-6">
                            <img src="${imagePath}" alt="${data.itemName}" class="img-fluid">
                        </div>
                        <div class="col-md-6">
                            <p><strong>아이템 이름:</strong> ${data.itemName}</p>
                            <p><strong>카테고리:</strong> ${data.itemCategory}</p>
                            <p><strong>수량:</strong> ${data.itemQuantity}</p>
                            ${purchaseDateStr ? `<p><strong>${purchaseDateStr}</strong></p>` : ''}
                            ${expiryDateStr ? `<p><strong>${expiryDateStr}</strong></p>` : ''}
                        </div>
                    </div>
                `);
                $('#itemModal').modal('show');
            },
            error: function (error) {
                console.log('Error fetching item details:', error);
            },
        });
    });
    $('#itemModal .btn-danger').on('click', function () {
        $('#itemModal').modal('hide');
    });
    // DOM 엘리먼트 선택
    const previewContainer = document.querySelector(".image-preview");
    const previewImage = previewContainer.querySelector(".image-preview__image");
    const previewDefaultText = previewContainer.querySelector(".image-preview__default-text");
    const fileInput = document.getElementById("itemImage");

    // 파일 입력 필드에 이벤트 리스너 추가
    fileInput.addEventListener("change", function() {
        const file = this.files[0];

        if (file) {
            // FileReader 객체 생성
            const reader = new FileReader();

            // 이미지 미리보기 및 기본 텍스트 숨김
            previewDefaultText.style.display = "none";
            previewImage.style.display = "block";

            // 파일 읽기가 완료되면 실행되는 이벤트 리스너
            reader.addEventListener("load", function() {
                // 읽은 결과를 미리보기 이미지의 src 속성에 설정
                previewImage.setAttribute("src", this.result);
            });

            // 파일 읽기 시작
            reader.readAsDataURL(file);
        } else {
            // 파일이 선택되지 않았을 경우, 미리보기 및 기본 텍스트를 초기 상태로 되돌림
            previewImage.style.display = null;
            previewImage.setAttribute("src", "");
            previewDefaultText.style.display = null;
        }
    });

});
//readyEND

function updateSortOrder(sortOrder) {

    console.log("updateSortOrder called with ", sortOrder);
    $('#sortOrderButton').text(sortOrder);

    let $livingItems = $('.living-item');
    let sortedItems = [];
    console.log("Found items: ", $livingItems.length);

    if (sortOrder === '유효기간 순') {
        sortedItems = $livingItems.sort((a, b) => {
            const aDays = parseInt($(a).find('.d-day').text()) || Number.MAX_SAFE_INTEGER;
            const bDays = parseInt($(b).find('.d-day').text()) || Number.MAX_SAFE_INTEGER;
            return aDays - bDays;
        });
    } else if (sortOrder === '유효기간 역순') {
        sortedItems = $livingItems.sort((a, b) => {
            const aDays = parseInt($(a).find('.d-day').text()) || Number.MIN_SAFE_INTEGER;
            const bDays = parseInt($(b).find('.d-day').text()) || Number.MIN_SAFE_INTEGER;
            return bDays - aDays;
        });
    } else if (sortOrder === '입력 날짜 순') {
        sortedItems = $livingItems.sort((a, b) => {
            return new Date($(a).data('item-input-date')) - new Date($(b).data('item-input-date'));
        });
    } else if (sortOrder === '입력 날짜 역순') {
        sortedItems = $livingItems.sort((a, b) => {
            return new Date($(b).data('item-input-date')) - new Date($(a).data('item-input-date'));
        });
    }

    $('#livingItemsContainer').empty().append(sortedItems);
}
