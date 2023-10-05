/**
 * 옷장 메인페이지
 */

 $(document).ready(function(){
	const ps = new PerfectScrollbar('#ManageCloset');
	const ps1 = new PerfectScrollbar('#navs-pills-justified-home');
	const ps2 = new PerfectScrollbar('#navs-pills-justified-profile');
	let closetNum = 0; //전체 옷장
	
// !!!!!!!!!!!!!!!!! 	알림 기능
  // 현재 날짜를 가져옵니다.
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  // 양력 2월 3일을 입춘으로 설정합니다.
  const springBegins = new Date(year, 1, 3); // 2월은 1을 기준으로 합니다.
  // 양력 5월 5일을 입하로 설정합니다.
  const summerBegins = new Date(year, 4, 5); // 5월은 4를 기준으로 합니다.
  // 양력 8월 7일을 입추로 설정합니다.
  const autumnBegins = new Date(year, 7, 7); // 8월은 7을 기준으로 합니다.
  // 양력 11월 7일을 입동으로 설정합니다.
  const winterBegins = new Date(year, 10, 7); // 11월은 10을 기준으로 합니다.

  // 현재 날짜가 어떤 절기와 일치하는지 확인하고 알림 표시
  if (
    currentDate.toDateString() === springBegins.toDateString() ||
    currentDate.toDateString() === summerBegins.toDateString() ||
    currentDate.toDateString() === autumnBegins.toDateString() ||
    currentDate.toDateString() === winterBegins.toDateString()
  ) {
    const seasonForAlert = getSeasonName(currentDate);
    let seasonStr = '<p>'+seasonForAlert+'입니다. 옷장을 정리해볼까요?</p>'
    $('#seasonAlert').html(seasonStr);
	}
  
	//$('.alert').hide();
// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	//dataValue 배열변수에 카테고리별 옷 개수 집어넣기
	let dataValue = new Array(8);
	$.ajax({
		url:'closet/chartValue',
		type:'get',
		data:{closetNum: closetNum},
		dataType:'json',
		success:function(valueList){
			dataValue[0] = valueList.TOPCATEGORYCOUNT;
			dataValue[1] = valueList.BOTTOMCATEGORYCOUNT;
			dataValue[2] = valueList.OUTERCATEGORYCOUNT;
			dataValue[3] = valueList.DRESSCATEGORYCOUNT;
			dataValue[4] = valueList.SHOESCATEGORYCOUNT;
			dataValue[5] = valueList.BAGCATEGORYCOUNT;
			dataValue[6] = valueList.ACCESSORYCATEGORYCOUNT;
			dataValue[7] = valueList.ETCCATEGORYCOUNT;
			
			chartDraw(dataValue);
		},
		error:function(e){
			console.log(JSON.stringify(e));
		}			
	})//ajax
// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	


	// 옷장 편집버튼 -> 수정,삭제 아이콘 숨어있다가 나타나기
	 $('.delCloset').hide();
	 $('.modifyCloset').hide();
	 $('#editClosetBtn').on('click',function(){
		$('.delCloset').toggle();
		$('.modifyCloset').toggle();			
	 })
		
	//옷장 추가버튼
	$('#insertClosetBtn').click(insertCloset); 
		
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	//옷찾기 분류에서 소분류 숨겨놓기
	$('#topCategory').hide();
	$('#bottomCategory').hide();
	$('#outerCategory').hide();
	$('#dressCategory').hide();
	$('#shoesCategory').hide();
	$('#bagCategory').hide();
	$('#accessoryCategory').hide();
	$('#etcCategory').hide();
		
	//옷찾기에서 신발사이즈 숨겨놓기
	$('#shoesSizeForSearch').hide();
		
	//옷찾기에서 분류를 선택하면 clothesSearchAnimation함수 실행	
	$("#clothesCategoryForSearch").on('change',clothesSearchAnimation);
		
	//옷찾기 버튼 클릭하면 전체옷장 의류목록 페이지로 이동
	$("#clothesSearchbtn").on('click',function(){
		window.open("../secretary/closet/AllCloset");
	});
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		
		
		
		
//!!!!!!!	세탁물 게이지 표시 & 필수 알림 표시 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		
		let laundryCheck = true;
		$.ajax({
			url:'closet/inCloset',
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
				}else{
			     laundryCntStr += '<p>세탁물이 20개 미만입니다. <br> 알림이 없습니다. <p>';
			     $('#alertContent').html(laundryCntStr);
				} 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})	
		
});//document.ready 끝

 function chartDraw(dataValue){
	
  let chartdata = {
  	labels: ['상의','하의','아우터','원피스','신발','가방','악세사리','기타'],
  	datasets: [{
    			label: '개수',
    			data: dataValue,
    			backgroundColor: [
					'rgb(244, 67, 54)',
					'rgb(255, 111, 0)',
					'rgb(255, 241, 118)',
					'rgb(220, 231, 117)',
      				'rgb(54, 162, 235)',
      				'rgb(186, 104, 200)',
      				'rgb(255, 99, 132)',
      				'rgb(255, 205, 210)',
    				],
    			hoverOffset: 4
  				}]//datasets
	};//let chartdata	 
	 
	let context = document.getElementById('myChart').getContext('2d');
 	window.myChart = new Chart(context, {
   			type: 'doughnut',
    		data: chartdata,
			options: {
			animation: false,
  	  		plugins: {
    		title: {
        		display: true,
        		text: '전체 옷장',
      				}
    			}//plugins
  	  		}//options 
  		});//new Chart 
 }//function chartDraw

