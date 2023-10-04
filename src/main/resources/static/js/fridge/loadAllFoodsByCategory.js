export function loadAllFoodsByCategory(category) {
    $.ajax({
        url: `fridgeFood/getAllFoodsByCategory/${category}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            $('#foodItemsContainer').empty();
            data.forEach(displayFoodItem);
        },
        error: function (error) {
            console.error('Error fetching fridge items:', error);
        },
    });
}

export function displayFoodItem(foodItem) {
    var imagePath = foodItem.foodSavedFile
        ? 'fridgeFood/image/' + foodItem.foodSavedFile // Serve image from C:/secretaryfile/
        : 'images/fridgeimg/DefaultFood.png';

    var today = new Date();
    var expiryDate = new Date(foodItem.foodExpiryDate);
    var diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    function formatDate(dateStr) {
        var date = new Date(dateStr);
        var year = date.getFullYear().toString().substr(2, 2); // 년도의 마지막 두 자리만 가져옵니다.
        return (
            year +
            '-' +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            '-' +
            date.getDate().toString().padStart(2, '0')
        );
    }

    var dDayColor = 'blue'; // 기본 색상
    if (diffDays <= 3) {
        dDayColor = 'red';
    }

    const foodModifyIcon = `
                                                                                    <img src="images/fridgeimg/ModifyName.png" alt="수정" class="editIcon food-editIcon foodModifyIcon"
                                                                                    data-food-id="${foodItem.foodId}" style="position: absolute; top: 0; right: 20px;">
                                                                                    `;
    const foodDeleteIcon = `
                                                                                    <img src="images/fridgeimg/Red_X.png" alt="삭제" class="editIcon food-editIcon foodDeleteIcon"
                                                                                    data-food-id="${foodItem.foodId}" style="position: absolute; top: 0; right: 0;">
                                                                                    `;

    var foodItemElement = `
                                                                                    <div class="card mt-3 mb-4 food-item" data-food-id="${
                                                                                        foodItem.foodId
                                                                                    }" data-category="${
        foodItem.foodCategory
    }" data-food-input-date="${foodItem.foodInputDate}">
                                                                                    <div class="card-body foodcard">
                                                                                    <!-- Edit & Delete Icons -->
                                                                                ${foodModifyIcon}
                                                                            ${foodDeleteIcon}
                                                                            <!-- Food Image -->
                                                                            <div class="food-image-container">
                                                                            <img src="${imagePath}" alt="${
        foodItem.foodName
    }" class="food-image">
                                                                            </div>
                                                                            <!-- Food Details -->
                                                                            <div class="food-details">
                                                                            <span class="badge rounded-pill bg-label-primary food-category centered-category">${
                                                                                foodItem.foodCategory
                                                                            }</span>
                                                                                <div class="food-name">${
                                                                                    foodItem.foodName
                                                                                }</div>
                                                                                <div class="purchase-date">${
                                                                                    foodItem.foodPurchaseDate &&
                                                                                    foodItem.foodPurchaseDate !==
                                                                                        ''
                                                                                        ? `구매: ${formatDate(
                                                                                              foodItem.foodPurchaseDate
                                                                                          )}`
                                                                                        : `입력: ${formatDate(
                                                                                              foodItem.foodInputDate
                                                                                          )}`
                                                                                }</div>
                                                                                    
                                                                                    <div class="expiry-date">기한: ${formatDate(
                                                                                        foodItem.foodExpiryDate
                                                                                    )}<br> (D-<span class="d-day" style="color:${dDayColor}">${diffDays}</span>)</div>
                                                                                    </div>
                                                                                    </div>
                                                                                    </div>
                                                                                    `;

    $('#foodItemsContainer').append(foodItemElement);
}