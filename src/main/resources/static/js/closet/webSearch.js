/**
 * 의류등록 -> 웹에서 찾기
 */

function pagingFormSubmit(currentPage) {
	let form = document.getElementById('pagingForm');
	var page = document.getElementById('page');
	page.value = currentPage;
	form.submit();
}

/*let contentIndex = 0;
const contents = ["추가하고 싶은 옷을 클릭하세요! 의류 등록 모드입니다.", "어떤 옷으로 바꾸고 싶으세요? 의류 수정 모드입니다."];
function changeMode(){
	const contentDiv = document.querySelector('#changeMode');
    contentIndex = (contentIndex + 1) % contents.length; // 다음 내용으로 이동
    contentDiv.textContent = contents[contentIndex]; // 내용 변경
    console.log(contentIndex);	// 0이면 등록, 1이면 수정
    console.log(typeof(contentIndex));	// 0이면 등록, 1이면 수정
}*/
function InsertOrUpdate(imgUrl){
	const smallModal = new bootstrap.Modal(document.getElementById('smallModal'));
    smallModal.show();
		$.ajax({
			url:'readClothesFromStore',
			type:'get',
			data:{imgUrl: imgUrl},
			dataType:'json',
			success:function(clothes){
				let str = '<img src="../closet/clothesFromStoreDownload?clothesFromStoreImg='+clothes.clothesFromStoreImg+'">\
						<br><br><ul><li>'+clothes.clothesFromStoreBrand+'</li>\
						<li>'+clothes.clothesFromStoreName+'</li></ul>';
				$('#clothesFromStoreInfo').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})    
	$('#insertClothesBtn').on('click',function(){
		window.opener.receiveImage(imgUrl);
		window.close();
	})
	$('#updateClothesBtn').on('click',function(){
		window.opener.receiveImageForUpdate(imgUrl);
		window.close();
	})
}//의류 추가/수정 모달


$(document).ready(function(){

//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  
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
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기 끝
		
});//document.ready 끝
	

	
// !!!!!!!!!!!!!!!!!!!!!!!!! 옷 검색 애니메이션 효과 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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