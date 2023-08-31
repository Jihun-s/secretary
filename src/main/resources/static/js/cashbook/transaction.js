$(document).ready(function() {
    // 목록 불러오기
    init();
    $("#transCategoriesDiv").hide();

    // 내역 검증 후 입력
    $('#setTransBt').click(setTrans);

   // 거래유형 클릭 이벤트 (대분류 출력)
   $("input[name='transType']").change(function() {
    showTransCategoriesDiv();
    loadMainCategories($(this).val());
   });

   // 대분류 선택 이벤트 (소분류 출력 or 기본값)
   $("#cate1Name").change(function() {
        const selectedCate1Name = $(this).val();
        if (selectedCate1Name !== "대분류를 선택하세요") {
            loadSubCategories(selectedCate1Name);
        } else {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2Name").html('<option>소분류를 선택하세요</option>');
        }
   });

    // 소분류 선택 이벤트 (소분류 먼저 선택할 수 없음)
    $("#cate2Name").click(function() {
        if ($("input[name='transType']:checked").length === 0) {
            alert("거래 유형을 먼저 선택하세요.");
            return;
        }
        if ($("#cate1Name").val() === "대분류를 선택하세요") {
            alert("대분류를 먼저 선택하세요.");
        }
    });

    // 대분류 커스텀 카테고리 추가
    $('#cate1Name').change(function() {
        const selectedOptionText = $(this).find("option:selected").text();

        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
            setCustomCategory1();
        }
    });

    // 소분류 커스텀 카테고리 추가
    // $('#cate2Name').change(function() {
    //     const selectedOptionText = $(this).find("option:selected").text();

    //     // 입력한 선택지가 '직접입력'인 경우
    //     if (selectedOptionText === "직접입력") {
    //         setCustomCategory2();
    //     }
    // });
    // body 요소에 이벤트 위임
    $('body').on('change', '#cate2Name', function() {
        const selectedOptionText = $(this).find("option:selected").text();
    
        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
            setCustomCategory2();
        }
    });

    // 1000단위 콤마 찍기
    $('#transAmount').on('input', function() {
        let amount = $(this).val().replace(/,/g, '');  // 현재 입력된 값에서 콤마를 제거합니다.
        
        if (!amount) {  // 입력값이 없는 경우
            return;
        }
        
        let parsedAmount = parseFloat(amount);
        
        if (isNaN(parsedAmount)) {  // 숫자로 변환할 수 없는 경우
            $(this).val('');  // 입력란을 비웁니다.
        } else {
            $(this).val(parsedAmount.toLocaleString('en-US'));  // 값을 천 단위로 콤마로 구분하여 다시 설정합니다.
        }
    });   
    
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
    // ',' 제거
    let transAmount = $('#transAmount').val().replace(/,/g, '');  
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


/** 내역 입력 */
function setTrans() {
    if(validateTrans()) {
        setTransAjax();
        init();
    }
}


/** 내역 입력 Ajax 호출 */
function setTransAjax() {
    let familyId = $('#familyId');
    let cashbookId = $('#cashbookId');
    let transDate = $('#transDate');
    let transType = $("input[name='transType']:checked"); 
    let cate1Name = $('#cate1Name');
    let cate2Name = $('#cate2Name');
    let transPayee = $('#transPayee');
    let transMemo = $('#transMemo');
    let transAmount = $('#transAmount').val().replace(/,/g, '');

    $.ajax({
        url: '/secretary/cashbook/trans/setTrans',
        type: 'POST',
        data: { 
            familyId: familyId.val(),
            cashbookId: cashbookId.val(),
            transDate: transDate.val(), 
            transType: transType.val(), 
            cate1Name: cate1Name.val(),
            cate2Name: cate2Name.val(),
            transPayee: transPayee.val(),
            transMemo: transMemo.val(),
            transAmount: transAmount
        },
        success: function() {
            init();

            // 입력창 비우기 
            transDate.html("");
            $('#transAmount').val("");
            cate1Name.val('대분류를 입력하세요');
            cate2Name.val('소분류를 선택하세요');
            $('#inlineRadio1').prop('checked', false);
            $('#inlineRadio2').prop('checked', false);
            transPayee.val("");
            transMemo.val("");
            $("#transCategoriesDiv").hide();
        },
        error: function() {
            alert('내역 입력 서버 전송 실패');
        }
    });
}


