
IndexedDB.checkDB();
IndexedDB.createSchema('id');
typeDisplay();

document.getElementById("b_insert").addEventListener("click", function(){
	var event = {
		//id:,
		type:a_type.value,
		company:a_company.value,
		depart:a_depart.value, 
		team:a_team.value, 
		posit:a_posit.value, 
		name:a_name.value, 
		job:a_job.value, 
		phone:a_phone.value, 
		cell:a_cell.value, 
		email:a_email.value, 
		etc:a_etc.value
	}
	console.log( event );
    IndexedDB.insert(event,function(data){
		dashboard.innerHTML	= "";
    	if(data == 1){
    		dashboard.innerHTML+= JSON.stringify(event) + "<br>";
    	}
    });
});

document.getElementById("b_list").addEventListener("click", function(){
	dashboard.innerHTML	= "<br><table><tbody id='addrBox'></tbody></table><br>";
	IndexedDB.selectAll( function( data ) {
		for( var i = 0 ; i < data.length ; i++ ){
			addrBox.innerHTML += "<tr><td><a href='javascript:select( " + data[i].id + ");'> [#] </a></td><td>"
				+ JSON.stringify(data[i])
				+ "</td><td><a href='javascript:deleteOne( " + data[i].id + ");'> [X] </a></td></tr>";
		}
	});
});

function deleteOne(id){
	IndexedDB.delete( id, function(data){
		dashboard.innerHTML	= "";
		if(data == 1){
			dashboard.innerHTML	= "삭제 완료.";
		}
	});
	
	var clickButton = document.getElementById("b_list");
	clickButton.click();
};

function select(id){
	IndexedDB.selectOne( id, function(data){
		// dashboard.innerHTML = JSON.stringify(data) + "<br>";
		// dashboard.innerHTML	+= "선택 완료.";
		a_id.value = data.id;
		a_type.value = data.type,
		a_company.value = data.company;
		a_depart.value = data.depart;
		a_team.value = data.team; 
		a_posit.value = data.posit; 
		a_name.value = data.name;
		a_job.value = data.job;
		a_phone.value = data.phone;
		a_cell.value = data.cell;
		a_email.value = data.email;
		a_etc.value = data.etc;
	});
};
	
document.getElementById("b_modify").addEventListener("click", function(){
	console.log(seletedID);
	var selID = Number.parseInt( a_id.value );
	if ( selID == 0 ) {
		alert( "수정할 수 없습니다. ( 아래 이유 참고 ) \r\n 1.기존에 등록된 주소가 아닙니다. 등록 버튼을 누르세요." );
	}
	var event = {
		id:selID,
		type:a_type.value,
		company:a_company.value,
		depart:a_depart.value, 
		team:a_team.value, 
		posit:a_posit.value, 
		name:a_name.value, 
		job:a_job.value, 
		phone:a_phone.value, 
		cell:a_cell.value, 
		email:a_email.value, 
		etc:a_etc.value
	}
	console.log( event );
    IndexedDB.insert(event,function(data){
		dashboard.innerHTML	= "";
    	if(data == 1){
    		dashboard.innerHTML += "수정 완료";
    	}
    });
});

document.getElementById("b_max").addEventListener("click", function(){
	dashboard.innerHTML	= "";
    IndexedDB.selectMaxValue("keyIndex",function(data){
  		dashboard.innerHTML = JSON.stringify(data) + "<br>";
   		dashboard.innerHTML += "최댓값 조회 완료";
    });
});

document.getElementById("b_search").addEventListener("click", function(){
	dashboard.innerHTML	= "";
    IndexedDB.searchStr(a_search.value ,function(data){
		for(var i = 0 ; i < data.length ; i ++){
			dashboard.innerHTML += "<a href='javascript:select( " + data[i].id + ");'> <선택> </a> ";
			dashboard.innerHTML += "<a href='javascript:deleteOne( " + data[i].id + ");'> <삭제> </a> ";
			dashboard.innerHTML += JSON.stringify(data[i]) + "<br>";
		}
    });
});

function typeDisplay(){
	typeBoard.innerHTML = "<table style='width:500px;'><tbody><tr id='typeBox'></tr></tbody></table>";
    IndexedDB.GroupByMenu( function(data){
		if( data.size == 0 ) {
			typeBoard.innerHTML	+= "등록된 내용이 없습니다. 등록 후 사용하십시오.";
		} else {
			for( var [key, value] of data ) {
				typeBox.innerHTML	+= "<td><a href='javascript:selectTypeData(\"" + key + "\");'> " + key + " </a></td>";
			}	
		}
    });
}

function selectTypeData( txt ) {
	dashboard.innerHTML	= "<br>" + txt + " Selected.<br><table><tbody id='addrBox'></tbody></table>";
    IndexedDB.selectType( txt, function(data) {
		//console.log( data );
		for(var i = 0 ; i < data.length ; i ++){
			addrBox.innerHTML += "<tr><td><a href='javascript:select( " + data[i].id + ");'> [#] </a> </td><td>" 
				+ JSON.stringify(data[i]) 
				+ "</td><td><a href='javascript:deleteOne( " + data[i].id + ");'> [X] </a><br></td></tr>";
		}
    });
}

document.getElementById("b_genData").addEventListener("click", function(){
	var val = Math.floor(1000 + Math.random() * 9000);
	var clickButton = document.getElementById("b_insert");

	dashboard.innerHTML	= "";
	for( var i = 0 ; i < 10 ; i++ ) {
		a_type.value = "가족";		//  협력사, 가족사, 퇴사자, 전직동료, 친구, 가족
		a_company.value = "YOUTUBE";	// 구글, 오라클, IBM, EMC, 애플, 삼성, SONY, PHILIPS, YOUTUBE
		a_depart.value = "기술본부";	// 경영지원본부 , 기술본부, 사업1본부, 사업3본부, 교육평가연구소,
		a_team.value = "개발1팀";	// 경영지원팀, 재무팀, 평가팀, 유학사업팀, 콘텐츠사업팀, 신규사업팀, 서비스운영팀, 서비스전략팀, 서비스영업팀, 마케팅사업팀, 디자인팀, 법무팀
		a_posit.value = "매니저" + val;
		a_name.value = "홍" + val;
		a_job.value = "시스템" + val;
		a_phone.value = "02-0000-" + val;
		a_cell.value = "010-0000-" + val;
		a_email.value = val + "@gmail.com";
		a_etc.value = val;
		
		val = Math.floor(1000 + Math.random() * 9000);
		clickButton.click();
	}
	dashboard.innerHTML += "데이터 생성 완료";
});
