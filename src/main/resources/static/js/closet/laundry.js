/**
 * 옷장 페이지
 */
$(document).ready(function(){
		const ps = new PerfectScrollbar('#whatsInCloset');
		$('#laundryAllOut').on('click',laundryAllOut);
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


// !!!!!!!!!!!!!!!!!!			차트 그리기			!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	let laundryCheck = true;
	let closetNum = 0;
	let dataValue = new Array(8);
	$.ajax({
		url:'chartValue',
		type:'get',
		data:{closetNum: closetNum, clothesLaundry: laundryCheck},
		dataType:'json',
		success:function(valueList){
			console.log(valueList);
			console.log(typeof(valueList));
			console.log(valueList.ACCESSORYCATEGORYCOUNT);
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
	})
	
	
// !!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		$.ajax({
			url:'inCloset',
			type:'get',
			data:{closetNum : closetNum, clothesLaundry: laundryCheck},
			dataType:'json',
			success:function(list){
				let str ='';
				let laundryCnt = 0; //세탁물 갯수
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str += '<div class="clothesList">\
					<a onclick="readClothes('+n.closetNum+','+clothesNum+')">\
					<img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'">\
					</div>';
					laundryCnt += 1;
				});
				if(str){
					$('#whatsInCloset').html(str); 
				}
				
				let proVal = (laundryCnt/50) * 100; 
				let proStr = '<div class="progress-bar" role="progressbar" style="width:'+proVal+'%; \
				background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255);" \
				aria-valuenow="'+proVal+'" aria-valuemin="0" aria-valuemax="50"></div>';
				let cntStr = '<p>세탁물 '+laundryCnt+'개가 쌓여있어요</p>';
				
				$('#progessDetail').html(proStr);
				$('#laundryDetail').html(cntStr);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})				
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	
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
			responsive: false,
  	  		plugins: {
    		title: {
        		display: true,
        		text: '세탁바구니',
      				}
    			}//plugins
  	  		}//options 
  		});//new Chart 
 }//function chartDraw
 	
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
				const manageTip = howtomanageMapping[clothes.clothesMaterial] || clothes.clothesMaterial;
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
				let str = '<br><br><ul>\
							<li><button class="btn-pink" style="cursor:auto;">카테고리</button><li>\
							<li>&nbsp;&nbsp;'+translatedCategory+'</li>\
							<li>&nbsp;&nbsp;'+ translatedMaterial+'</li>\
							<li>&nbsp;&nbsp;'+seasonresult+'</td>\
							<li>&nbsp;&nbsp;'+clothes.clothesSize+'</li></ul>\
							<br><ul><li><button class="btn-pink" style="cursor:auto;">착용횟수</button></li>\
							<li>&nbsp;&nbsp;'+clothes.clothesPutOnCnt+'번</li></ul><br>\
							<ul><li><button class="btn-pink" style="cursor:auto;">관리방법</button>&nbsp;&nbsp;'+manageTip+'</li></ui><br>'
				let footer = '<br><div id="clothesFooter"><button class="btn btn-primary" style="background-color: rgba(223,132,166,255); border-color: rgba(223,132,166,255); float:right"\
								onclick="laundryOut('+clothes.closetNum+','+clothes.clothesNum+')">옷장으로 보내기</button></div>'
							

				$('#IMGdetail').html(imgStr+str+footer);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		}) //의류정보 읽어오기
		
	}
	
	function laundryAllOut(){
		let res = confirm('세탁바구니를 비우시겠어요?');
		if(res){
			$.ajax({
				url:'laundryOut',
				type:'get',
				data:{closetNum:0, clothesNum:0},
				success:function(){
					location.reload(true);
				},
				error:function(e){
					alert(JSON.stringify(e));
				}			
			});	
		}//if문
	}
	
	function laundryOut(closetNum,clothesNum){
		$.ajax({
			url:'laundryOut',
			type:'get',
			data:{closetNum:closetNum, clothesNum:clothesNum},
			success:function(){
				location.reload(true);
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		});	
	}
	
	
	

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 옷 검색 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
		
		let laundryCheck = true;
		let closetNum = 0;
		$.ajax({
			url:'inCloset',
			type:'get',
			traditional:true,
			data:{closetNum: closetNum, category:category, size:size
				,seasonArr: seasonArr, material:material, clothesLaundry: laundryCheck},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					let clothesNum = parseInt(n.clothesNum);
					str +='<div class="clothesList"><a onclick="readClothes('+n.closetNum+','+clothesNum+')"><img src="../closet/clothesDownload?closetNum='+n.closetNum+'&clothesNum='+clothesNum+'"></a></div>';					
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
	}
	
	
//!!!!!!!!!!!!!!!!!!!!!!!!!!!! 옷 검색 애니메이션 효과 !!!!!!!!!!!!!!!!!!!!!!!!!1	
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
	
	
//!!!!!!!!!!!!!!!!!!!!!!     카테고리 맵핑   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!	
	const howtomanageMapping = {
    'none': '해당 없음', 'cotton': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 밝은 색과 진한 색을 분리하여 세탁합니다. 햇빛에 오래 노출하지 않고, 그늘에서 보관하며 공기 순환을 유지합니다.', 
    'linen': '손세탁이나 기계 세탁 모두 가능하며, 따뜻한 물을 사용합니다. 세탁 시 드라이어 사용을 피하고, 그늘에서 건조합니다. 린넨은 다림질 시 미지근한 상태에서 다림질해야 합니다.',
    'polyester': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질이 필요할 경우 낮은 열로 다림질합니다.', 
    'denim': '데님은 기계 세탁이 가능하며, 내부를 바깥으로 뒤집어서 세탁합니다. 드라이어 사용을 피하고, 건조할 때 태양에 직사광선을 피합니다. 다림질은 필요하지 않습니다.',
    'knit': '손세탁이나 기계 세탁 중 선택할 수 있으며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 수평으로 뉘어뜨려서 건조합니다. 낮은 열로 뒤집어서 다림질합니다.',
    'wool': '손세탁을 권장하며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 수평으로 뉘어뜨려서 건조합니다. 낮은 열로 다림질하며, 스팀 다림질이 필요할 수 있습니다.',
    'acryl': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.', 
    'corduroy': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피하고, 건조할 때 털을 다듬어 줍니다. 다림질 시 낮은 열로 다림질합니다.',
    'silk': '손세탁을 권장하며, 차가운 물을 사용합니다. 드라이어 사용을 피하고, 그늘에서 건조합니다. 다림질 시 낮은 열로 다림질하며, 실크 제품을 뒤집어서 다림질합니다.',
    'woolen': '드라이클리닝을 권장하며, 손세탁 시 차가운 물을 사용합니다. 드라이어 사용을 피하고, 건조할 때 털을 다듬어 줍니다. 낮은 열로 뒤집어서 다림질합니다.',
    'nylon': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.', 
    'suede': '스웨이드는 물과 습기에 민감하므로, 특수한 스웨이드 브러시를 사용하여 세탁합니다.',
    'leather': '가죽 제품은 특수한 관리가 필요하므로 전문적인 가죽 청소제와 관리제를 사용합니다. 습기와 물을 피하고, 직사광선에 노출을 피합니다.', 
    'rayon': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피합니다. 다림질 시 낮은 열로 다림질합니다.', 
    'oxford': '기계 세탁이 가능하며, 따뜻한 물을 사용합니다. 드라이어 사용을 피합니다. 다림질 시 낮은 열로 다림질합니다.',
    'napping': '기계 세탁이 가능하며, 차가운 물을 사용합니다. 드라이어 사용이 가능하나, 낮은 열로 설정합니다. 다림질은 필요하지 않습니다.'		
	}

	const categoryMapping = {
    'Tshirt': '티셔츠',
    'blouse': '블라우스/셔츠',
    'sweatshirt': '맨투맨/후디',
    'knitwear': '니트',
    'skirt': '치마',
    'pants': '바지',
    'jeans': '청바지',
    'trainingPants': '트레이닝/조거',
    'coat': '코트',
    'jacket': '자켓/점퍼',
    'paddedJacket': '패딩',
    'zipupHoodie': '후드집업',
    'cardigan': '가디건/베스트',
    'miniDress': '미니원피스',
    'longDress': '롱원피스',
    'sneakers': '운동화',
    'formalShoes': '구두',
    'boots': '부츠',
    'sandals': '샌들',
    'backpack': '백팩',
    'totebag': '숄더/토트백',
    'crossbodybag': '크로스백',
    'clutchbag': '클러치',
    'hat': '모자',
    'socks': '양말',
    'jewelryOrWatch': '쥬얼리/시계',
    'scarf': '머플러/스카프',
    'belt': '벨트',
    'accessoryEtc': '기타',
    'innerwear': '이너웨어',
    'sleepwear': '잠옷',
    'swimsuit': '수영복'
	};
	
	const materialMapping = {
    'none': '해당없음',
    'cotton': '면',
    'linen': '린넨',
    'polyester': '폴리에스테르',
    'denim': '데님',
    'knit': '니트',
    'wool': '울',
    'acryl': '아크릴',
    'corduroy': '코듀로이',
    'silk': '실크',
    'woolen': '모직',
    'nylon': '나일론',
    'suede': '스웨이드',
    'leather': '가죽',
    'rayon': '레이온',
    'oxford': '옥스퍼드',
    'napping': '기모'
	};
	
	const seasonMapping = {
    'spring': '봄', 'summer': '여름', 'fall': '가을', 'winter': '겨울'
	};