/** 내역 목록 불러오기 */
function init() {
    let transCntMonth = $('#transCntMonth');
    let transListDiv = $('#transListDiv');
    let familyId = $('#familyId');

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
        data: { familyId: familyId.val() },
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
                    // 뱃지 색상 결정
                    let colorClass = getColorClassByCategory(ta.cate1Name);

                    table += `<tr>
                                <td style="width: 5rem;">
                                    <span class="badge bg-label-${colorClass} me-1">${ta.cate2Name || ta.cate1Name || '미분류'}</span>
                                    <input type="hidden" value="${ta.transId}">
                                </td>
                                <td style="width: 5rem;">${ta.transTime}</td>
                                <td><i class="fab fa-react fa-lg text-info me-3"></i> <strong>${ta.transPayee}</strong></td>
                                <td>${ta.transMemo || ''}</td>
                                <td style="width: 5rem;">${parseInt(ta.transAmount).toLocaleString('en-US')}</td>
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

/** 카테고리별 뱃지 색상 결정 */
function getColorClassByCategory(category) {
    switch (category) {
        case '쇼핑': return 'primary';
        case '뷰티': return 'secondary';
        case '건강': return 'info';
        case '여가': return 'warning';
        case '식비': return 'danger';
        case '여행': return 'warning';
        case '용돈': 
        case '판매소득': 
        case '복권': 
        case '금융소득': 
        case '투자소득': 
        case '급여': return 'success';
        default: return 'dark';
    }
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

/** 내역 수정 */
function updateTrans(transId) {
    // 기존 내역 한번 불러오고
    // 그걸 폼에 뿌린 다음
    // ... 자리에 있는 '수정' 버튼을 누르면 전송
    // '취소'누르면 원래대로 돌아감
}


/** 수입/지출에 따른 카테고리 표시 */
function showTransCategoriesDiv() {
    let selectedType = $("input[name='transType']:checked").val();
    ;
    
    $("#transCategoriesDiv").show();

    if (selectedType === "수입") {
        $("#transCategory1Div").show();
        $("#transCategory2Div").hide();
    } else {
        $("#transCategory1Div").show();
        $("#transCategory2Div").show();
        // 지출에 대한 대분류 카테고리를 로드하는 함수 (예: loadExpenditureCategories())를 호출할 수 있습니다.
    }
}


/** 대분류 불러오기 */
function loadMainCategories(transType) {

    $.ajax({
        url: '/secretary/cashbook/trans/loadCate1', // 해당 경로를 실제 경로로 교체해야 합니다.
        type: 'GET',
        data: { transType: transType },
        success: function(cate1List) {
            let options = '<option>대분류를 선택하세요</option>';
            
            cate1List.forEach(cate1 => {
                options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
            });

            options += `<option value="직접입력" onclick="setCustomCategory1()">직접입력</option>`;

            $("#cate1Name").html(options);
        },
        error: function() {
            alert('대분류 목록 전송 실패');
        }
    });
}

/** 소분류 불러오기 */
function loadSubCategories(cate1Name) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate2', // 해당 경로를 실제 경로로 교체해야 합니다.
        type: 'GET',
        data: { cate1Name: cate1Name },
        success: function(cate2List) {
            let options;

            if (cate2List.length > 0) { // 소분류 리스트가 있을 경우
                options = '<option>소분류를 선택하세요</option>';
                cate2List.forEach(cate2 => {
                    options += `<option value="${cate2.cate2Name}">${cate2.cate2Name}</option>`;
                });
                options += `<option value="직접입력" onclick="setCustomCategory2()">직접입력</option>`;
            } else { // 소분류 리스트가 비어있을 경우
                options = '<option>소분류를 선택하세요</option><option value="직접입력" onclick="setCustomCategory2()">직접입력</option>';
            }
            $("#cate2Name").html(options);
        },
        error: function() {
            alert('소분류 목록 전송 실패');
        }
    });
}

/** 커스텀 대분류 카테고리 추가 */
function setCustomCategory1() {
    let familyId = $('#familyId').val();
    let transType = $("input[name='transType']:checked").val();
    let customCate1Name = prompt("새로운 대분류명을 입력하세요:");
    
        // '취소' 버튼 클릭
        if (customCate1Name === null) {
            return;
        }

    // 미입력
    if (customCate1Name === "") {
        alert("카테고리명을 입력하세요.");
        return setCustomCategory1();
    }

    // 한글, 영문, 숫자만 사용
    const regex = /^[가-힣A-Za-z0-9]+$/;

    // 연속 공백 제한
    if (/\s{2,}/.test(customCate1Name)) {
        alert("카테고리 이름에 연속된 공백을 포함할 수 없습니다.");

        return setCustomCategory1();
    }

    // 중복 제한
    const isDuplicate = [...$("#cate1Name option")].some(option => option.textContent === customCate1Name);
    if (isDuplicate) {
        alert("이미 존재하는 카테고리 이름입니다.");
        
        return setCustomCategory1();
    }

    // 길이는 한글 기준 10자 이내(30BYTE)
    if (!regex.test(customCate1Name) || new Blob([customCate1Name]).size > 30) {
        alert("카테고리 이름은 한글, 영문, 숫자만 포함하여 30Byte(한글 10자) 이내로 입력해야 합니다.");
        
        return setCustomCategory1();
    }

    $.ajax({
        url: '/secretary/cashbook/trans/addCate1',
        type: 'POST',
        data: { cate1Name: customCate1Name, transType: transType, familyId:familyId },
        success: () => {
            // '직접입력' 옵션 바로 앞에 새 옵션 삽입
            const newOption = document.createElement("option");
            newOption.value = customCate1Name; // value와 textContent를 입력받은 값으로 통일
            newOption.textContent = customCate1Name;
    
            // '직접입력' 옵션 찾기
            const etcOptions = Array.from(document.querySelectorAll('#cate1Name option')).filter(option => option.textContent.trim() === '직접입력');
            const etcOption = etcOptions.length > 0 ? etcOptions[0] : null;
    
            if (etcOption) {
                // '직접입력' 옵션 바로 앞에 새 옵션 삽입
                etcOption.parentNode.insertBefore(newOption, etcOption);
                newOption.selected = true;  // 새로 추가된 옵션을 선택 상태로 설정
            } else {
                alert("'직접입력' 옵션이 찾아지지 않습니다.");
            }
        },
        error: () => {
            alert('대분류 추가 전송 실패');
        }
    });

}


/** 커스텀 소분류 카테고리 추가 */
function setCustomCategory2() {
    let familyId = $('#familyId').val();
    let cate1Name = $('#cate1Name').val();
    let customCate2Name = prompt("새로운 소분류명을 입력하세요:");
    
        // '취소' 버튼 클릭
        if (customCate2Name === null) {
            return;
        }

    // 미입력
    if (customCate2Name === "") {
        alert("카테고리명을 입력하세요.");
        return setCustomCategory2();
    }

    // 한글, 영문, 숫자만 사용
    const regex = /^[가-힣A-Za-z0-9]+$/;

    // 연속 공백 제한
    if (/\s{2,}/.test(customCate2Name)) {
        alert("카테고리 이름에 연속된 공백을 포함할 수 없습니다.");

        return setCustomCategory2();
    }

    // 중복 제한
    const isDuplicate = [...$("#cate2Name option")].some(option => option.textContent === customCate2Name);
    if (isDuplicate) {
        alert("이미 존재하는 카테고리 이름입니다.");
        
        return setCustomCategory2();
    }

    // 길이는 한글 기준 10자 이내(30BYTE)
    if (!regex.test(customCate2Name) || new Blob([customCate2Name]).size > 30) {
        alert("카테고리 이름은 한글, 영문, 숫자만 포함하여 30Byte(한글 10자) 이내로 입력해야 합니다.");
        
        return setCustomCategory2();
    }

    $.ajax({
        url: '/secretary/cashbook/trans/addCate2',
        type: 'POST',
        data: { cate2Name: customCate2Name, cate1Name: cate1Name, familyId:familyId },
        success: () => {
            // '직접입력' 옵션 바로 앞에 새 옵션 삽입
            const newOption = document.createElement("option");
            newOption.value = customCate2Name; // value와 textContent를 입력받은 값으로 통일
            newOption.textContent = customCate2Name;

            // '직접입력' 옵션 찾기
            const etcOptions = Array.from(document.querySelectorAll('#cate2Name option')).filter(option => option.textContent.trim() === '직접입력');
            const etcOption = etcOptions.length > 0 ? etcOptions[0] : null;

            if (etcOption) {
                // '직접입력' 옵션 바로 앞에 새 옵션 삽입
                etcOption.parentNode.insertBefore(newOption, etcOption);

                newOption.selected = true;  // 새로 추가된 옵션을 선택 상태로 설정
            } else {
                alert("'직접입력' 옵션이 찾아지지 않습니다.");
            }
        },
        error: () => {
            alert('소분류 추가 전송 실패');
        }
    });

}

