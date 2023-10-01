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
            console.log("받은 데이터:", JSON.stringify(data));
            
            // 데이터 없음 
            if (!data || jQuery.isEmptyObject(data) || !data.EXPENSESUMMONTH) {
                console.error("받아온 해시맵이 비어있어요:", data);
                $('#sumExpenseMonth').html("0");
                
                const noDataHTML = `
                    <img src="https://cdn3.iconfinder.com/data/icons/eco-tech/512/10_Circular_Economy.png" alt="noCashbookData" style="width: 15rem; height: 15rem;" />
                    <div class="mt-3 mb-3">
                        <p>이번 달 가계부 데이터가 존재하지 않습니다.</p>
                        <p>내역을 입력하러 가볼까요?</p>
                        <a href="/secretary/cashbook/trans">
                            <button type="button" class="btn btn-primary">
                                가계부 내역 바로가기
                            </button>
                        </a>
                    
                    </div>    
                    
                    
                
                    `;

                $('#donutDiv').html(noDataHTML);

            } 
            // 데이터 있음 
            else {
                $('#sumExpenseMonth').html(data.EXPENSESUMMONTH.toLocaleString('en-US'));
            }
        },
        error: (e) => {
            console.error("총수입 총지출 전송 실패:", JSON.stringify(e));
        }
        
    });
}