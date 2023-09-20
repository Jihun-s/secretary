$(document).ready(function() {
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
      aspectRatio: 0.1,
      height: 550,
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
          alert(JSON.stringify(e));
          alert("달력 내역 상세 목록 전송 실패");
        }
      });
    }
  
  });

  $('#transViewDiv').html('');

  calendar.render();
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

let isCal = false;

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


/** 날짜 형식 변환 */
function formatDate(inputDate) {
  // YYYY-MM-DD 형식의 문자열을 받아서 "월 일 요일" 형식으로 반환하는 함수
  let dateObj = new Date(inputDate);
  let month = dateObj.getMonth() + 1;
  let date = dateObj.getDate();
  let dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  let day = dayNames[dateObj.getDay()];
  return `${month}월 ${date}일　　${day}`;
}