/** 
 * chart.js 활용해서 차트 그리는 .js
 */


$(document).ready(function() {
  weekExpenseAcc();

  /* 도넛 차트 그리기 */
  $('#donutMonthIncome-tab').on('shown.bs.tab', function (e) {
    totalMonthIncome();
  });
  $('#donutMonthExpense-tab').on('shown.bs.tab', function (e) {
    totalMonthExpense();
  });
});



////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 

/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////



/** 현재 날짜 전역변수 */
let date = new Date();
let curYear = date.getFullYear();
let curMonth = (date.getMonth() + 1).toString().padStart(2, '0');
let curDate = date.getDate().toString().padStart(2, '0');
let curHour = date.getHours().toString().padStart(2, '0');
let curMin = date.getMinutes().toString().padStart(2, '0');

let curDateTime = `${curYear}-${curMonth}-${curDate} ${curHour}:${curMin}:00`;



/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////

/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////
/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////
/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////



/** chart 객체 담는 전역변수 */
let DonutMonthExpense;

/** 대분류별 이달의 지출 도넛 그리기 */
function totalMonthExpense() {
  // chart 객체가 이미 존재하면 파괴
  if (DonutMonthExpense) {
    DonutMonthExpense.destroy();
  }

    $.ajax({
        url: "/secretary/cashbook/chart/donutMonthExpense",
        type: "POST",
        data: { chYear: curYear, chMonth: curMonth },
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
              return "#FFE616";
            }
            else {
              return "#8592A3";
            }
          });
    
          // 도넛 그리기
          const ctx = document.getElementById("DonutMonthExpenseCate1").getContext("2d");
          DonutMonthExpense = new Chart(ctx, {
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
            const ExpenseSubCategoryExample = ExpenseCate2NameExample(item.cate1Name);
            const cateIcon = ExpenseCate1Icon(item.cate1Name);

            htmlToInsert += `
                <li class="d-flex mb-4 pb-1">
                <div class="avatar flex-shrink-0 me-3">
                    <span class="avatar-initial rounded bg-label-${item.labelColor}"><i class="bx bx-${cateIcon}"></i></span>
                </div>
                <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                    <h6 class="mb-0">${item.cate1Name}</h6>
                    <small class="text-muted">${ExpenseSubCategoryExample}</small>
                    </div>
                    <div class="user-progress">
                    <small class="fw-semibold">${item.totalMonthExpense.toLocaleString('en-US')}원</small>
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


/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////
/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////지출리스트/////


/** 도넛 밑 리스트 대분류에 따른 지출 소분류 예시 */
function ExpenseCate2NameExample(cate1Name) {
    switch (cate1Name) {
      case '고정지출':
        return '주거, 통신, 교통 등';
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

/** 도넛 밑 리스트 대분류에 따른 지출 아이콘bx 변경 */
function ExpenseCate1Icon(cate1Name) {
    switch (cate1Name) {
      case '고정지출':
        return 'pin';
      case '식비':
        return 'dish';
      case '쇼핑':
        return 'shopping-bag';
      case '여가':
        return 'camera-movie';
      case '여행':
        return 'train';
      case '뷰티':
        return 'face';
      case '건강':
        return 'capsule';
      default:
        return 'credit-card';
    }
  }



/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////
/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////
/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////지출도넛/////

/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////
/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////
/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////



// chart 객체 담는 전역변수 
let DonutMonthIncome;

/** 대분류별 이달의 수입 도넛 */
function totalMonthIncome() {
  // chart 객체가 이미 존재하면 파괴
  if (DonutMonthIncome) {
    DonutMonthIncome.destroy();
  }

  $.ajax({
      url: "/secretary/cashbook/chart/donutMonthIncome",
      type: "POST",
      data: { chYear: curYear, chMonth: curMonth },
      dataType: "JSON",
      success: (result) => {
        alert("도넛 그릴 데이터:" + JSON.stringify(result));
        // 데이터가 없거나 비어있다
        // if (!result || result.length === 0) {
        //   alert('이번달 지출 데이터가 없습니다.');

        //   let nodata = '';
        //   nodata += `
        //       <p>이번 달 가계부 데이터가 존재하지 않아요. 내역을 작성하러 가볼까요?</p>
        //       <a th:href="@{/cashbook/trans}">
        //         <button type="button" class="btn btn-success">
        //           내역 바로가기
        //         </button>
        //       </a>`;
        //   $('#donutDiv').html(nodata);
          
        //   return;
        // }

        let dataFromServer = result;
  
        const labels = dataFromServer.map(
          (item) => `${item.cate1Name}`
        );
        const data = dataFromServer.map((item) => item.totalMonthIncome);
  
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
            return "#FFE616";
          }
          else {
            return "#8592A3";
          }
        });
  
        // 도넛 그리기
        const ctx = document.getElementById("DonutMonthIncomeCate1").getContext("2d");
        DonutMonthIncome  = new Chart(ctx, {
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
          const IncomeSubCategoryExample = IncomeCate2NameExample(item.cate1Name);
          const cateIcon = IncomeCate1Icon(item.cate1Name);

          htmlToInsert += `
              <li class="d-flex mb-4 pb-1">
              <div class="avatar flex-shrink-0 me-3">
                  <span class="avatar-initial rounded bg-label-${item.labelColor}"><i class="bx bx-${cateIcon}"></i></span>
              </div>
              <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                  <div class="me-2">
                  <h6 class="mb-0">${item.cate1Name}</h6>
                  <small class="text-muted">${IncomeSubCategoryExample}</small>
                  </div>
                  <div class="user-progress">
                  <small class="fw-semibold">${item.totalMonthIncome.toLocaleString('en-US')}원</small>
                  </div>
              </div>
              </li>`;
      });
      $('#totalMonthIncomeList').html(htmlToInsert);
      },
      error: (e) => {
        console.log("도넛 월수입 실패" + JSON.stringify(e));
      },
    });
}


