/** 
 * 거래내역 .js  
 */



$(document).ready(function() {

    /////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
    /////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
    
    
    // 날짜 설정
    setCurDate();
    initializeDateSelector();

    // 오늘 날짜로 초기화
    $('#dateReset').click(function() {
        resetToCurrentDate();
        initializeDateSelector();
        init();
    });
    

    /////화면초기화/////화면초기화/////화면초기화/////화면초기화/////화면초기화/////화면초기화/////화면초기화/////화면초기화/////
    /////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////
    
    // 목록 불러오기
    init();
    $('body').on('click', '#prevYear, #prevMonth, #nextYear, #nextMonth', init);

    $("#transCategoriesDiv").hide();
    $("#transSearchCategory2Div").hide();


    /////PERFECT SCROLLBAR/////PERFECT SCROLLBAR/////PERFECT SCROLLBAR/////PERFECT SCROLLBAR/////PERFECT SCROLLBAR/////PERFECT SCROLLBAR/////
    /////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////스크롤바/////


      // 스크롤바 
      const containers = [
        document.querySelector('#transListDiv'),
        document.querySelector('.card-body')
    ].filter(el => el !== null); 

    const options = {
        wheelSpeed: 1,
        wheelPropagation: true,
    };

    containers.forEach(container => {
        new PerfectScrollbar(container, options);
    });

    
    /////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////
    /////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////입력폼 비동기 이벤트////

    
    // 내역 검증 후 입력
    $('body').on('click', '#setTransBt', setTrans);

    
    // 대분류 커스텀 카테고리 추가
    $('body').on('change', '#cate1Name', function() {
        const selectedOptionText = $(this).find("option:selected").text();

        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
            setCustomCategory1();
        }
    });


    // 소분류 커스텀 카테고리 추가
    $('body').on('change', '#cate2Name', function() {
        const selectedOptionText = $(this).find("option:selected").text();
        
        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
            setCustomCategory2();
        }
    });


    // 거래유형 클릭 이벤트 (대분류 출력)
   $('body').on('change', "#transType input[name='transType']", function() {
    showTransCategoriesDiv();
    loadMainCategories($(this).val());
   });


   // 대분류 선택 이벤트 (소분류 출력 or 기본값)
   $('body').on('change', "#cate1Name", function() {
        const selectedCate1Name = $(this).val();
        if (selectedCate1Name !== "대분류를 선택하세요") {
            loadSubCategories(selectedCate1Name);
        } else {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2Name").html('<option>소분류를 선택하세요</option>');
        }
   });

   
    // 소분류 선택 이벤트 (소분류 먼저 선택할 수 없음)
    $('body').on('click', "#cate2Name", function() {
        if ($("input[name='transType']:checked").length === 0) {
            alert("거래 유형을 먼저 선택하세요.");
            return;
        }
        if ($("#cate1Name").val() === "대분류를 선택하세요") {
            alert("대분류를 먼저 선택하세요.");
        }
    });
    
    
    /////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////
    /////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////수정모달 비동기 이벤트/////


    // 모달 검증 후 내역 수정
    $('body').on('click', '#setTransBtModal', updateTrans); 


   // 모달 대분류 커스텀 카테고리 추가
   $('body').on('change', '#cate1NameModal', function() {
        const selectedOptionText = $(this).find("option:selected").text();

        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
                setCustomCategory1Modal();
            }
    });


    // 모달 소분류 커스텀 카테고리 추가 
    $('body').on('change', '#cate2NameModal', function() {
        const selectedOptionText = $(this).find("option:selected").text();

        // 입력한 선택지가 '직접입력'인 경우
        if (selectedOptionText === "직접입력") {
            setCustomCategory2Modal();
        }
    });

    
   // 모달 거래유형 클릭 이벤트 (대분류 출력)
   $('body').on('change', "#transTypeModal input[name='transType']", function() {
    showTransCategoriesDivModal();
    loadMainCategoriesModal($(this).val());
   });


   // 모달 대분류 선택 이벤트 (소분류 출력 or 기본값)
   $('body').on('change', "#cate1NameModal", function() {
        const selectedCate1NameModal = $(this).val();
        if (selectedCate1NameModal !== "대분류를 선택하세요") {
            loadSubCategoriesModal(selectedCate1NameModal);
        } 
        if (selectedCate1NameModal === "대분류를 선택하세요") {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2NameModal").html('<option>소분류를 선택하세요</option>');
        }
   });


    // 모달 소분류 선택 이벤트 (소분류 먼저 선택할 수 없음)
    $('body').on('click', "#cate2NameModal", function() {
        if ($("input[name='transType']:checked").length === 0) {
            alert("거래 유형을 먼저 선택하세요.");
            return;
        }
        if ($("#cate1NameModal").val() === "대분류를 선택하세요") {
            alert("대분류를 먼저 선택하세요.");
        }
    });


    /////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////
    /////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////필터링검색/////


    // 검색용 전체 대분류 & 에 맞는 소분류 출력
    loadMainCategoriesSearch();
    $('body').on('change', "#transSearchCategory1Div", function() {
        selectConditionTrans();
        const selectedCate1NameSearch = $(this).val();
        if (selectedCate1NameSearch !== "대분류를 선택하세요") {
            loadSubCategoriesSearch(selectedCate1NameSearch);
        } else {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2NameSearch").html('<option>소분류를 선택하세요</option>');
        }
    });

    
    // 조건 & 검색 & 정렬 
    // 카테고리 필터링
    $('body').on('change', '#selectCondition input, #selectCondition select', selectConditionTrans);
    // 수입 체크박스
    $('body').on('click', '#transSearchCheckIncome', selectConditionTrans);
    // 지출 체크박스
    $('body').on('click', '#transSearchCheckExpense', selectConditionTrans);
    // 나의내역만 체크박스
    $('body').on('click', '#transSearchCheckUserId', selectConditionTrans);
    // 검색용 카테고리
    $('body').on('change', '#transSearchCategoriesDiv', selectConditionTrans);
    // 검색어 입력
    $('body').on('click', '#searchSubmitBt', selectConditionTrans);
    // 정렬
    $('body').on('change', '#sortBy', selectConditionTrans);


    /////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////
    /////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////SMS모달 비동기 이벤트/////


    // SMS 추출 거래유형 클릭 이벤트 (대분류 출력)
    $('body').on('change', ".modal-radio-group input[name='transType']", function() {
        showTransCategoriesDivSms();
        loadMainCategoriesSms($(this).val());
    });
    

   // SMS 추출 대분류 선택 이벤트 (소분류 출력 or 기본값)
   $('body').on('change', "#cate1NameSms", function() {
        const selectedCate1Name = $(this).val();
        if (selectedCate1Name !== "대분류를 선택하세요") {
            loadSubCategoriesSms(selectedCate1Name);
        } else {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2NameSms").html('<option>소분류를 선택하세요</option>');
        }
   });

    // SMS 추출 소분류 선택 이벤트 (소분류 먼저 선택할 수 없음)
    $('body').on('click', "#cate2NameSms", function() {
        if ($("input[name='transType']:checked").length === 0) {
            alert("거래 유형을 먼저 선택하세요.");
            return;
        }
        if ($("#cate1NameSms").val() === "대분류를 선택하세요") {
            alert("대분류를 먼저 선택하세요.");
        }
    });


    /////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////
    /////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////간편입력/////


    // 영수증 사진 첨부
    $('#imgSubmitBt').click(submitReceiptImg);


    // SMS 모달 닫히면 입력 값 초기화
    $("#inputBySmsModal").on("hidden.bs.modal", initSmsModal());
  
    // 영수증 모달 닫히면 입력 값 초기화
    $("#inputByImgModal").on("hidden.bs.modal", initImgModal());


    /////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////
    /////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////숫자포맷/////


    // 1000단위 콤마 찍기
    $('body').on('input', '#transAmount', function() {
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
    

    // 모달 1000단위 콤마 찍기
    $('body').on('input', '#transAmountModal', function() {
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



////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 



/** 내역 날짜 선택 기본값을 현재시각으로 설정하는 함수 */
function dateToSysdate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');

    let dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    let searchDate = `${year}-${month}-${day}`;

    $('#transDate').val(dateTimeString);
    $('#searchDate').val(searchDate);
}

/** HTML에 현재 시각 심는 함수 */
function setCurDate() {
    let now = new Date();
    let curYear = now.getFullYear();
    let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
    let curDate = now.getDate().toString().padStart(2, '0');
    let curHour = now.getHours().toString().padStart(2, '0');
    let curMin = now.getMinutes().toString().padStart(2, '0');
    
    let curDateTime = `${curYear}-${curMonth}-${curDate} ${curHour}:${curMin}:00`;
    
    // hidden 필드 
    $('#curDateTime').val(curDateTime);
    $('#curYear').val(curYear);
    $('#curMonth').val(curMonth);
    $('#curDate').val(curDate);

    // 월 페이징 
    $('#nowYear').html(curYear);
    $('#nowMonth').html(curMonth);
}


/** 월 페이징 오늘로 가는 함수 */
function resetToCurrentDate() {
    const currentDate = new Date();
    $('#nowYear').html(currentDate.getFullYear());
    $('#nowMonth').html(currentDate.getMonth() + 1);
}


/** 월 페이징 연&월 범위 안 넘어가게 처리하는 함수 */
function initializeDateSelector() {
    let yearElement = $('#nowYear');
    let monthElement = $('#nowMonth');

    let currentYear = parseInt(yearElement.text());
    let currentMonth = parseInt(monthElement.text());

    $('#prevYear').on('click', function() {
        currentYear--;
        yearElement.text(currentYear);
    });

    $('#nextYear').on('click', function() {
        currentYear++;
        yearElement.text(currentYear);
    });

    $('#prevMonth').on('click', function() {
        currentMonth--;
        if(currentMonth === 0) {
            currentMonth = 12;
            currentYear--;
        }
        yearElement.text(currentYear);
        monthElement.text(currentMonth);
    });

    $('#nextMonth').on('click', function() {
        currentMonth++;
        if(currentMonth === 13) {
            currentMonth = 1;
            currentYear++;
        }
        yearElement.text(currentYear);
        monthElement.text(currentMonth);
    });
}


/** YYYY-MM-DD 형식의 문자열을 받아서 "월 일 요일" 형식으로 반환하는 함수 */
function formatDate(inputDate) {
    let dateObj = new Date(inputDate);
    let month = dateObj.getMonth() + 1;
    let date = dateObj.getDate();
    let dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    let day = dayNames[dateObj.getDay()];
    return `${month}월 ${date}일　　${day}`;
}



/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////



/** 내역 목록 불러오기 */
function init() {
    let transCntMonth = $('#transCntMonth');
    let transListDiv = $('#transListDiv');
    let familyId = $('#familyId');
    let nowYear = $('#nowYear').html();
    let nowMonth = $('#nowMonth').html();

    /* 2열 블록 총지출 총수입 가져오는 Ajax */
    $.ajax({
        url: '/secretary/cashbook/trans/selectSumInEx',
        type: 'GET',
        data: { nowYear: nowYear, nowMonth: nowMonth },
        dataType: 'JSON',
        success: (data) => {
            if (data == null || data == undefined) {
                $('#transListDiv').html("내역이 존재하지 않습니다.");
                $('#transSumIncomeMonth').html("0");
                $('#transSumExpenseMonth').html("0");
            } else {
                $('#transSumIncomeMonth').html(data.INCOMESUMMONTH.toLocaleString('en-US'));
                $('#transSumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: () => {
            $('#transListDiv').html("내역이 존재하지 않습니다.");
            $('#transSumIncomeMonth').html("0");
            $('#transSumExpenseMonth').html("0");
        }
    });

    /* 거래내역 목록 가져오는 Ajax */ 
    $.ajax({
        url: '/secretary/cashbook/trans/list',
        type: 'GET',
        data: { familyId: familyId.val(), nowYear: nowYear, nowMonth: nowMonth },
        dataType: 'JSON',
        success: function(list) {
            let groupedData = {};

            // 일자별로 데이터 그룹화
            $(list).each(function(idx, ta) {
                let date = ta.transDate;
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
                                <th>작성자</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">`;

                $(groupedData[date]).each(function(idx, ta) {
                    // 수입 대분류 없으면 초록색
                    if (ta.transType === '수입') {
                        ta.labelColor = 'success';
                    } 
                    // 지출 대분류 없으면 회색
                    else if (ta.transType === '지출' && ta.labelColor == null) {
                        ta.labelColor = 'dark';
                    }

                    table += `<tr>
                                <td style="width: 5rem;">
                                    <span class="badge bg-label-${ta.labelColor} me-1">${ta.cate2Name || ta.cate1Name || '미분류'}</span>
                                    <input type="hidden" value="${ta.transId}">
                                </td>
                                <td style="width: 5rem;">${ta.transTime}</td>
                                <td><i class="fab fa-react fa-lg text-info me-3"></i> <strong>${ta.transPayee}</strong></td>
                                <td>${ta.transMemo || ''}</td>
                                <td style="width: 5rem;">${parseInt(ta.transAmount).toLocaleString('en-US')}</td>
                                <td>${ta.userNickname || ta.userId}</td>
                                <td>
                                <div class="dropdown">
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button>
                                    <div class="dropdown-menu">
                                    <a class="dropdown-item" href="javascript:openModalUpdate(${ta.transId});"><i class="bx bx-edit-alt me-2"></i> 수정</a>
                                    <a class="dropdown-item" href="javascript:deleteTrans(${ta.transId});"><i class="bx bx-trash me-2"></i> 삭제</a>
                                    </div>
                                </div>
                                </td>
                            </tr>`;
                });

                table += `</tbody>`;
            }

            table += `</table>`;

            transCntMonth.html(list.length);
            transListDiv.html(table);
        },
        error: function() {
            console.log('내역 리스트 전송 실패');
        }
    });
    
}



/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////
/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////초기화/////
/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////INIT/////



/** 내역 입력 유효성 전부 검사하는 함수 */
function validateTrans() {
    let isValid = true;
    
    // 하나라도 만족하지 못하면 false
    if(!validateTransType()) isValid = false;
    if(!validateTransPayee()) isValid = false;
    if(!validateTransAmount()) isValid = false;

    return isValid;
}


/** 내역 입력 유효성 검사 
 * 1) 거래유형 */
function validateTransType() {
    let radios = document.getElementsByName('transType');
    let transTypeError = document.getElementById('transTypeError');
    
    // 라디오버튼 선택되면 true로 변경
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


/** 내역 입력 유효성 검사 
 * 2) 거래내용 */
function validateTransPayee() {
    let input = document.getElementById('transPayee');
    let transPayeeError = document.getElementById('transPayeeError');
    let value = input.value.trim();
    
    // 0 < 길이 < 15 이면 true 
    let isValid = value.length > 0 && value.length < 15;
    
    // 오류 메세지 출력
    if(!isValid) {
        transPayeeError.textContent = "거래내용을 15자 이내로 입력하세요.";
    } else {
        transPayeeError.textContent = "";
    }
    
    return isValid;
}


/** 내역 입력 유효성 검사 
 * 3) 거래금액 */
function validateTransAmount() {
    let transAmount = $('#transAmount').val().replace(/,/g, '');  // ',' 제거
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
    
    // ',' 또는 다른 문자 섞여 있음 
    if(/[^0-9]/.test(transAmount)) {
        transAmountError.text('거래금액에는 숫자만 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(transAmount) < 0 || transAmount.length > 12) {
        transAmountError.text('0부터 12자리수까지 입력하세요.');
        return false;
    }

    // 모두 통과했으면 에러메세지 초기화
    transAmountError.text('');
    
    return true;
}



////////////////////////////////////////////수정/////////////////////////////////수정//////////////////////////////////////////////////////



/** 내역 수정 유효성 검사 
 * 1) 거래내용 */
function validateTransPayeeModal() {
    const input = document.getElementById('transPayeeModal');
    const transPayeeErrorModal = document.getElementById('transPayeeErrorModal');
    const value = input.value.trim();
    
    const isValid = value.length > 0 && value.length < 15;
    
    // 오류 메세지 출력
    if(!isValid) {
        transPayeeErrorModal.textContent = "거래내용을 15자 이내로 입력하세요.";
    } else {
        transPayeeErrorModal.textContent = "";
    }
    
    return isValid;
}


/** 내역 수정 유효성 검사 
 * 2) 거래금액 */
function validateTransAmountModal() {
    let transAmountModal = $('#transAmountModal').val().replace(/,/g, '');  // ',' 제거
    let transAmountErrorModal = $('#transAmountErrorModal');

    // 미입력
    if(transAmountModal === '' || transAmountModal == null) {
        transAmountErrorModal.text('거래금액을 입력하세요.');
        return false;
    }

    // 숫자가 아님
    if(isNaN(transAmountModal)) {
        transAmountErrorModal.text('숫자를 입력하세요.');
        return false;
    }

    // 정수가 아님
    if(transAmountModal != parseInt(transAmountModal)) {
        transAmountErrorModal.text('정수를 입력하세요.');
        return false;
    }
    
    // ',' 또는 다른 문자 섞여 있음 
    if(/[^0-9]/.test(transAmountModal)) {
        transAmountErrorModal.text('거래금액에는 숫자만 입력하세요.');
        return false;
    }

    // 범위 오류 (음수 or 12자리 이상)
    if(parseInt(transAmountModal) < 0 || transAmountModal.length > 12) {
        transAmountErrorModal.text('0부터 12자리수까지 입력하세요.');
        return false;
    }

    // 모두 통과했으면 에러 메세지 초기화
    transAmountErrorModal.text('');
    
    return true;
}



////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////
////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////
////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////유효성검사/////



/** 유효성 검사 후 내역 입력값을 서버로 전송하는 함수 */
function setTrans() {
    if(validateTrans()) {
        setTransAjax();
    }
}


/** 입력할 내역 Ajax로 전송하는 함수 */
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
            cate1Name.val('대분류를 선택하세요');
            cate2Name.val('소분류를 선택하세요');
            $('#inlineRadio1').prop('checked', false);
            $('#inlineRadio2').prop('checked', false);
            transPayee.val("");
            transMemo.val("");
            $("#transCategoriesDiv").hide();
        },
        error: function() {
            console.log('내역 입력 서버 전송 실패');
        }
    });
}



/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////
/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////
/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////내역입력/////



/** 유효성 검사 후 수정할 내역을 서버로 전송하는 함수 */
function updateTrans() {
    if(validateTransModal()) {
        updateTransAjax();
        $("#ModalUpdate").modal('hide');
    }
}


/** 내역 수정 모달 여는 함수 */
function openModalUpdate(transId) {
    // 모달을 표시
    $('#ModalUpdate').modal('show');

    // 기존 내역 한번 불러오고
    $.ajax({
        url: '/secretary/cashbook/trans/selectTrans',
        type: 'POST',
        data: { transId: transId },
        dataType: 'JSON',
        success: (data) => {
             // 값 뿌리기
             $('#transIdModal').val(data.transId);
             $('#familyIdModal').val(data.familyId);
             $('#cashbookIdModal').val(data.cashbookId);
             $('#labelColorModal').val(data.labelColor);
             
             // 거래일자
             $('#transDateModal').val(data.transDate);
             
             // 내역 유형
             // 대분류 소분류 불러와주고
             if(data.transType === '수입') {
                 $('#inlineRadio1Modal').prop('checked', true);
                 loadMainCategoriesModal(data.transType);
            } else {
                $('#inlineRadio2Modal').prop('checked', true);
                loadMainCategoriesModal(data.transType, data.cate1Name);
                loadSubCategoriesModal(data.cate1Name, data.cate2Name);
            }
             
             // 카테고리
             $('#cate1NameModal').val(data.cate1Name);
             $('#cate2NameModal').val(data.cate2Name);
             
             // 거래내용
             $('#transPayeeModal').val(data.transPayee);
 
             // 메모
             $('#transMemoModal').val(data.transMemo);
 
             // 거래금액
             $('#transAmountModal').val(data.transAmount.toLocaleString('en-US'));
 
             // 모달을 표시
             $('#basicModal').modal('show');
        },
        error: () => {
            console.log('수정하기 위한 정보 전송 실패');
        }
    });

}



/** 내역 수정 모달 유효성 전부 검사하는 함수 */
function validateTransModal() {
    let isValid = true;
    
    // 하나라도 만족하지 못하면 false
    if(!validateTransPayeeModal()) isValid = false;
    if(!validateTransAmountModal()) isValid = false;

    return isValid;
}



/** 수정할 내역 전송하는 Ajax 호출 */
function updateTransAjax() {
    let transId = $('#transIdModal');
    let cashbookId = $('#cashbookIdModal');
    let transDate = $('#transDateModal').val().replace("T", " ");
    let transType = $("#transTypeModal input[name='transType']:checked"); 
    let cate1Name = $('#cate1NameModal');
    let cate2Name = $('#cate2NameModal');
    let transPayee = $('#transPayeeModal');
    let transMemo = $('#transMemoModal');
    let transAmount = $('#transAmountModal').val().replace(/,/g, '');
    let labelColor = $('#labelColorModal');

    // alert("수정할 값들:" + transId.val() + cashbookId.val() + transDate
    // + transType.val() + cate1Name.val() + cate2Name.val() + transPayee.val()
    //  + transMemo.val()  + transAmount + labelColor.val());

    $.ajax({
        url: '/secretary/cashbook/trans/updateTrans',
        type: 'POST',
        data: { 
            transId: transId.val(),
            cashbookId: cashbookId.val(),
            transDate: transDate, 
            transType: transType.val(), 
            cate1Name: cate1Name.val(),
            cate2Name: cate2Name.val(),
            transPayee: transPayee.val(),
            transMemo: transMemo.val(),
            transAmount: transAmount,
            labelColor: labelColor.val()
        },
        dataType: 'text',
        success: function(result) {
            if(result == 0) {
                alert('다른 가족이 작성한 내역은 수정할 수 없습니다.');
                return;
            }
            init();
        },
        error: function() {
            console.log('내역 수정 서버 전송 실패');
        }
    });
}



/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////
/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////
/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////내역수정/////



/** 거래내역 삭제하는 함수 */
function deleteTrans(transId) {
    // alert(transId);
    $.ajax({
        url: '/secretary/cashbook/trans/deleteTrans',
        type: 'POST',
        data: { transId: transId },
        dataType: 'text',
        success: (result) => {
            if(result == 0) {
                alert('다른 가족이 작성한 내역은 삭제할 수 없습니다.');
                return;
            }
            init();
        },
        error: () => {
            console.log('내역 삭제 전송 실패');
        }
    });
}



/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////
/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////
/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////내역삭제/////



/** 수입/지출 라디오 버튼에 따라 카테고리 div 표시하는 함수 */
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
    }
}


/** 거래유형에 따라 대분류 카테고리 불러오는 함수 */
function loadMainCategories(transType) {

    $.ajax({
        url: '/secretary/cashbook/trans/loadCate1', 
        type: 'GET',
        data: { transType: transType },
        success: function(cate1List) {
            let options = '';
            
            cate1List.forEach(cate1 => {
                options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
            });

            options += `<option value="직접입력" onclick="setCustomCategory1()">직접입력</option>`;

            $("#cate1Name").html(options);
        },
        error: function() {
            console.log('대분류 목록 전송 실패');
        }
    });
}


/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////소분류/////


/** 소분류 불러오기 */
function loadSubCategories(cate1Name) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate2',
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
            console.log('소분류 목록 전송 실패');
        }
    });
}



