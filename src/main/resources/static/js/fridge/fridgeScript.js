window.showFoodsByCategory = showFoodsByCategory;
window.updateSortOrder = updateSortOrder;


const DEFAULT_CATEGORIES = ['일반', '야채', '해산물', '육류', '과일'];
let currentCategory = '냉장실'; // 초기값은 냉장실

document.addEventListener('DOMContentLoaded', function () {
    const containers = [
        document.querySelector('.food-items-container'),
        document.querySelector('#consumptionHistoryContainer'),
        document.querySelector('#fridge-notification')
    ].filter(el => el !== null); // 존재하지 않는 요소를 배열에서 제거합니다.

    const options = {
        wheelSpeed: 1,
        wheelPropagation: true,
        // 여기에 추가 옵션을 넣을 수 있습니다.
    };

    containers.forEach(container => {
        new PerfectScrollbar(container, options);
    });
});


export function getCurrentCategory() {
    return currentCategory;
}

export function setCurrentCategory(category) {
    currentCategory = category;
}

export function showFoodsByCategory(selectedCategory) {
    // 모든 음식 목록에서 선택된 카테고리에 해당하는 음식만 화면에 표시
    $('.food-item').each(function () {
        const foodCategory = $(this).data('category');
        if (foodCategory === selectedCategory) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });

    // 선택된 카테고리로 버튼 텍스트 업데이트
    $('#categoryDisplayButton').text(selectedCategory);
}

export function updateSortOrder(sortOrder) {
    $('#sortOrderButton').text(sortOrder);

    let $foodItems = $('.food-item');
    let sortedItems = [];

    if (sortOrder === '유효기간 순') {
        sortedItems = $foodItems.sort((a, b) => {
            return parseInt($(a).find('.d-day').text()) - parseInt($(b).find('.d-day').text());
        });
    } else if (sortOrder === '유효기간 역순') {
        sortedItems = $foodItems.sort((a, b) => {
            return parseInt($(b).find('.d-day').text()) - parseInt($(a).find('.d-day').text());
        });
    } else if (sortOrder === '입력 날짜 순') {
        sortedItems = $foodItems.sort((a, b) => {
            return new Date($(a).data('food-input-date')) - new Date($(b).data('food-input-date'));
        });
    } else if (sortOrder === '입력 날짜 역순') {
        sortedItems = $foodItems.sort((a, b) => {
            return new Date($(b).data('food-input-date')) - new Date($(a).data('food-input-date'));
        });
    }

    $('#foodItemsContainer').empty().append(sortedItems);
}

