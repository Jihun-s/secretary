$(document).ready(function() {
    
});

/** 내역 입력 유효성 검사 */
function validateTransAmount() {
    alert('연결 완')

    let transAmount = $('#transAmount').val();
    let transAmountError = $('#transAmountError');

    // 미입력
    if(transAmount.length < 1 || transAmount === '' || transAmount == null) {
        transAmountError.text('내역을 입력하세요.');
        return false;
    }

    // 숫자가 아님
    if(isNaN(transAmount)) {
        transAmountError.text('숫자를 입력하세요.');
        return false;
    }

    // 정수가 아님
    if(transAmount != parseInt(transAmount)) {
        transAmountError.text('정수를 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(transAmount) < 0 || transAmount.length > 12) {
        transAmountError.text('0부터 12자리수까지 입력하세요.');
        return false;
    }
    transAmountError.text('');
    
    return true;
}