/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////
/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////
/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////입력폼카테고리/////



/** 모달 수입/지출에 따른 카테고리 표시 */
function showTransCategoriesDivModal() {
    let selectedType = $("#transTypeModal input[name='transType']:checked").val();
    
    $("#transCategoriesDivModal").show();
    
    if (selectedType === "수입") {
        $("#transCategory1DivModal").show();
        $("#transCategory2DivModal").hide();
    } else {
        $("#cate2NameModal").html('<option>소분류를 선택하세요</option>');
        $("#transCategory1DivModal").show();
        $("#transCategory2DivModal").show();
    }
}


/** 수정 모달 대분류 불러오기 */
function loadMainCategoriesModal(transType, cate1Name) {

    $.ajax({
        url: '/secretary/cashbook/trans/loadCate1',
        type: 'GET',
        data: { transType: transType },
        success: function(cate1List) {
            let options = '';
            
            cate1List.forEach(cate1 => {
                // cate1Name과 cate1.cate1Name이 일치하는 경우에만 selected 속성 추가
                if (cate1Name === cate1.cate1Name) {
                    options += `<option value="${cate1.cate1Name}" selected>${cate1.cate1Name}</option>`;
                } else {
                    options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
                }
            });

            options += `<option value="직접입력" onclick="setCustomCategory1()">직접입력</option>`;

            $("#cate1NameModal").html(options);
        },
        error: function() {
            console.log('대분류 목록 전송 실패');
        }
    });
}


