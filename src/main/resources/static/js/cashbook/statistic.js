$(document).ready(function() {
    setCurDate();
});


////////////////////////////////////////////////////////////////////////


/** 현재 날짜 심기 */
function setCurDate() {
    let date = new Date();
    let curYear = date.getFullYear();
    let curMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    let curDate = date.getDate().toString().padStart(2, '0');
    let curHour = date.getHours().toString().padStart(2, '0');
    let curMin = date.getMinutes().toString().padStart(2, '0');

    let curDateTime = `${curYear}-${curMonth}-${curDate} ${curHour}:${curMin}:00`;

    // alert(curYear + ' ' + curMonth + ' ' + curDate + ' ' + curDateTime);

    $('#curDateTime').val(curDateTime);
    $('#curYear').val(curYear);
    $('#curMonth').val(curMonth);
    $('#curDate').val(curDate);
    
    $('#nowYear').html(curYear);
    $('#nowMonth').html(curMonth);
}

////////////////////////////////////////////////////////////////

/** 월 대분류별 총지출 총수입 불러오기 */
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
            if (data == null || data == undefined) {
                $('#sumExpenseMonth').html("0");
                $('#sumIncomeMonth').html("0");
            } else {
                $('#sumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
                $('#sumIncomeMonth').html(data.INCOMESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: (e) => {
            console.log("총지출 총수입 실패:" + JSON.stringify(e));
        }
    });
}