/**
 * 옷장 페이지
 */
$(document).ready(function(){
	
	let closetNum = 0; //  전체 옷장에서 찾기

// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	let dataValue = new Array(9);
	$.ajax({
		url:'styleDiary/chartValue',
		type:'get',
		data:{userId: userId},
		dataType:'json',
		success:function(valueList){
			console.log(valueList);
			dataValue[0] = valueList.OFFICE;
			dataValue[1] = valueList.GATHERING;
			dataValue[2] = valueList.DAILY;
			dataValue[3] = valueList.FRIEND;
			dataValue[4] = valueList.DATECOUNT;
			dataValue[5] = valueList.BREAK;
			dataValue[6] = valueList.EXERCISE;
			dataValue[7] = valueList.TRIP;
			dataValue[8] = valueList.ETCTPO;
			
			chartDraw(dataValue);
		},
		error:function(e){
			console.log(JSON.stringify(e));
		}			
	})	
// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	


	$('#styleSearchbtn').on('click', diarySearch);
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
	$("#clothesSearchbtn").on('click',clothesSearch); //옷찾기 버튼 클릭하면 clothesSearch 함수실행
//!!!!!!!!!!!!!!!!!!!!!! 옷 찾기  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!		

	$.ajax({
		url:'styleDiary/inStyleDiary',
		type:'get',
		data:{userId: userId},
		dataType:'json',
		success:function(list){
			let str ='';
			$(list).each(function(i,n){
				let styleNum = parseInt(n.styleNum);
				str +='<div><a onclick="readDiary('+styleNum+')">\
					<img src="../closet/styleDiary/styleDiaryDownload?styleNum='+styleNum+'&userId='+n.userId+'">\
						</a></div>';
			});
			$('#whatsInStyleDiary').html(str);
		},
		error:function(e){
			alert(JSON.stringify(e));
		}			
	})//ajax	

// !!!!!!!!!!!!!!!!!!!!!!!!!!!(코디등록) 옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$.ajax({
			url:'inCloset',
			type:'get',
			data:{closetNum: closetNum},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str +='<div><a onclick="deliverImg('+n.closetNum+','+clothesNum+')">\
					<img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">\
						   </a></div>';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})		
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!(코디등록) 옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
});//document.ready 끝



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!코디등록 imagePreview에 의류추가 미리보기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var imageIndex = 1;
var maxImages = 9;
var imageSlots = [];

function deliverImg(closetNum, clothesNum){
    console.log(closetNum);
    console.log(clothesNum);

    // 이미지 슬롯을 확인하고 비어있는 슬롯에 이미지를 추가합니다.
    for (var i = 0; i < maxImages; i++) {
        if (!imageSlots[i]) {
            addImageToSlot(i, closetNum, clothesNum);
            return;
        }
    }

    // 모든 슬롯이 이미지로 채워진 경우 알림을 표시합니다.
    alert('10개까지만 추가할 수 있어요~');
}