/** 수정 모달 소분류 불러오기 */
function loadSubCategoriesModal(cate1Name, cate2Name) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate2',
        type: 'GET',
        data: { cate1Name: cate1Name },
        success: function(cate2List) {
            let options;

            if (cate2List.length > 0) { // 소분류 리스트가 있을 경우
                options = '<option>소분류를 선택하세요</option>';
                cate2List.forEach(cate2 => {
                    // cate1Name과 cate1.cate1Name이 일치하는 경우에만 selected 속성 추가
                    if (cate2Name === cate2.cate2Name) {
                        options += `<option value="${cate2.cate2Name}" selected>${cate2.cate2Name}</option>`;
                    } else {
                        options += `<option value="${cate2.cate2Name}">${cate2.cate2Name}</option>`;
                    }
                });
                options += `<option value="직접입력" onclick="setCustomCategory2()">직접입력</option>`;
            } else { // 소분류 리스트가 비어있을 경우
                options = '<option>소분류를 선택하세요</option><option value="직접입력" onclick="setCustomCategory2()">직접입력</option>';
            }
            $("#cate2NameModal").html(options);
        },
        error: function() {
            console.log('소분류 목록 전송 실패');
        }
    });
}



/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////
/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////
/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////모달카테고리/////



/** SMS 수입/지출에 따른 카테고리 표시 */
function showTransCategoriesDivSms() {
    let selectedType = $("input[name='transType']:checked").val();
    ;
    
    $("#transCategoriesDivSms").show();

    if (selectedType === "수입") {
        $("#transCategory1DivSms").show();
        $("#transCategory2DivSms").hide();
    } else {
        $("#transCategory1DivSms").show();
        $("#transCategory2DivSms").show();
    }
}