/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////
/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////수입리스트/////


/** 도넛 밑 리스트 대분류에 따른 수입 소분류 예시 */
function IncomeCate2NameExample(cate1Name) {
  switch (cate1Name) {
    case '급여':
      return '월급, 주급 등';
    case '용돈':
      return '엄마찬스 등';
    case '투자소득':
      return '주식, 부동산 등';
    case '금융소득':
      return '예금이자 등';
    case '판매소득':
      return '중고거래 등';
    case '복권':
      return '일확천금';
    default:
      return '기타';
  }
}

/** 도넛 밑 리스트 대분류에 따른 수입 아이콘bx 변경 */
function IncomeCate1Icon(cate1Name) {
  switch (cate1Name) {
    case '급여':
      return 'money';
    case '용돈':
      return 'wallet';
    case '투자소득':
      return 'credit-card-front';
    case '금융소득':
      return 'buildings';
    case '판매소득':
      return 'coin-stack';
    case '복권':
      return 'bitcoin';
    default:
      return 'money';
  }
}

/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////
/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////
/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////수입도넛/////

/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////
/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////
/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////



/** 주별 요약 (주간 누적 총 소비금액) 리스트 그리는 함수 */
function weekExpenseAcc() {
  $.ajax({
    url: '/secretary/cashbook/chart/weekExpenseAcc',
    type: 'POST',
    data: { chYear: curYear, chMonth: curMonth },
    dataType: 'JSON',
    success: (data) => {
      // console.log("주별 요약:" + JSON.stringify(data));
      // [{"familyId":1,"userId":null,"cate1Name":null,"cate2Name":null,"labelColor":null,"curYear":2023,"curMonth":9,"weekOfMonth":1,"totalMonthExpense":null,"totalMonthIncome":null,"totalWeekExpense":780200,"weekAccumulatedExpense":780200}]

      let htmlToInsert = '';
      data.forEach((wea) => {
      htmlToInsert += `
          <p class="list-group-item list-group-item-action d-flex justify-content-between">
            <span>${wea.weekOfMonth}주차</span>
            <span>총 ${wea.weekAccumulatedExpense.toLocaleString('en-US')}원</span>
            <small>+${wea.totalWeekExpense.toLocaleString('en-US')}</small>
          </p>
        `;
      });

      $('#weekExpenseAccDiv').html(htmlToInsert);

    },
    error: (e) => {
      alert("주별 요약 전송 실패");
      console.log(JSON.stringify(e));
    }
  });
}



