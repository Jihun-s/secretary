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
              id: sch.schId,
              title: sch.schContent,
              start: sch.schStart,
              end: sch.schEnd,
              allday: sch.schAllday === 1 ? true : false // 1이면 참, 0이면 거짓
            }
          })

          successCallback(transformedData);
        },
        error: (e) => {
          alert(JSON.stringify(e));
        }
      });
    },
  });

  calendar.render();
});