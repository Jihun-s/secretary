/** 
 * 모든 파일 공용 종&메뉴 알림 모달 탭
 */

/** 종이나 알림 메뉴 누르면 모달 띄우기  */
$(document).ready(function() {
    /** 알림 모달 여는 함수 */
    function openAlertModal() {
      $('#alertModal').modal('show');
    }

    // 종 아이콘
    var bellIcon = $('.bx-bell');
    if(bellIcon) {
      bellIcon.click(openAlertModal);
    }


    // 알림 메뉴 
    var alertMenu = $('#openAlertModalMenu');
    if(alertMenu) {
      alertMenu.click(openAlertModal);
    }

    // 모달 열릴 때
    $('#alertModal').on('show.bs.modal', function () {
      // 외부 드롭다운 비활성화
      $('.dropdown').prop('disabled', true);
    });

    // 모달 닫힐 때
    $('#alertModal').on('hidden.bs.modal', function () {
      // 외부 드롭다운 다시 활성화
      $('.dropdown').prop('disabled', false);
    });

    // 자동 Popper.js 적용 비활성화
    var dropdownElement = document.querySelector('.dropdown');
    dropdownElement.setAttribute('data-bs-no-auto', '');



});

/** 세탁물 필수알림 */
function closetPilsuAlert() {
    let closetNum = 0;
    let laundryCheck = true;

    $.ajax({
      url:'/secretary/closet/inCloset',
      type:'get',
      data:{closetNum : closetNum, clothesLaundry: laundryCheck},
      dataType:'json',
      success:function(list){
        let laundryCnt = 0; //세탁물 갯수
        $(list).each(function(i,n){
          laundryCnt += 1;
        });
        
        let proVal = (laundryCnt/30) * 100; 
        let proStr = '<div class="progress-bar" role="progressbar" style="width:'+proVal+'%; \
        background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
        aria-valuenow="'+proVal+'" aria-valuemin="0" aria-valuemax="30"></div>';
        $('#progessDetail').html(proStr);
        $('#laundryCntDetail').html('<p>세탁바구니에 세탁물이 '+laundryCnt+'개 쌓여있어요</p>')
        
        var now = new Date();	// 현재 날짜 및 시간
        var month = now.getMonth() + 1;
        var date = now.getDate();
        let dateStr = month+'월 '+date+'일 알림입니다.</p>';
        $('#dateAlert').html(dateStr);
        let laundryCntStr = '';
        if(laundryCnt>=20){
        laundryCntStr += `
        <small class="text-light fw-semibold mb-2">${dateStr}</small>
        <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
          <a href="javascript:openDetailModal(0);">
            <div>
              세탁하러 가시는 건 어떠신가요? 세탁물이 <b>${laundryCnt}</b>개 쌓여있어요.
            </div>
          </a>
        </div>
        `;      

        }else{
          laundryCntStr += `
          <small class="text-light fw-semibold mb-2">${dateStr}</small>
          <div class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" style="border: none;">
            <a href="javascript:openDetailModal(0);">
              <div>
              세탁물이 20개 미만입니다. 알림이 없습니다.
              </div>
            </a>
          </div>
          `;            
        } 

        $('#alertContent').html(laundryCntStr);
        $('.alertContent').html(laundryCntStr);
        
      },
      error:function(e){
        // console.log(JSON.stringify(e));
      }			
    })	
}


/** 퍼펙트 스크롤바 */
const containers = [
    document.querySelector('#mainAlertDiv-modal'),
    document.querySelector('.tab-content'),
    document.querySelector('#alertPillCloset-modal'),
    document.querySelector('#alertPillCashbook-modal'),
    document.querySelector('#navs-pills-justified-home-modal'),
    document.querySelector('#navs-pills-justified-goods-modal')
  ].filter(el => el !== null); 

  const options = {
      wheelSpeed: 1,
      wheelPropagation: true,
  };

  containers.forEach(container => {
      new PerfectScrollbar(container, options);
  });