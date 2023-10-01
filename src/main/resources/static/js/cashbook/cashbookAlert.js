/** 
 * 가계부 알림 .js  
 */


$(document).ready(function() {
  // 기본값인 필수함수만 먼저 불러오기 
  getPilsuAlert();

  /** 1분에 한번씩 알림창 새로고침하는 함수  */
  setInterval(function() {
    getPilsuAlert();
    getJeahnAlert();
  }, 60000);
});



////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 

/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////
/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////
/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////



/** 예산 설정 여부 확인하는 전역변수 */
let budgetExist = 0;
/** (예산-지출) > 0인지 확인하는 전역변수 */
let budgetMinus = 0;


/** 필수알림 가져오는 함수 */
function getPilsuAlert() {
  let curYear = $('#curYear').val();
  let curMonth = $('#curMonth').val();
  let curDate = $('#curDate').val();
  let curDateTime = $('#curDateTime').val();

  /** 예산 있없? 확인 */
  $.ajax({
      url: '/secretary/cashbook/budgetExist',
      type: 'GET',
      data: { curYear: curYear, curMonth: curMonth },
      dataType: 'text',
      success: (result) => {
          if(result == 1) {
              budgetExist = 1;

              // 예산 초과했는지 확인
              $.ajax({
                url: '/secretary/cashbook/budget/getBudgetRest',
                type: 'GET',
                data: { curYear: curYear, curMonth: curMonth },
                success: (result) => {
                  if (result <= 0) {
                    budgetMinus = 1;
                    // alert("예산초과?:" + budgetMinus);
                  }
                },
                error: (e) => {
                  alert('남은 예산 서버 전송 실패');
                  console.log(JSON.stringify(e));
                }
              });

          }
      },
      error: (e) => {
          alert('알림 출력 직전 예산 있없 조회 실패');
          console.log(JSON.stringify(e));
      }
  });

  /** 필수알림 목록 가져오는 ajax */
  $.ajax({
    url: '/secretary/cashbook/alert/getPilsuAlert',
    type: 'POST',
    data: { curDateTime: curDateTime, curYear: curYear, curMonth: curMonth, curDate: curDate },
    dataType: 'JSON',
    success: function(data) {
    // console.log("필수알림 data: " + JSON.stringify(data));

    let html = "";

    if (!data || data.length === 0) {
      html = `<br>&nbsp;&nbsp;&nbsp;&nbsp;<p>표시할 필수 알림이 없습니다.</p>`;
      $('#pilsuAlertListDiv').html(html);
      return;
    }

    // 예산 없을 때 알림
    if(budgetExist == 0) {
      html += `<br><small class="text-light fw-semibold mb-2">${curYear}-${curMonth}-${curDate}</small>`;
      html += `
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
              <a href="javascript:openSetBudgetModal()">
                <div>
                  ${curMonth}월 예산이 설정되지 않았습니다. 여기를 클릭하면 예산을 설정할 수 있어요.
                </div>
              </a>
          </div>
          `;
    }
        
    // 예산 초과했을 때 알림
    if(budgetMinus == 1) {
      // alert("알림 추가하자!");
      html += `<br><small class="text-light fw-semibold mb-2">${curYear}-${curMonth}-${curDate}</small>`;
      html += `
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
            <a href="javascript:openUpdateBudgetModal()">
            <div>
              ${curMonth}월 예산을 초과했어요! 과소비를 계속하면 길바닥에 나앉을 수 있어요. 여기를 눌러 예산을 다시 설정할 수 있어요.
            </div>
            </a>
          </div>
      `;
      // alert("알림 추가 완료!");
    }


    // 알림을 alertDateYmd 기준으로 그룹화
    let groupedByDate = {};
    data.forEach(alert => {
      if (!groupedByDate[alert.alertDateYmd]) {
          groupedByDate[alert.alertDateYmd] = [];
      }
      groupedByDate[alert.alertDateYmd].push(alert);
    });

    // 객체의 키를 추출해 내림차순으로 정렬
    let sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

    // 내림차순한 배열 
    let sortedGroupedByDate = {};
    sortedDates.forEach(date => {
      sortedGroupedByDate[date] = groupedByDate[date];
    });


    // console.log("제안 sortedGroupedByDate: " + JSON.stringify(sortedGroupedByDate));

    // 그룹별 키워드

    // 총수입 총지출
    let inexTotal = ["지난달"];

    // 지출
    let exWeek = ["지난주"];
    
    // 예산
    // 정기소득
    let bgRest = ["남은예산"];

    // 그룹화된 데이터를 기반으로 HTML 생성
    for (let date in sortedGroupedByDate) {
      html += `<br><small class="text-light fw-semibold mb-2">${date}</small>`;
      // 가져온 데이터 분기
      sortedGroupedByDate[date].forEach(alert => {
        html += `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
        <a href="javascript:openDetailModal(${alert.alertId});">
          <div>
        `;

        // 지난달총수입총지출
          if (inexTotal.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            지난 달에는 ${alert.totalIncomeMonth.toLocaleString('en-US')}원을 벌고 ${alert.totalExpenseMonth.toLocaleString('en-US')}원을 지출했어요.
          `;
            // 수입 < 지출
            if(alert.totalIncomeMonth < alert.totalExpenseMonth) {
              html += `배보다 배꼽이 더 큰 한 달이네요. 🤯`;
            }
            // 수입 = 지출
            else if (alert.totalIncomeMonth == alert.totalExpenseMonth) {
              html += `버는 족족 써버리고 말았네요. 💸`;
            }
            // 수입 > 지출
            else if (alert.totalIncomeMonth == alert.totalExpenseMonth) {
              html += `저축이나 재테크의 비중을 높여도 좋겠어요.`;
            }
          }
          // 지난주총지출
          else if (exWeek.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
              지난 주 총 지출은 ${alert.totalWeekExpense.toLocaleString('en-US')}원입니다.
            `;
          } 
          // 남은예산
          else if (bgRest.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            
            `;
            if(alert.budgetRest <= 0) {
              html += `예산보다 ${alert.budgetRest.toLocaleString('en-US') * -1}원 더 지출했어요. 와! 길바닥에 나앉기 직전이에요. 🫵`;
            }
            else {
              html += `이번 달 남은 예산은 ${alert.budgetRest.toLocaleString('en-US')}원입니다. 이번 주도 알뜰살뜰 노력해봐요. ☺️`;
            }
          } 
          // 기타
          else {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다.
            `;
          }

          html += `
          </div>
            </a>
            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteAlert(${alert.alertId});"></i>
          </div>
          `; 

          // console.log("이 알림의 번호는 " + alert.alertId);
        });

      }

      $('#pilsuAlertListDiv').html(html);


    },
    error: (e) => {
        alert('가계부 필수알림 목록 전송 실패');
    }
  });
}