/** SMS 대분류 불러오기 */
function loadMainCategoriesSms(transType) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate1', 
        type: 'GET',
        data: { transType: transType },
        success: function(cate1List) {
            let options = '';
            
            cate1List.forEach(cate1 => {
                options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
            });

            options += `<option value="직접입력" onclick="setCustomCategory1()">직접입력</option>`;

            $("#cate1NameSms").html(options);
        },
        error: function() {
            console.log('SMS 대분류 목록 전송 실패');
        }
    });
}


/** SMS 소분류 불러오기 */
function loadSubCategoriesSms(cate1Name) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate2',
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

            $("#cate2NameSms").html(options);
        },
        error: function() {
            console.log('SMS 소분류 목록 전송 실패');
        }
    });
}



/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////
/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////
/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////SMS문자카테고리/////



/** 내역목록 필터링하는 대분류 카테고리 가져오기 */
function loadMainCategoriesSearch() {

    $.ajax({
        url: '/secretary/cashbook/trans/loadCate1Search', 
        type: 'GET',
        success: function(cate1List) {
            let options = '';
            
            cate1List.forEach(cate1 => {
                // '대분류를 추가하세요'인데 리스트에 없을 경우에만 추가 
                if (cate1.cate1Name === "대분류를 선택하세요" && !options.includes("대분류를 선택하세요")) {
                    options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
                }
                // '대분류를 추가하세요'가 애초에 아닌 경우 
                else if (cate1.cate1Name !== "대분류를 선택하세요") {
                    options += `<option value="${cate1.cate1Name}">${cate1.cate1Name}</option>`;
                }

            });

            $("#cate1NameSearch").html(options);
        },
        error: function() {
            console.log('검색 대분류 목록 전송 실패');
        }
    });
}


