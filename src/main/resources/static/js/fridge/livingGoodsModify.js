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
    categoryNameSpan.hide().after('<div class="d-flex align-items-center justify-content-between" style="width: 100%;"><input type="text" class="form-control category-input" value="' + categoryName + '" /><div class="d-flex flex-direction-row"><button class="btn btn-sm btn-warning confirm-edit">Confirm</button><button class="btn btn-sm btn-outline-secondary cancel-edit">Cancel</button></div></div>');

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
// 아이템 삭제 아이콘을 클릭했을 때 실행되는 코드
$(document).on('click', '.itemDeleteIcon', function (e) {
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
    e.stopPropagation();
});

// 아이템 수정 아이콘 클릭 이벤트
$(document).on('click', '.item-editIcon', function (e) {
    e.stopPropagation(); // 이벤트 전파 중단

    const itemId = $(this).data('item-id'); // 해당 아이템의 ID

    // 서버에서 아이템 정보를 가져옴
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
            // 기존에 업로드된 이미지가 있다면 미리보기에 설정
            if (item.itemSavedFile) {
                const existingImageSrc = 'fridgeFood/image/' + item.itemSavedFile; // 예시 경로, 실제 경로는 서버에 맞게 변경
                setExistingImageInEditMode(existingImageSrc);
            }

            const submitBtn = $('#manualInputModal .addsubmitBtn');
            submitBtn.text('Update');
            submitBtn.removeClass('btn-primary').addClass('btn-warning');

            $('#manualInputModal form').attr('action', 'livingGoods/modify/' + itemId);

            $('#manualInputModal').modal('show');
        },
        error: function (error) {
            console.error(error);
        }
    });
});

// 모달이 닫힐 때, 버튼과 폼 액션을 원래대로 돌려놓음
$('#manualInputModal').on('hidden.bs.modal', function () {
    const submitBtn = $('#manualInputModal .btn-warning');
    submitBtn.text('Submit');
    submitBtn.removeClass('btn-warning').addClass('btn-primary');
    $('#manualInputModal form').attr('action', 'livingGoods/add');
});
});
//readyEND