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
    $(document).on('click', '.dropdown-item', function() {
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
                `<li><a class="dropdown-item" href="javascript:void(0);" data-category="욕실용품">욕실용품</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" data-category="주방용품">주방용품</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" data-category="청소용품">청소용품</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" data-category="세탁용품">세탁용품</a></li>
                <li><a class="dropdown-item" href="javascript:void(0);" data-category="일반물품">일반물품</a></li>`
            );
            categories.forEach(function (category) {
                dropdownMenu.append(
                    `<li><a class="dropdown-item" href="javascript:void(0);" data-category="${category.itemCategory}">${category.itemCategory}</a></li>`
                );
            });
        },
        error: function (error) {
            console.error('Error fetching categories:', error);
        },
    });


    //아이템 출력
    function displayLivingItem(item) {
        var imagePath = item.itemSavedFile
            ? 'fridgeFood/image/' + item.itemSavedFile
            : 'images/fridgeimg/DefaultItem.png';
    
        var today = new Date();
        var expiryDate = item.itemExpiryDate ? new Date(item.itemExpiryDate) : null;
        var diffDays = expiryDate ? Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)) : null;
    
        function formatDate(dateStr) {
            var date = new Date(dateStr);
            var year = date.getFullYear().toString().substr(2, 2);
            return (
                year +
                '-' +
                (date.getMonth() + 1).toString().padStart(2, '0') +
                '-' +
                date.getDate().toString().padStart(2, '0')
            );
        }
    
        var dDayColor = 'blue';
        if (diffDays !== null && diffDays <= 3) {
            dDayColor = 'red';
        }
    
        var expiryDateStr = expiryDate ? `기한: ${formatDate(item.itemExpiryDate)} (D-<span class="d-day" style="color:${dDayColor}">${diffDays}</span>)` : '';
        var purchaseDateStr = item.itemPurchaseDate ? `구매: ${formatDate(item.itemPurchaseDate)}` : `입력: ${formatDate(item.itemInputDate)}`;
    
        var itemElement = `
            <div class="card mt-3 mb-4 living-item" 
                 data-item-id="${item.itemId}" 
                 data-category="${item.itemCategory}" 
                 data-item-input-date="${item.itemInputDate}"
                 data-item-expiry-date="${item.itemExpiryDate}">
                <div class="card-body itemcard">
                    <div class="item-image-container">
                        <img src="${imagePath}" alt="${item.itemName}" class="item-image">
                    </div>
                    <div class="item-details">
                        <span class="badge rounded-pill bg-success item-category">${item.itemCategory}</span>
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
    

    
    //아이템 출력
    $.get(`livingGoods/getLivingGoods`, function (items) {
        $('#livingItemsContainer').empty();
        items.forEach(displayLivingItem);
    });
})

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

    console.log("Sorted items: ", sortedItems.length);
    $('#livingItemsContainer').empty().append(sortedItems);
    console.log($('#livingItemsContainer').html());
}
