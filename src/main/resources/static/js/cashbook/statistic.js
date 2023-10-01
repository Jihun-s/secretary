/** 
 * 소비분석에 필요한 통계값 전송하는 .js  
 */


$(document).ready(function() {
    setCurDate();
    const ps = new PerfectScrollbar('#vertical-example');
});



////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 
////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY/////READY///// 



/** 현재 날짜 심기 */
function setCurDate() {
    let date = new Date();
    let curYear = date.getFullYear();
    let curMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    let curDate = date.getDate().toString().padStart(2, '0');
    let curHour = date.getHours().toString().padStart(2, '0');
    let curMin = date.getMinutes().toString().padStart(2, '0');

    let curDateTime = `${curYear}-${curMonth}-${curDate} ${curHour}:${curMin}:00`;

    //  alert(curYear + ' ' + curMonth + ' ' + curDate + ' ' + curDateTime);

    $('#curDateTime').val(curDateTime);
    $('#curYear').val(curYear);
    $('#curMonth').val(curMonth);
    $('#curDate').val(curDate);
    
    $('#nowYear').html(curYear);
    $('#nowMonth').html(curMonth);
}



/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////
/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////날짜/////



/** 도넛차트 - 월 대분류별 총지출 총수입 불러오기 */
/** 월 총 지출 불러오기 */
function sumInExMonth() {
    nowYear = new Date().getFullYear();
    nowMonth = new Date().getMonth()+1;

    // 총지출 총수입 가져오기 
    $.ajax({
        url: '/secretary/cashbook/trans/selectSumInEx',
        type: 'GET',
        data: { nowYear: nowYear, nowMonth: nowMonth },
        dataType: 'JSON',
        success: (data) => {
            console.log("받은 데이터:", JSON.stringify(data));
            
            const noExDataHTML = `
                <img src="https://cdn3.iconfinder.com/data/icons/eco-tech/512/10_Circular_Economy.png" alt="noCashbookData" style="width: 15rem; height: 15rem;" />
                <div class="mt-3 mb-3">
                    <p>이번 달 지출 거래내역이 존재하지 않습니다.</p>
                    <p>내역을 입력하러 가볼까요?</p>
                    <a href="/secretary/cashbook/trans">
                        <button type="button" class="btn btn-success">
                            가계부 내역 바로가기
                        </button>
                    </a>
                </div>    
            `;

            const noInDataHTML = `
            <img src="https://cdn3.iconfinder.com/data/icons/eco-tech/512/10_Circular_Economy.png" alt="noCashbookData" style="width: 15rem; height: 15rem;" />
            <div class="mt-3 mb-3">
                <p>이번 달 수입 거래내역이 존재하지 않습니다.</p>
                <p>내역을 입력하러 가볼까요?</p>
                <a href="/secretary/cashbook/trans">
                    <button type="button" class="btn btn-success">
                        가계부 내역 바로가기
                    </button>
                </a>
            </div>    
        `;

            // 수입 데이터 있는지 확인
            if (!data || jQuery.isEmptyObject(data) || !data.INCOMESUMMONTH) {
                console.error("이번달 수입 데이터 없음:", data);
                $('#donutIncomeDiv').html(noInDataHTML);
            } else {
                $('#sumIncomeMonth').html(data.INCOMESUMMONTH.toLocaleString('en-US'));
            }

            // 지출 데이터 있는지 확인 
            if (!data || jQuery.isEmptyObject(data) || !data.EXPENSESUMMONTH) {
                console.error("이번달 지출 데이터 없음:", data);
                $('#donutExpenseDiv').html(noExDataHTML);
            } else {
                $('#sumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: (e) => {
            console.error("총수입 총지출 데이터 서버 전송 실패:", JSON.stringify(e));
        }
        
    });
}




/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////
/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////도넛/////
/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////DONUT/////


/** 지름의 전당 - 최대&최다 지출한 소분류 카테고리 */
function mostCate2() {
    $.ajax({
        url: '/secretary/cashbook/trans/mostCate2',
        type: 'POST',
        data: { nowYear: curYear, nowMonth: curMonth },
        dataType: 'JSON',
        success: (data) => {
            // 최다(자주) 지출 카테고리
            let mostFreqCate2 = data.reduce((prev, curr) => 
                prev.transCount > curr.transCount ? prev : curr
            );

            // 최대(금액) 지출 카테고리
            let mostLgCate2 = data.reduce((prev, curr) => 
                prev.totalAmount > curr.totalAmount ? prev : curr
            );

            // 1위 제외하고 2, 3, 4위 찾기 
            let sortedByTransCount = [...data].filter(item => item !== mostFreqCate2).sort((a, b) => b.transCount - a.transCount);
            let top4ByTransCount = sortedByTransCount.slice(0, 3);

            let sortedByTotalAmount = [...data].filter(item => item !== mostLgCate2).sort((a, b) => b.totalAmount - a.totalAmount);
            let top4ByTotalAmount = sortedByTotalAmount.slice(0, 3);

            // html1 입력 
            let html1 = `
                        <div class="mb-4">
                            <img
                                src="../images/cashbookimg/12114068.png"
                                alt="medal1"
                                class="d-flex justify-content-center align-items-center"
                                style="width: 10rem; height: 10rem; margin: 0 auto;"
                            />
                            <h4 class="d-flex justify-content-center align-items-center">${mostFreqCate2.cate2Name}</h4>
                            <span class="d-flex justify-content-center align-items-center mb-4">이번 달 <mark>${mostFreqCate2.cate2Name}</mark>에 가장 자주 지출했어요.</span>
                        </div>
                    <table style="width:100%; text-align: center;">
                <tr>
            `;
                
            top4ByTransCount.forEach(trans => {
                html1 += `<td><h6 class="d-flex justify-content-center align-items-center">${trans.cate2Name}</h6><small>${trans.transCount}회</small></td>`;
            });
            html1 += `</tr></table></div>`;

            // html2 입력 
            let html2 = `
                        <div class="mb-4">
                            <img
                                src="../images/cashbookimg/12113938.png"
                                alt="medal2"
                                class="d-flex justify-content-center align-items-center"
                                style="width: 10rem; height: 10rem; margin: 0 auto;"
                            />
                            <h4 class="d-flex justify-content-center align-items-center mb-4">${mostLgCate2.cate2Name}</h4>
                            <span class="d-flex justify-content-center align-items-center">이번 달 <mark>${mostLgCate2.cate2Name}</mark>에 가장 많이 썼어요.</span>
                        </div>
                    <table style="width:100%; text-align: center;">
                <tr>
            `;
            
            top4ByTotalAmount.forEach(trans => {
                html2 += `<td><h6 class="d-flex justify-content-center align-items-center">${trans.cate2Name}</h6><small>총 ${trans.totalAmount.toLocaleString('en-US')}원</small></td>`;
            });
            html2 += `</tr></table></div>`;

            // html 입력
            $('#mostFreqDiv').html(html1);
            $('#mostLgDiv').html(html2);
        },
        error: (e) => {
            alert("최대최다 카테고리 전송 실패");
            console.log(JSON.stringify(e));
        }
    });
}



/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////
/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////
/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////지름의전당/////