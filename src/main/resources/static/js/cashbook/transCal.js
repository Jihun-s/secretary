/** 
 * 거래내역 목록<->달력 .js  
 */


$(document).ready(function() {

});



////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 



/** 내역 날짜 선택 기본값을 현재시각으로 설정하는 함수 */
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



/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////



let isCal = false;

/** transType별 색상 매핑하는 함수 */
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
        textColor: '#FFAB00',
        borderColor: 'transparent',
        backgroundColor: 'transparent'
      };
  }
}


/** 숫자에 1000 단위로 , 찍기 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////
/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////
/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////기존HTML/////

let listHtml = `
    <!-- 내역 제목 -->
    <div class="row">
      <h5 class="card-header">이달의 내역<span id="transCntMonth"></span>건</h5>
    </div>

    <!-- 내역 조건 -->
    <div class="row">
      <!-- 페이징이랑 체크박스 있는 1열 -->
      <div class="col-md-6">
        <!-- 월 페이징 -->
        <div class="row">
          <div class="date-selector mt-4 d-flex flex-column align-items-center justify-content-center">
            <div>
              <i id="prevYear" class="tf-icon bx bx-chevron-left bx-sm" style="cursor: pointer;"></i>
              <span class="display-6 mb-4" id="nowYear"></span>
              <i id="nextYear" class="tf-icon bx bx-chevron-right bx-sm" style="cursor: pointer;"></i>
            </div>
            <div>
              <i id="prevMonth" class="tf-icon bx bx-chevron-left bx-sm" style="cursor: pointer;"></i>
              <mark><span class="display-5 mt-4" id="nowMonth"></span>월</mark>
              <i id="nextMonth" class="tf-icon bx bx-chevron-right bx-sm" style="cursor: pointer;"></i>
            </div>
            <p><button type="button" id="dateReset" class="mt-3 btn btn-xs rounded-pill btn-outline-primary">오늘</button></p>
          </div>
        </div>
        <!-- 체크박스 -->
        <div class="row mt-4">
          <div id="selectCondition">
            <div class="row-6">
              <div>
                <div class="form-check form-check-inline">
                <input type="hidden" value="" id="searchDate">
                <input class="form-check-input" type="checkbox" id="transSearchCheckIncome" value="수입" checked="true">
                <label class="form-check-label" for="transSearchCheckIncome">수입</label> 총 <b id="transSumIncomeMonth"></b>원
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="checkbox" id="transSearchCheckExpense" value="지출" checked="true">
                <label class="form-check-label" for="transSearchCheckExpense">지출</label> 총 <b id="transSumExpenseMonth"></b>원
              </div>
              <div class="form-check form-check-inline form-switch mb-2 mt-2">
                <input class="form-check-input" type="checkbox" id="transSearchCheckUserId">
                <label class="form-check-label" for="transSearchCheckUserId">나의 내역만 보기</label>
              </div>  
            </div>
          </div>
        </div>
        </div>
      </div>
      <!-- select 있는 2열 -->
      <div class="col-md-6">
        <!-- 카테고리 -->
        <div class="row">
          <div id="selectCondition">
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
        </div>
        <!-- 정렬 -->
        <div class="row mb-3">
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
        <!-- 검색 -->
        <div class="row">
        <label class="form-label" for="search">검색</label>
        <div class="input-group input-group-merge">
          <select id="searchBy" name="searchBy" class="form-select">
            <option value="all" selected>전체</option>
            <option value="transPayee">거래내용</option>
            <option value="transMemo">거래메모</option>
            <option value="transAmount">거래금액</option>
          </select>
          <span class="input-group-text"><i class="bx bx-search"></i></span>
          <input type="text" id="searchWord" name="searchWord" style="width: 35%" class="form-control" placeholder="검색" aria-label="검색" aria-describedby="검색">
          <button class="btn btn-outline-success" id="searchSubmitBt">검색</button>
        </div>
      </div>
    </div>
  </div>
  <!-- 내역 테이블 -->
  <div class="row mt-5">
    <div class="table-responsive text-nowrap">
      <div id="transListDiv" class="ps ps--active-x ps--active-y transListDiv" style="overflow-y: auto; height: 50rem;">
        <!-- 반복문 들어가는 자리 -->
      </div>

    </div>
  </div>
`;


/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////
/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////
/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////달력-목록 전환/////



/** calendar 객체 */
let calendar = null;


