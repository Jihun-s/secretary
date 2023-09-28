$(document).ready(function() {
    getAlerts();
});

//////////////////////////////////////////////////////////

/** 알림 */
function getAlerts() {

    let curYear = $('#curYear').val();
    let curMonth = $('#curMonth').val();
    let curDate = $('#curDate').val();
    let curDateTime = $('#curDateTime').val();
    let budgetExist = 0;

    // 예산 있없? 확인
    $.ajax({
        url: '/secretary/cashbook/budgetExist',
        type: 'GET',
        data: { curYear: curYear, curMonth: curMonth },
        dataType: 'text',
        success: (result) => {
            if(result == 1) {
                budgetExist = 1;
            }
        },
        error: (e) => {
            alert('알림 출력 직전 예산 있없 조회 실패');
            console.log(JSON.stringify(e));
        }
    });

    // 목록 가져오기
    $.ajax({
        url: '/secretary/cashbook/alertList',
        type: 'POST',
        data: { curDateTime: curDateTime, curYear: curYear, curMonth: curMonth, curDate: curDate },
        dataType: 'JSON',
        success: function(data) {
            console.log(JSON.stringify(data));

            let html = "";
            
            // 예산 없을 때 알림
            if(budgetExist == 0) {
                html += `<br><small class="text-light fw-semibold">${curYear}-${curMonth}-${curDate}</small>`;
                html += `
                    <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                        <a href="javascript:openSetBudgetModal()">
                          <div>
                            ${curMonth}월 예산이 설정되지 않았습니다. 여기를 클릭하면 예산을 설정할 수 있어요.
                          </div>
                        </a>
                    </div>
                    `;
            }
        
            // 일정을 schStartYmd 기준으로 그룹화
            let groupedByDate = {};
            // 자동이체 
            data.forEach(sch => {
                if (!groupedByDate[sch.schStartYmd]) {
                    groupedByDate[sch.schStartYmd] = [];
                }
                groupedByDate[sch.schStartYmd].push(sch);
            });

            // 그룹화된 데이터를 기반으로 HTML 생성
            for (let date in groupedByDate) {
                html += `<br><small class="text-light fw-semibold">${date}</small>`;
                // 가져온 데이터 분기
                groupedByDate[date].forEach(sch => {
                    if (sch.schContent.includes("카드") || sch.schContent.includes("구독") || sch.schContent.includes("정기") || sch.schContent.includes("결제") || sch.schContent.includes("납부")) {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                ${sch.schStartMonth}월 ${sch.schStartDate}일은 ${sch.schContent}입니다. 연결 계좌 잔고를 확인하세요.
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                    } else if (sch.schCate == '명절' || sch.schCate == '생일' ||sch.schCate == '경조사') {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                ${sch.schStartMonth}월 ${sch.schStartDate}일은 ${sch.schContent}입니다. 예산을 확인하세요.
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                    } else if (sch.schCate == '수입') {
                        html += `
                          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
                            <a href="javascript:openDetailModal(${sch.schId});">
                              <div>
                                ${sch.schStartMonth}월 ${sch.schStartDate}일은 기다리던 ${sch.schContent}입니다. 야호! 월급의 50%는 저축하는 편이 좋아요.
                              </div>
                            </a>
                            <i class="bx bx-x" style="cursor: pointer;" onclick="deleteSch(${sch.schId});"></i>
                          </div>
                        `;
                    } 
                    
                });
                
            }


            $('#AlertListDiv').html(html);
        },
        error: (e) => {
            alert('가계부 알람 목록 전송 실패');
        }
    });
}