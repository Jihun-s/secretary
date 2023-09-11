$(document).ready(function () {
  let calendarEl = $("#calendar")[0];
  
  /* 현재 날짜 구하기 */
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate;  


  /** 풀캘린더 */
  let calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'ko',
    initialDate: curDateFormat,
    editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true,
    events: function(info, successCallback, failureCallback) {
      $.ajax({
        url: "/secretary/schedule/list",
        type: "GET",
        dataType: "JSON",
        success: (data) => {
          let transformedData = data.map(function (sch) {
            return {
              // 기본 제공 프롭스
              id: sch.schId,
              title: sch.schContent,
              start: sch.schStart,
              end: sch.schEnd,
              allday: sch.schAllday === 1 ? true : false,
              // 사용자 정의 프롭스
              schId: sch.schId,
              schContent: sch.schContent,
              schStart: sch.schStart,
              schEnd: sch.schEnd,
              schAllday: sch.schAllday === 1 ? true : false,
              schType: sch.schType,
              schCate: sch.schCate,
              schLevel: sch.schLevel,
            }
          })

          successCallback(transformedData);
        },
        error: (e) => {
          alert('일정 가져오기 실패');
          alert(JSON.stringify(e));
        }
      });
    },
    eventClick: (data) => {
      let schObj = data.event.extendedProps;
      // alert(JSON.stringify(data.event));
      // {"allDay":false,"title":"현대카드 대금 인출","start":"2023-09-13T00:00:00+09:00","id":"1",
      // "extendedProps":{"allday":true,"schId":1,"schContent":"현대카드 대금 인출","schStart":"2023-09-13 00:00:00","schEnd":"2023-09-13 00:00:00","schAllday":true,"schType":"가계부","schCate":"지출","schLevel":2}}

      // 모달에 데이터 채우기
      $("#schId").val(schObj.schId); // 일정 아이디
      $("#schContent").val(schObj.schContent); // 일정 내용
      $("#schType").val(schObj.schType); // 유형
      $("#schCate").val(schObj.schCate); // 카테고리
      $("#schLevel").val(schObj.schLevel); // 중요도
      $("#schStart").val(schObj.schStart); // 시작일
      $("#schEnd").val(schObj.schEnd); // 종료일
      $("#schAllday").val(schObj.schAllday); // 종일 여부
      
      // 모달을 표시
      $('#schDetailModal').modal('show');
    },    
  });

  // 일정 삭제
  $('#schDetailDeleteBt').click(deleteSch);

  calendar.render();
});

/** 일정 삭제 */
function deleteSch() {
  let schId = $('#schId').val();
  console.log("삭제할 일정의 schId는 " + schId);
  
  if(confirm("일정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
    $.ajax({
      url: '/secretary/schedule/deleteSch',
      type: 'POST',
      data: { schId: schId },
      dataType: 'TEXT',
      success: (data) => {
        if(data == 1) {
          alert('일정을 삭제했습니다.');
        } else {
          alert('일정을 삭제할 수 없습니다.');
        }
  
        location.reload();
      },
      error: (e) => {
        alert('일정 삭제 전송 실패');
        alert(JSON.stringify(e));
      }
    });
  }

}