/** 달력으로 보기 전환 함수 */
function showCalendar() {
  isCal = true;
  let calendarEl = $('#transViewDiv')[0];

  // 현재 날짜 구하기
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate; 
  
  $('#transViewDiv').html('');


  // 달력 객체 만들기 
  calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'ko',
      initialDate: curDateFormat,
      events: function(info, successCallback, failureCallback) {
      // 현재 달력 연월 추출
      let date = new Date(info.start);
      date.setDate(date.getDate() + 15);  // 중간값
      let calYear = date.getFullYear();
      let calMonth = date.getMonth() + 1;
  
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
            console.log('달력 수입지출 가져오기 실패');
          }
      });
    },
    /** 이벤트 클릭하면 상세 모달 표시 */
    eventClick: function(info) {
      // 현재 달력 연월 추출
      let detailListDiv = $('#detailListDiv');
      let eventDate = new Date(info.event.start); // 시작 날짜를 기준으로 
      let calYear = eventDate.getFullYear();
      let calMonth = eventDate.getMonth() + 1;
      let calDate = eventDate.getDate();
      let transType = info.event.extendedProps.type;

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
                        </tr>
                    </thead>
                    <tbody class="table-border-bottom-0">`;

            $(groupedData[date]).each(function(idx, ta) {
                table += `<tr>
                            <td>
                                <span class="badge bg-label-${ta.labelColor} me-1">${ta.cate2Name || ta.cate1Name || '미분류'}</span>
                                <input type="hidden" value="${ta.transId}">
                            </td>
                            <td>${ta.transTime}</td>
                            <td><i class="fab fa-react fa-lg text-info me-3"></i> <strong>${ta.transPayee}</strong></td>
                            <td>${ta.transMemo || ''}</td>
                            <td>${parseInt(ta.transAmount).toLocaleString('en-US')}</td>
                            <td>${ta.userNickname || ta.userId}</td>
                        </tr>`;
            });

            table += `</tbody>`;
        }

        table += `</table>`;

        detailListDiv.html(table);
        }
      
          
          // 모달 활성화
          $('#ModalDetailList').modal('show'); 
      },
        error: (e) => {
          console.log("달력 내역 상세 목록 전송 실패");
        }
      });
    }
  
  });

  $('#transViewDiv').html('');

  calendar.render();
}


/** 목록으로 보기 전환 함수 */
function showList() {
  isCal = false;
  $('#transViewDiv').html(listHtml);
  
  if(calendar) {
    calendar.destroy(); // 만들었던 달력 객체 폐기
  }


    
  // 오늘 날짜로 초기화
  $('#dateReset').click(function() {
    resetToCurrentDate();
    initializeDateSelector();
    init();
  });
  
  // 날짜 설정
  setCurDate();
  initializeDateSelector();

  // 조건 & 검색 & 정렬 
  // 대분류 카테고리 가져오기 
  loadMainCategoriesSearch();
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

  // 목록 불러오기
  init();
  $('body').on('click', '#prevYear, #prevMonth, #nextYear, #nextMonth', init);
  
  // 숨기기 
  $("#transCategoriesDiv").hide();
  $("#transSearchCategory2Div").hide();

  // 스크롤바 
  const containers = [
      document.querySelector('#transListDiv'),
      document.querySelector('.transListDiv'),
      document.querySelector('.card-body')
  ].filter(el => el !== null); 

  const options = {
      wheelSpeed: 1,
      wheelPropagation: true,
  };

  containers.forEach(container => {
      new PerfectScrollbar(container, options);
  });
}