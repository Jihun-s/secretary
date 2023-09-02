/**
 * 옷장 페이지
 */
$(document).ready(function(){
	
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
		
		//옷찾기에서 분류를 선택하면 categoryFunction함수 실행	
		$("#clothesCategoryForSearch").on('change',categoryFunction);
		
		//(의류)등록버튼을 클릭하면 insertClothes함수 실행
		$('#insertClothesbtn').on('click', insertClothes);

		//편집버튼 누르면 editIMG함수 실행
		$('#editIMGbtn').on('click', editIMG);
		//웹에서 찾기 버튼을 누르면 webSearch함수 실행	
		$('#webSearchbtn').on('click', webSearch);

// !!!!!!!!!!!!!!!!!!!!!!!!!!!옷장안에 의류목록 출력!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		closetNum = parseInt(closetNum); // 스트링에서 정수형으로 변환
		$.ajax({
			url:'inCloset',
			type:'get',
			data:{closetNum: closetNum},
			dataType:'json',
			success:function(list){
				let str ='';
				$(list).each(function(i,n){
					str +='<img src="../closet/clothesDownload?closetNum='+closetNum+'&clothesNum='+n+'">';
				});
				$('#whatsInCloset').html(str); 
			},
			error:function(e){
				alert(JSON.stringify(e));
			}			
		})
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


		//카테고리에서 신발종류를 선택하지않으면, 신발사이즈는 보이지않게 숨기기
		$('#shoesSize').hide(); 
		//카테고리에서 신발종류를 선택하면 옷사이즈 사라지고 신발사이즈가 보임
		$('#clothesCategory').change(function(){
			var result = $('#clothesCategory option:selected').val();
			if (result == 'sneakers' || result == 'formalShoes' || result == 'boots' || result == 'sandals'){
				$('#clothesSize').hide();
				$('#shoesSize').show();
			} else {
				$('#clothesSize').show();
				$('#shoesSize').hide();
			}
		}) 
		
		
		$('#insertClothesbtn').css('visibility','hidden'); //(의류)등록버튼: 의류사진 첨부하기 전에는 숨기기
		const imageInput = document.getElementById("uploadIMG"); //input file태그 의류사진 등록버튼
		const imagePreview = document.getElementById("imagePreview"); //첨부한 사진 미리보기 div영역
		//사진등록 버튼을 클릭해서 이미지 첨부하면, 미리보기가 실행됨
		imageInput.addEventListener("change", function() {
		  const selectedFile = imageInput.files[0];
		  if (selectedFile) {
		    const reader = new FileReader();

		    reader.onload = function(event) {
		      const imageUrl = event.target.result;
		      const imageElement = document.createElement("img");
		      imageElement.setAttribute("src", imageUrl);
		      imageElement.setAttribute("alt", "Image Preview");
		      imageElement.setAttribute("style", "max-width: 100%; max-height: 300px;");
		      
		      imagePreview.innerHTML = "";
		      imagePreview.appendChild(imageElement);
		      $('#insertClothesbtn').css('visibility','visible'); //(의류)등록버튼 나타나기
		    }

		    reader.readAsDataURL(selectedFile);
		  } 
		});
		
		
	});//document.ready 끝
	
	//사진 편집여부 체크하는 변수
	let imgEditCheck = 0;
	
	// editIMGbtn 누르면 실행되는 함수: 사진편집+미리보기 기능
	function editIMG(){
		const imageInput = document.getElementById("uploadIMG");
		const selectedFile = imageInput.files[0];
		if (!selectedFile) {
			alert("사진을 등록해주세요");
			return;
		}
        const formData = new FormData();
        formData.append('image', selectedFile);
       	
        //서버에 사진편집 요청보내기
        fetch('processImage', {
            method: 'POST',
            body: formData
        })
        .then(response => response.blob())
        .then(blob => {
            const image = new Image();
            image.src = URL.createObjectURL(blob);
            imagePreview.innerHTML = "";
            imagePreview.appendChild(image);
        })
        .catch(error => {
            console.error('Error:', error);
        });
        
        imgEditCheck = 1; //사진편집여부 체크
	}
	
	
	//(의류)등록 insertClothesbtn 누르면 실행되는 함수 
	function insertClothes(){
		let originalFileName = document.getElementById("uploadIMG").files[0].name; //사용자가 첨부한 파일이름, clothesOriginalFile의 값

		let blobIMG;//uploadFile 값으로 사용할 변수
		if(!imgEditCheck){// 사용자가 편집안한 사진을 의류등록할 경우
			blobIMG = document.getElementById("uploadIMG").files[0];
		}
		
		let category = $('#clothesCategory option:selected').val(); //분류
		let material = $('#materialList option:selected').val();	//소재

		//계절 배열변수에 담기
		const seasonArr = [];
		var seasonChecked = $("input:checkbox[name='seasons']:checked");
		$(seasonChecked).each(function(){
			seasonArr.push($(this).val());
		}); 
		
		//옷이면 옷사이즈, 신발이면 신발사이즈 가져오기
		let size;
		var result = $('#clothesCategory option:selected').val();
		if (!(result == 'sneakers') && !(result == 'formalShoes') && !(result == 'boots') && !(result == 'sandals')){
			size = 	$("select[name='clothesSize'] option:selected").val();
		} else {
			size = $("input[name='shoesSize']").val();
		}
		
		closetNum = parseInt(closetNum);// 스트링에서 정수형으로 변환
		familyId = parseInt(familyId);// 스트링에서 정수형으로 변환
		//폼데이터에 넣을 key-value값들
		const clothesObj = {
			familyId : familyId,
			closetNum : closetNum,
			clothesMaterial : material,
			clothesCategory	: category,
			clothesSeasons : seasonArr,
			clothesSize : size,
			clothesOriginalFile : originalFileName,
			uploadFile : blobIMG,
			clothesEditcheck : imgEditCheck,
		}		
		let formData = new FormData();
		for (let key in clothesObj){//for문으로 폼데이터에 값 전달
			formData.append(key, clothesObj[key])			
		}
		let entries = formData.entries();
		for (const pair of entries) {//formData값 콘솔로 확인
		    console.log(pair[0]+ ', ' + pair[1]); 
		}
		
		//fetch로 서버에 의류등록 요청보내기
		fetch('insertClothes',{
			method:'POST',
			body: formData
		})
		.then(response => response.json())
        .then(data => {
        	
        })
        .catch(error => {
            console.error('Error:', error);
        });  
		
		//옷등록 완료했으면 새로고침
		location.reload(true);

	}
	
	function categoryFunction(){
		//$("select[name='topCategory']").hide();
		//$("#topCategory").hide();
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
	function webSearch(){
		window.open("webSearch");
	}
