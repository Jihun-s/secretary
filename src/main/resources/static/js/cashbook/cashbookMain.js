$(document).ready(function() {
    setCurDate();
    getAlerts();
    init();

    $('#ModalSetBudget').on('show.bs.modal', function() {
        initSetBudgetModal();
    });
    $('#ModalUpdateBudget').on('show.bs.modal', function() {
        initUpdateBudgetModal();
    });
    $('#setBudgetBtModal').click(setBudgetModal);
    $('#updateBudgetBtModal').click(updateBudgetModal);
    $('#deleteBudgetBtModal').click(deleteBudgetModal);
    $('necessaryAlertBt').click(getAlerts);
});

/** 화면 초기화 */
function init() {
    let familyId = $('#familyId').val();
    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();
    let curDate = $('#curDate').val();
    let curDateTime = $('#curDateTime').val();


    $.ajax({
        url: '/secretary/cashbook/init',
        type: 'POST',
        data: { familyId: familyId, curDateTime: curDateTime,
            curYear: curYear, curMonth: curMonth, curDate: curDate },
        dataType: 'JSON',
        success: (data) => {
            //  alert('init 결과:' + JSON.stringify(data));
            if(data.budgetExist == 1) {
                $('#remainingAmountSpan').html(data.remainingAmount.toLocaleString('en-US'));
                $('#budgetAmountP').html(data.budgetAmount.toLocaleString('en-US'));
                $('#incomeSumMonthSpan').html(data.incomeSumMonth.toLocaleString('en-US'));
                $('#expenseSumMonthSpan').html(data.expenseSumMonth.toLocaleString('en-US'));
                $('.curYear').html(curYear);
                $('.curMonth').html(curMonth);
            }
        },
        error: () => {
            alert('init 실행 실패');
        }
    });
}


/** 현재 날짜 심기 */
function setCurDate() {
    let date = new Date();
    let curYear = date.getFullYear();
    let curMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    let curDate = date.getDate().toString().padStart(2, '0');
    let curHour = date.getHours().toString().padStart(2, '0');
    let curMin = date.getMinutes().toString().padStart(2, '0');

    let curDateTime = `${curYear}-${curMonth}-${curDate} ${curHour}:${curMin}:00`;

    $('#curDateTime').val(curDateTime);
    $('#curYear').val(curYear);
    $('#curMonth').val(curMonth);
    $('#curDate').val(curDate);
}


