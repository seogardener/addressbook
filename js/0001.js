
IndexedDB.checkDB();
IndexedDB.createSchema('id');
genData();

document.getElementById("b_insert").addEventListener("click", function(){
	var event = {
		//id:,
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
	IndexedDB.selectAll( function( data ) {
		dashboard.innerHTML	= "";
		for(var i = 0 ; i < data.length ; i ++){
			dashboard.innerHTML += "<a href='javascript:select( " + data[i].id + ");'> <선택> </a> ";
			dashboard.innerHTML += "<a href='javascript:deleteOne( " + data[i].id + ");'> <삭제> </a> ";
			dashboard.innerHTML += JSON.stringify(data[i]) + "<br>";
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
		dashboard.innerHTML = JSON.stringify(data) + "<br>";
		dashboard.innerHTML	+= "선택 완료.";
		a_id.value = data.id;
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

document.getElementById("b_companyGB").addEventListener("click", function(){
	dashboard.innerHTML	= "";
    IndexedDB.GroupByCompany( function(data){
		//console.log( data );
		for( var [key, value] of data ) {
			//console.log( key + " / " + value  ); // 부서 이름 출력
			dashboard.innerHTML += " &nbsp; <a href='javascript:selectCompanyData(\"" + key + "\");'> " + key + " </a> &nbsp; ";
			//dashboard.innerHTML += "<button id="b_max">" + key + "</button> + " </a> &nbsp; ";
		}
    });
});

function selectCompanyData( txt ) {
	dashboard.innerHTML	+= "<br>" + txt + " Selected.<br>";
    IndexedDB.selectCompany( txt, function(data) {
		//console.log( data );
		dashboard.innerHTML	= "";
		for(var i = 0 ; i < data.length ; i ++){
			dashboard.innerHTML += "<a href='javascript:select( " + data[i].id + ");'> <선택> </a> ";
			dashboard.innerHTML += "<a href='javascript:deleteOne( " + data[i].id + ");'> <삭제> </a> ";
			dashboard.innerHTML += JSON.stringify(data[i]) + "<br>";
		}
    });
}

document.getElementById("b_departGB").addEventListener("click", function(){
	dashboard.innerHTML	= "";
    IndexedDB.GroupByDepart( function(data){
		//console.log( data );
		for( var [key, value] of data ) {
			//console.log( key + " / " + value  ); // 부서 이름 출력
			dashboard.innerHTML += " &nbsp; <a href='javascript:selectDepartData(\"" + key + "\");'> " + key + " </a> &nbsp; ";
			//dashboard.innerHTML += "<button id="b_max">" + key + "</button> + " </a> &nbsp; ";
		}
    });
});

function selectDepartData( txt ) {
	dashboard.innerHTML	+= "<br>" + txt + " Selected.<br>";
	var names = txt.split(/\//);
	dashboard.innerHTML	+= "<br> Company : " + names[0] + " / Department : " + names[1];
    IndexedDB.selectDepart( names[0], names[1], function(data) {
		//console.log( data );
		dashboard.innerHTML	= "";
		for(var i = 0 ; i < data.length ; i ++){
			dashboard.innerHTML += "<a href='javascript:select( " + data[i].id + ");'> <선택> </a> ";
			dashboard.innerHTML += "<a href='javascript:deleteOne( " + data[i].id + ");'> <삭제> </a> ";
			dashboard.innerHTML += JSON.stringify(data[i]) + "<br>";
		}
    });
}

document.getElementById("b_teamGB").addEventListener("click", function(){
	dashboard.innerHTML	= "";
    IndexedDB.GroupByTeam( function(data){
		//console.log( data );
		for( var [key, value] of data ) {
			//console.log( key + " / " + value  ); // 부서 이름 출력
			dashboard.innerHTML += " &nbsp; <a href='javascript:selectTeamData(\"" + key + "\");'> " + key + " </a> &nbsp; ";
			//dashboard.innerHTML += "<button id="b_max">" + key + "</button> + " </a> &nbsp; ";
		}
    });
});

function selectTeamData( txt ) {
	dashboard.innerHTML	+= "<br>" + txt + " Selected.<br>";
	var names = txt.split(/\//);
	dashboard.innerHTML	+= "<br> Company : " + names[0] + " / Department : " + names[1] + " / Team : " + names[2];
    IndexedDB.selectTeam( names[0], names[1], names[2], function(data) {
		//console.log( data );
		dashboard.innerHTML	= "";
		for(var i = 0 ; i < data.length ; i ++){
			dashboard.innerHTML += "<a href='javascript:select( " + data[i].id + ");'> <선택> </a> ";
			dashboard.innerHTML += "<a href='javascript:deleteOne( " + data[i].id + ");'> <삭제> </a> ";
			dashboard.innerHTML += JSON.stringify(data[i]) + "<br>";
		}
    });
}

document.getElementById("b_gen100").addEventListener("click", function(){
	dashboard.innerHTML	= "";
	genData100();
	dashboard.innerHTML += "데이터 생성 완료";
});

function genData() {
	var val = Math.floor(1000 + Math.random() * 9000);
	
	// a_id.value = data.id;
	a_company.value = "구글" + val;
	a_depart.value = "기술본부" + val;
	a_team.value = "시스템운영팀" + val;
	a_posit.value = "매니저" + val;
	a_name.value = "홍" + val;
	a_job.value = "시스템" + val;
	a_phone.value = "02-0000-" + val;
	a_cell.value = "010-0000-" + val;
	a_email.value = val + "@gmail.com";
	a_etc.value = val;
}

function genData100() {
	
	var val = Math.floor(1000 + Math.random() * 9000);
	var clickButton = document.getElementById("b_insert");

	for( var i = 0 ; i < 10 ; i++ ) {
		a_company.value = "구글";
		a_depart.value = "서비스운영본부";
		a_team.value = "서비스운영팀";
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
}