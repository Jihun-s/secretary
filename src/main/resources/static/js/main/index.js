/** 예산 설정 여부 확인하는 전역변수 */
let budgetExist = 0;
/** (예산-지출) > 0인지 확인하는 전역변수 */
let budgetMinus = 0;


/** 필수알림 가져오는 함수 */
function getPilsuAlert() {
let now = new Date(); 
let curYear = now.getFullYear();
let curMonth = now.getMonth() + 1;
let curDate = now.getDate();

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
    html = `<p>표시할 필수 알림이 없습니다.</p>`;
    $('#pilsuAlertListDiv').html(html);
    return;
    }

    // 예산 없을 때 알림
    if(budgetExist == 0) {
    html += `<br><small class="text-light fw-semibold mb-2">${curYear}-${curMonth}-${curDate}</small>`;
    html += `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
            <a href="/secretary/cashbook">
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


/** 공용 모달 알림 가져오는 함수 */
function getPilsuAlertModal() {
  let now = new Date();
  let curYear = now.getFullYear();
  let curMonth = now.getMonth() + 1;
  let curDate = now.getDate();

  /** 예산 있없? 확인 */
  $.ajax({
    url: "/secretary/cashbook/budgetExist",
    type: "GET",
    data: { curYear: curYear, curMonth: curMonth },
    dataType: "text",
    success: (result) => {
      if (result == 1) {
        budgetExist = 1;

        // 예산 초과했는지 확인
        $.ajax({
          url: "/secretary/cashbook/budget/getBudgetRest",
          type: "GET",
          data: { curYear: curYear, curMonth: curMonth },
          success: (result) => {
            if (result <= 0) {
              budgetMinus = 1;
              // alert("예산초과?:" + budgetMinus);
            }
          },
          error: (e) => {
            alert("남은 예산 서버 전송 실패");
            console.log(JSON.stringify(e));
          },
        });
      }
    },
    error: (e) => {
      alert("알림 출력 직전 예산 있없 조회 실패");
      console.log(JSON.stringify(e));
    },
  });

  /** 필수알림 목록 가져오는 ajax */
  $.ajax({
    url: "/secretary/cashbook/alert/getPilsuAlert",
    type: "POST",
    data: {
      curDateTime: curDateTime,
      curYear: curYear,
      curMonth: curMonth,
      curDate: curDate,
    },
    dataType: "JSON",
    success: function (data) {
      // console.log("필수알림 data: " + JSON.stringify(data));

      let html = "";

      if (!data || data.length === 0) {
        html = `<p>표시할 필수 알림이 없습니다.</p>`;
        $("#pilsuAlertListDivModal").html(html);
        return;
      }

      // 예산 없을 때 알림
      if (budgetExist == 0) {
        html += `<br><small class="text-light fw-semibold mb-2">${curYear}-${curMonth}-${curDate}</small>`;
        html += `
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
              <a href="/secretary/cashbook">
                <div>
                  ${curMonth}월 예산이 설정되지 않았습니다. 예산을 설정하고 돈을 효율적으로 관리해보세요.
                </div>
              </a>
          </div>
          `;
      }

      // 예산 초과했을 때 알림
      if (budgetMinus == 1) {
        // alert("알림 추가하자!");
        html += `<br><small class="text-light fw-semibold mb-2">${curYear}-${curMonth}-${curDate}</small>`;
        html += `
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
            <a href="javascript:openUpdateBudgetModal()">
            <div>
              ${curMonth}월 예산을 초과했어요! 현실적인 예산을 다시 설정하거나 반성하는 시간을 가져요.
            </div>
            </a>
          </div>
      `;
        // alert("알림 추가 완료!");
      }

      // 알림을 alertDateYmd 기준으로 그룹화
      let groupedByDate = {};
      data.forEach((alert) => {
        if (!groupedByDate[alert.alertDateYmd]) {
          groupedByDate[alert.alertDateYmd] = [];
        }
        groupedByDate[alert.alertDateYmd].push(alert);
      });

      // 객체의 키를 추출해 내림차순으로 정렬
      let sortedDates = Object.keys(groupedByDate).sort((a, b) =>
        b.localeCompare(a)
      );

      // 내림차순한 배열
      let sortedGroupedByDate = {};
      sortedDates.forEach((date) => {
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
        sortedGroupedByDate[date].forEach((alert) => {
          html += `
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
        <a href="javascript:openDetailModal(${alert.alertId});">
          <div>
        `;

          // 지난달총수입총지출
          if (
            inexTotal.some((keyword) =>
              alert.alertContent.includes(keyword)
            )
          ) {
            html += `
            지난 달에는 ${alert.totalIncomeMonth.toLocaleString(
              "en-US"
            )}원을 벌고 ${alert.totalExpenseMonth.toLocaleString(
              "en-US"
            )}원을 지출했어요.
          `;
            // 수입 < 지출
            if (alert.totalIncomeMonth < alert.totalExpenseMonth) {
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
          else if (
            exWeek.some((keyword) => alert.alertContent.includes(keyword))
          ) {
            html += `
              지난 주 총 지출은 ${alert.totalWeekExpense.toLocaleString(
                "en-US"
              )}원입니다.
            `;
          }
          // 남은예산
          else if (
            bgRest.some((keyword) => alert.alertContent.includes(keyword))
          ) {
            html += `
            
            `;
            if (alert.budgetRest <= 0) {
              html += `예산보다 ${
                alert.budgetRest.toLocaleString("en-US") * -1
              }원 더 지출했어요. 와! 길바닥에 나앉기 직전이에요. 🫵`;
            } else {
              html += `이번 달 남은 예산은 ${alert.budgetRest.toLocaleString(
                "en-US"
              )}원입니다. 이번 주도 알뜰살뜰 노력해봐요. ☺️`;
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

      $("#pilsuAlertListDivModal").html(html);
    },
    error: (e) => {
      alert("가계부 필수알림 목록 전송 실패");
    },
  });
}



/** 월 총 지출 불러오기 */
function sumExpenseMonth() {
    nowYear = new Date().getFullYear();
    nowMonth = new Date().getMonth()+1;

    // 총지출 총수입 가져오기 
    $.ajax({
        url: '/secretary/cashbook/trans/selectSumInEx',
        type: 'GET',
        data: { nowYear: nowYear, nowMonth: nowMonth },
        dataType: 'JSON',
        success: (data) => {
            console.log("받은 데이터:", JSON.stringify(data));
            
            // 데이터 없음 
            if (!data || jQuery.isEmptyObject(data) || !data.EXPENSESUMMONTH) {
                console.error("받아온 해시맵이 비어있어요:", data);
                $('#sumExpenseMonth').html("0");
                
                const noDataHTML = `
                    <img src="https://cdn3.iconfinder.com/data/icons/eco-tech/512/10_Circular_Economy.png" alt="noCashbookData" style="width: 15rem; height: 15rem;" />
                    <div class="mt-3 mb-3">
                        <p>이번 달 가계부 데이터가 존재하지 않습니다.</p>
                        <p>내역을 입력하러 가볼까요?</p>
                        <a href="/secretary/cashbook/trans">
                            <button type="button" class="btn btn-primary">
                                가계부 내역 바로가기
                            </button>
                        </a>
                    
                    </div>    
                    
                    
                
                    `;

                $('#donutDiv').html(noDataHTML);

            } 
            // 데이터 있음 
            else {
                $('#sumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: (e) => {
            console.error("총수입 총지출 전송 실패:", JSON.stringify(e));
        }
        
    });
}