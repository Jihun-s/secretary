/**
 * 옷장 페이지
 */
$(document).ready(function(){
	
	let closetNum = 0; //  전체 옷장에서 찾기
	let dataValue = new Array(8);
	$.ajax({
		url:'chartValue',
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
		},
		error:function(e){
			console.log(JSON.stringify(e));
		}			
	})	
	
  const ctx = document.getElementById('myChart');
  const data = {
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
  						}]
	};
				
  new Chart(ctx, {
    type: 'doughnut',
    data: data,
	  options: {
  	  	plugins: {
    		title: {
        	display: true,
        	text: '전체 옷장',
      		}
    	}//plugins
  	  }//options 
  });
  
  
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
	//옷찾기 버튼 클릭하면 clothesSearch 함수실행
	$("#clothesSearchbtn").on('click',clothesSearch);

	let category = opener.$('#clothesCategoryForSearch option:selected').val();
	let size;				
	if(category == 'top'){
		category = opener.$('#topCategory option:selected').val();
	} else if(category == 'bottom'){
		category = opener.$('#bottomCategory option:selected').val();
	} else if(category == 'clothesOuter'){
		category = opener.$('#outerCategory option:selected').val();
	} else if(category == 'dress'){
		category = opener.$('#dressCategory option:selected').val();
	} else if(category == 'shoes'){
		//신발사이즈 체크된 값
		size = opener.$("input:checkbox[name='shoesSizeAll']:checked").val();
		if(size==undefined){
		size = opener.$("input[name='shoesForSearch']").val();
		}
		category = opener.$('#shoesCategory option:selected').val();
	} else if(category == 'bag'){
		category = opener.$('#bagCategory option:selected').val();
	} else if(category == 'accessory'){
		category = opener.$('#accessoryCategory option:selected').val();
	} else if(category == 'etc'){
		category = opener.$('#etcCategory option:selected').val();
	}
	//신발이 아닌경우
	if(size==undefined){
		size = opener.$('#clothesSizeForSearch option:selected').val();
	}	 
	console.log(category);
	console.log(size);
	
	// 소재 material
	let material = opener.$('#materialListForSearch option:selected').val();
	console.log(material);

	// 계절 seasonArr
	const seasonArr = [];
	var seasonChecked = opener.$("input:checkbox[name='seasonsForSearch']:checked");
	$(seasonChecked).each(function(){
		seasonArr.push($(this).val());
	}); 		
	console.log(seasonArr);
	console.log(typeof(seasonArr));

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
					str += '<a onclick="readClothes('+n.closetNum+','+clothesNum+')"><img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
		
});//document.ready 끝

	
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
		
		let closetNum = 0; // 스트링에서 정수형으로 변환
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
					str += '<a onclick="readClothes('+n.closetNum+','+clothesNum+')"><img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
	}
	
	
	//의류 자세히보기
	function readClothes(closetNum, clothesNum){
		console.log(closetNum);
		console.log(clothesNum);
		$.ajax({
			url:'readClothes',
			type:'get',
			data:{closetNum: closetNum, clothesNum: clothesNum},
			dataType:'json',
			success:function(clothes){
				//분류, 소재, 계절 한글로 변환작업
				const translatedCategory = categoryMapping[clothes.clothesCategory] || clothes.clothesCategory;
				const translatedMaterial = materialMapping[clothes.clothesMaterial] || clothes.clothesMaterial;
				let seasonresult = '';
				if(!clothes.clothesSeasons){
					seasonresult='해당 없음';
				} else if(clothes.clothesSeasons.includes(',')){
					let inputSeasonArray = clothes.clothesSeasons.split(',').map(season => season.trim());
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
					seasonresult = seasonMapping[clothes.clothesSeasons] || clothes.clothesSeasons;
				}
				
				let imgStr =  '<img	src="../closet/clothesDownload?closetNum='+clothes.closetNum+'&clothesNum='+clothes.clothesNum+'">'
				let str = '<br><table><tr>\
							<td><button class="btn-pink">카테고리</button><td>\
							<td>&nbsp;&nbsp;'+translatedCategory+'</td>\
							<td>&nbsp;&nbsp;'+ translatedMaterial+'</td>\
							<td>&nbsp;&nbsp;'+seasonresult+'</td>\
							<td>&nbsp;&nbsp;'+clothes.clothesSize+'</td></tr>'
				let footer = '<br><button class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255); float:left"\
								onclick="laundryIn('+clothes.closetNum+','+clothes.clothesNum+')">세탁물 체크</button>\
								<button class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255); float:right"\
								onclick="ToInCloset('+clothes.closetNum+')">해당 옷장 보러가기</button>'

				$('#IMGdetail').html(imgStr);
				$('#InfoDetail').html(str);
				$('#InfoFooter').html(footer);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		}) //의류정보 읽어오기
		
		
		$.ajax({
			url:'howToManageClothes',
			type:'get',
			data:{closetNum: closetNum, clothesNum: clothesNum},
			dataType:'json',
			success:function(manageTip){
				console.log('howToManageClothes 매핑')
				let manageTipStr = '<tr><td><button class="btn-pink">관리방법</button></td>\
				<td colspan="4">&nbsp;&nbsp;'+manageTip.howToWash+'&nbsp;'+manageTip.howToKeep+'</td></tr></table>';
				$('#ManageDetail').html(manageTipStr); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})//관리정보 읽어오기
		
	}//의류 자세히보기


	//의류 세탁물 체크
	function laundryIn(closetNum, clothesNum){
		$.ajax({
			url:'laundryIn',
			type:'get',
			data:{closetNum: closetNum, clothesNum:clothesNum},
			success:function(){
				location.reload(true);				
			},
			error:function(e){
				alert(JSON.stringify(e));
			}						
		})		
	}
	
	//해당 옷장으로 이동
	function ToInCloset(closetNum){
		window.open('../closet/InCloset?closetNum='+closetNum);
	}

	const categoryMapping = {
    'Tshirt': '티셔츠', 'blouse': '블라우스/셔츠', 'sweatshirt': '맨투맨/후디', 'knitwear': '니트',
    'skirt': '치마', 'pants': '바지', 'jeans': '청바지', 'trainingPants': '트레이닝/조거',
    'coat': '코트', 'jacket': '자켓/점퍼', 'paddedJacket': '패딩', 'zipupHoodie': '후드집업', 'cardigan': '가디건/베스트',
    'miniDress': '미니원피스', 'longDress': '롱원피스',
    'sneakers': '운동화', 'formalShoes': '구두', 'boots': '부츠', 'sandals': '샌들',
    'backpack': '백팩', 'totebag': '숄더/토트백', 'crossbodybag': '크로스백', 'clutchbag': '클러치',
    'hat': '모자', 'socks': '양말', 'jewelryOrWatch': '쥬얼리/시계', 'scarf': '머플러/스카프', 'belt': '벨트', 'accessoryEtc': '기타',
    'innerwear': '이너웨어', 'sleepwear': '잠옷', 'swimsuit': '수영복'
	};
	
	const materialMapping = {
    'none': '해당 없음', 'cotton': '면', 'linen': '린넨',
    'polyester': '폴리에스테르', 'denim': '데님', 'knit': '니트',
    'wool': '울', 'acryl': '아크릴', 'corduroy': '코듀로이',
    'silk': '실크', 'woolen': '모직', 'nylon': '나일론', 'suede': '스웨이드',
    'leather': '가죽', 'rayon': '레이온', 'oxford': '옥스퍼드',
    'napping': '기모'
	};
	
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