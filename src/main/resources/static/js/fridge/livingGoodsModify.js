$(document).ready(function () {

    let isEditMode = false; // 편집 모드 상태를 저장하는 변수

    // 편집 버튼 클릭 이벤트
    $('#livingItemModify').click(function () {
        if (isEditMode) {
            $('.category-editIcon').hide();
            $('.item-editIcon, .item-deleteIcon').hide();
            isEditMode = false;
        } else {
            $('.category-editIcon').show();
            $('.item-editIcon, .item-deleteIcon').show();
            isEditMode = true;
        }
    });

    let isCategoryEditMode = false;

// 카테고리 수정 아이콘 클릭 이벤트
$(document).on('click', '.category-editIcon', function () {
    if (isCategoryEditMode) {
        isCategoryEditMode = false;
    } else {
        isCategoryEditMode = true;
        $('#categoryEditModal').modal('show');
    }
});

// 카테고리 편집 모달이 표시될 때 이 함수를 호출
$('#categoryEditModal').on('show.bs.modal', populateCategoryModal);
$('#categoryEditModal').on('hidden.bs.modal', function () {
    $('.category-editIcon').off('click').on('click', function () {
        $('#categoryEditModal').modal('show');
    });
});

// 카테고리 정보를 모달에 채우는 함수
function populateCategoryModal() {
    $.ajax({
        url: 'livingCategories',  // URL을 생활용품 카테고리에 맞게 수정해주세요.
        type: 'GET',
        dataType: 'json',
        success: function (categories) {
            const modalBody = $('#categoryEditModal .modal-body');
            modalBody.empty(); // 기존 목록 삭제

            // 기본 카테고리 출력
            modalBody.append('<div class="card mb-4"><div class="card-header"><b>기본 카테고리</b></div><ul class="list-group list-group-flush default-categories">');
            ['욕실용품', '주방용품', '청소용품', '세탁용품', '일반물품'].forEach(function (categoryName) {
                modalBody.find('.default-categories').append(`
                    <li class="list-group-item d-flex align-items-center">
                        <span class="category-name flex-grow-1">${categoryName}</span>
                    </li>
                `);
            });
            modalBody.append('</ul></div>');

            // 사용자 정의 카테고리 출력
            modalBody.append('<div class="user-defined-categories">');
            categories.forEach(function (category) {
                modalBody.append(`
                    <div class="category-item d-flex align-items-center mb-2 p-2 border rounded">
                        <span class="category-name flex-grow-1 p-2 border rounded">${category.itemCategory}</span>
                        <img src="images/fridgeimg/ModifyName.png" style="height:25px; width:25px; margin-left: 5px;" alt="수정" class="modal-category-editIcon" data-category-id="${category.categoryId}">
                        <img src="images/fridgeimg/Red_X.png" style="height:25px; width:25px; margin-left: 5px;" alt="삭제" class="modal-category-deleteIcon" data-category-id="${category.categoryId}">
                    </div>
                `);
            });
            modalBody.append('</div>');
        },
        error: function (e) {
            // 오류 처리 로직
        },
    });
}


// 모달 내부의 카테고리 수정 아이콘 클릭 이벤트
$(document).on('click', '.modal-category-editIcon', function () {
    const categoryItem = $(this).closest('.category-item');
    const categoryNameSpan = categoryItem.find('.category-name');
    const categoryName = categoryNameSpan.text();
    categoryNameSpan.hide().after('<div class="d-flex align-items-center justify-content-between" style="width: 100%;"><input type="text" class="form-control category-input" value="' + categoryName + '" style="flex: 1; margin-right: 5px;" /><div class="d-flex flex-direction-row"><button class="btn btn-sm btn-warning confirm-edit">수정</button><button class="btn btn-sm btn-outline-secondary cancel-edit">취소</button></div></div>');

    $(this).hide();
    categoryItem.find('.modal-category-deleteIcon').hide();
});

// 카테고리 수정 취소
$(document).on('click', '.cancel-edit', function () {
    const categoryItem = $(this).closest('.category-item');
    categoryItem.find('.d-flex').remove();
    categoryItem.find('.category-name').show();
    categoryItem.find('.modal-category-editIcon, .modal-category-deleteIcon').show();
});

// 카테고리 수정 확인
$(document).on('click', '.confirm-edit', function () {
    const categoryItem = $(this).closest('.category-item');
    const newCategoryName = categoryItem.find('.category-input').val();
    const originalCategoryName = categoryItem.find('.category-name').text();

    // Default 카테고리와 중복되는지 확인
    const DEFAULT_CATEGORIES = ['욕실용품', '주방용품', '청소용품', '세탁용품', '일반물품'];
    if (DEFAULT_CATEGORIES.includes(newCategoryName)) {
        alert('The name conflicts with a default category. Please choose another name.');
        return;
    }

    // 데이터베이스에서 중복 확인
    $.ajax({
        url: 'livingCategories/checkCategoryDuplication',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            itemCategory: newCategoryName,
        }),
        contentType: 'application/json',
        success: function (isDuplicated) {
            if (isDuplicated) {
                alert('이미 존재하는 카테고리 이름입니다.');
                return;
            }

            // 해당 카테고리를 사용하는 아이템의 수를 확인
            $.ajax({
                url: 'livingCategories/countItemsUsingCategory',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({
                    itemCategory: originalCategoryName,
                }),
                contentType: 'application/json',
                success: function (count) {
                    const isConfirmed = confirm(`총 ${count} 개의 물건이 해당 카테고리 명을 사용중입니다. 일괄 변경하시겠습니까?`);
                    if (isConfirmed) {
                        updateCategory(originalCategoryName, newCategoryName);
                    }
                },
                error: function (e) {
                    // Handle error here
                },
            });
        },
        error: function (e) {
            // Handle error here
        },
    });
});


