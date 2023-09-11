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
              allday: sch.schAllday,
              // 사용자 정의 프롭스
              schId: sch.schId,
              schContent: sch.schContent,
              schStart: sch.schStart,
              schEnd: sch.schEnd,
              schAllday: sch.schAllday,
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

    // 날짜 클릭 -> Insert 모달 실행
    dateClick: function(info) {
      $('#schStartInput').val(info.dateStr + "T00:00"); // 클릭한 날짜로 시작일 설정
      $('#schEndInput').val(info.dateStr + "T23:59"); // 클릭한 날짜로 종료일 설정
      
      $('#schInsertModal').modal('show'); // 모달 표시
    },
  
    // 이벤트 클릭 -> Detail 모달 실행
    eventClick: (data) => {
      let schObj = data.event.extendedProps;
      // alert(JSON.stringify(data.event));
      // {"allDay":false,"title":"현대카드 대금 인출","start":"2023-09-13T00:00:00+09:00","id":"1",
      // "extendedProps":{"allday":true,"schId":1,"schContent":"현대카드 대금 인출","schStart":"2023-09-13 00:00:00","schEnd":"2023-09-13 00:00:00","schAllday":true,"schType":"가계부","schCate":"지출","schLevel":2}}
      
      // 모달에 데이터 채우기
      $("#schId").val(schObj.schId); 
      $("#schContent").val(schObj.schContent);
      $("#schTypeSelect").val(schObj.schType);
      $("#schCateSelect").val(schObj.schCate);
      $("#schLevel").val(schObj.schLevel); 
      $("#schStart").val(convertDateTimeToLocal(schObj.schStart));
      $("#schEnd").val(convertDateTimeToLocal(schObj.schEnd));
      $("#schAllday").prop('checked', schObj.schAllday);
      
      // 유형에 따라 카테고리 옵션 업데이트하고 선택
      updateSchCateOptions(schObj.schType, schObj.schCate, 'schTypeSelect');      

      // 모달 표시
      $('#schDetailModal').modal('show');
    },


  });

  // schType select 변경
  $('#schTypeSelect, #schTypeSelectInput').change(function() {
    let selectedType = $(this).val();
    let triggerId = $(this).attr('id');

    updateSchCateOptions(selectedType, null, triggerId);
  });
  

  // 일정 삭제
  $('#schDetailDeleteBt').click(deleteSch);

  // 달력 렌더링
  calendar.render();

}); // ready 함수


/////////////////////////////////////////////////////////////////

/** 풀캘린더 초기화 */
function init() {
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
              allday: sch.schAllday,
              // 사용자 정의 프롭스
              schId: sch.schId,
              schContent: sch.schContent,
              schStart: sch.schStart,
              schEnd: sch.schEnd,
              schAllday: sch.schAllday,
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

    // 날짜 클릭 -> Insert 모달 실행
    dateClick: function(info) {
      $('#schStartInput').val(info.dateStr + "T00:00"); // 클릭한 날짜로 시작일 설정
      $('#schEndInput').val(info.dateStr + "T23:59"); // 클릭한 날짜로 종료일 설정
      
      $('#schInsertModal').modal('show'); // 모달 표시
  },
  
    // 이벤트 클릭 -> Detail 모달 실행
    eventClick: (data) => {
      let schObj = data.event.extendedProps;
      // alert(JSON.stringify(data.event));
      // {"allDay":false,"title":"현대카드 대금 인출","start":"2023-09-13T00:00:00+09:00","id":"1",
      // "extendedProps":{"allday":true,"schId":1,"schContent":"현대카드 대금 인출","schStart":"2023-09-13 00:00:00","schEnd":"2023-09-13 00:00:00","schAllday":true,"schType":"가계부","schCate":"지출","schLevel":2}}

      // 모달에 데이터 채우기
      $("#schId").val(schObj.schId); 
      $("#schContent").val(schObj.schContent);
      $("#schTypeSelect").val(schObj.schType);
      $("#schLevel").val(schObj.schLevel); 
      $("#schStart").val(convertDateTimeToLocal(schObj.schStart));
      $("#schEnd").val(convertDateTimeToLocal(schObj.schEnd));
      $("#schAllday").prop('checked', schObj.schAllday);
  
      // 유형에 따라 카테고리 옵션 업데이트하고 선택
      updateSchCateOptions(schObj.schType, schObj.schCate);

      // 모달 표시
      $('#schDetailModal').modal('show');
    },
  });
}


////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////

/** schType -> schCate <option> 동적 변경 */ 
function updateSchCateOptions(schType, schCate, triggerId) {
  console.log(schType, schCate, triggerId);

  let schCateSelect;

  if (triggerId === 'schTypeSelect') {
    schCateSelect = $('#schCateSelect');
  } else if (triggerId === 'schTypeSelectInput') {
    schCateSelect = $('#schCateSelectInput');
  } else {
    return; // 둘 다 아닌 경우
  }

  // 기존 옵션 삭제
  schCateSelect.empty();
  schCateSelect.append('<option value="">카테고리를 선택하세요</option>');

  let options = [];

  // 타입 별 카테고리 옵션 대입
  switch (schType) {
      case '일정':
          options = ['생일', '경조사', '명절', '공휴일', '시험', '약속', '일정'];
          break;
      case '냉장고':
          options = ['구매예정일', '소비기한'];
          break;
      case '생활용품':
          options = ['구매예정일', '소비기한'];
          break;
      case '옷장':
          options = ['미정'];
          break;
      case '가계부':
          options = ['지출', '수입'];
          break;
      default:
          break;
  }

  // 리스트에 있는 값 <option>으로 추가
  options.forEach(option => {
    schCateSelect.append(`<option value="${option}">${option}</option>`);
  });

  // 카테고리 선택
  if (schCate) {
    schCateSelect.val(schCate);
  }
}

////////////////////////////////////////////////////////////////////////

/** 날짜 포맷 변환 */
// YYYY-MM-DD' 'HH24:MI:SS -> YYYY-MM-DD'T'HH24:MI:SS 
function convertDateTimeToLocal(dateTimeStr) {

  return dateTimeStr.replace(" ", "T");
}

////////////////////////////////////////////////////////////////


/** 일정 입력 유효성 검사 */
function validateSch() {
  
  return validateSchContentInput() && validateDates() && validateSchTypeInput() && validateSchCateInput();
}

/** 일정명 유효성 검사 */
function validateSchContentInput() {
  let content = $('#schContentInput').val();
  let byteSize = 0;

  for (var i = 0; i < content.length; i++) {
      var char = content.charAt(i);
      if (escape(char).length > 4) {  // 한글일 경우
          byteSize += 3;
      } else {
          byteSize += 1;
      }
  }

  if (byteSize > 50) {
      alert("일정명은 50byte(한글 15글자)를 넘을 수 없습니다.");
      return false;
  }
  return true;
}

/** 날짜 유효성 검사 */
function validateDates() {
  let startDate = new Date($('#schStartInput').val());
  let endDate = new Date($('#schEndInput').val());

  if (startDate > endDate) {
      alert("종료일이 시작일보다 이전 날짜일 수 없습니다.");
      return false;
  }
  return true;
}

/** 유형 유효성 검사 */
function validateSchTypeInput() {
  let schType = $('#schTypeSelectInput').val();
  if (schType === "") {
      alert("유형을 선택하세요");
      return false;
  }

  return true;
}

/** 카테고리 유효성 검사 */
function validateSchCateInput() {
  let schCate = $('#schCateSelectInput').val();
  if (schCate === "") {
      alert("카테고리를 선택하세요");
      return false;
  }

  return true;
}
