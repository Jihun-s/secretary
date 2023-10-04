
import { loadAllFoodsByCategory } from './loadAllFoodsByCategory.js';
import { getCurrentCategory} from './fridgeScript.js';
$(document).ready(function(){

let allFoods = [];

        function loadFoodsForNotification(category, callback) {
          $.ajax({
            url: `fridgeFood/getAllFoodsByCategory/${category}`,
            type: "GET",
            dataType: "json",
            success: function (data) {
              allFoods = allFoods.concat(data);
              callback();
            },
            error: function (error) {
              console.error(
                "Error fetching fridge items for notification:",
                error
              );
            },
          });
        }

        function loadData() {
          allFoods = []; // 초기화
          // 냉장실 음식 아이템 데이터 가져오기
          loadFoodsForNotification("냉장실", function () {
            // 냉동실 음식 아이템 데이터 가져오기
            loadFoodsForNotification("냉동실", function () {
              // 데이터가 모두 로드된 후 알림 생성 및 표시
              createEssentialNotifications();
              createSuggestedNotifications();
            });
          });
        }

        function createEssentialNotifications() {
          $(".navs-pills-justified-home").empty();
          const today = new Date();
          const oneWeekFromNow = new Date(today);
          oneWeekFromNow.setDate(today.getDate() + 7);

          const essentialItems = allFoods.filter((food) => {
            const expiryDate = new Date(food.foodExpiryDate);
            return expiryDate <= oneWeekFromNow;
          });
          essentialItems.sort((a, b) => {
            const expiryDateA = new Date(a.foodExpiryDate);
            const expiryDateB = new Date(b.foodExpiryDate);
            return expiryDateA - expiryDateB;
          });

          essentialItems.forEach((item) => {
            const expiryDate = new Date(item.foodExpiryDate);
            const diffDays = Math.ceil(
              (expiryDate - today) / (1000 * 60 * 60 * 24)
            );
            const color = diffDays <= 3 ? "red" : "blue";
            const notification = `<div style="margin-bottom: 10px;">
                                  <p style="margin-bottom: 0;">[${item.fridgeName}]의 ${item.foodName} 유통기한 <span style="color:${color}">${diffDays}일</span> 남았습니다!</p>
                                  <a href="https://www.google.com/search?q=${item.foodName}을 활용한 요리 레시피" target="_blank" style="margin-top: -5px;"> - 레시피 제안 - </a>
                                  <span class="consume-text-btn consume-btn" data-fridge-id="${item.fridgeId}" data-food-id="${item.foodId}" data-food-quantity="${item.foodQuantity}" data-food-name="${item.foodName}">[소비]</span>
                              </div>`;
            $(".navs-pills-justified-home").append(notification);
          });
        }

        function createSuggestedNotifications() {
          $("#navs-pills-justified-profile").empty();
          $.ajax({
            url: `fridgeUsed/getFoodsNotAccessedForDays`,
            type: "GET",
            dataType: "json",
            success: function (data) {
              displaySuggestedNotifications(data.foods15Days, 15);
              displaySuggestedNotifications(data.foods30Days, 30);
            },
            error: function (error) {
              console.error("Error fetching suggested notifications:", error);
            },
          });
        }
        function displaySuggestedNotifications(foods, days) {
          foods.forEach((item) => {
            const notification = `
            <div>
                <p style="margin-bottom:0px;">[${item.fridgeName}]의 ${item.foodName}을 사용하지 않은 지 <span style="color:red">${days}일</span>이 지났습니다!</p>
                <a href="https://www.google.com/search?q=${item.foodName}을 활용한 요리 레시피" target="_blank"> - 레시피 제안 - </a>
                <span class="consume-text-btn consume-btn" data-fridge-id="${item.fridgeId}" data-food-id="${item.foodId}" data-food-quantity="${item.foodQuantity}" data-food-name="${item.foodName}">[소비]</span>
                        </div>
                    `;
            $("#navs-pills-justified-profile").append(notification);
          });
        }

        // 데이터 로드 및 알림 생성 및 표시 시작
        loadData();

                        //소비 버튼
                        $(document).on('click', '.consume-btn', function () {
                            const foodId = $(this).data('food-id');
                            const maxQuantity = $(this).data('food-quantity');
                            const fridgeId = $(this).data('fridge-id');
                            const responseFromPrompt = prompt(`소비할 수량을 입력하세요 (재고: ${maxQuantity})`);
                            const foodName = $(this).data('food-name');
        
                            if (responseFromPrompt === null) {
                                // 프롬프트에서 취소 버튼을 누름
                                return; // 아무 것도 하지 않고 종료
                            }
                            const quantityToConsume = parseInt(responseFromPrompt);
        
                            if (quantityToConsume > 0 && quantityToConsume <= maxQuantity) {
                                // 서버에 소비 처리 요청
                                $.ajax({
                                    url: 'fridgeUsed/consumeFood',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        foodId: foodId,
                                        foodQuantity: quantityToConsume,
                                        fridgeId: fridgeId,
                                        foodName: foodName,
                                    }),
        
                                    contentType: 'application/json',
                                    success: function (response) {
                                        alert('소비 처리가 완료되었습니다.');
                                        $('#foodModal').modal('hide');
                                        loadAllFoodsByCategory(getCurrentCategory());
                                        refreshConsumptionHistory();
                                        loadData();
                                    },
                                    error: function (error) {
                                        console.log('Error consuming food:', error);
                                        alert('소비 처리에 실패하였습니다.');
                                    },
                                });
                            } else {
                                alert('올바른 수량을 입력하세요.');
                            }
                        });
        
                        function refreshConsumptionHistory() {
                            $.ajax({
                                type: 'GET',
                                url: 'fridgeUsed/consumptionHistory',
                                success: function (data) {
                                    let content = '';
                                    data.forEach((item) => {
                                        content += `
                <div class="consumption-item">
                    <h5 class="used-food-name">${item.fridgeFoodName}을/를 ${item.fridgeQuantityUsed}개 소비하셨습니다!</h5>
                    <p class="used-date">${new Date(item.fridgeUsedDate).toLocaleString()}</p>
                    <span class="delete-consumption-text" data-consumption-id="${item.fridgeUsedId}">X</span>
                </div>
            `;
                                    });
                                    $('#consumptionHistoryContainer').html(content); // 해당 id를 갖는 div 내용 갱신
                                },
                            });
                        }
        
                        $(document).on('click', '.delete-consumption-text', function () {
                            const consumptionId = $(this).data('consumption-id');
                            if (confirm('정말 이 소비 이력을 삭제하시겠습니까?')) {
                                // 서버에 소비 이력 삭제 요청
                                $.ajax({
                                    url: 'fridgeUsed/deleteConsumptionHistory',
                                    type: 'POST',
                                    data: { fridgeUsedId: consumptionId },
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
        
                        $(document).on('click', '.delete-all-consumption-text', function () {
                            const totalItems = $('.consumption-item').length;
                            if (confirm(`총 ${totalItems}개의 소비 이력을 전부 삭제하시겠습니까?`)) {
                                $.ajax({
                                    url: 'fridgeUsed/deleteAllConsumptionHistory',
                                    type: 'POST',
                                    success: function (response) {
                                        alert('모든 소비 이력이 삭제되었습니다.');
                                        $('#consumptionHistoryContainer').empty(); // UI에서 모든 항목 제거
                                    },
                                    error: function (error) {
                                        console.log('Error deleting all consumptions:', error);
                                        alert('소비 이력 전체 삭제에 실패하였습니다.');
                                    },
                                });
                            }
                        });
        
                        // 사용자가 소비를 할 때 해당 함수를 호출
                        refreshConsumptionHistory();
    });