/** 내역목록 필터링하는 소분류 불러오기 */
function loadSubCategoriesSearch(cate1Name) {
    $.ajax({
        url: '/secretary/cashbook/trans/loadCate2',
        type: 'GET',
        data: { cate1Name: cate1Name },
        success: function(cate2List) {
            let options;

            if (cate2List.length > 0) { // 소분류 리스트가 있을 경우
                options = '<option>소분류를 선택하세요</option>';
                cate2List.forEach(cate2 => {
                    options += `<option value="${cate2.cate2Name}">${cate2.cate2Name}</option>`;
                });
            } else { // 소분류 리스트가 비어있을 경우
                options = '<option>소분류를 선택하세요</option><option value="직접입력" onclick="setCustomCategory2()">직접입력</option>';
            }

            $("#cate2NameSearch").html(options);
        },
        error: function() {
            console.log('소분류 목록 전송 실패');
        }
    });
}



/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////
/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////
/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////검색카테고리/////



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
                alert("기존 입력 '직접입력' 옵션이 찾아지지 않습니다.");
            }
        },
        error: () => {
            console.log('대분류 추가 전송 실패');
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
                alert("기존 입력 '직접입력' 옵션이 찾아지지 않습니다.");
            }
        },
        error: () => {
            console.log('소분류 추가 전송 실패');
        }
    });

}


