/** 월 총 지출 불러오기 */
function sumExpenseMonth() {
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
            } else {
                $('#sumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: (e) => {
            console.log("3행 1열 총지출액 실패:" + JSON.stringify(e));
        }
    });
}