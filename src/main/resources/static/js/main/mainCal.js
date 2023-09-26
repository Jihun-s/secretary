$(document).ready(function () {
  /* 현재 날짜 구하기 */
  let now = new Date();

  let curYear = now.getFullYear();
  let curMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  let curDate = now.getDate().toString().padStart(2, '0');
  let curDateFormat = curYear + '-' + curMonth + '-' + curDate;  

  /* 그루핑 라디오 박스 이벤트 */
  let groupByValue = "일자별";
  loadSchedule(curYear, curMonth, groupByValue);

  $('input[name="groupBy"]').change(function() {
    // 라디오 버튼에서 선택된 값 얻기
    groupByValue = $(this).val();
    
    // 현재 달력의 연/월과 선택된 그룹 방식을 사용하여 loadSchedule 호출
    loadSchedule(curYear, curMonth, groupByValue);
  });

}); // ready 함수


////////////////////////////////////////////////////////////////

/** 일정 목록 불러오기 */
function loadSchedule(curYear, curMonth, groupBy) {
  console.log(curYear + "년 " + curMonth + "월 " + groupBy + "로 일정을 불러올게요");

  $.ajax({
      url: '/secretary/schedule/loadSchListAfter',
      method: 'GET',
      data: { schYear: curYear, schMonth: curMonth },
      dataType: 'JSON',
      success: function(data) {
          let html = "";
          if (groupBy === "일자별") {
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
                        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                          <a href="javascript:openDetailModal(${sch.schId});">
                            <div>
                                <span class="badge rounded-pill ${getBadgeClass(sch.schType, sch.schCate)}">${sch.schCate}</span>
                                ${convertTimeToKor(sch.schStartHm)}&nbsp;${sch.schContent}
                            </div>
                          </a>
                          <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                        </div>
                      `;
                  });
              }
          } else if (groupBy === "유형별") {
            let groupedByType = {};
            data.forEach(sch => {
                if (!groupedByType[sch.schType]) {
                    groupedByType[sch.schType] = [];
                }
                groupedByType[sch.schType].push(sch);
            });

            for (let type in groupedByType) {
                html += `<br><small class="text-light fw-semibold">${type}</small>`;
                groupedByType[type].forEach(sch => {
                  html += `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                      <a href="javascript:openDetailModal(${sch.schId});">
                        <div>
                            <span class="badge rounded-pill ${getBadgeClass(sch.schType, sch.schCate)}">${sch.schCate}</span>
                            ${convertDateToKor(sch.schStartYmd)}&nbsp;${sch.schContent}
                        </div>
                      </a>
                      <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                    </div>
                  `;
              });
            }
          } else if (groupBy === "중요도별") {
              let groupedByLevel = { 2: [], 1: [], 0: [] };

              data.forEach(sch => {
                  if (typeof groupedByLevel[sch.schLevel] !== "undefined") {
                    groupedByLevel[sch.schLevel].push(sch);
                  }
              });

              [2, 1, 0].forEach(level => {
                  if (groupedByLevel[level].length > 0) {
                      html += `<br><small class="text-light fw-semibold">중요도: ${level}</small>`;
                      groupedByLevel[level].forEach(sch => {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                  <span class="badge rounded-pill ${getBadgeClass(sch.schType, sch.schCate)}">${sch.schCate}</span>
                                  ${convertDateToKor(sch.schStartYmd)}&nbsp;${sch.schContent}
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                      });
                  }
              });
            }
          if(data.length == 0 || data == null) {
            html = `등록된 일정이 없습니다.`;
          }

          $("#schListDiv").html(html);
      },
      error: function(e) {
          alert(JSON.stringify(e));
          alert('일정 목록 서버 전송 실패');
      }
  });
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



////////////////////////////////////////////////////////////////////////

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

/** 일정 삭제 매개변수 있음 */
function deleteSch(schId) {
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

/** 일정 수정 */
function updateSch() {

  let isValid = validateUpdateSch();
  console.log("수정해도 될까요:" + isValid.toString());

  if(isValid) {
    let schId = $('#schId').val();
    let schType = $('#schTypeSelect').val();
    let schCate = $('#schCateSelect').val();
    let schContent = $('#schContent').val();
    let schLevel = $('#schLevel').val();
    let schStart = $('#schStart').val();
    let schEnd = $('#schEnd').val();
    let schAllday = $('#schAllday').val();
    console.log(schId, schType, schCate, schContent, schLevel, schStart, schEnd, schAllday);

    $.ajax({
      url: '/secretary/schedule/updateSch',
      type: 'POST',
      data: { schId: schId, 
              schType: schType, 
              schCate: schCate,
              schContent: schContent, 
              schLevel: schLevel, 
              schStart: schStart, 
              schEnd: schEnd, 
              schAllday: schAllday },
      dataType: 'TEXT',
      success: (data) => {
        if(data == 1) {
          alert('일정을 수정했습니다.');
        } else {
          alert('일정을 수정할 수 없습니다.');
        }
        location.reload();
      },
      error: (e) => {
        alert('일정 수정 전송 실패');
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

// YYYY-MM-DD -> MM월 DD일
function convertDateToKor(dateString) {
  let date = new Date(dateString);

  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// YYYY-MM-DD' 'HH24:MI:SS -> HH24시
function convertTimeToKor(dateTimeStr) {
  let hour = dateTimeStr.slice(0, 2);

  return `${hour}시`;
}

////////////////////////////////////////////////////////////////


/** 일정 입력 유효성 검사 */
function validateSch() {
  
  return validateSchContentInput() && validateDatesInput() && validateSchTypeInput() && validateSchCateInput();
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

  if(byteSize == 0) {
    alert("일정명을 입력하세요.");
    return false;
  }

  if (byteSize > 50) {
      alert("일정명은 50byte(한글 15글자)를 넘을 수 없습니다.");
      return false;
  }
  return true;
}

/** 날짜 유효성 검사 */
function validateDatesInput() {
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


////////////////////////////////////////////////////////////////


/** 일정 수정 유효성 검사 */
function validateUpdateSch() {
  
  return validateSchContent() && validateDates() && validateSchType() && validateSchCate();
}

/** 일정명 유효성 검사 */
function validateSchContent() {
  let content = $('#schContent').val();
  let byteSize = 0;

  for (var i = 0; i < content.length; i++) {
      var char = content.charAt(i);
      if (escape(char).length > 4) {  // 한글일 경우
          byteSize += 3;
      } else {
          byteSize += 1;
      }
  }

  if(byteSize == 0) {
    alert("일정명을 입력하세요.");
    return false;
  }

  if (byteSize > 50) {
      alert("일정명은 50byte(한글 15글자)를 넘을 수 없습니다.");
      return false;
  }
  return true;
}

/** 날짜 유효성 검사 */
function validateDates() {
  let startDate = new Date($('#schStart').val());
  let endDate = new Date($('#schEnd').val());

  if (startDate > endDate) {
      alert("종료일이 시작일보다 이전 날짜일 수 없습니다.");
      return false;
  }
  return true;
}

/** 유형 유효성 검사 */
function validateSchType() {
  let schType = $('#schTypeSelect').val();
  if (schType === "") {
      alert("유형을 선택하세요");
      return false;
  }

  return true;
}

/** 카테고리 유효성 검사 */
function validateSchCate() {
  let schCate = $('#schCateSelect').val();
  if (schCate === "") {
      alert("카테고리를 선택하세요");
      return false;
  }

  return true;
}

////////////////////////////////////////////////////////////////

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
