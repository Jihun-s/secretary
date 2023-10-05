$(document).ready(function () {
	
  var calendarEl = document.getElementById('calendar');
  /* 현재 날짜 구하기 */
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate;  
  /* 현재 날짜 구하기 끝 */
  
    var calendar = new FullCalendar.Calendar(calendarEl, {

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'listWeek'
      },

      views: {
        listWeek: { buttonText: '주간 일정' }
      },
	  locale: "ko",
      initialView: 'listWeek',
      initialDate: curDateFormat,
      navLinks: false, // can click day/week names to navigate views
      editable: false,
      dayMaxEvents: false, // allow "more" link when too many events
      noEventsContent: { html: '<p>등록한 일정이 없습니다. <br> 일정을 추가하려면 클릭하세요</p>' },
	  events: function(info, successCallback, failureCallback) {
      // 현재 달력의 년도와 월을 추출
      let date = new Date(info.start);
      let schYear = date.getFullYear();
      let schMonth = date.getMonth() + 1;
  
      // loadSchedule 함수 호출
      loadSchedule(schYear, schMonth, "일자별");
  
      $.ajax({
        url: "/secretary/schedule/loadSch",
        type: "GET",
        dataType: "JSON",
        success: (data) => {
          let transformedData = data.map(function (sch) {
            // 배경색 + 글자색 + 테두리색
            let colorInfo = getColorBySchType(sch.schType, sch.schCate);

            return {
              // 기본 제공 프롭스
              id: sch.schId,
              title: sch.schContent,
              start: sch.schStart,
              end: sch.schEnd,
              allday: sch.schAllday,
              backgroundColor: colorInfo.bgColor, // 배경색
              textColor: colorInfo.textColor,     // 글자색
              borderColor: colorInfo.borderColor, // 테두리색
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
      });//ajax
    },//events
        // 이벤트 클릭 -> Detail 모달 실행
    eventClick: (data) => {
      let schObj = data.event.extendedProps;
      // alert(JSON.stringify(data.event));
      // {"allDay":false,"title":"현대카드 대금 인출","start":"2023-09-13T00:00:00+09:00","id":"1",
      // "extendedProps":{"allday":true,"schId":1,"schContent":"현대카드 대금 인출","schStart":"2023-09-13 00:00:00","schEnd":"2023-09-13 00:00:00","schAllday":true,"schType":"가계부","schCate":"지출","schLevel":2}}

      // 수정전송버튼, 수정취소버튼 숨기기
      $('#schUpdateBt, #schCancelBt').hide();
      // 원래 수정 삭제 확인버튼 나오기
      $('#schDetailUpdateBt, #schDetailDeleteBt, #schDetailCloseBt').show();
      // 제목 수정
      $('#schDetailModalTitle').html('일정 상세보기');
      // 모든 input 필드의 readonly 속성 추가
      $('#schDetailModal input').prop('readonly', true);
      // 모든 select 필드의 disabled 속성 추가
      $('#schDetailModal select, #schDetailModal :checkbox').prop('disabled', true);

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

      // 모든 input을 readonly로 설정
      $('#schDetailModal input').prop('readonly', true);
      // 모든 select을 disabled로 설정
      $('#schDetailModal select, #schDetailModal :checkbox').prop('disabled', true);


      // 모달 표시
      $('#schDetailModal').modal('show');
    },//eventClick
	  noEventsDidMount: function(arg) {
    	// "일정이 없습니다" 메시지가 화면에 표시된 후 실행할 코드
   		// arg.el은 메시지의 DOM 요소를 나타냅니다.
    	// 메시지에 클릭 이벤트를 추가
    	arg.el.style.backgroundColor = '#ffcbcb';
    	arg.el.addEventListener('click', function() {
      		window.open("schedule","schedulePage");
   		 });
  	  },//noEventsDidMount
    });//calendar
    calendar.render();
 var rowsWithDate = document.querySelectorAll('.fc-list-day');
for (var i = 0; i < rowsWithDate.length; i++) {
  rowsWithDate[i].classList.add('has-date');
}   

});//document.ready


/** 일정 목록 불러오기 */
function loadSchedule(schYear, schMonth, groupBy) {
  console.log(schYear + "년 " + schMonth + "월 " + groupBy + "로 일정을 불러올게요");

  $.ajax({
      url: '/secretary/schedule/loadSchList',
      method: 'GET',
      data: { schYear: schYear, schMonth: schMonth },
      dataType: 'JSON',
      success: function(data) {
          let html = "";
          // 일정을 schStartYmd 기준으로 그룹화
          let groupedByDate = {};
          data.forEach(sch => {
             if (!groupedByDate[sch.schStartYmd]) {
                  groupedByDate[sch.schStartYmd] = [];
               }
               groupedByDate[sch.schStartYmd].push(sch);
          });

         // 그룹화된 데이터를 기반으로 HTML 생성
         for (let date in groupedByDate) {
              html += `<br><small class="text-light fw-semibold">${date}</small>`;
              groupedByDate[date].forEach(sch => {
                 html += `
                   
                     <a href="javascript:openDetailModal(${sch.schId});">
                      
                      <span class="badge rounded-pill ${getBadgeClass(sch.schType, sch.schCate)}">${sch.schCate}</span>
                          ${convertTimeToKor(sch.schStartHm)}&nbsp;${sch.schContent}
                      
                      </a>
                   <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i><br>
                      `;
                  });
              } 

          $("#navs-pills-justified-profile").html(html);
      },
      error: function(e) {
          alert(JSON.stringify(e));
          alert('일정 목록 서버 전송 실패');
      }
  });
}


/** 일정 하나 당 모달 열기 */
function openDetailModal(schId) {
  // 값 불러오기
  $.ajax({
    url: '/secretary/schedule/selectOne',
    type: 'POST',
    data: { schId: schId },
    dataType: 'JSON',
    success: (schObj) => {
      // 수정전송버튼, 수정취소버튼 숨기기
      $('#schUpdateBt').hide();
      $('#schCancelBt').hide();

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

      // 모든 input을 readonly로 설정
      $('#schDetailModal input').prop('readonly', true);
      // 모든 select을 disabled로 설정
      $('#schDetailModal select, #schDetailModal :checkbox').prop('disabled', true);

      // 모달 표시
      $('#schDetailModal').modal('show');
    },
    error: (e) => {
      alert(JSON.stringify(e));
      alert('일정 하나 불러오기 전송 실패');
    }
  });
}

/** 일정 삭제 매개변수 있음 */
function deleteSch(schId) {
  console.log("삭제할 일정의 schId는 " + schId);
	Swal.fire({
	   	title: '일정을 삭제하시겠습니까?',
	   	text:'이 작업은 되돌릴 수 없습니다.',
	  	icon: 'warning',
	   	showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
	   	iconColor: 'rgba(223,132,166,255)',
	   	confirmButtonColor: 'rgba(223,132,166,255)',
	   	cancelButtonColor: 'rgba(223,132,166,255)', 
	   	confirmButtonText: '삭제', 
	   	cancelButtonText: '닫기',
	}).then(result => {
	   	if (result.isConfirmed) { // 만약 모달창에서 confirm 버튼을 눌렀다면
		    $.ajax({
		      url: '/secretary/schedule/deleteSch',
		      type: 'POST',
		      data: { schId: schId },
		      dataType: 'TEXT',
		      success: (data) => {
		        if(data == 1) {
					Swal.fire({
		 				text: '일정 삭제 성공',
		  				icon: 'success',
		  				confirmButtonText: '확인',
		  				confirmButtonColor: 'rgba(223,132,166,255)',
		  				iconColor: 'rgba(223,132,166,255)',
		  				closeOnClickOutside : false
					}).then(function(){
						location.reload();
					});	
		        } else {
					Swal.fire({
		 				text: '일정 삭제 실패',
		  				icon: 'error',
		  				confirmButtonText: '확인',
		  				confirmButtonColor: 'rgba(223,132,166,255)',
		  				iconColor: 'rgba(223,132,166,255)',
					})
		        }
		      },
		      error: (e) => {
		        alert('일정 삭제 전송 실패');
		        alert(JSON.stringify(e));
		      }
		    });
	   	}
	});	  
  
}

// YYYY-MM-DD' 'HH24:MI:SS -> HH24시
function convertTimeToKor(dateTimeStr) {
  let hour = dateTimeStr.slice(0, 2);

  return `${hour}시`;
}

/** 일정 목록 뱃지 색 지정 */
function getBadgeClass(type, cate) {
  let classes = {
      '일정': 'bg-primary',
      '냉장고': 'bg-warning',
      '생활용품': 'bg-info',
      '옷장': 'bg-label-danger',
      '가계부': 'bg-success'
  };

  if (type === '일정' && (cate === '명절' || cate === '공휴일')) {
      return 'bg-danger';
  }

  return classes[type] || 'bg-primary';
}

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
/** 날짜 포맷 변환 */
// YYYY-MM-DD' 'HH24:MI:SS -> YYYY-MM-DD'T'HH24:MI:SS 
function convertDateTimeToLocal(dateTimeStr) {

  return dateTimeStr.replace(" ", "T");
}


/** schType, schCate별 색상 매핑 */
function getColorBySchType(schType, schCate) {
  // 'danger' color
  if (schType === '일정') {
    if (schCate === '명절' || schCate === '공휴일') {
      return {
        bgColor: '#FF3E1D',
        textColor: '#FFE0DB', 
        borderColor: '#FF3E1D'
      };
    }
  }
  
  switch (schType) {
    // 'primary' color
    case '일정':
      return {
        bgColor: '#696CFF',
        textColor: '#E7E7FF',
        borderColor: '#696CFF'
      };
    
    // 'warning' color
    case '냉장고':
      return {
        bgColor: '#FFAB00',
        textColor: '#FFF2D6',
        borderColor: '#FFAB00'
      };

    // 'info' color
    case '생활용품':
      return {
        bgColor: '#03C3EC',
        textColor: '#D7F5FC',
        borderColor: '#03C3EC'
      };

    // 혜린핑크.
    case '옷장':
      return {
        bgColor: '#DF84A6',
        textColor: '#FFDCE7',
        borderColor: '#DF84A6'
      };

    // 'success' color
    case '가계부':
      return {
        bgColor: '#71DD37',
        textColor: '#E8FADF',
        borderColor: '#71DD37'
      };

    // 'secondary' color
    default:
      return {
        bgColor: '#EBEEF0',
        textColor: '#8592A3',
        borderColor: '#EBEEF0'
      };
  }
}
 ///////////////////////////////////////////////////////////////////
 
 
