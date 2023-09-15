$(document).ready(function() {
      // 날짜 설정
    setCurDate();
    initializeDateSelector();

    // 오늘 날짜로 초기화
    $('#dateReset').click(function() {
        resetToCurrentDate();
        initializeDateSelector();
        init();
    });

    // 목록 불러오기
    init();
    $('#prevYear, #prevMonth, #nextYear, #nextMonth').click(init);

    $("#transCategoriesDiv").hide();
    $("#transSearchCategory2Div").hide();

    // 내역 검증 후 입력
    $('#setTransBt').click(setTrans);

    // 모달 검증 후 내역 수정
    $('#setTransBtModal').click(updateTrans); 

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

   // 모달 거래유형 클릭 이벤트 (대분류 출력)
   $("input[name='transType']").change(function() {
    showTransCategoriesDivModal();
    loadMainCategoriesModal($(this).val());
   });

   // 모달 대분류 선택 이벤트 (소분류 출력 or 기본값)
   $("#cate1NameModal").change(function() {
        const selectedCate1NameModal = $(this).val();
        if (selectedCate1NameModal !== "대분류를 선택하세요") {
            loadSubCategoriesModal(selectedCate1NameModal);
        } 
        if (selectedCate1NameModal === "대분류를 선택하세요") {
            // 대분류가 초기 상태로 변경된 경우, 소분류도 초기 상태로 변경합니다.
            $("#cate2NameModal").html('<option>소분류를 선택하세요</option>');
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

    // 모달 소분류 선택 이벤트 (소분류 먼저 선택할 수 없음)
    $("#cate2NameModal").click(function() {
        if ($("input[name='transType']:checked").length === 0) {
            alert("거래 유형을 먼저 선택하세요.");
            return;
        }
        if ($("#cate1NameModal").val() === "대분류를 선택하세요") {
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
    
    // 모달 1000단위 콤마 찍기
    $('#transAmountModal').on('input', function() {
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

    
    // 검색용 전체 대분류 & 에 맞는 소분류 출력
    loadMainCategoriesSearch();
    $("#transSearchCategory1Div").change(function() {
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
    // 검색어 입력
    $('#searchSubmitBt').click(selectConditionTrans);
    $('#selectCondition input, #selectCondition select').change(selectConditionTrans);
    $('#transSearchCheckIncome').click(selectConditionTrans);
    $('#transSearchCheckExpense').click(selectConditionTrans);
    $('#transSearchCheckUserId').click(selectConditionTrans);
    $('#transSearchCategoriesDiv').click(selectConditionTrans);
    $('#sortBy').change(selectConditionTrans);
});

////////////////////////////////////////////////////////////////

/** 날짜입력 기본값 현재시간으로 설정 */
function dateToSysdate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
  const searchDate = `${year}-${month}-${day}`;

  document.getElementById('transDate').value = dateTimeString;
  document.getElementById('searchDate').value = searchDate;
}


////////////////////////////////////////////////////////////////

/** transType별 색상 매핑 */
function getColorBytransType(transType) {
  switch (transType) {
    // 'success' color
    case '수입':
      return {
        textColor: '#71DD37',
        borderColor: 'transparent',
        backgroundColor: 'transparent'
      };

    // 'warning' color
    case '지출':
      return {
        textColor: '#FFC0CB',
        borderColor: 'transparent',
        backgroundColor: 'transparent'
      };
  }
}


/** 숫자에 1000 단위로 , 찍기 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


///////////////////////////////////////////////////////////////////////////////

let listHtml = `
                    <div class="row">
                      <div class="col">
                        <h5 class="card-header">이달의 내역<span id="transCntMonth"></span>건</h5>
                      </div>
                      <div class="col">
                        <div class="date-selector">
                          <button id="prevYear">◁◁</button>
                          <button id="nowYear">2023</button>
                          <button id="nextYear">▷▷</button>
                          <br>
                          <button id="prevMonth">◁</button>
                          <span><span id="nowMonth">9</span>월</span>
                          <button id="nextMonth">▷</button>
                          <button id="dateReset">오늘로 이동</button>
                        </div>
                      </div>
                    </div>
                    
                    <input type="hidden" value="" id="searchDate">
                    
                    <!-- 조건별 보기 -->
                    <div class="row mb-3">
                      <!-- 분류랑 정렬 -->
                      <div id="selectCondition" class="col-6">
                        <div class="row-6">
                          <div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="checkbox" id="transSearchCheckIncome" value="수입" checked="true">
                              <label class="form-check-label" for="transSearchCheckIncome">수입</label> 총 <span id="transSumIncomeMonth"></span>원
                            </div>
                            <div class="form-check form-check-inline">
                              <input class="form-check-input" type="checkbox" id="transSearchCheckExpense" value="지출" checked="true">
                              <label class="form-check-label" for="transSearchCheckExpense">지출</label> 총 <span id="transSumExpenseMonth"></span>원
                            </div>
                            <div class="form-check form-check-inline form-switch mb-2">
                              <input class="form-check-input" type="checkbox" id="transSearchCheckUserId">
                              <label class="form-check-label" for="transSearchCheckUserId">나의 내역만 보기</label>
                            </div>  
                          </div>
                        </div>
                        <div class="row-6">
                          <div id="transSearchCategoriesDiv" class="mb-3">
                            <label class="form-label" for="transCategory">카테고리</label>
                            <div>
                              <div id="transSearchCategory1Div">
                                <select id="cate1NameSearch" name="cate1Name" class="form-select">
                                </select>
                              </div>
                              <div id="transSearchCategory2Div">
                                <select id="cate2NameSearch" name="cate2Name" class="form-select">
                                </select>
                              </div>
                            </div>  
                            <div>
                              <p id="transCategorySearchError"></p> 
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- 검색 & 정렬 -->
                      <div class="col-6">
                        <label class="form-label" for="search">검색</label>
                        <div class="input-group input-group-merge">
                          <select id="searchBy" name="searchBy" class="form-select">
                            <option value="all" selected>전체</option>
                            <option value="transPayee">거래내용</option>
                            <option value="transMemo">거래메모</option>
                            <option value="transAmount">거래금액</option>
                          </select>
                          <span class="input-group-text"><i class="bx bx-search"></i></span>
                          <input type="text" id="searchWord" name="searchWord" class="form-control" placeholder="검색" aria-label="검색" aria-describedby="검색">
                          <button class="btn btn-outline-success" id="searchSubmitBt">검색</button>
                        </div>
                        <label class="form-label" for="sort">정렬</label>
                        <div class="input-group input-group-merge">
                          <select id="sortBy" name="sortBy" class="form-select">
                            <option value="dateAsc">날짜 오름차순</option>
                            <option value="dateDesc" selected>날짜 내림차순</option>
                            <option value="amountAsc">금액 오름차순</option>
                            <option value="amountDesc">금액 내림차순</option>
                            <option value="payeeAsc">거래내용 가나다순</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    <!-- 내역 테이블 -->
                    <div class="table-responsive text-nowrap">
                      <div id="transListDiv">
                        <!-- 반복문 들어가는 자리 -->
                      </div>
                    </div>
`;


/////////////////////////////////////////////////////////////////////////////


function showList() {
  $('#transViewDiv').html(listHtml);
  init();
}

let calendar = null; // 글로벌 변수로 캘린더 인스턴스를 저장하기 위한 변수

function showCalendar() {
  let calendarEl = $('#transViewDiv')[0];

  /* 현재 날짜 구하기 */
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate; 
  
  $('#transViewDiv').html('');

  calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ko',
      initialDate: curDateFormat,
      events: function(info, successCallback, failureCallback) {
      // 현재 달력 연월 추출
      let date = new Date(info.start);
      date.setDate(date.getDate() + 15);  // 중간값 작업
      let calYear = date.getFullYear();
      let calMonth = date.getMonth() + 1;
      // alert("events 함수에서 읽은 연월:" + calYear + " " + calMonth);
  
      $.ajax({
          url: "/secretary/cashbook/trans/loadCalInEx",
          type: "GET",
          data: { calYear: calYear, calMonth: calMonth },
          dataType: "JSON",
          success: (data) => {
            // console.log(calYear + "년 " + calMonth + "월의 데이터:" + JSON.stringify(data));
            let colorInfo = getColorBytransType(data.transType);
            let transformedData = [];
        
            data.forEach(trans => {
                
            // 수입이 0이 아닌 경우 이벤트 추가
            if (trans.calIncome !== 0) {
              let colorInfoIncome = getColorBytransType('수입');
              transformedData.push({
                  title: `+${numberWithCommas(trans.calIncome)}`,
                  start: trans.calDate,
                  textColor: colorInfoIncome.textColor,
                  borderColor: colorInfoIncome.borderColor,
                  backgroundColor: colorInfoIncome.backgroundColor,
                  extendedProps: {
                    type: '수입',
                    income: trans.calIncome
                  }
              });
            }
                  
            // 지출이 0이 아닌 경우 이벤트 추가
            if (trans.calExpense !== 0) {
              let colorInfoExpense = getColorBytransType('지출');
              transformedData.push({
                  title: `-${numberWithCommas(trans.calExpense)}`,
                  start: trans.calDate,
                  textColor: colorInfoExpense.textColor,
                  borderColor: colorInfoExpense.borderColor,
                  backgroundColor: colorInfoExpense.backgroundColor,
                  extendedProps: {
                    type: '지출',
                    expense: trans.calExpense
                  }
              });
            }
          });
        
            successCallback(transformedData);
          },
          error: (e) => {
              alert('달력 수입지출 가져오기 실패');
              alert(JSON.stringify(e));
          }
      });
    },
    eventClick: function(info) {
      // 현재 달력 연월 추출
      let detailListDiv = $('#detailListDiv');
      let eventDate = new Date(info.event.start); // 이벤트의 시작 날짜를 가져옵니다.
      let calYear = eventDate.getFullYear();
      let calMonth = eventDate.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
      let calDate = eventDate.getDate();
      let transType = info.event.extendedProps.type;
      // alert(calYear + "년 " + calMonth + "월 " + calDate + "일의 " + transType + "을 클릭");

      // 해당 날짜의 해당 유형의 거래내역을 가져오는 ajax 함수
      $.ajax({
        url: '/secretary/cashbook/trans/getDetailList',
        type: 'GET',
        data: { calYear: calYear, calMonth: calMonth, calDate: calDate, transType: transType },
        dataType: 'JSON',
        success: (list) => {
          // console.log(JSON.stringify(list));

          if(list.length == 0 || list == null) {
            transListDiv.html("내역이 존재하지 않습니다.");
        } else {
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
                                <span class="badge bg-label-${ta.labelColor} me-1">${ta.cate2Name || ta.cate1Name || '미분류'}</span>
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

        detailListDiv.html(table);
        }
      
          
          // 모달 활성화
          $('#ModalDetailList').modal('show');  // Bootstrap의 모달을 활성화합니다.
      },
        error: (e) => {
          alert(JSON.stringify(e));
          alert("달력 내역 상세 목록 전송 실패");
        }
      });
    }
  
  });

  $('#transViewDiv').html('');

  calendar.render();
}
