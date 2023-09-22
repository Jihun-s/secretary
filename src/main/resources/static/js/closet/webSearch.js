/**
 * 의류등록 -> 웹에서 찾기
 */

function pagingFormSubmit(currentPage) {
	let form = document.getElementById('pagingForm');
	var page = document.getElementById('page');
	page.value = currentPage;
	form.submit();
}

function sendImageToParent(imgUrl){
	console.log(imgUrl);
	window.opener.receiveImage(imgUrl);
	window.close();
}


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
		//$("#clothesSearchbtn").on('click',clothesSearch); //옷찾기 버튼 클릭하면 clothesSearch 함수실행
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기 끝

// !!!!!!!!!!!!!!!!			의류목록 출력			!!!!!!!!!!!!!!!!!
/*		$.ajax({
			url:'ClothesFromStoreList',
			type:'get',
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let ImgSrc = n.clothesFromStoreImg;
					str +='<div>\
							<img src="../closet/clothesFromStoreDownload?clothesFromStoreImg='+ImgSrc+'">\
							</div>';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})		*/
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



		
});//document.ready 끝
	

/*	function clothesSearch(){
		//console.log();
		// 카테고리 category, 사이즈 size
		let category = $('#clothesCategoryForSearch option:selected').val();
		let size;				
		if(category == 'top'){
			category = $('#topCategory option:selected').val();
		} else if(category == 'bottom'){
			category = $('#bottomCategory option:selected').val();
		} else if(category == 'clothesOuter'){
			category = $('#outerCategory option:selected').val();
		} else if(category == 'dress'){
			category = $('#dressCategory option:selected').val();
		} else if(category == 'shoes'){
			//신발사이즈 체크된 값
			size = $("input:checkbox[name='shoesSizeAll']:checked").val();
			if(size==undefined){
				size = $("input[name='shoesForSearch']").val();
			}
			category = $('#shoesCategory option:selected').val();
		} else if(category == 'bag'){
			category = $('#bagCategory option:selected').val();
		} else if(category == 'accessory'){
			category = $('#accessoryCategory option:selected').val();
		} else if(category == 'etc'){
			category = $('#etcCategory option:selected').val();
		}
		//신발이 아닌경우
		if(size==undefined){
				size = $('#clothesSizeForSearch option:selected').val();
		}	 
		console.log(category);
		console.log(size);
		
		// 소재 material
		let material = $('#materialListForSearch option:selected').val();
		console.log(material);

		// 계절 seasonArr
		const seasonArr = [];
		var seasonChecked = $("input:checkbox[name='seasonsForSearch']:checked");
		$(seasonChecked).each(function(){
			seasonArr.push($(this).val());
		}); 		
		console.log(seasonArr);
		console.log(typeof(seasonArr));
		
		closetNum = parseInt(closetNum); // 스트링에서 정수형으로 변환
		$.ajax({
			url:'inCloset',
			type:'get',
			traditional:true,
			data:{closetNum: closetNum, category:category, size:size
				,seasonArr: seasonArr, material:material},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str += '<div><a onclick="readClothes('+n.closetNum+','+clothesNum+')"><img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'"></div>';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
	}*/
	
	

	
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