/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////
/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////
/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////주별요약/////

/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////
/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////
/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////



/** 6개월 간 수입지출 추이를 곡선 그래프로 그리는 함수 */
function inExSixMonth() {
  $.ajax({
    url: '/secretary/cashbook/chart/inExSixMonth',
    type: 'POST',
    data: { chYear: curYear, chMonth: curMonth },
    dataType: 'JSON',
    success: (data) => {
      // 연월 기준 오름차순 정렬
      data.sort((a, b) => {
        if (a.curYear === b.curYear) {
          return a.curMonth - b.curMonth;
        }
        return a.curYear - b.curYear;
      });
    
      // console.log(JSON.stringify(data));
    
      // 라벨과 데이터 배열 생성
      const labels = data.map(item => `${item.curYear}년 ${item.curMonth}월`);
      const expenseData = data.map(item => item.totalMonthExpense);
      const incomeData = data.map(item => item.totalMonthIncome);
    
      // 차트 생성
      const ctx = document.getElementById('barInExSixMonth').getContext('2d');
      const barInExSixMonth = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '수입',
              data: incomeData,
              borderColor: '#696CFF',
              fill: false,
            },
            {
              label: '지출',
              data: expenseData,
              borderColor: '#03C3EC',
              fill: false,
            }
          ]
        },
        options: {
          scales: {
            x: { beginAtZero: true },
            y: { beginAtZero: true }
          },
          elements: {
            line: {
              tension: 0.3  // 선 띠용~하는 정도 
            }
          }
        }
      });
    },
    error: (e) => {
      alert('6개월 추이 선 그래프 전송 실패');
      console.log(JSON.stringify(e));
    }
    
  });
}



/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////
/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////
/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////라인차트/////

/////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////
/////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////
/////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////막대그래프////



/** 다른 유저 3개월 평균 비교하는 막대그래프 그리는 함수 */
function otherUserTotal() {
  $.ajax({
    url: '/secretary/cashbook/chart/otherUserTotal',
    type: 'POST',
    data: { chYear: curYear, chMonth: curMonth },
    dataType: 'JSON',
    success: (data) => {
      // key:월, value:각 값으로 하는 map
      const myExpenseMap = new Map();
      const otherExpenseAvgMap = new Map();
  
      // Map에 데이터 저장
      for (const item of data.myResult) {
        const key = `${item.chYear}-${item.chMonth}`;
        myExpenseMap.set(key, item.totalMonthExpense);
      }
  
      for (const item of data.otherResult) {
        const key = `${item.chYear}-${item.chMonth}`;
        otherExpenseAvgMap.set(key, item.totalMonthExpenseAvg);
      }
  
      // 고유한 시간 라벨을 생성
      const uniqueLabels = Array.from(new Set([...myExpenseMap.keys(), ...otherExpenseAvgMap.keys()])).sort();
  
      // Chart.js 데이터 배열 생성
      const labels = uniqueLabels.map(label => `${label.split('-')[0]}년 ${label.split('-')[1]}월`);
      const myExpenseData = uniqueLabels.map(label => myExpenseMap.get(label) || 0);
      const otherExpenseAvgData = uniqueLabels.map(label => otherExpenseAvgMap.get(label) || 0);  

      // Chart.js 설정
      const ctx = document.getElementById('lineOtherUserTotal').getContext('2d');
      const lineOtherUserTotal = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '우리 가족',
              data: myExpenseData,
              backgroundColor: '#71DD37'
            },
            {
              label: '평균',
              data: otherExpenseAvgData,
              backgroundColor: '#696CFF'
            }
          ]
        },
        
      });
    },
    error: (e) => {
      alert('타 유저 비교 막대그래프 전송 실패');
      console.log(JSON.stringify(e));
    }
  });
}












