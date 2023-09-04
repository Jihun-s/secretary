$(document).ready(function() {
    $('#setBudgetBtModal').click(setBudgetModal);
    $('#updateBudgetBtModal').click(updateBudgetModal);
    $('#deleteBudgetBtModal').click(deleteBudgetModal);
});

/** 화면 초기화 */
// function init() {
//     let familyId = $('#familyId').val();
//     let cashbookId = $('#cashbookId').val();
//     let budgetId = $('#budgetId').val();

//     $.ajax({
//         url: '/secretary/cashbook/init',
//         type: 'POST',
//         data: { familyId: familyId, cashbookId: cashbookId, budgetId: budgetId },
//         dataType: 'JSON',
//         success: (data) => {
//             alert(budgetExist + remainingAmount + budgetAmount + incomeSumMonth + expenseSumMonth + budgetAvg + budgetAmountX + budgetAmountXx + budgetAmountXxx + curYear + curMonth + )
//         },
//         error: () => {
//             alert('init 실행 실패');
//         }
//     });


// }

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
    }
}


/** 모달 예산 수정 */
function updateBudgetModal() {
    if(validateBudgetUpdate()) {
        updateBudgetAjax();
        $('#ModalUpdateBudget').modal('hide');
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
            // init();
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
            // init();
        },
        error: () => {
            alert('예산 수정 서버 전송 실패');
        }
    });
}


/** 예산 삭제 Ajax */
function deleteBudgetAjax() {
    let budgetId = $('#budgetId').val();
    let cashbookId = $('#cashbookId').val();
    let familyId = $('#familyId').val();

    $.ajax({
        url: '/secretary/cashbook/budget/deleteBudget',
        type: 'POST',
        data: { budgetId: budgetId, cashbookId: cashbookId, familyId: familyId },
        success: () => {
            // init();
        },
        error: () => {
            alert('예산 수정 서버 전송 실패');
        }
    });
}