/** 대분류별 이달의 지출 도넛 */
function totalMonthExpense() {
    $.ajax({
        url: "/secretary/cashbook/chart/donutMonthExpense",
        type: "POST",
        data: { chYear: 2023, chMonth: 9 },
        dataType: "JSON",
        success: (result) => {
          // alert(JSON.stringify(result));
          let dataFromServer = result;
    
          const labels = dataFromServer.map(
            (item) => `${item.cate1Name}`
          );
          const data = dataFromServer.map((item) => item.totalMonthExpense);
    
          // 데이터를 복사하고 정렬
          const sortedData = [...data].sort((a, b) => b - a);
    
          // 동적으로 배경색을 설정
          const backgroundColors = data.map((amount) => {
            const rank = sortedData.indexOf(amount) + 1; // 순위는 1부터 시작
    
            if (rank === 1) {
              return "#696CFF";
            } else if (rank === 2) {
              return "#71DD37";
            } else if (rank === 3) {
              return "#03C3EC";
            } else if (rank === 4) {
              return "#FFAB00";
            }
            else {
              return "#8592A3";
            }
          });
    
          // 도넛 그리기
          const ctx = document.getElementById("DonutMonthExpense").getContext("2d");
          const DonutMonthExpense = new Chart(ctx, {
            type: "doughnut",
            data: {
              labels: labels,
              datasets: [
                {
                  data: data,
                  backgroundColor: backgroundColors,
                  borderColor: ["black"],
                  borderWidth: 0,
                },
              ],
            },
            options: {
                aspectRatio: 1,
                maintainAspectRatio: false,
                // 라벨 지우기
                plugins:{
                    legend: {
                        display: false
                    },
                }
            },
          });

        // <ul>에 <li>를 동적으로 추가
        let htmlToInsert = '';
        dataFromServer.forEach((item) => {
            const subCategoryExample = cate2NameExample(item.cate1Name); // cate1Name을 기반으로 소분류 예제 텍스트 가져오기
            htmlToInsert += `
                <li class="d-flex mb-4 pb-1">
                <div class="avatar flex-shrink-0 me-3">
                    <span class="avatar-initial rounded bg-label-${item.labelColor}"><i class="bx bx-mobile-alt"></i></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                    <h6 class="mb-0">${item.cate1Name}</h6>
                    <small class="text-muted">${subCategoryExample}</small>
                    </div>
                    <div class="user-progress">
                    <small class="fw-semibold">${item.totalMonthExpense.toLocaleString('en-US')}</small>
                    </div>
                </div>
                </li>`;
        });
        $('#totalMonthExpenseList').html(htmlToInsert);
        },
        error: (e) => {
          console.log("도넛 월지출 실패" + JSON.stringify(e));
        },
      });
}


/** 도넛 밑 리스트 대분류에 따른 소분류 예시 */
function cate2NameExample(cate1Name) {
    switch (cate1Name) {
      case '식비':
        return '식당, 카페, 간식 등';
      case '쇼핑':
        return '의류, 생활용품 등';
      case '여가':
        return '영화, 도서, 공연 등';
      case '여행':
        return '항공권, 관광, 숙박 등';
      case '뷰티':
        return '화장품, 미용실 등';
      case '건강':
        return '병원, 약국, 운동 등';
      default:
        return '기타';
    }
  }