/////수정모달커스텀카테고리/////수정모달커스텀카테고리/////수정모달커스텀카테고리/////수정모달커스텀카테고리/////수정모달커스텀카테고리/////수정모달커스텀카테고리/////


/** 모달 커스텀 대분류 카테고리 추가 */
function setCustomCategory1Modal() {
    // alert("모달용 대분류 커스텀");
    let familyId = $('#familyId').val();
    let transType = $("#transTypeModal input[name='transType']:checked").val();
    let customCate1Name = prompt("새로운 대분류명을 입력하세요:");
    
        // '취소' 버튼 클릭
        if (customCate1Name === null) {
            return;
        }

    // 미입력
    if (customCate1Name === "") {
        alert("카테고리명을 입력하세요.");
        return setCustomCategory1Modal();
    }

    // 한글, 영문, 숫자만 사용
    const regex = /^[가-힣A-Za-z0-9]+$/;

    // 연속 공백 제한
    if (/\s{2,}/.test(customCate1Name)) {
        alert("카테고리 이름에 연속된 공백을 포함할 수 없습니다.");

        return setCustomCategory1Modal();
    }

    // 중복 제한
    const isDuplicate = [...$("#cate1NameModal option")].some(option => option.textContent === customCate1Name);
    if (isDuplicate) {
        alert("이미 존재하는 카테고리 이름입니다.");
        
        return setCustomCategory1Modal();
    }

    // 길이는 한글 기준 10자 이내(30BYTE)
    if (!regex.test(customCate1Name) || new Blob([customCate1Name]).size > 30) {
        alert("카테고리 이름은 한글, 영문, 숫자만 포함하여 30Byte(한글 10자) 이내로 입력해야 합니다.");
        
        return setCustomCategory1Modal();
    }

    $.ajax({
        url: '/secretary/cashbook/trans/addCate1',
        type: 'POST',
        data: { cate1Name: customCate1Name, transType: transType, familyId:familyId },
        success: () => {
            // '직접입력' 옵션 바로 앞에 새 옵션 삽입
            const newOption = document.createElement("option");
            newOption.value = customCate1Name; 
            newOption.textContent = customCate1Name;
    
            // '직접입력' 옵션 찾기
            const etcOptions = Array.from(document.querySelectorAll('#cate1NameModal option')).filter(option => option.textContent.trim() === '직접입력');
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
            console.log('대분류 추가 전송 실패');
        }
    });

}


/** 모달 커스텀 소분류 카테고리 추가 */
function setCustomCategory2Modal() {
    // alert("모달용 커스텀 소분류");
    let familyId = $('#familyId').val();
    let cate1Name = $('#cate1NameModal').val();
    let customCate2Name = prompt("새로운 소분류명을 입력하세요:");
    
        // '취소' 버튼 클릭
        if (customCate2Name === null) {
            return;
        }

    // 미입력
    if (customCate2Name === "") {
        alert("카테고리명을 입력하세요.");
        return setCustomCategory2Modal();
    }

    // 한글, 영문, 숫자만 사용
    const regex = /^[가-힣A-Za-z0-9]+$/;

    // 연속 공백 제한
    if (/\s{2,}/.test(customCate2Name)) {
        alert("카테고리 이름에 연속된 공백을 포함할 수 없습니다.");

        return setCustomCategory2Modal();
    }

    // 중복 제한
    const isDuplicate = [...$("#cate2NameModal option")].some(option => option.textContent === customCate2Name);
    if (isDuplicate) {
        alert("이미 존재하는 카테고리 이름입니다.");
        
        return setCustomCategory2Modal();
    }

    // 길이는 한글 기준 10자 이내(30BYTE)
    if (!regex.test(customCate2Name) || new Blob([customCate2Name]).size > 30) {
        alert("카테고리 이름은 한글, 영문, 숫자만 포함하여 30Byte(한글 10자) 이내로 입력해야 합니다.");
        
        return setCustomCategory2Modal();
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
            const etcOptions = Array.from(document.querySelectorAll('#cate2NameModal option')).filter(option => option.textContent.trim() === '직접입력');
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
            console.log('소분류 추가 전송 실패');
        }
    });

}



/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////
/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////
/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////커스텀카테고리추가/////



