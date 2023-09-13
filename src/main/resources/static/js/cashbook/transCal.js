$(document).ready(function() {
  let calendarEl = $('#calendar')[0];

  /* 현재 날짜 구하기 */
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate; 

  let calendar = new FullCalendar.Calendar(calendarEl, {
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
            let transformedData = [];
        
            data.forEach(trans => {
                
              // 수입이 0이 아닌 경우 이벤트 추가
              if (trans.calIncome !== 0) {
                  transformedData.push({
                      title: `+${numberWithCommas(trans.calIncome)}`,
                      start: trans.calDate,
                      extendedProps: {
                        type: '수입',
                        income: trans.calIncome
                      }
                  });
              }
              
              // 지출이 0이 아닌 경우 이벤트 추가
              if (trans.calExpense !== 0) {
                  transformedData.push({
                      title: `-${numberWithCommas(trans.calExpense)}`,
                      start: trans.calDate,
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
        success: (data) => {
          console.log(JSON.stringify(data));
          
        },
        error: (e) => {
          alert(JSON.stringify(e));
          alert("달력 내역 상세 목록 전송 실패");
        }
      });
    }
  
  });

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

/** transType별 색상 매핑 */
function getColorBytransType(transType) {
  switch (transType) {
    // 'success' color
    case '수입':
      return {
        bgColor: '#71DD37',
        textColor: '#E8FADF',
        borderColor: '#71DD37'
      };

    // 'warning' color
    case '지출':
      return {
        bgColor: '#FFAB00',
        textColor: '#FFF2D6',
        borderColor: '#FFAB00'
      };
  }
}

/** 숫자에 1000 단위로 , 찍기 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 사용 예
console.log(numberWithCommas(1234567));  // "1,234,567"