function addImageToSlot(slotIndex, closetNum, clothesNum) {
    var imageUrl = '../closet/clothesDownload?closetNum=' + closetNum + '&clothesNum=' + clothesNum;
    var imagePreview = document.querySelector('.imagePreview' + (slotIndex + 1));

    // 새로운 이미지 엘리먼트 생성
    var img = new Image();
    img.src = imageUrl;

    // 이미지를 현재 div에 추가
    imagePreview.appendChild(img);

    // 이미지 슬롯을 기록합니다.
    imageSlots[slotIndex] = img;
    
    // 이미지 클릭 이벤트 리스너 추가
    img.addEventListener('click', function () {
        // 이미지 삭제
        img.remove();
        // 슬롯을 비웁니다.
        imageSlots[slotIndex] = undefined;
    });
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!코디등록 imagePreview에 의류추가 미리보기 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


	
function styleCreate(){
	//계절 배열변수에 담기
	let seasonArr = [];
	var seasonChecked = $("input:checkbox[name='seasons']:checked");
	$(seasonChecked).each(function(){
		seasonArr.push($(this).val());
	}); 
	console.log(seasonArr);
	
	//TPO 변수
	let tpo = $("select[name='styleTPO'] option:selected").val();
	console.log(tpo);
	
	//사용자 스타일메모 변수
	let description = $("textarea[name='styleDescription']").val();
	console.log(description);
	
	//사용자가 추가한 의류 확인
	if(imageSlots.length == 0){
		alert('의류를 하나 이상 추가해주세요!');
		return;
	}
	
	
	let ImgToSend = [];
	for(var i = 0; i < maxImages; i++){
	 if(imageSlots[i]){	
	// 이미지 태그의 src 속성에서 closetNum과 clothesNum 추출
		var imageSrc = imageSlots[i].src;
		var closetNumRegex = /closetNum=(\d+)/;
		var clothesNumRegex = /clothesNum=(\d+)/;

		var closetNumMatch = imageSrc.match(closetNumRegex);
		var clothesNumMatch = imageSrc.match(clothesNumRegex);

		if (closetNumMatch && clothesNumMatch) {
   	 		var closetNum = closetNumMatch[1]; // 매치된 값에서 숫자 부분을 추출
   	 		var clothesNum = clothesNumMatch[1]; // 매치된 값에서 숫자 부분을 추출

   	 		console.log('closetNum:', closetNum);
   	 		console.log('clothesNum:', clothesNum);
   	 		ImgToSend.push({'closetNum':parseInt(closetNum), 'clothesNum':parseInt(clothesNum)})
		} else {
    	console.log('closetNum 또는 clothesNum을 추출할 수 없습니다.');
		}
	 }
	}//for문
	console.log(ImgToSend);
	
	$.ajax({
		url:'styleDiary/styleCreate',
		type:'post',
		traditional:true,
		data:{array: JSON.stringify(ImgToSend), //의류이미지
				styleSeasons : seasonArr, 		//계절 변수
				styleTPO : tpo,			 		//TPO 변수
				styleDescription:description, 	//메모 변수
				userId: userId}, 	
		success:function(){
			location.reload(true); // 성공했으면 새로고침
		},
		error:function(e){
			console.log(JSON.stringify(e));
		}			
	})//ajax
}

function diarySearch(){
	// 계절
	const seasonArrForDiary = [];
	var seasonChecked = $("input:checkbox[name='seasonsForDiarySearch']:checked");
	$(seasonChecked).each(function(){
		seasonArrForDiary.push($(this).val());
	}); 		
	console.log(seasonArrForDiary);
	console.log(typeof(seasonArrForDiary));	
	// TPO
	let tpoForDiary = $("select[name='styleTPOforSearch'] option:selected").val();
	console.log(tpoForDiary);
	// 메모
	let descriptionForDiary = $('#descriptionForSearch').val();
	console.log(descriptionForDiary);
	
	$.ajax({
		url:'styleDiary/inStyleDiary',
		type:'get',
		traditional:true,
		data:{userId: userId, seasonArr:seasonArrForDiary, 
			 styleTPO:tpoForDiary ,searchWord: descriptionForDiary},
		dataType:'json',
		success:function(list){
			let str ='';
			$(list).each(function(i,n){
				let styleNum = parseInt(n.styleNum);
				str +='<div><a onclick="readDiary('+styleNum+')">\
					<img src="../closet/styleDiary/styleDiaryDownload?styleNum='+styleNum+'&userId='+n.userId+'">\
						</a></div>';
			});
			$('#whatsInStyleDiary').html(str);
		},
		error:function(e){
			alert(JSON.stringify(e));
		}			
	})//ajax
}

function readDiary(styleNum){
	console.log('readDiary 실행');
	console.log(styleNum);
	$.ajax({
		url:'styleDiary/readDiary',
		type:'get',
		data:{styleNum: styleNum, userId: userId},
		dataType:'json',
		success:function(diary){
			const translatedTPO = tpoMapping[diary.styleTPO] || diary.styleTPO;
			let seasonresult = '';
			if(!diary.styleSeasons){
				seasonresult='해당 없음';
			} else if(diary.styleSeasons.includes(',')){
				let inputSeasonArray = diary.styleSeasons.split(',').map(season => season.trim());
				// 매핑된 결과를 담을 배열
				let translatedSeasons = [];

				// 각 사계절을 매핑하고 결과를 배열에 추가합니다.
				inputSeasonArray.forEach(inputSeason => {
   				 let translatedSeason = seasonMapping[inputSeason] || inputSeason;
    			 translatedSeasons.push(translatedSeason);
				 });
				seasonresult = translatedSeasons.join(', ');
			} else {
				//쉼표 없이 계절 하나일 경우
				seasonresult = seasonMapping[diary.styleSeasons] || clothes.clothesSeasons;
			}
			
			let DiaryImgStr = '<img src="../closet/styleDiary/styleDiaryDownload?styleNum='+styleNum+'&userId='+userId+'">';
			$('#IMGdetail').html(DiaryImgStr);
			let DiaryStr = '<br><table><tr>\
						<td><button class="btn-pink">카테고리</button><td>\
						<td>&nbsp;&nbsp;'+seasonresult+'</td>\
						<td>&nbsp;&nbsp;'+translatedTPO+'</td></tr>\
						<tr><td><button class="btn-pink">메모내용</button><td>\
						<td colspan="2">&nbsp;&nbsp;'+diary.styleDescription+'</td></tr>'
			$('#InfoDetail').html(DiaryStr);
			let footer = '<br><button type="button" class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
							onclick="deleteDiary('+styleNum+')"> 삭제 </button>\
						<button type="button" class="btn btn-primary"	style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
							onclick="openUpdateModal('+styleNum+')"> 수정 </button>'
		 	$('#InfoFooter').html(footer);						
		 },
		error:function(e){
			alert(JSON.stringify(e));
		}			
	})//ajax	
}

function clothesSearch(){
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
		
	let closetNum = 0; //  전체 옷장에서 찾기
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
				str += '<img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">';
			});
			$('#whatsInCloset').html(str); 
		},
		error:function(e){
			alert(JSON.stringify(e));
		}			
	})
}

function chartDraw(dataValue){
	
  let chartdata = {
  	labels: ['회사','모임','일상','친구','데이트','휴식','운동','여행', '기타'],
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
			responsive: false,
  	  		plugins: {
    		title: {
        		display: true,
        		text: 'TPO 통계',
      				}
    			}//plugins
  	  		}//options 
  		});//new Chart 
 }//function chartDraw

	const tpoMapping = {
		'office':'회사', 'gathering':'모임', 'daily':'일상',
		'friend':'친구', 'date':'데이트', 'break':'휴식',
		'exercise':'운동', 'trip':'여행', 'etcTPO':'기타',
	}

	const seasonMapping = {
    'spring': '봄', 'summer': '여름', 'fall': '가을','winter': '겨울'
	};

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