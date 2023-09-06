$(document).ready(function() {
    setCurDate();
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