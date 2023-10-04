/** 
 * 모든 파일 공용 종&메뉴 알림 모달 탭
 */

/** 종이나 알림 메뉴 누르면 모달 띄우기  */
document.addEventListener('DOMContentLoaded', function() {

  // 충돌 방지
  var $j = jQuery.noConflict();

  /** 알림 모달 여는 함수 */
  function openAlertModal() {
    var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
    alertModal.show();
  }

  // 종 아이콘
  var bellIcon = document.querySelector('.bx-bell');
  if(bellIcon) {
    bellIcon.addEventListener('click', openAlertModal);
  }

  // 알림 메뉴 
  var alertMenu = document.getElementById('openAlertModalMenu');
  if(alertMenu) {
    alertMenu.addEventListener('click', openAlertModal);
  }
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
        laundryCntStr += '<p> 세탁하러 가시는건 어떠신가요? <br> 세탁물이 <b>'+laundryCnt+'</b>개 쌓여있어요.</p>';
        $('#alertContent').html(laundryCntStr);
        $('.alertContent').html(laundryCntStr);
        }else{
          laundryCntStr += '<p>세탁물이 20개 미만입니다. <br> 알림이 없습니다. <p>';
          $('#alertContent').html(laundryCntStr);
          $('.alertContent').html(laundryCntStr);
        } 
      },
      error:function(e){
        alert(JSON.stringify(e));
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