function updateCategory(originalName, newName) {
    $.ajax({
        url: 'livingCategories/updateCategory',
        type: 'POST',
        data: {
            originalName: originalName,
            newName: newName,
        },
        success: function () {
            alert('카테고리가 성공적으로 수정되었습니다.');
            location.reload();
        },
        error: function (e) {
            // Handle error here
        },
    });
}
    // 모달이 닫힐 때 원래 상태로 복구
    $('#manualInputModal').on('hidden.bs.modal', function () {
        const submitBtn = $('#manualInputModal .btn-warning');
        submitBtn.text('Submit');
        submitBtn.removeClass('btn-warning').addClass('btn-primary');
        $('#manualInputModal form').attr('action', 'livingGoodsCategories/add');
    });

    // 삭제 아이콘 클릭 이벤트
$(document).on('click', '.modal-category-deleteIcon', function () {
    const categoryItem = $(this).closest('.category-item');
    const categoryToDelete = categoryItem.find('.category-name').text();

    // 해당 카테고리를 사용하는 생활용품의 수 확인
    $.ajax({
        url: 'livingCategories/countItemsUsingCategory',
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            itemCategory: categoryToDelete,
        }),
        contentType: 'application/json',
        success: function (count) {
            const isConfirmed = confirm(
                `총 ${count}개의 생활용품이 '${categoryToDelete}' 카테고리 명을 사용중입니다. 모든 생활용품을 '일반용품' 카테고리로 일괄 변경하시겠습니까?`
            );

            if (isConfirmed) {
                deleteCategory(categoryToDelete);
            }
        },
        error: function () {
            alert('생활용품 수 확인에 실패하였습니다.');
        }
    });
});

