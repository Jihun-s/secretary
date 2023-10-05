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


	/* !!!!!!!!!!!!!!!    세탁물 필수알림   !!!!!!!!!!!!!!!!!!*/
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
	    
	    //날짜 정보 출력
	    var now = new Date();
	    var year = now.getFullYear();
	    var month = now.getMonth() + 1;
	    var date = now.getDate();
	    let dateStr = '<small class="text-light fw-semibold mb-2">'+year+'-'+month+'-'+date+'</small>';
	    $('#curDate').html(dateStr);
	    
	    //세탁 게이지
	    let proVal = (laundryCnt/30) * 100; 
	    let proStr = '<div class="progress-bar" role="progressbar" style="width:'+proVal+'%; \
	    background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
	    aria-valuenow="'+proVal+'" aria-valuemin="0" aria-valuemax="30"></div>';
	    $('#progessDetail').html(proStr);
	    
	    //세탁물 개수
	    let laundryCntStr = '';
	    if(laundryCnt>=20){
	    	laundryCntStr += `<p>세탁하러 가시는 건 어떠신가요? 세탁물이 <b>${laundryCnt}</b>개 쌓여있어요.</p>`;      
	    }else{
	       laundryCntStr += `<p>세탁물이 20개 미만입니다. 아직 세탁하지 않아도 됩니다.</p>`;            
	    }
	    $('#laundryCntDetail').html(laundryCntStr);
	    
	},error:function(e){
	        // console.log(JSON.stringify(e));
	  }			
	})	
	/* !!!!!!!!!!!!!!!    세탁물 필수알림 끝  !!!!!!!!!!!!!!!!!!*/
});



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