/** 내역목록 조건별로 필터링하는 함수 */
function selectConditionTrans() {
    let transListDiv = $('#transListDiv');
    let transCntMonth = $('#transCntMonth');
    transListDiv.html("");

    let incomeSelected = false;
    let expenseSelected = false;
    let myTransOnly = false;
    let cate1Name = $('#cate1NameSearch').val();
    let cate2Name = $('#cate2NameSearch').val(); // 아직 구현 안함 ㅎ
    let searchBy = $('#searchBy').val();
    let searchWord = $('#searchWord').val();
    let sortBy = $('#sortBy').val();
    let nowYear = $('#nowYear').html();
    let nowMonth = $('#nowMonth').html();

    ///////// 수입 or 지출 or all 체크박스 ///////// 수입 or 지출 or all 체크박스 ///////// 

    if($("#transSearchCheckIncome").is(':checked')) {
        incomeSelected = true;
    }
    
    if($("#transSearchCheckExpense").is(':checked')) {
        expenseSelected = true;
    }
    
    if($("#transSearchCheckUserId").is(':checked')) {
        myTransOnly = true;
    }
    // alert("incomeSelected" + incomeSelected + "expenseSelected" + expenseSelected);
    

    /* 조건 맞춰서 서버에서 내역 새로 가져오기 */
    $.ajax({
        url: '/secretary/cashbook/trans/selectConditionTrans',
        type: 'GET',
        cache: false, // 캐싱 방지 걍 넣어봄 
        data: { incomeSelected: incomeSelected
            , expenseSelected: expenseSelected
            , myTransOnly: myTransOnly
            , cate1Name: cate1Name
            , cate2Name: cate2Name
            , searchBy: searchBy
            , searchWord: searchWord
            , sortBy: sortBy
            , nowYear: nowYear
            , nowMonth: nowMonth },
        dataType: 'JSON',
        success: (list) => {
            let sumIncome = 0;
            let sumExpense = 0;
            
            // 넘어올 값: 내역리스트
            if(list.length == 0 || list == null) {
                transListDiv.html("내역이 존재하지 않습니다.");

                $("#transSumIncomeMonth").text(sumIncome.toLocaleString('en-US'));
                $("#transSumExpenseMonth").text(sumExpense.toLocaleString('en-US'));  
            } else {
                let groupedData = {};

            // 일자별로 데이터 그룹화
            $(list).each(function(idx, ta) {
                let date = ta.transDate;
                if (!groupedData[date]) {
                    groupedData[date] = [];
                }

                // 수입 총합 지출 총합 계산
                if (ta.transType === '수입') {
                    sumIncome += parseInt(ta.transAmount);
                } else if (ta.transType === '지출') {
                    sumExpense += parseInt(ta.transAmount);
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
                                <th>작성자</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="table-border-bottom-0">`;

                $(groupedData[date]).each(function(idx, ta) {
                    // 수입 대분류 없으면 초록색
                    if (ta.transType === '수입') {
                        ta.labelColor = 'success';
                    } 
                    // 지출 대분류 없으면 회색
                    else if (ta.transType === '지출' && ta.labelColor == null) {
                        ta.labelColor = 'dark';
                    }

                    table += `<tr>
                                <td style="width: 5rem;">
                                    <span class="badge bg-label-${ta.labelColor} me-1">${ta.cate2Name || ta.cate1Name || '미분류'}</span>
                                    <input type="hidden" value="${ta.transId}">
                                </td>
                                <td style="width: 5rem;">${ta.transTime}</td>
                                <td><i class="fab fa-react fa-lg text-info me-3"></i> <strong>${ta.transPayee}</strong></td>
                                <td>${ta.transMemo || ''}</td>
                                <td style="width: 5rem;">${parseInt(ta.transAmount).toLocaleString('en-US')}</td>
                                <td>${ta.userNickname || ta.userId}</td>
                                <td>
                                <div class="dropdown">
                                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button>
                                    <div class="dropdown-menu">
                                    <a class="dropdown-item" href="javascript:openModalUpdate(${ta.transId});"><i class="bx bx-edit-alt me-2"></i> 수정</a>
                                    <a class="dropdown-item" href="javascript:deleteTrans(${ta.transId});"><i class="bx bx-trash me-2"></i> 삭제</a>
                                    </div>
                                </div>
                                </td>
                            </tr>`;
                });

                table += `</tbody>`;
            }

            table += `</table>`;


            transCntMonth.html(list.length);
            transListDiv.html(table);

            $("#transSumIncomeMonth").text(sumIncome.toLocaleString('en-US'));
            $("#transSumExpenseMonth").text(sumExpense.toLocaleString('en-US'));  

            }

        },
        error: () => {
            console.log("조건&검색 전송 실패");
        }
    });
}


/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////
/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////
/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////내역목록필터링/////



/** SMS 문자메세지에서 거래일자, 거래내용, 거래금액 추출하는 함수 */
function parseBySms() {
    let smsMessage = $("#smsMessage").val();

    let dateRegex = /(\d{2}\/\d{2})/;
    let timeRegex = /(\d{2}:\d{2})/;
    let amountRegex = /(\d+,\d+)/;
    let payeeRegex = /원\s(.*?)\s잔액/;

    let smsDate = smsMessage.match(dateRegex)[1];
    let smsTime = smsMessage.match(timeRegex)[1];
    let transAmount = smsMessage.match(amountRegex)[1];
    let transPayee = smsMessage.match(payeeRegex)[1];

    console.log("거래일자: " + smsDate);
    console.log("거래시간: " + smsTime);
    console.log("거래금액: " + transAmount);
    console.log("거래처: " + transPayee);

    // 거래일자 포맷 맞추기 
    let transDate = convertSmsDateFormat(smsDate, smsTime);
    console.log("찐 거래일시: " + transDate);

    let form = `
        <div class="mb-3">
        <label class="form-label" for="transDate">거래일자</label>
        <input class="form-control" type="datetime-local" name="transDate" value="${transDate}" id="transDateSms">
        </div>
        <div class="mb-3">
            <label class="form-label" for="transPayee">거래내용</label>
            <input type="text" name="transPayee" id="transPayeeSms" value="${transPayee}" class="form-control phone-mask" placeholder="거래처를 입력하세요">
            <div>
                <p id="transPayeeErrorSms"></p>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label" for="transAmount">거래금액</label>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon11">₩</span>
                <input type="text" name="transAmount" id="transAmountSms" value="${transAmount}" class="form-control" placeholder="금액을 입력하세요" aria-label="Username" aria-describedby="basic-addon11">
            </div>
            <div>
                <p id="transAmountErrorSms"></p>
            </div>
        </div>
    
    `;

    let footer = `
    <button type="button" class="btn btn-success" id="fromSmsToForm" onclick="fromSmsToForm();">입력하기</button>
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">닫기</button>
    </form>
    `;

    $('#smsModalFooter').html(footer);
    $('#parseBySmsResultDiv').html(form);
}

/** SMS 거래일자 포맷을 MM/DD HH:MI -> YYYY/MM/DDTHH24:MI 로 맞춰주는 함수 */
function convertSmsDateFormat(date, time) {
    let currentYear = 2023;
    
    // "MM/DD" -> "YYYY-MM-DD" 
    let formattedDate = `${currentYear}-${date.split('/').join('-')}`;
    
    // "HH:MI" -> "T11:30:00"
    let formattedTime = `T${time}:00`;
    
    // 합치기
    let resultFormat = `${formattedDate}${formattedTime}`;
    
    return resultFormat;
  }


  /** 직접입력 폼에 SMS에서 추출한 내용을 집어넣는 함수 */
  function fromSmsToForm() {
    // SMS 모달 값 추출
    let transDateSms = $('#transDateSms').val();
    let transPayeeSms = $('#transPayeeSms').val();
    let transAmountSms = $('#transAmountSms').val();

    console.log(transDateSms, transPayeeSms, transAmountSms);

    // 본문에 값 설정
    $('#transDate').val(transDateSms);
    $('#transPayee').val(transPayeeSms);
    $('#transAmount').val(transAmountSms);

    // 모달 닫기
    $('#inputBySmsModal').modal('hide');
}


/** SMS 모달 닫히면 필드 초기화하는 함수 */
function initSmsModal() {
    // 입력 필드 초기화 
    $("#smsMessage").val("");
    $("#transDateSms").val("");
    $("#radioSms1").prop("checked", false);
    $("#radioSms2").prop("checked", false);
    $("#cate1NameSms").val("");
    $("#cate2NameSms").val("");
    $("#transPayeeSms").val("");
    $("#transMemoSms").val("");
    $("#transAmountSms").val("");
    
    // 오류 메세지 초기화
    $("#transTypeErrorSms").text("");
    $("#transCategoryErrorSms").text("");
    $("#transPayeeErrorSms").text("");
    $("#transMemoErrorSms").text("");
    $("#transAmountError").text("");
    
    // smsMessage 값 초기화
    $("#smsMessage").val("");
    
    // 인식 field 숨기기
    $('#parseBySmsResultDiv').html("");

    // footer 버튼 바꾸기 
    let footer = `
    <button type="button" class="btn btn-success" onclick="parseBySms();">메세지 인식하기</button>
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">닫기</button>
    `;
    $('#smsModalFooter').html(footer);
}



/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////
/////문자메시지추출/////문자메시지추출/////문자메시지추출/////문자메시지추출/////문자메시지추출/////문자메시지추출/////문자메시지추출/////문자메시지추출/////
/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////SMS PARSING/////



/** 영수증 사진 서버로 보내기 */
function submitReceiptImg() {
    let fileInput = $('#receiptUpload').get(0); // jQuery에서 DOM 객체 가져오기
    if (!fileInput.files || !fileInput.files.length) {
        alert('영수증 사진을 첨부하세요.');
        return;
    }

    let formData = new FormData();
    formData.append('file', fileInput.files[0]);

    fetch('/secretary/detect-text', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        handleOcrResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



/** 영수증 문자열 정규식으로 파싱하는 함수 */
function handleOcrResult(response) {
    console.log("서버가 읽어준 영수증 텍스트:" + response);
    
    // 거래일시 추출
    let dateMatch = response.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})/);
    let transDate = dateMatch ? `${dateMatch[1]}T${dateMatch[2]}` : null;

    // ','가 포함된 숫자 중 가장 먼저 나오는 숫자 추출
    let repeatedNumbers = response.match(/(\d{1,3}(,\d{3})*(\.\d+)?)(?:[^\d]+\1){2}/);
    let transAmount = repeatedNumbers ? repeatedNumbers[1].replace(/,/g, '') : null;

    // "마트"가 포함된 문자열 추출
    let martMatch = response.match(/Text: ([^\n]*마트[^\n]*)/);
    let transPayee = martMatch ? martMatch[1] : null;

    console.log('transDate:', transDate);
    console.log('transAmount:', transAmount);
    console.log('transPayee:', transPayee);

    // 추출한 문자열 모달에 넣기
    let form = `
        <div class="mb-3">
            <label class="form-label" for="transDate">거래일자</label>
            <input class="form-control" type="datetime-local" name="transDate" value="${transDate}" id="transDateImg">
        </div>
        <div class="mb-3">
            <label class="form-label" for="transPayee">거래내용</label>
            <input type="text" name="transPayee" id="transPayeeImg" value="${transPayee}" class="form-control phone-mask" placeholder="거래처를 입력하세요">
            <div>
                <p id="transPayeeErrorImg"></p>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label" for="transAmount">거래금액</label>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon11">₩</span>
                <input type="text" name="transAmount" id="transAmountImg" value="${transAmount}" class="form-control" placeholder="금액을 입력하세요" aria-label="Username" aria-describedby="basic-addon11">
            </div>
            <div>
                <p id="transAmountErrorImg"></p>
            </div>
        </div>
    `;

    let footer = `
    <button type="button" class="btn btn-success" id="fromImgToForm" onclick="fromImgToForm();">입력하기</button>
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">닫기</button>
    `;

    $('#imgModalFooter').html(footer);
    $('#parseByImgResultDiv').html(form);
}


/** 직접입력 폼에 영수증 추출 내용 넣기 */
function fromImgToForm() {
    // 영수증 모달 값 추출
    let transDateImg = $('#transDateImg').val();
    let transPayeeImg = $('#transPayeeImg').val();
    let transAmountImg = $('#transAmountImg').val();

    console.log(transDateImg, transPayeeImg, transAmountImg);

    // 본문에 값 설정
    $('#transDate').val(transDateImg);
    $('#transPayee').val(transPayeeImg);
    $('#transAmount').val(transAmountImg);

    // 모달 닫기
    $('#inputByImgModal').modal('hide');
}


/** 이미지 모달 닫히면 필드 초기화하는 함수 */
function initImgModal() {
    // 입력 필드 초기화
    $("#transDateImg").val("");
    $("#transPayeeImg").val("");
    $("#transAmountImg").val("");
    
    // 영수증 파일 초기화
    $("#receiptUpload").val("");
    
    // 인식 field 숨기기
    $('#parseByImgResultDiv').html("");

    // footer 버튼 바꾸기 
    let footer = `
    <button type="button" class="btn btn-success" onclick="submitReceiptImg();">이미지 인식하기</button>
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">닫기</button>
    `;
    $('#imgModalFooter').html(footer);
}



/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////
/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////영수증 추출/////
/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////IMAGE PARSING/////