/** 예산 설정 유효성 검사 */
function validateBudget() {
    let budgetAmount = $('#setModalInput').val();
    let budgetAmountErrorModal = $('#budgetAmountErrorModal');

    // 미입력
    if(budgetAmount.length < 1 || budgetAmount === '' || budgetAmount == null) {
        budgetAmountErrorModal.text('예산을 입력하세요.');
        return false;
    }

    // 숫자가 아님
    if(isNaN(budgetAmount)) {
        budgetAmountErrorModal.text('숫자를 입력하세요.');
        return false;
    }

    // 정수가 아님
    if(budgetAmount != parseInt(budgetAmount)) {
        budgetAmountErrorModal.text('정수를 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(budgetAmount) < 0 || budgetAmount.length > 12) {
        budgetAmountErrorModal.text('0부터 12자리수까지 입력하세요.');
        return false;
    }
    budgetAmountErrorModal.text('');
    
    return true;
}

/** 예산 수정 유효성 검사 */
function validateBudgetUpdate() {
    let budgetAmount = $('#updateModalInput').val();
    let budgetAmountErrorModal = $('#budgetAmountErrorUpdateModal');

    // 미입력
    if(budgetAmount.length < 1 || budgetAmount === '' || budgetAmount == null) {
        budgetAmountErrorModal.text('예산을 입력하세요.');
        return false;
    }

    // 숫자가 아님
    if(isNaN(budgetAmount)) {
        budgetAmountErrorModal.text('숫자를 입력하세요.');
        return false;
    }

    // 정수가 아님
    if(budgetAmount != parseInt(budgetAmount)) {
        budgetAmountErrorModal.text('정수를 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(budgetAmount) < 0 || budgetAmount.length > 12) {
        budgetAmountErrorModal.text('0부터 12자리수까지 입력하세요.');
        return false;
    }
    budgetAmountErrorModal.text('');
    
    return true;
}


/** 모달 예산 입력 */
function setBudgetModal() {
    if(validateBudget()) {
        setBudgetAjax();
        $('#ModalSetBudget').modal('hide');
        init();
    }
}

/** 예산 입력 모달 init */
function initSetBudgetModal() {
    let familyId = $('#familyId').val();
    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();
    let curDate = $('#curDate').val();
    let curDateTime = $('#curDateTime').val();

    $.ajax({
        url: '/secretary/cashbook/initSetBudgetModal',
        type: 'POST',
        data: { familyId: familyId, curDateTime: curDateTime,
            curYear: curYear, curMonth: curMonth, curDate: curDate },
        dataType: 'JSON',
        success: (data) => {
            // alert("ajax로 가져온 데이터:" + JSON.stringify(data));
            $('.budgetAvg').html(data.budgetAvg.toLocaleString('en-US'));
            $('.budgetAmountX').html(data.budgetAmountX.toLocaleString('en-US'));
            $('.budgetAmountXx').html(data.budgetAmountXx.toLocaleString('en-US'));
            $('.budgetAmountXxx').html(data.budgetAmountXxx.toLocaleString('en-US'));
            $('.curYear').html(curYear);
            $('.curMonth').html(curMonth);
            $('.curMonthX').html(curMonth - 1);
            $('.curMonthXx').html(curMonth - 2);
            $('.curMonthXxx').html(curMonth - 3);

        },
        error: () => {
            alert('예산 설정 모달 init 실패');
        }
    });
}

/** 예산 수정 모달 init */
function initUpdateBudgetModal() {
    let familyId = $('#familyId').val();
    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();
    let curDate = $('#curDate').val();
    let curDateTime = $('#curDateTime').val();

    $.ajax({
        url: '/secretary/cashbook/initSetBudgetModal',
        type: 'POST',
        data: { familyId: familyId, curDateTime: curDateTime,
            curYear: curYear, curMonth: curMonth, curDate: curDate },
        dataType: 'JSON',
        success: (data) => {
            // alert("ajax로 가져온 데이터:" + JSON.stringify(data));
            $('.budgetAvg').html(data.budgetAvg);
            $('.budgetAmountX').html(data.budgetAmountX);
            $('.budgetAmountXx').html(data.budgetAmountXx);
            $('.budgetAmountXxx').html(data.budgetAmountXxx);
            $('.curYear').html(curYear);
            $('.curMonth').html(curMonth);
            $('.curMonthX').html(curMonth - 1);
            $('.curMonthXx').html(curMonth - 2);
            $('.curMonthXxx').html(curMonth - 3);

        },
        error: () => {
            alert('예산 수정 모달 init 실패');
        }
    });
}


/** 모달 예산 수정 */
function updateBudgetModal() {
    if(validateBudgetUpdate()) {
        updateBudgetAjax();
        $('#ModalUpdateBudget').modal('hide');
    }
}

/** 모달 예산 입력 */
function setBudgetModal() {
    if(validateBudget()) {
        setBudgetAjax();
        $('#ModalSetBudget').modal('hide');
        init();
    }
}
/** 모달 예산 삭제 */
function deleteBudgetModal() {
    deleteBudgetAjax();
    $('#ModalDeleteBudget').modal('hide');
}

/** 예산 전송 Ajax */
function setBudgetAjax() {
    let budgetAmount = $('#setModalInput').val();

    $.ajax({
        url: '/secretary/cashbook/budget/setBudget',
        type: 'POST',
        data: { budgetAmount: budgetAmount },
        success: () => {
            location.reload();
        },
        error: () => {
            alert('예산 서버 전송 실패');
        }
    });
}


/** 예산 수정 Ajax */
function updateBudgetAjax() {
    let budgetAmount = $('#updateModalInput').val();

    $.ajax({
        url: '/secretary/cashbook/budget/updateBudget',
        type: 'POST',
        data: { budgetAmount: budgetAmount },
        success: () => {
            location.reload();
        },
        error: () => {
            alert('예산 수정 서버 전송 실패');
        }
    });
}


/** 예산 삭제 Ajax */
function deleteBudgetAjax() {
    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();

    $.ajax({
        url: '/secretary/cashbook/budget/deleteBudget',
        type: 'POST',
        data: { curYear: curYear, curMonth: curMonth },
        success: () => {
            alert("예산을 삭제했습니다.");
            location.reload();
        },
        error: () => {
            alert('예산 삭제 서버 전송 실패');
        }
    });
}


//////////////////////////////////////////////////////////

/** 알림 */
function getAlerts() {

    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();
    let curDate = $('#curDate').val();
    let curDateTime = $('#curDateTime').val();

    $.ajax({
        url: '/secretary/cashbook/alertList',
        type: 'POST',
        data: { curDateTime: curDateTime, curYear: curYear, curMonth: curMonth, curDate: curDate },
        dataType: 'JSON',
        success: function(data) {
            console.log(JSON.stringify(data));

            let html = "";
        
            // 일정을 schStartYmd 기준으로 그룹화
            let groupedByDate = {};
            // 자동이체 
            data.forEach(sch => {
                if (!groupedByDate[sch.schStartYmd]) {
                    groupedByDate[sch.schStartYmd] = [];
                }
                groupedByDate[sch.schStartYmd].push(sch);
            });

            // 그룹화된 데이터를 기반으로 HTML 생성
            for (let date in groupedByDate) {
                html += `<br><small class="text-light fw-semibold">${date}</small>`;
                groupedByDate[date].forEach(sch => {
                    if (sch.schContent.includes("카드") || sch.schContent.includes("구독") || sch.schContent.includes("정기") || sch.schContent.includes("결제") || sch.schContent.includes("납부")) {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                ${sch.schStartMonth}월 ${sch.schStartDate}일은 ${sch.schContent}입니다. 연결 계좌 잔고를 확인하세요.
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                    } else if (sch.schCate == '명절' || sch.schCate == '생일' ||sch.schCate == '경조사') {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                ${sch.schStartMonth}월 ${sch.schStartDate}일은 ${sch.schContent}입니다. 예산을 확인하세요.
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                    }
                });
            }

            $('#AlertListDiv').html(html);
        },
        error: (e) => {
            alert('가계부 알람 목록 전송 실패');
        }
    });
}

////////////////////////////////////////////////////////////////


/** 일정 목록 뱃지 색 지정 */
function getBadgeClass(type, cate) {
    let classes = {
        '일정': 'bg-primary',
        '냉장고': 'bg-warning',
        '생활용품': 'bg-info',
        '옷장': 'bg-label-danger',
        '가계부': 'bg-success'
    };
  
    if (type === '일정' && (cate === '명절' || cate === '공휴일')) {
        return 'bg-danger';
    }
  
    return classes[type] || 'bg-primary';
  }

///////////////////////////////////////////////////////////////////////////

/** 날짜 포맷 변환 */
// YYYY-MM-DD' 'HH24:MI:SS -> YYYY-MM-DD'T'HH24:MI:SS 
function convertDateTimeToLocal(dateTimeStr) {

    return dateTimeStr.replace(" ", "T");
  }
  
  // YYYY-MM-DD -> MM월 DD일
  function convertDateToKor(dateString) {
    let date = new Date(dateString);
  
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  }
  
  // YYYY-MM-DD' 'HH24:MI:SS -> HH24시
  function convertTimeToKor(dateTimeStr) {
    let hour = dateTimeStr.slice(0, 2);
  
    return `${hour}시`;
  }



////////////////////////////////////////////////////////////////////////


/** 일정 삭제 */
function deleteSch() {
    let schId = $('#schId').val();
    console.log("삭제할 일정의 schId는 " + schId);
    
    if(confirm("일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      $.ajax({
        url: '/secretary/schedule/deleteSch',
        type: 'POST',
        data: { schId: schId },
        dataType: 'TEXT',
        success: (data) => {
          if(data == 1) {
            alert('일정을 삭제했습니다.');
          } else {
            alert('일정을 삭제할 수 없습니다.');
          }
    
          location.reload();
        },
        error: (e) => {
          alert('일정 삭제 전송 실패');
          alert(JSON.stringify(e));
        }
      });
    }
  }
  
  /** 일정 삭제 매개변수 있음 */
  function deleteSch(schId) {
    console.log("삭제할 일정의 schId는 " + schId);
    
    if(confirm("일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      $.ajax({
        url: '/secretary/schedule/deleteSch',
        type: 'POST',
        data: { schId: schId },
        dataType: 'TEXT',
        success: (data) => {
          if(data == 1) {
            alert('일정을 삭제했습니다.');
          } else {
            alert('일정을 삭제할 수 없습니다.');
          }
    
          location.reload();
        },
        error: (e) => {
          alert('일정 삭제 전송 실패');
          alert(JSON.stringify(e));
        }
      });
    }
  }