/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////
/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////
/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////필수알림/////

/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////
/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////
/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////



/** 제안알림 가져오는 함수 */
function getJeahnAlert() {
  let curYear = $('#curYear').val();
  let curMonth = $('#curMonth').val();
  let curDate = $('#curDate').val();
  let curDateTime = $('#curDateTime').val();

  /** 제안알림 목록 가져오는 ajax */
  $.ajax({
    url: '/secretary/cashbook/alert/getJeahnAlert',
    type: 'POST',
    data: { curDateTime: curDateTime, curYear: curYear, curMonth: curMonth, curDate: curDate },
    dataType: 'JSON',
    success: function(data) {
    // console.log("제안알림 data: " + JSON.stringify(data));
    
    let html = "";

    if (!data || data.length === 0) {
      html = `<br>&nbsp;&nbsp;&nbsp;&nbsp;<p>표시할 제안 알림이 없습니다.</p>`;
      $('#jeahnAlertListDiv').html(html);
      return;
    }

    // 알림을 alertDateYmd 기준으로 그룹화
    let groupedByDate = {};
    data.forEach(alert => {
      if (!groupedByDate[alert.alertDateYmd]) {
          groupedByDate[alert.alertDateYmd] = [];
      }
      groupedByDate[alert.alertDateYmd].push(alert);
    });

    // 객체의 키를 추출해 내림차순으로 정렬
    let sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

    // 내림차순한 배열 
    let sortedGroupedByDate = {};
    sortedDates.forEach(date => {
      sortedGroupedByDate[date] = groupedByDate[date];
    });

    // console.log("sortedGroupedByDate: " + JSON.stringify(sortedGroupedByDate));

    /** 그룹별 키워드 */
    // 지출
    // 정기결제
    let exSubscript = ["카드", "구독", "정기", "결제", "납부"];
    // 명절
    let exHoliday = ["명절", "설날", "추석"];
    // 경사
    let exGoodday = ["생일", "생신", "결혼", "백일", "돌잔치", "환갑", "칠순", "팔순", "구순", "파티"]
    // 조사 
    let exSadday = ["기일", "장례"];

    // 수입
    // 정기소득
    let inSalary = ["월급", "급여", "주급"];
    // 비정기소득
    let inLuck = ["용돈", "주식"];

    // 그룹화된 데이터를 기반으로 HTML 생성
    for (let date in sortedGroupedByDate) {
      html += `<br><small class="text-light fw-semibold mb-2">${date}</small>`;
      // 가져온 데이터 분기
      sortedGroupedByDate[date].forEach(alert => {
        html += `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
        <a href="javascript:openDetailModal(${alert.alertId});">
          <div>
        `;

          // 정기결제
          if (exSubscript.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
              ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 연결된 계좌의 잔고를 확인하세요.
            `;
          } 
          // 명절
          else if (exHoliday.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 명절 맞이 준비는 하셨나요?
            `;
          } 
          // 경사
          else if (exGoodday.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 기다리던 ${alert.alertContent}입니다. 선물로 마음을 전해요.
            `;
          } 
          // 조사
          else if (exSadday.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 ${alert.alertContent}입니다. 성의 표현을 위해 일정과 예산을 확인하세요.
          `;
          }
          // 월급
          else if (inSalary.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일은 대망의 ${alert.alertContent} 입니다! 야호! 월급의 50%는 저축하는 편이 좋아요.
          `;
          }
          // 용돈
          else if (inLuck.some(keyword => alert.alertContent.includes(keyword))) {
            html += `
            ${alert.alertDateMonth}월 ${alert.alertDateDay}일 받은 ${alert.alertContent}! 비상금으로 모아두는 건 어떨까요? 
          `;
          }

          html += `
          </div>
            </a>
            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteAlert(${alert.alertId});"></i>
          </div>
          `; 

          // console.log("이 알림의 번호는 " + alert.alertId);
        });

      }
      
      $('#jeahnAlertListDiv').html(html);

    },
    error: (e) => {
        alert('가계부 제안알림 목록 전송 실패');
    }
  });
}


/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////
/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////
/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////제안알림/////

/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////
/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////
/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////



/** 알림 삭제 */
function deleteAlert(alertId) {
  console.log("삭제할 알림 번호:" + alertId);

  $.ajax({
    url: '/secretary/cashbook/alert/deleteAlert',
    type: 'POST',
    data: { alertId: alertId },
    success: () => {
      getPilsuAlert();
    },
    error: (e) => {
      alert("알림 삭제 서버 전송 실패");
      console.log(JSON.stringify(e));
    }
  });
}


/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////전체삭제/////


/** 필수알림 전체 삭제 */
function deleteAllCashbookAlert() {
  if(confirm("가계부 관련 알림을 모두 삭제할까요?")) {
    $.ajax({
      url: '/secretary/cashbook/alert/deleteAllCashbookAlert',
      type: 'POST',
      success: () => {
        getPilsuAlert();
        getJeahnAlert();
      },
      error: (e) => {
        alert("가계부 알림 모두 삭제 서버 전송 실패");
        console.log(JSON.stringify(e));
      }
    });
  }
}

/** 제안알림 전체 삭제 */
function deleteAllJeahnAlert() {
  if(confirm("제안 알림을 모두 삭제할까요?")) {
    $.ajax({
      url: '/secretary/cashbook/alert/deleteAllJeahnAlert',
      type: 'POST',
      success: () => {
        getPilsuAlert();
        getJeahnAlert();
      },
      error: (e) => {
        alert("제안알림 모두 삭제 서버 전송 실패");
        console.log(JSON.stringify(e));
      }
    });
  }
}


/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////
/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////
/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////알림삭제/////

/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////
/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////
/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////


/** 예산 재설정 알림 클릭하면 예산 설정 모달 띄우는 함수 */
function openUpdateBudgetModal() {
  initUpdateBudgetModal();
  $('#ModalUpdateBudget').modal('show');
}


/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////
/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////
/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////알림 상호작용/////