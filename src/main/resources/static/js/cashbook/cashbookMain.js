$(document).ready(function() {
    
});

/** 예산 설정 유효성 검사 */
function validateBudget() {
    let budgetAmount = $('#budgetAmount').val();
    let budgetAmountError = $('#budgetAmountError');

    // 미입력
    if(budgetAmount.length < 1 || budgetAmount === '' || budgetAmount == null) {
        budgetAmountError.text('예산을 입력하세요.');
        return false;
    }

    // 숫자가 아님
    if(isNaN(budgetAmount)) {
        budgetAmountError.text('숫자를 입력하세요.');
        return false;
    }

    // 정수가 아님
    if(budgetAmount != parseInt(budgetAmount)) {
        budgetAmountError.text('정수를 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(budgetAmount) < 0 || budgetAmount.length > 12) {
        budgetAmountError.text('0부터 12자리수까지 입력하세요.');
        return false;
    }
    budgetAmountError.text('');
    
    return true;
}