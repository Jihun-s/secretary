$(document).ready(function() {
    
});

/** 사진 입력 버튼 */
function inputBtImg() {
    alert('사진입력 기다려요');
}

/** 음성 입력 버튼 */
function inputBtVoice() {
    alert('음성입력 기다려요');
}

/** SMS 입력 버튼 */
function inputBtSms() {
    alert('SMS입력 기다려요');
}


/** 날짜입력 기본값 현재시간으로 설정 */
function dateToSysdate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    document.getElementById('transDate').value = dateTimeString;
}


/** 내역 입력 유효성 검사 */
function validateTrans() {
    let isValid = true;
    
    // 하나라도 만족하지 못하면 false
    if(!validateTransType()) isValid = false;
    if(!validateTransPayee()) isValid = false;
    if(!validateTransAmount()) isValid = false;

    return isValid;
}

/** 거래유형 유효성 검사 */
function validateTransType() {
    const radios = document.getElementsByName('transType');
    const transTypeError = document.getElementById('transTypeError');
    
    let isSelected = false;
    for(let i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            isSelected = true;
            break;
        }
    }
    
    // 오류 메세지 출력
    if(!isSelected) {
        transTypeError.textContent = "거래 유형을 선택하세요.";
    } else {
        transTypeError.textContent = "";
    }
    
    return isSelected;
}

/** 거래내용 유효성 검사 */
function validateTransPayee() {
    const input = document.getElementById('basic-default-phone');
    const transPayeeError = document.getElementById('transPayeeError');
    const value = input.value.trim();
    
    const isValid = value.length > 0 && value.length < 15;
    
    // 오류 메세지 출력
    if(!isValid) {
        transPayeeError.textContent = "거래내용을 15자 이내로 입력하세요.";
    } else {
        transPayeeError.textContent = "";
    }
    
    return isValid;
}

/** 거래금액 유효성 검사 */ 
function validateTransAmount() {
    let transAmount = $('#transAmount').val();
    let transAmountError = $('#transAmountError');

    // 미입력
    if(transAmount === '' || transAmount == null) {
        transAmountError.text('거래금액을 입력하세요.');
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
