$(document).ready(function() {
    // 목록 불러오기
    init();

    // 내역 검증 후 입력
    $('#setTransBt').click(setTrans);

   // 라디오 버튼 클릭 이벤트
   $("#transCategoriesDiv").hide();
//    $("input[name='transType']").change(showTransCategoriesDiv);
//    $("input[name='transType']").change(loadMainCategories);
   $("input[name='transType']").change(function() {
    showTransCategoriesDiv();
    loadMainCategories($(this).val());
   });

   $("#cate1Name").change(function() {
       setCategoryDefault();
        // 선택된 대분류 이름을 가져와서 loadSubCategories 함수를 호출합니다.
        const selectedCate1Name = $(this).val();
        if (selectedCate1Name !== "대분류를 선택하세요") {
            loadSubCategories(selectedCate1Name);
        } else {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2Name").html('<option>소분류를 선택하세요</option>');
        }
   });

    // 소분류 카테고리 클릭 이벤트
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
    $(document).on('change', '#cate1Name', function() {
        if ($(this).val() === "0") {
            setCustomCategory();
        }
    });
    
    // 소분류 커스텀 카테고리 추가
    $(document).on('change', '#cate2Name', function() {
        if ($(this).val() === "0") {
            setCustomCategory();
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
    let transAmount = $('#transAmount');

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
            transAmount: transAmount.val()
        },
        success: function() {
            init();

            // 입력창 비우기 
            transDate.html("");
            transAmount.val("");
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
                    table += `<tr>
                                <td style="width: 5rem;">
                                    <span class="badge bg-label-success me-1">${ta.cate2Name}</span>
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


/** 대분류 기본값 -> 소분류 기본값 */
function setCategoryDefault() {
    const selectedValue = $('#cate1Name').val();
    if (selectedValue && selectedValue === "대분류를 선택하세요") {
        $("#cate2Name").html('<option>소분류를 선택하세요</option>');
    } else {
        loadSubCategories(selectedValue);
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
            let options = '<option>소분류를 선택하세요</option>';
            cate2List.forEach(cate2 => {
                options += `<option value="${cate2.cate2Name}">${cate2.cate2Name}</option>`;
            });
            $("#cate2Name").html(options);
        },
        error: function() {
            alert('소분류 목록 전송 실패');
        }
    });
}

/** 커스텀 카테고리 추가 */
function setCustomCategory() {
    let customCategoryName = prompt("새로운 대분류명을 입력하세요:");

    // 1. 한글, 영문, 숫자만 사용
    const regex = /^[가-힣A-Za-z0-9]+$/;

    // 2. 연속된 공백 제한
    if (/\s{2,}/.test(customCategoryName)) {
        alert("카테고리 이름에 연속된 공백을 포함할 수 없습니다.");

        return;
    }

    // 3. 중복 제한
    const isDuplicate = [...this.options].some(option => option.value === customCategoryName);
    if (isDuplicate) {
        alert("이미 존재하는 카테고리 이름입니다.");

        return;
    }

    // 4. 길이는 한글 기준 10자 이내(30BYTE)로 제한
    if (!regex.test(customCategoryName) || new Blob([customCategoryName]).size > 30) {
        alert("카테고리 이름은 한글, 영문, 숫자만 포함하여 30Byte(한글 10자) 이내로 입력해야 합니다.");
        
        return;
    }

    if (customCategoryName && customCategoryName.trim() !== "") {
        var newOption = document.createElement("option");
        newOption.value = 555;
        newOption.textContent = customCategoryName;

        // "직접입력" 옵션 찾기
        var etcOption = this.querySelector('option[value="0"]');

        // "직접입력" 옵션 바로 앞에 새 옵션 삽입
        this.insertBefore(newOption, etcOption);
        newOption.selected = true;  // 새로 추가된 옵션을 선택 상태로 설정
    }

}