function deleteCategory(categoryName) {
    $.ajax({
        url: 'livingCategories/deleteCategory',
        type: 'POST',
        data: {
            itemCategory: categoryName,
        },
        success: function () {
            alert('카테고리가 성공적으로 삭제되었습니다.');
            location.reload(); // 페이지 새로고침
        },
        error: function () {
            alert('카테고리 삭제에 실패하였습니다.');
        }
    });
}
function setExistingImageInEditMode(existingImageSrc) {
    const previewDefaultText = document.querySelector(".image-preview__default-text");
    const previewImage = document.querySelector(".image-preview__image");

    previewDefaultText.style.display = "none";
    previewImage.style.display = "block";
    previewImage.setAttribute("src", existingImageSrc);
}
    // 삭제 아이콘 클릭 이벤트
    $(document).on('click', '.itemDeleteIcon', function (e) {
        e.stopImmediatePropagation();
        const itemId = $(this).data('item-id');
        if (confirm('정말로 이 물품 아이템을 삭제하시겠습니까?')) {
            $.ajax({
                url: 'livingGoods/delete/' + itemId,
                type: 'POST',
                success: function (response) {
                    if (response === 'success') {
                        $('[data-item-id="' + itemId + '"]').remove();
                    } else {
                        console.error('Failed to delete the item.');
                    }
                },
                error: function (error) {
                    console.error(error);
                },
            });
        }
        e.stopPropagation(); // 이벤트 전파 중단
    });

    // 수정 아이콘 클릭 이벤트
    $(document).on('click', '.item-editIcon', function (e) {
        const itemId = $(this).data('item-id');
        $.ajax({
            url: 'livingGoods/item/' + itemId,
            type: 'GET',
            success: function (item) {
                $('#itemName').val(item.itemName);
                $('#itemCategory').val(item.itemCategory);
                $('#itemQuantity').val(item.itemQuantity);
                $('#itemPrice').val(item.itemPrice);
                $('#itemPurchaseDate').val(item.itemPurchaseDate);
                $('#itemExpiryDate').val(item.itemExpiryDate);
                $('#itemMadeDate').val(item.itemMadeDate);
                if (item.itemSavedFile) {
                    const existingImageSrc = 'fridgeFood/image/' + item.itemSavedFile;
                    setExistingImageInEditMode(existingImageSrc);
                }
                const submitBtn = $('#manualInputModal .addsubmitBtn');
                submitBtn.text('수정');
                submitBtn.removeClass('btn-primary').addClass('btn-warning');
                $('#manualInputModal form').attr('action', 'livingGoods/modify/' + itemId);
                $('#manualInputModal').modal('show');
            },
            error: function (error) {
                console.error(error);
            },
        });
        e.stopPropagation(); // 이벤트 전파 중단
    });

    // 모달이 닫힐 때 초기 상태로 복구
    $('#manualInputModal').on('hidden.bs.modal', function () {
        const submitBtn = $('#manualInputModal .btn-warning');
        submitBtn.text('입력');
        submitBtn.removeClass('btn-warning').addClass('btn-primary');
        $('#manualInputModal form').attr('action', 'livingGoods/add');
    });

// 아이템 소비 후에 호출되는 함수
function updateItemQuantity(itemId, newQuantity) {
    const itemElement = $(`[data-item-id="${itemId}"]`);
    if (newQuantity <= 0) {
        // 수량이 0 이하이면 화면에서 아이템 제거
        itemElement.remove();
    } else {
        // 아니면 수량 업데이트
        itemElement.data('item-quantity', newQuantity); // data 속성 업데이트
        itemElement.find('.item-quantity').text(newQuantity); // 화면에 보이는 텍스트 업데이트
    }
}

//소비 버튼 클릭 이벤트
$(document).on('click', '.consume-btn', function () {
    const itemId = $(this).data('item-id');
    const maxQuantity = $(this).data('item-quantity');
    const itemName = $(this).data('item-name');
    const itemCategory = $(this).data('item-category');

    const responseFromPrompt = prompt(`소비할 수량을 입력하세요 (재고: ${maxQuantity})`);
    
    if (responseFromPrompt === null) {
        return;
    }
    
    const quantityToConsume = parseInt(responseFromPrompt);

    if (quantityToConsume > 0 && quantityToConsume <= maxQuantity) {
        $.ajax({
            url: 'livingUsed/consumeItem',
            type: 'POST',
            data: JSON.stringify({
                itemId: itemId,
                itemQuantity: quantityToConsume,
                itemName: itemName,
                itemCategory: itemCategory,
            }),
            contentType: 'application/json',
            success: function (response) {
                alert('소비 처리가 완료되었습니다.');
                $('#itemModal').modal('hide');

                const newQuantity = maxQuantity - quantityToConsume;
                updateItemQuantity(itemId, newQuantity);

                refreshConsumptionHistory();
                loadData();
            },
            error: function (error) {
                console.log('Error consuming item:', error);
                alert('소비 처리에 실패하였습니다.');
            },
        });
    } else {
        alert('올바른 수량을 입력하세요.');
    }
});

// 소비 이력 갱신 함수
function refreshConsumptionHistory() {
    $.ajax({
        type: 'GET',
        url: 'livingUsed/consumptionHistory',
        success: function (data) {
            let content = '';
            data.forEach((item) => {
                content += `
                <div class="consumption-item">
                    <h5 class="used-item-name">${item.itemCategory}의 ${item.itemName}을/를 ${item.livingQuantityUsed}개 소비하셨습니다!</h5>
                    <p class="used-date">${new Date(item.livingUsedDate).toLocaleString()}</p>
                    <span class="delete-consumption-text" data-consumption-id="${item.livingUsedId}">X</span>
                </div>
            `;
            });
            $('#consumptionHistoryContainer').html(content);
        },
    });
}

