/**
 * 옷장 메인페이지
 */

 $(document).ready(function(){
	 	
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
		
//!!!!!!!!!!!!!!!!!!! 세탁물 게이지 표시 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		
		let laundryCheck = true;
		let closetNum = 0;
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
				
				let proVal = (laundryCnt/50) * 100; 
				let proStr = '<div class="progress-bar" role="progressbar" style="width:'+proVal+'%; \
				background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
				aria-valuenow="'+proVal+'" aria-valuemin="0" aria-valuemax="50"></div>';
				$('#progessDetail').html(proStr);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})	
		
});//document.ready 끝

function delCloset(closetNum){
	console.log(closetNum);
	let res = confirm('옷장을 삭제하시겠어요? \n옷장 안에 저장된 옷들도 전부 삭제됩니다.');
	if(res){
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
	}//if문
}

function modifyCloset(closetNum){
	console.log(closetNum);
	let modifyStr = '<table><tr><td><input type="text" placeholder="옷장이름 (3자 이상)" id="closetNameForModify" style="width:72%;">\
								<button class="btn-pink" id="closetNameForModifyBtn">수정</button></td></tr>\
					<tr><td><img src="images/closetImg/wardrobe.png"></td></tr></table>'
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
				alert('옷장수정 성공');
				location.reload(true);
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
				alert('옷장추가 성공');
				location.reload(true);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}
		});
	})
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