function delCloset(closetNum){
	console.log(closetNum);
	Swal.fire({
   		title: '옷장을 삭제하시겠어요?',
   		text: '옷장 안에 저장된 옷들도 전부 삭제됩니다.',
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
				url:'closet/delCloset',
				type:'post',
				data:{closetNum: closetNum, familyId: familyId, userId: userid},
				success:function(){
					location.reload(true);
				},
				error:function(e){
					alert(JSON.stringify(e));
				}			
			});			
   		}
	});


}

function modifyCloset(closetNum){
	console.log(closetNum);
	let modifyStr = '<table><tr><td><input class="form-control" style="display:inline-block; width:72%;" type="text" placeholder="이름 (3자 이상)" id="closetNameForModify">\
								<button class="btn-pink" id="closetNameForModifyBtn">수정</button></td></tr>\
					<tr><td><img src="images/closetImg/wardrobe.png" class="wardrobeImg"></td></tr></table>'
	$('#ManageCloset').html(modifyStr);
	$('#closetNameForModifyBtn').on('click',function(){
		let n = $('#closetNameForModify').val();
   		if(n.length <=1 || n.length >= 7){
			alert('2글자 이상, 7글자 미만으로 입력해주세요');
			return;   
		}
		$.ajax({
			url:'closet/modifyCloset',
			type:'post',
			data:{closetNum:closetNum, familyId: familyId, userId: userid, closetName:n},
			success:function(){
				Swal.fire({
 				text: '옷장 수정 성공',
  				icon: 'success',
  				confirmButtonText: '닫기',
  				confirmButtonColor: 'rgba(223,132,166,255)',
  				iconColor: 'rgba(223,132,166,255)',
  				closeOnClickOutside : false
				}).then(function(){
				location.reload();
				});
			},
			error:function(e){
				alert(JSON.stringify(e));
			}
		}); //ajax 끝		
	}) //#closetNameForModifyBtn : click 함수 끝
}


function insertCloset(){
	
	let insertStr = '<table><tr><td id="plusClosetBtn"><img src="images/fridgeimg/PlusButton.png"></td></tr>\
							<tr><td><br><input type="text" id="closetNameForInsert" placeholder="옷장이름 입력 (3자 이상)"></td></tr></table>'
    $('#ManageCloset').html(insertStr);
    $('#plusClosetBtn').on('click',function(){
   		let n = $('#closetNameForInsert').val();
   		if(n.length <=1 || n.length >= 7){
			alert('2글자 이상, 7글자 미만으로 입력해주세요');
			return;   
		}
		let closetnum = 0;
   		familyId = parseInt(familyId);
		$.ajax({
			url:'closet/insertCloset',
			type:'post',
			data:{closetNum:closetnum, familyId: familyId, userId: userid, closetName:n},
			success:function(){
				Swal.fire({
 				text: '옷장 추가 성공',
  				icon: 'success',
  				confirmButtonText: '닫기',
  				confirmButtonColor: 'rgba(223,132,166,255)',
  				iconColor: 'rgba(223,132,166,255)',
  				closeOnClickOutside : false
				}).then(function(){
				location.reload();
				});
			},
			error:function(e){
				alert(JSON.stringify(e));
			}
		});
	})
}

// 계절 이름을 반환하는 함수
function getSeasonName(date) {
  const month = date.getMonth();
  if (month === 1) {
    return "입춘";
  } else if (month === 4) {
    return "입하";
  } else if (month === 7) {
    return "입추";
  } else if (month === 10) {
    return "입동";
  }
}

function clothesSearchAnimation(){
	var result = $('#clothesCategoryForSearch option:selected').val();
	if(result=='top'){
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();
		$('#topCategory').show();
	}else if(result =='bottom'){
		$('#topCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();			
		$('#bottomCategory').show();
	}else if(result =='clothesOuter'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();			
		$('#outerCategory').show();
	}else if(result =='dress'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();			
		$('#etcCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();			
		$('#dressCategory').show();
	}else if(result =='shoes'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();
		$('#clothesSizeForSearch').hide();
		
		$('#shoesSizeForSearch').show();
		$('#shoesCategory').show();
	}else if(result =='bag'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();	
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();					
		$('#bagCategory').show();
	}else if(result =='accessory'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#etcCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();			
		$('#accessoryCategory').show();
	}else if(result =='etc'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();			
		$('#etcCategory').show();			
	}else if(result== 'CategoryAll'){
		$('#topCategory').hide();
		$('#bottomCategory').hide();
		$('#outerCategory').hide();
		$('#dressCategory').hide();
		$('#shoesCategory').hide();
		$('#bagCategory').hide();
		$('#accessoryCategory').hide();
		$('#etcCategory').hide();		
		$('#shoesSizeForSearch').hide();
			
		$('#clothesSizeForSearch').show();				
	}
}