//소비 이력 각각 삭제
$(document).on('click', '.delete-consumption-text', function () {
    const consumptionId = $(this).data('consumption-id');
    if (confirm('정말 이 소비 이력을 삭제하시겠습니까?')) {
        // 서버에 소비 이력 삭제 요청
        $.ajax({
            url: 'livingUsed/deleteConsumptionHistory',
            type: 'POST',
            data: { livingUsedId: consumptionId },
            success: function (response) {
                alert('소비 이력이 삭제되었습니다.');
                refreshConsumptionHistory();
            },
            error: function (error) {
                console.log('Error deleting consumption:', error);
                alert('소비 이력 삭제에 실패하였습니다.');
            },
        });
    }
});

//소비 이력 전체 삭제
$(document).on('click', '.delete-all-consumption-text', function () {
    if (confirm('정말 모든 소비 이력을 삭제하시겠습니까?')) {
        // 서버에 전체 소비 이력 삭제 요청
        $.ajax({
            url: 'livingUsed/deleteAllConsumptionHistory',
            type: 'POST',
            success: function (response) {
                alert('모든 소비 이력이 삭제되었습니다.');
                refreshConsumptionHistory();
            },
            error: function (error) {
                console.log('Error deleting all consumptions:', error);
                alert('모든 소비 이력 삭제에 실패하였습니다.');
            },
        });
    }
});


// 페이지 로딩 후 자동으로 소비 이력 갱신
refreshConsumptionHistory();

let allLivingGoods = [];

function loadLivingGoodsForNotification(callback) {
    $.ajax({
        url: `livingGoods/getLivingGoods`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            allLivingGoods = data;
            callback();
        },
        error: function (error) {
            console.error('Error fetching living goods items for notification:', error);
        },
    });
}

function createEssentialNotifications() {
    $('#navs-pills-justified-home').empty();
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    const essentialItems = allLivingGoods.filter((item) => {
        if(item.itemExpiryDate === null) return false;
        const expiryDate = new Date(item.itemExpiryDate);
        return expiryDate <= oneWeekFromNow;
    });

    essentialItems.sort((a, b) => {
        const expiryDateA = new Date(a.itemExpiryDate);
        const expiryDateB = new Date(b.itemExpiryDate);
        return expiryDateA - expiryDateB;
    });

    essentialItems.forEach((item) => {
        const expiryDate = new Date(item.itemExpiryDate);
        const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const color = diffDays <= 3 ? 'red' : 'blue';
        const notification = `<div style="margin-bottom: 10px;">
                                  <p style="margin-bottom: 0;">[${item.itemCategory}]${item.itemName}의 유통기한이 <span style="color:${color}">${diffDays}일</span> 남았습니다! - </p>
                                  <span class="consume-text consume-btn" data-item-id="${item.itemId}" data-item-quantity="${item.itemQuantity}" data-item-name="${item.itemName}" data-item-category="${item.itemCategory}"> [소비]</span></p>
                              </div>`;
        $('#navs-pills-justified-home').append(notification);
    });
}

function createSuggestedNotifications() {
    $('#navs-pills-justified-profile').empty();
    // 이 부분은 서버에서 15일, 30일 사용하지 않은 제품 정보를 가져와야 함
    // 아래는 예시 코드
    $.ajax({
        url: `livingUsed/getLivingGoodsNotAccessedForDays`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displaySuggestedNotifications(data.goods15Days, 15);
            displaySuggestedNotifications(data.goods30Days, 30);
        },
        error: function (error) {
            console.error('Error fetching suggested notifications:', error);
        },
    });
}

function displaySuggestedNotifications(goods, days) {
    goods.forEach((item) => {
        const notification = `
            <div>
                <p style="margin-bottom: 0;">${item.itemName}을(를) 사용하지 않은 지 <span style="color:red">${days}일</span>이 지났습니다! - </p>
                <span class="consume-text consume-btn" data-item-id="${item.itemId}" data-item-quantity="${item.itemQuantity}" data-item-name="${item.itemName}" data-item-category="${item.itemCategory}"> [소비]</span></p>
            </div>
        `;
        $('#navs-pills-justified-profile').append(notification);
    });
}

function loadData() {
    allLivingGoods = [];
    loadLivingGoodsForNotification(function () {
        createEssentialNotifications();
        createSuggestedNotifications();
    });
}

// 데이터 로드 및 알림 생성 및 표시 시작
loadData();
});
//readyEND