import { loadAllFoodsByCategory } from './loadAllFoodsByCategory.js';
import { displayFoodItem } from './loadAllFoodsByCategory.js';


            $(document).ready(function () {
                loadFridgesByCategory('냉장실');
                loadAllFoodsByCategory('냉장실');
                $('#foodForm').submit(function (event) {
                    event.preventDefault();

                    let formData = new FormData(this);

                    $.ajax({
                        type: 'POST',
                        url: $(this).attr('action'),
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: handleFoodAddSuccess,
                        error: handleFoodAddError,
                    });
                });

                $('#manualInputModal').on('hidden.bs.modal', function () {
                    $(this).find('form').trigger('reset'); // form 내의 모든 입력 필드 초기화
                    // 추가로 초기화해야 할 요소가 있다면 이곳에 코드를 추가
                });

                function handleFoodAddSuccess(response) {
                    alert('음식 정보가 성공적으로 추가되었습니다.');
                    $('#manualInputModal').modal('hide');

                    const selectedFridgeId = $('.fridgeSelect').val();
                    console.log(selectedFridgeId);
                    if (selectedFridgeId) {
                        $.get(`/secretary/fridgeFood/getFridgeFoods/${selectedFridgeId}`, function (foods) {
                            $('#foodItemsContainer').empty();
                            foods.forEach(displayFoodItem);
                        });
                    } else {
                        loadAllFoodsByCategory(currentCategory);
                    }
                }

                function handleFoodAddError(jqXHR, textStatus, errorThrown) {
                    console.error('Error:', errorThrown); // 개발자를 위한 오류 로그
                    alert(`음식 정보를 추가하는 데 실패했습니다. 오류: ${errorThrown}`);
                }
                $(document).on('click', '.fridgeItem', function () {
                    event.preventDefault(); // <a> 태그의 기본 동작 중단
                    const fridgeId = $(this).find('a').attr('href').split('/').pop();
                    const fridgeName = $(this).find('.fridgeName').data('current-name'); // 클릭된 냉장고의 이름을 가져옵니다.

                    $('#fName').text(fridgeName);
                    $.get(`/secretary/fridgeFood/getFridgeFoods/${fridgeId}`, function (foods) {
                        $('#foodItemsContainer').empty(); // 기존에 표시되던 음식 항목을 모두 제거합니다.
                        foods.forEach(displayFoodItem); // 각 음식 항목을 화면에 표시합니다.
                        $('#categoryDisplayButton').text('카테고리');
                    });
                    $('.fridgeSelect').val(fridgeId);
                });

                let isEditMode = false; // 편집 모드 상태를 저장하는 변수

                $('#foodItemModify').click(function () {
                    if (isEditMode) {
                        $('.food-editIcon, .category-editIcon').hide();
                        isEditMode = false;
                    } else {
                        $('.food-editIcon, .category-editIcon').show();
                        isEditMode = true;
                    }
                });
                $(document).on('click', '.foodModifyIcon', function (e) {
                    e.stopPropagation(); // 이벤트 전파 중단

                    const foodId = $(this).data('food-id');

                    $.ajax({
                        url: '/secretary/fridgeFood/food/' + foodId,
                        type: 'GET',
                        success: function (foodItem) {
                            $('#foodName').val(foodItem.foodName);
                            $('.fridgeSelect').val(foodItem.fridgeId);
                            $('#foodCategory').val(foodItem.foodCategory);
                            $('#foodQuantity').val(foodItem.foodQuantity);
                            $('#foodPrice').val(foodItem.foodPrice);
                            $('#foodPurchaseDate').val(foodItem.foodPurchaseDate);
                            $('#foodExpiryDate').val(foodItem.foodExpiryDate);
                            $('#foodMadeDate').val(foodItem.foodMadeDate);

                            const submitBtn = $('#manualInputModal .addsubmitBtn');
                            submitBtn.text('수정');
                            submitBtn.removeClass('btn-primary').addClass('btn-warning');

                            $('#manualInputModal form').attr('action', '/secretary/fridgeFood/modify/' + foodId);

                            $('#manualInputModal').modal('show');
                        },
                        error: function (error) {
                            console.error(error);
                        },
                    });
                });

                $('#manualInputModal').on('hidden.bs.modal', function () {
                    const submitBtn = $('#manualInputModal .btn-warning');
                    submitBtn.text('입력');
                    submitBtn.removeClass('btn-warning').addClass('btn-primary');
                    $('#manualInputModal form').attr('action', '/secretary/fridgeFood/add');
                });

                $(document).on('click', '.foodDeleteIcon', function (e) {
                    const foodId = $(this).data('food-id');
                    // 기본 JavaScript confirm 대신 SweetAlert2 사용
                    Swal.fire({
                        title: '확인',
                        text: "정말로 이 음식 아이템을 삭제하시겠습니까?",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: '예, 삭제합니다!',
                        cancelButtonText: '취소',
                        customClass: {
                            confirmButton: 'btn btn-primary', // 부트스트랩 'btn-primary' 스타일 적용
                            cancelButton: 'btn btn-secondary'  // 부트스트랩 'btn-secondary' 스타일 적용
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $.ajax({
                                url: '/secretary/fridgeFood/delete/' + foodId,
                                type: 'POST',
                                success: function (response) {
                                    if (response === 'success') {
                                        $('[data-food-id="' + foodId + '"]').remove();
                                    } else {
                                        console.error('Failed to delete the food item.');
                                    }
                                },
                                error: function (error) {
                                    console.error(error);
                                },
                            });
                        }
                    });

                    e.stopPropagation();
                });

                $(document).on('click', '.modifyIcon', function () {
                    const fridgeItem = $(this).closest('.fridgeItem');
                    const fridgeNameDiv = fridgeItem.find('.fridgeName');
                    const currentName = fridgeNameDiv.text();

                    const buttonContainer = `
                                    <div class="fridgeInputField mt-2" style="display: block;">
                                    <input type="text" value="${currentName}" class="fridgeNameInput form-control mb-2">
                                    <button type="button" class="btn btn-primary" id="confirmEditButton">수정</button>
                                    <button type="button" class="btn btn-secondary ml-2" id="cancelEditButton">취소</button>
                                    </div>`;

                    fridgeNameDiv.hide();
                    fridgeItem.append(buttonContainer);
                });

                $(document).on('click', '#confirmEditButton', function () {
                    const fridgeItem = $(this).closest('.fridgeItem');
                    const fridgeId = fridgeItem.find('.modifyIcon').data('fridge-id');
                    const fridgeName = fridgeItem.find('.fridgeNameInput').val();
                    const currentName = fridgeItem.find('.fridgeName').data('current-name');
                    $.ajax({
                        url: '/secretary/fridge/updateFridge',
                        type: 'POST',
                        data: JSON.stringify({
                            fridgeId: fridgeId,
                            fridgeName: fridgeName,
                            currentFridgeName: currentName,
                        }),
                        contentType: 'application/json',
                        success: function (updatedFridge) {
                            console.log('수정되었습니다.');
                            fridgeItem.find('.fridgeName').text(updatedFridge.name).show();
                            fridgeItem.find('.fridgeNameInput, #confirmEditButton, #cancelEditButton').remove();
                            loadFridgesByCategory(currentCategory); // 카테고리에 따른 냉장고 목록 로드
                            isItemEditMode = false;
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert('냉장고 이름을 수정하는 데 실패했습니다.');
                        },
                    });
                });

                $(document).on('click', '#cancelEditButton', function () {
                    const fridgeItem = $(this).closest('.fridgeItem');
                    fridgeItem.find('.fridgeName').show();
                    fridgeItem
                        .find('.fridgeNameInput, #confirmEditButton, #cancelEditButton, .fridgeInputField')
                        .remove();
                });
                $(document).on('click', '.deleteIcon', function () {
                    const fridgeId = $(this).data('fridge-id');
                    const fridgeName = $(this).closest('.fridgeItem').find('.fridgeName').text();

                    $.get(`/secretary/fridgeFood/getFoodCountInFridge/${fridgeId}`, function (foodCount) {
                        if (foodCount > 0) {
                            Swal.fire({
                                title: '확인',
                                text: `${fridgeName}에 음식이 있습니다. 함께 삭제하시겠습니까?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: '예, 삭제합니다!',
                                cancelButtonText: '취소',
                                customClass: {
                                    confirmButton: 'btn btn-primary',
                                    cancelButton: 'btn btn-secondary'
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteFridge(fridgeId, fridgeName); // 냉장고를 삭제하는 함수 호출
                                }
                            });
                        } else {
                            Swal.fire({
                                title: '확인',
                                text: `${fridgeName}를 삭제하시겠습니까?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: '예, 삭제합니다!',
                                cancelButtonText: '취소',
                                customClass: {
                                    confirmButton: 'btn btn-primary',
                                    cancelButton: 'btn btn-secondary'
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteFridge(fridgeId, fridgeName); // 냉장고를 삭제하는 함수 호출
                                }
                            });
                        }
                    });
                    
                });

                function deleteFridge(fridgeId, fridgeName) {
                    $.ajax({
                        url: '/secretary/fridge/deleteFridge',
                        type: 'POST',
                        data: JSON.stringify({ fridgeId: fridgeId }),
                        contentType: 'application/json',
                        success: function () {
                            alert(`${fridgeName}가 성공적으로 삭제되었습니다.`);
                            location.reload();
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert('냉장고를 삭제하는 데 실패했습니다.');
                        },
                    });
                }

                $('#foodCategory').change(function () {
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
                    $('#foodCategory option').each(function () {
                        if (this.value === newCategory) {
                            isDuplicate = true;
                            return false; // loop 중단
                        }
                    });

                    if (!isDuplicate) {
                        // 서버에 카테고리 추가 요청
                        $.ajax({
                            url: '/secretary/foodCategories',
                            method: 'POST',
                            data: JSON.stringify({ foodCategory: newCategory }),
                            contentType: 'application/json',
                            success: function (response) {
                                if (response === -1) {
                                    alert('미리 지정된 카테고리는 추가할 수 없습니다.');
                                } else if (response > 0) {
                                    // 예를 들어, 서버에서 추가된 카테고리의 ID를 반환한다고 가정
                                    $('#foodCategory').append(
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
                    url: '/secretary/foodCategories',
                    method: 'GET',
                    success: function (categories) {
                        categories.forEach(function (category) {
                            $('#foodCategory').append(
                                `<option value="${category.foodCategory}">${category.foodCategory}</option>`
                            );
                        });
                    },
                    error: function (error) {
                        console.error('Error fetching categories:', error);
                    },
                });

                // 카테고리 목록 가져오기
                $.ajax({
                    url: '/secretary/foodCategories',
                    method: 'GET',
                    success: function (categories) {
                        // 드롭다운에 카테고리 목록 추가
                        const dropdownMenu = $('#categoryDisplayButton').siblings('.categoryDropdown');
                        dropdownMenu.empty(); // 기존 목록 삭제
                        dropdownMenu.append(
                            `<li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('일반')">일반</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('야채')">야채</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('해산물')">해산물</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('육류')">육류</a></li>
                            <li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('과일')">과일</a></li>`
                        );
                        categories.forEach(function (category) {
                            dropdownMenu.append(
                                `<li><a class="dropdown-item" href="javascript:void(0);" onclick="showFoodsByCategory('${category.foodCategory}')">${category.foodCategory}</a></li>`
                            );
                        });
                    },
                    error: function (error) {
                        console.error('Error fetching categories:', error);
                    },
                });

                

                document.getElementById('toggleButton').addEventListener('click', function () {
                    const button = this;
                    if (button.textContent === '냉장실 보기') {
                        currentCategory = '냉장실';
                        button.textContent = '냉동실 보기';
                        button.classList.remove('btn-primary');
                        button.classList.add('btn-info');
                        loadFridgesByCategory(currentCategory);
                        loadAllFoodsByCategory(currentCategory);
                        document.getElementById('fName').textContent = '전체 냉장고';
                    } else {
                        currentCategory = '냉동실';
                        button.textContent = '냉장실 보기';
                        button.classList.remove('btn-info');
                        button.classList.add('btn-primary');
                        loadFridgesByCategory(currentCategory);
                        loadAllFoodsByCategory(currentCategory);
                        document.getElementById('fName').textContent = '전체 냉동실';
                    }
                    loadFridgesByCategory(currentCategory);
                });

                let isItemEditMode = false; // 편집 모드 상태를 추적하는 변수

                $('#editButton').on('click', function () {
                    if (isItemEditMode) {
                        $('#addFridgeImage').remove(); // PlusButton.png 제거
                        $('#fridgeNameInput').remove();
                        $('#addConfirmButton').remove();
                        $('.fridgeBox').remove();
                        $('#addCancelButton').remove();

                        $('.fridge-editIcon').css('display', 'none'); // 냉장고 편집 아이콘을 숨깁니다.
                        isItemEditMode = false;
                    } else {
                        $('#fridgeContainer').append(
                            `<img src="images/fridgeimg/PlusButton.png" alt="추가버튼" style="width: 90px; height: 90px; margin-left:10px" id="addFridgeImage">`
                        );

                        $('.fridgeItem').each(function () {
                            const fridgeId = $(this).find('a').attr('href').split('/').pop();

                            const modifyIcon = `
                                                                                            <img src="images/fridgeimg/ModifyName.png" alt="수정" class="editIcon fridge-editIcon modifyIcon"
                                                                                            data-fridge-id="${fridgeId}" style="position: absolute; top: 0; right: 20px;">
                                                                                            `;
                            const deleteIcon = `
                                                                                            <img src="images/fridgeimg/Red_X.png" alt="삭제" class="editIcon fridge-editIcon deleteIcon"
                                                                                            data-fridge-id="${fridgeId}" style="position: absolute; top: 0; right: 0;">
                                                                                            `;

                            $(this)
                                .find('div[style="position: relative;"]')
                                .append(modifyIcon + deleteIcon)
                                .find('.fridge-editIcon') // 아이콘을 찾습니다.
                                .css('display', 'block'); // 아이콘을 표시합니다.
                        });

                        setTimeout(() => {
                            $('#addFridgeImage')[0].scrollIntoView({
                                behavior: 'smooth',
                                block: 'end',
                            });
                        }, 100); // 100ms의 지연을 줍니다.

                        isItemEditMode = true;
                    }
                });

                $(document).on('click', '#addFridgeImage', function () {
                    $(this).attr('src', 'images/fridgeimg/노랑냉장고.jpg');
                    const inputField = `
                                                                                    <div class="fridgeInputField mt-2">
                                                                                    <input type="text" class="form-control mb-2" placeholder="냉장고 이름을 입력하세요!" id="fridgeNameInput">
                                                                                    <button type="button" class="btn btn-primary" id="addConfirmButton">추가</button>
                                                                                    <button type="button" class="btn btn-secondary ml-2" id="addCancelButton">취소</button>
                                                                                    </div>
                                                                                    `;

                    const fridgeBox = $(`<div class="fridgeBox"></div>`);
                    $(this).appendTo(fridgeBox);
                    fridgeBox.append(inputField);
                    $('#fridgeContainer').append(fridgeBox);

                    $('.fridgeInputField').show(); /* 입력 필드를 표시합니다. */
                    this.scrollIntoView({ behavior: 'smooth', block: 'end' });
                });

                $(document).on('click', '#addConfirmButton', function () {
                    if ($('#fridgeNameInput').val().length < 2) {
                        alert(`냉장고 이름은 2자 이상이어야 합니다.`);
                        return;
                    }
                    const fridgeName = $('#fridgeNameInput').val();
                    if (fridgeName) {
                        $.ajax({
                            url: '/secretary/fridge/addFridge',
                            type: 'POST',
                            data: JSON.stringify({ fridgeName: fridgeName }),
                            contentType: 'application/json',
                            success: function (data) {
                                console.log('냉장고가 추가되었습니다.', data);
                                $('#addFridgeImage').remove();
                                $('#fridgeNameInput').remove();
                                $('#addConfirmButton').remove();
                                $('#addCancelButton').remove();
                                loadFridgesByCategory(currentCategory); // 카테고리에 따른 냉장고 목록 로드
                                isItemEditMode = false;
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                console.error('냉장고 추가 중 오류 발생:', jqXHR.responseText);
                            },
                        });
                    } else {
                        alert('냉장고 이름을 입력하세요!');
                    }
                });

                $(document).on('click', '#addCancelButton', function () {
                    $('#addFridgeImage').remove();
                    $('.fridgeBox').remove();
                    $('#fridgeNameInput').remove();
                    $(this).remove();
                    $('#addConfirmButton').remove();
                    isItemEditMode = false;
                });

                const MAX_NAME_LENGTH = 8; // 원하는 글자 수로 설정

                $(document).on('input', '#fridgeNameInput', function () {
                    if ($(this).val().length > MAX_NAME_LENGTH) {
                        $(this).val($(this).val().substr(0, MAX_NAME_LENGTH));
                        alert(`냉장고 이름은 ${MAX_NAME_LENGTH}자 이하여야 합니다.`);
                    }
                });

                $(document).on('click', '.food-item', function (e) {
                    e.stopPropagation();
                    let foodId = $(this).data('food-id');

                    $.ajax({
                        url: '/secretary/fridgeFood/food/' + foodId,
                        type: 'GET',
                        success: function (data) {
                            // 버튼의 data 속성 업데이트
                            $('.consume-btn').data('food-id', data.foodId);
                            $('.consume-btn').data('food-quantity', data.foodQuantity);
                            $('.consume-btn').data('fridge-id', data.fridgeId);
                            $('.consume-btn').data('food-name', data.foodName);

                            const imagePath = data.foodSavedFile
                                ? '/secretary/fridgeFood/image/' + data.foodSavedFile
                                : 'images/fridgeimg/DefaultFood.png';
                            const madeDate = data.foodMadeDate ? data.foodMadeDate : '미입력';

                            // D-Day 계산
                            const today = new Date();
                            const expiryDate = new Date(data.foodExpiryDate);
                            const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                            const dDayColor = diffDays <= 3 ? 'red' : 'blue';

                            // 날짜 형식 변환 함수
                            function formatDate(dateStr) {
                                const date = new Date(dateStr);
                                const year = date.getFullYear().toString().substr(2, 2);
                                return `${year}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                                    .getDate()
                                    .toString()
                                    .padStart(2, '0')}`;
                            }

                            $('#foodModal .modal-body').html(`
                <div class="row">
                    <div class="col-md-6">
                        <img src="${imagePath}" alt="${data.foodName}" class="img-fluid" style="width: 300px; height: 243px;">
                    </div>
                    <div class="col-md-6">
                        <p><strong>음식의 이름:</strong> ${data.foodName}</p>
                        <p><strong>카테고리:</strong> ${data.foodCategory}</p>
                        <p><strong>수량:</strong> ${data.foodQuantity}</p>
                        <p><strong>구매일:</strong> ${
                            data.foodPurchaseDate
                                ? `${formatDate(data.foodPurchaseDate)}`
                                : `${formatDate(data.foodInputDate)}`
                        }</p>
                        <p><strong>제조일:</strong> ${madeDate}</p>
                        <p><strong>유효기간:</strong> ${formatDate(
                            data.foodExpiryDate
                        )} (D-<span class="d-day" style="color:${dDayColor}">${diffDays}</span>)</p>
                    </div>
                </div>
            `);
                            $('#foodModal').modal('show');
                        },
                        error: function (error) {
                            console.log('Error fetching food details:', error);
                        },
                    });
                });

                $('#foodModal .btn-danger').on('click', function () {
                    $('#foodModal').modal('hide');
                });

                $('.fridgeSelect').on('change', function () {
                    const selectedFridgeId = $(this).val();
                    console.log('Selected Fridge ID:', selectedFridgeId);
                });
                function loadFridgesByCategory(category) {
                    $.ajax({
                        url: '/secretary/fridge/getAllFridges',
                        type: 'GET',
                        success: function (data) {
                            const filteredFridges = data.filter((fridge) => fridge.fridgeCategory === category);
                            $('#fridgeContainer').empty();
                            $('.fridgeSelect').empty();
                            filteredFridges.forEach(function (fridge) {
                                var option = `<option value="${fridge.fridgeId}">${fridge.fridgeName}</option>`;
                                $('.fridgeSelect').append(option);
                            });

                            filteredFridges.forEach(function (fridge) {
                                const fridgeElement = `
                                                                                                                <div class="fridgeItem">
                                                                                                                <div style="position: relative;">
                                                                                                                <a href="/secretary/fridge/${
                                                                                                                    fridge.fridgeId
                                                                                                                }">
                                                                                                                <img src="images/fridgeimg/${
                                                                                                                    category ===
                                                                                                                    '냉장실'
                                                                                                                        ? '노랑냉장고.jpg'
                                                                                                                        : '파랑냉장고.jpg'
                                                                                                                }" alt="${
                                    fridge.fridgeName
                                }" style="width: 90px; height: 90px">
                                                                                                                    </a>
                                                                                                                    </div>
                                                                                                                    <div class="fridgeName" data-current-name="${
                                                                                                                        fridge.fridgeName
                                                                                                                    }">${
                                    fridge.fridgeName
                                }</div>
                                                                                                                    </div>
                                                                                                                    `;
                                $('#fridgeContainer').append(fridgeElement);
                            });
                        },
                        error: function (error) {
                            console.error('냉장고 목록을 가져오는 중 오류 발생: ', error);
                        },
                    });
                }

                /*
        
                fridgeNotification.js로 모듈화함
                
                */

                // 위에서 정의한 변수입니다.
                let isCategoryEditMode = false;

                // 카테고리 수정 아이콘 클릭 이벤트
                $('.category-editIcon').click(function () {
                    if (isCategoryEditMode) {
                        isCategoryEditMode = false;
                    } else {
                        isCategoryEditMode = true;
                        // 카테고리 편집 모달 표시
                        $('#categoryEditModal').modal('show');
                    }
                });
                // 카테고리 편집 모달이 표시될 때 이 함수를 호출
                $('#categoryEditModal').on('show.bs.modal', populateCategoryModal);
                $('#categoryEditModal').on('hidden.bs.modal', function () {
                    // 모달이 완전히 닫힌 후 이벤트 리스너를 다시 바인딩
                    $('.category-editIcon')
                        .off('click')
                        .on('click', function () {
                            $('#categoryEditModal').modal('show');
                        });
                });
                function populateCategoryModal() {
                    $.ajax({
                        url: '/secretary/foodCategories',
                        type: 'GET',
                        dataType: 'json',
                        success: function (categories) {
                            const modalBody = $('#categoryEditModal .modal-body');
                            modalBody.empty(); // 기존 목록 삭제

                            // 기본 카테고리 출력
                            modalBody.append(
                                '<div class="card mb-4"><div class="card-header"><b>기본 카테고리</b></div><ul class="list-group list-group-flush default-categories">'
                            );
                            ['일반', '야채', '해산물', '육류', '과일'].forEach(function (categoryName) {
                                modalBody.find('.default-categories').append(`
        <li class="list-group-item d-flex align-items-center">
            <span class="category-name flex-grow-1">${categoryName}</span>
            <!-- 기본 카테고리는 수정/삭제 불가능하므로 아이콘을 출력하지 않습니다. -->
        </li>
    `);
                            });
                            modalBody.append('</ul></div>');

                            // 사용자 정의 카테고리 출력
                            modalBody.append('<div class="user-defined-categories">');
                            categories.forEach(function (category) {
                                modalBody.append(`
    <div class="category-item d-flex align-items-center mb-2 p-2 border rounded">
        <span class="category-name flex-grow-1 p-2 border rounded">${category.foodCategory}</span>
        <img src="images/fridgeimg/ModifyName.png" style="height:25px; width:25px; margin-left: 5px;" alt="수정" class="category-modal-editIcon modal-category-editIcon" data-category-id="${category.categoryId}">
        <img src="images/fridgeimg/Red_X.png" style="height:25px; width:25px; margin-left: 5px;" alt="삭제" class="category-modal-editIcon modal-category-deleteIcon" data-category-id="${category.categoryId}">
    </div>
`);
                            });
                            modalBody.append('</div>');
                        },
                        error: function (e) {},
                    });
                }

                // 모달 내부의 카테고리 수정 아이콘 클릭 이벤트
                $(document).on('click', '.modal-category-editIcon', function () {
                    const categoryItem = $(this).closest('.category-item');
                    const categoryNameSpan = categoryItem.find('.category-name');
                    const categoryName = categoryNameSpan.text();

                    // 기존 카테고리 이름을 숨기고, 입력란과 버튼을 같은 행에 추가합니다.
                    categoryNameSpan
                        .after(
                            `
    <div class="d-flex align-items-center justify-content-between" style="width: 100%;">
        <input type="text" class="form-control category-input" value="${categoryName}" style="flex: 1; margin-right: 5px;" />
        <div>
            <button class="btn btn-sm btn-warning confirm-edit">수정</button>
            <button class="btn btn-sm btn-outline-secondary cancel-edit" style="margin-left: 5px;">취소</button>
        </div>
    </div>
`
                        )
                        .hide();

                    $(this).hide();
                    categoryItem.find('.modal-category-deleteIcon').hide();
                });

                //음식 카테고리 수정 기능!
                $(document).on('click', '.cancel-edit', function () {
                    const categoryItem = $(this).closest('.category-item');

                    categoryItem.find('.d-flex').remove();

                    categoryItem.find('.category-name').show();
                    categoryItem.find('.modal-category-editIcon, .modal-category-deleteIcon').show();
                });

                $(document).on('click', '.confirm-edit', function () {
                    const categoryItem = $(this).closest('.category-item');
                    const newCategoryName = categoryItem.find('.category-input').val();
                    const originalCategoryName = categoryItem.find('.category-name').text();

                    // 기본 카테고리 중복 확인
                    if (DEFAULT_CATEGORIES.includes(newCategoryName)) {
                        alert('기본 카테고리명과 중복됩니다. 다른 이름을 선택해주세요.');
                        return;
                    }

                    // 데이터베이스 중복 확인
                    $.ajax({
                        url: '/secretary/foodCategories/checkCategoryDuplication',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({
                            foodCategory: newCategoryName,
                        }),
                        contentType: 'application/json',
                        success: function (isDuplicated) {
                            if (isDuplicated) {
                                Swal.fire({
                                    title: '경고',
                                    text: '이미 존재하는 카테고리 이름입니다.',
                                    icon: 'warning',
                                    confirmButtonText: '확인',
                                    customClass: {
                                        confirmButton: 'btn btn-primary', // 부트스트랩 'btn-primary' 스타일 적용
                                    }
                                });
                                return;
                            }
                            // 해당 카테고리를 사용하는 음식의 수 확인
                            $.ajax({
                                url: '/secretary/foodCategories/countFoodsUsingCategory',
                                type: 'POST',
                                dataType: 'json',
                                data: JSON.stringify({
                                    foodCategory: originalCategoryName,
                                }),
                                contentType: 'application/json',
                                success: function (count) {
                                    Swal.fire({
                                        title: '확인',
                                        text: `총 ${count}개의 음식이 해당 카테고리 명을 사용중입니다. 일괄 변경하시겠습니까?`,
                                        icon: 'warning',
                                        showCancelButton: true,
                                        confirmButtonText: '예, 변경합니다!',
                                        cancelButtonText: '취소',
                                        customClass: {
                                            confirmButton: 'btn btn-primary', // 부트스트랩 'btn-primary' 스타일 적용
                                            cancelButton: 'btn btn-secondary'  // 부트스트랩 'btn-secondary' 스타일 적용
                                        }
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            updateCategory(originalCategoryName, newCategoryName);
                                        }
                                    });
                                },
                            });
                        },
                    });
                });

                function updateCategory(originalName, newName) {
                    $.ajax({
                        url: '/secretary/foodCategories/updateCategory',
                        type: 'POST',
                        data: {
                            originalName: originalName,
                            newName: newName,
                        },
                        success: function () {
                            alert('카테고리가 성공적으로 수정되었습니다.');
                            location.reload(); // 페이지 새로고침
                        },
                    });
                }

                //삭제
                $(document).on('click', '.modal-category-deleteIcon', function () {
                    const categoryItem = $(this).closest('.category-item');
                    const categoryToDelete = categoryItem.find('.category-name').text();

                    // 해당 카테고리를 사용하는 음식의 수 확인
                    $.ajax({
                        url: '/secretary/foodCategories/countFoodsUsingCategory',
                        type: 'POST',
                        dataType: 'json',
                        data: JSON.stringify({
                            foodCategory: categoryToDelete,
                        }),
                        contentType: 'application/json',
                        success: function (count) {
                            Swal.fire({
                                title: '확인',
                                text: `총 ${count}개의 음식이 '${categoryToDelete}' 카테고리 명을 사용중입니다. 모든 음식을 '일반' 카테고리로 일괄 변경하시겠습니까?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: '예, 변경합니다!',
                                cancelButtonText: '취소',
                                customClass: {
                                    popup: 'swal2-popup-custom',
                                    confirmButton: 'btn btn-primary', // 부트스트랩 'btn-primary' 스타일 적용
                                    cancelButton: 'btn btn-secondary'  // 부트스트랩 'btn-secondary' 스타일 적용
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    deleteCategory(categoryToDelete);
                                }
                            });
                        },
                    });
                });

                function deleteCategory(categoryName) {
                    $.ajax({
                        url: '/secretary/foodCategories/deleteCategory',
                        type: 'POST',
                        data: {
                            foodCategory: categoryName,
                        },
                        success: function () {
                            alert('카테고리가 성공적으로 삭제되었습니다.');
                            location.reload(); // 페이지 새로고침
                        },
                        error: function () {
                            alert('카테고리 삭제에 실패하였습니다.');
                        },
                    });
                }

                //소비 버튼

                // 검색창 요소 선택
                let $searchInput = $('#foodSearchInput');

                // 검색창에 키 입력 이벤트 추가
                $searchInput.on('keyup', function () {
                    let searchTerm = $(this).val(); // 사용자가 입력한 검색어

                    $.ajax({
                        url: '/secretary/fridgeFood/search', // 백엔드 검색 엔드포인트
                        method: 'GET',
                        data: { query: searchTerm }, // 검색어를 쿼리 파라미터로 전달
                        success: function (response) {
                            // 응답에서 받아온 검색 결과를 화면에 표시
                            $('#foodItemsContainer').empty(); // 기존에 표시되던 음식 항목을 모두 제거합니다.
                            response.forEach(displayFoodItem); // 각 검색된 음식 항목을 화면에 표시합니다.
                        },
                        error: function (error) {
                            console.error('Error fetching search results:', error);
                        },
                    });
                });
                // DOM 엘리먼트 선택
                const previewContainer = document.querySelector('.image-preview');
                const previewImage = previewContainer.querySelector('.image-preview__image');
                const previewDefaultText = previewContainer.querySelector('.image-preview__default-text');
                const fileInput = document.getElementById('foodImage'); // 파일 입력 필드의 id를 "foodImage"로 가정

                // 파일 입력 필드에 이벤트 리스너 추가
                fileInput.addEventListener('change', function () {
                    const file = this.files[0];

                    if (file) {
                        // FileReader 객체 생성
                        const reader = new FileReader();

                        // 이미지 미리보기 및 기본 텍스트 숨김
                        previewDefaultText.style.display = 'none';
                        previewImage.style.display = 'block';

                        // 파일 읽기가 완료되면 실행되는 이벤트 리스너
                        reader.addEventListener('load', function () {
                            // 읽은 결과를 미리보기 이미지의 src 속성에 설정
                            previewImage.setAttribute('src', this.result);
                        });

                        // 파일 읽기 시작
                        reader.readAsDataURL(file);
                    } else {
                        // 파일이 선택되지 않았을 경우, 미리보기 및 기본 텍스트를 초기 상태로 되돌림
                        previewImage.style.display = null;
                        previewImage.setAttribute('src', '');
                        previewDefaultText.style.display = null;
                    }
                });
            });
            //ready_End;

            document.addEventListener('DOMContentLoaded', function () {
                var manualInputModal = document.getElementById('manualInputModal');

                manualInputModal.addEventListener('show.bs.modal', function () {
                    // 구매일자의 기본값 설정
                    var purchaseDateInput = document.getElementById('foodPurchaseDate');
                    var today = new Date().toISOString().slice(0, 10); // 현재 날짜를 YYYY-MM-DD 형식으로 변환
                    purchaseDateInput.value = today;

                    // 유통기한의 기본값 설정
                    var expiryDateInput = document.getElementById('foodExpiryDate');
                    var expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + 14);
                    expiryDateInput.value = expiryDate.toISOString().slice(0, 10); // 현재 날짜 + 14일을 YYYY-MM-DD 형식으로 변환
                });

            });