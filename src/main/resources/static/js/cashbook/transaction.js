$(document).ready(function() {
    init();
    $('#setTransBt').click(setTrans);
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
    const input = document.getElementById('transPayee');
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
    
    // 콤마나 기타 문자가 포함되어 있는지 확인
    if(/[^0-9]/.test(transAmount)) {
        transAmountError.text('거래금액에는 숫자만 입력하세요.');
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


function setTrans() {
    if(validateTrans()) {
        setTransAjax();
        init();
    }
}

function setTransAjax() {
    let transDate = $('#transDate');
    let transAmount = $('#transAmount');
    let transCategory1 = $('#transCategory1');
    let transCategory2 = $('#transCategory2');
    let transType = $("input[name='transType']:checked"); 
    let transPayee = $('#transPayee');
    let transMemo = $('#transMemo');

    $.ajax({
        url: '/secretary/cashbook/trans/setTrans',
        type: 'POST',
        data: { 
            transDate: transDate.val(), 
            transAmount: transAmount.val(), 
            transCategory1: transCategory1.val(), 
            transCategory2: transCategory2.val(),
            transType: transType.val(), 
            transPayee: transPayee.val(),
            transMemo: transMemo.val() 
        },
        success: function() {
            // 입력창 비우기 
            transDate.html("");
            transAmount.val("");

            $('#inlineRadio1').prop('checked', false);
            $('#inlineRadio2').prop('checked', false);
            transPayee.val("");
            transMemo.val("");
        },
        error: function() {
            alert('서버 전송 실패');
        }
    });
}

/** 내역 목록 불러오기 */
function init() {
    let transCntMonth = $('#transCntMonth');
    let transListDiv = $('#transListDiv');

    // 내역 수 가져오기 
    $.ajax({
        url: '/secretary/cashbook/trans/cntMonth',
        type: 'GET',
        dataType: 'text',
        success: (cnt) => {
            transCntMonth.html(cnt);
        },
        error: () => {
            alert('내역 개수 전송 실패');
        }
    });

    // 목록 가져오기 
    $.ajax({
        url: '/secretary/cashbook/trans/list',
        type: 'GET',
        dataType: 'JSON',
        success: function(list) {
            let groupedData = {};

            // 일자별로 데이터 그룹화
            $(list).each(function(idx, ta) {
                let date = ta.transDate;  // 거래날짜를 가져옵니다. (예: "2023-08-28")
                if (!groupedData[date]) {
                    groupedData[date] = [];
                }
                groupedData[date].push(ta);
            });

            let table = `<table class="table">`;

            // 일자별로 테이블 생성
            for (let date in groupedData) {
                table += `<thead>
                            <tr>
                                <th colspan="6">${formatDate(date)}</th>
                            </tr>
                            <tr>
                                <th>카테고리</th>
                                <th>시간</th>
                                <th>내용</th>
                                <th>메모</th>
                                <th>거래금액</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">`;

                $(groupedData[date]).each(function(idx, ta) {
                    table += `<tr>
                                <td style="width: 5rem;">
                                    <span class="badge bg-label-success me-1">${ta.transCategory2}</span>
                                    <input type="hidden" value="${ta.transId}">
                                </td>
                                <td style="width: 5rem;">${ta.transTime}</td>
                                <td><i class="fab fa-react fa-lg text-info me-3"></i> <strong>${ta.transPayee}</strong></td>
                                <td>${ta.transMemo}</td>
                                <td style="width: 5rem;">${ta.transAmount}</td>
                                <td>
                                <div class="dropdown">
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button>
                                    <div class="dropdown-menu">
                                    <a class="dropdown-item" href="javascript:updateTrans(${ta.transId});"><i class="bx bx-edit-alt me-2"></i> 수정</a>
                                    <a class="dropdown-item" href="javascript:deleteTrans(${ta.transId});"><i class="bx bx-trash me-2"></i> 삭제</a>
                                    </div>
                                </div>
                                </td>
                            </tr>`;
                });

                table += `</tbody>`;
            }

            table += `</table>`;

            transListDiv.html(table);
        },
        error: function() {
            alert('내역 리스트 전송 실패');
        }
    });
}

/** 날짜 형식 변환 */
function formatDate(inputDate) {
    // YYYY-MM-DD 형식의 문자열을 받아서 "월 일 요일" 형식으로 반환하는 함수입니다.
    let dateObj = new Date(inputDate);
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    let day = dayNames[dateObj.getDay()];
    return `${month}월 ${date}일　　${day}`;
}

/** 내역 삭제 */
function deleteTrans(transId) {

    $.ajax({
        url: '/secretary/cashbook/trans/deleteTrans',
        type: 'POST',
        data: { transId: transId },
        success: () => {
            init();
        },
        error: () => {
            alert('내역 삭제 전송 실패');
        }
    });
}