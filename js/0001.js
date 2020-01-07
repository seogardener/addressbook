
IndexedDB.checkDB();
IndexedDB.createSchema('id');
typeDisplay();
//databaseExists();

genDatalists();

/* Address Book */

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
    IndexedDB.insert(event,function(data){
		dashboard.innerHTML	= "";
    	if(data == 1){
    		dashboard.innerHTML+= JSON.stringify(event) + "<br>";
    	}
    });
});

document.getElementById("b_list").addEventListener("click", function(){
	// dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td></td><td>Type</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";
	IndexedDB.selectAll( function( data ) {
		for( var i = 0 , lng = data.length ; i < lng ; i++ ){
			addrBox.innerHTML += "<tr draggable='true' ondragstart='dragstart(event);'>"
				+ "<td>" + data[i].id + "</td>"
				+ "<td>" + data[i].type + "</td>"
				+ "<td>" + data[i].company + "</td>"
				+ "<td>" + data[i].depart + "</td>"
				+ "<td>" + data[i].team + "</td>"
				+ "<td>" + data[i].posit + "</td>"
				+ "<td>" + data[i].name + "</td>"
				+ "<td>" + data[i].job + "</td>"
				+ "<td>" + data[i].phone + "</td>"
				+ "<td>" + data[i].cell + "</td>"
				+ "<td>" + data[i].email + "</td>"
				+ "<td>" + data[i].etc + "</td></tr>";
		}
	});
});

document.getElementById("b_backup").addEventListener("click", function(){
	dashboard.innerHTML	= "<br>'['를 포함해서 마지막 ']'까지 포함한 모든 내용을 복사해서 파일로 저장하세요. <br><br>";
	dashboard.innerHTML	+= "<br><table><thead><tr><td>[</td></tr></thead><tbody id='bakupBox'></tbody><tfoot><tr><td>]</td></tr></tfoot></table><br>";
	IndexedDB.selectAll( function( data ) {
		var marking = "";
		var lng = data.length;
		var lastline = lng -1 ;
		for( var i = 0 ; i < lng ; i++ ) {
			if( i < lastline ) {
				bakupBox.innerHTML += "<tr><td>" + JSON.stringify(data[i]) + ",</td></tr>";
			} else {
				bakupBox.innerHTML += "<tr><td>" + JSON.stringify(data[i]) + "</td></tr>";
			}
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
	//console.log(seletedID);
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
	// dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td>ID</td><td>Type</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";

    IndexedDB.searchStr(a_search.value ,function(data){
		for(var i = 0, lng = data.length ; i < lng ; i ++){
			addrBox.innerHTML += "<tr draggable='true' ondragstart='dragstart(event);'>"
				+ "<td>" + data[i].id + "</td>"
				+ "<td>" + data[i].type + "</td>"
				+ "<td>" + data[i].company + "</td>"
				+ "<td>" + data[i].depart + "</td>"
				+ "<td>" + data[i].team + "</td>"
				+ "<td>" + data[i].posit + "</td>"
				+ "<td>" + data[i].name + "</td>"
				+ "<td>" + data[i].job + "</td>"
				+ "<td>" + data[i].phone + "</td>"
				+ "<td>" + data[i].cell + "</td>"
				+ "<td>" + data[i].email + "</td>"
				+ "<td>" + data[i].etc + "</td></tr>";
		}
    });
});

function typeDisplay(){
	typeBoard.innerHTML = "<table style='width=100%;'><tbody><tr id='typeBox'></tr></tbody></table>";
    IndexedDB.GroupByMenu( function(data){
		if( data.size == 0 ) {
			typeBoard.innerHTML	+= "등록된 내용이 없습니다. 등록 후 사용하십시오.";
		} else {
			for( var [key, value] of data ) {
				typeBox.innerHTML	+= "<td class='dropzone' onclick=selectTypeData(\"" + key + "\");> " + key + " </a></td>";
			}	
		}
    });
}

function selectTypeData( txt ) {
	//dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td>ID</td><td>Type</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";

    IndexedDB.selectType( txt, function(data) {
		for(var i = 0, lng = data.length ; i < lng ; i ++){
			addrBox.innerHTML += "<tr draggable='true' ondragstart='dragstart(event);'>"
				+ "<td>" + data[i].id + "</td>"
				+ "<td>" + data[i].type + "</td>"
				+ "<td>" + data[i].company + "</td>"
				+ "<td>" + data[i].depart + "</td>"
				+ "<td>" + data[i].team + "</td>"
				+ "<td>" + data[i].posit + "</td>"
				+ "<td>" + data[i].name + "</td>"
				+ "<td>" + data[i].job + "</td>"
				+ "<td>" + data[i].phone + "</td>"
				+ "<td>" + data[i].cell + "</td>"
				+ "<td>" + data[i].email + "</td>"
				+ "<td>" + data[i].etc + "</td></tr>";
		}
    });
}

function dropOnTypeCell(e) {
	var sel = JSON.parse( e.dataTransfer.getData("text") );
	var preType = sel.type;
	var postType = e.target.innerText;
	
	sel.type = postType;
	IndexedDB.insert(sel,function(data){
		if(data == 1){
			console.log ( "id:" + sel.id + " ( " + preType + " --> " + postType + ") 이동 완료." );
		}
	});

	selectTypeData( preType ) ;
	e.preventDefault();
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

document.getElementById("b_db_delete").addEventListener("click", function(){
	IndexedDB.deleteAll( function(isOk){
		dashboard.innerHTML	= "";
		if(isOk == true) {
			dashboard.innerHTML	= "전체 데이터 삭제 작업 완료.";
		} else {
			dashboard.innerHTML	= "전체 데이터 삭제 작업 실패. <br> 브라우저 재실행 후 다시 시도하세요.";
		}
	});
	typeDisplay();
	//databaseExists();
});

//function databaseExists() {
//	var data = false;
//	dashboard.innerHTML	= "";
//	IndexedDB.databaseExists ( function(data){
//		if(data == true){
//			console.log( "DB가 존재합니다." );
//			b_db_create.disabled = true;
//			b_db_delete.disabled = false;
//		} else {
//			console.log( "DB가 없습니다." );
//			b_db_create.disabled = false;
//			b_db_delete.disabled = true;
//			
//		}
//	});
//}

/* File Control Zone */


function isText(type){
	return type.match(/^text/g);
}

document.getElementById("addrfile").addEventListener("change", function() {
	var file = this.files[0];
	dashboard.innerHTML = "파일로 부터 데이터를 읽어오는 중입니다. <br>";
	var fReader = new FileReader();
	fReader.addEventListener("load", function(e){
		console.log("파일 읽기 완료");
		if(isText(file.type)){
			var content = JSON.parse( fReader.result );
			
			var lng = content.length;
			for( var i = 0 ; i < lng ; i++ ) {
				IndexedDB.insert(content[i],function(data){
					if(data == 1){
						console.log( "Data 추가 중 ... [" + i + "/" + lng + "]" );
					}
				});
			}
			typeDisplay();
		}
	});
	fReader.addEventListener("error", function(e){
		console.log( "파일 읽는 도중 예외 발생. " + e );
	});
	fReader.addEventListener("progress", function(e){
		console.log( "읽는 중. " );
	});
	fReader.addEventListener("loadend", function(e){
		console.log( "Data 추가 작업 완료. " );
	});
	if(isText(file.type)){
		fReader.readAsText(file);
	}
});

/* Drag&Drop Zone */

var dragged;
// images-preloader
(new Image()).src = "img/xofficecontact_103670.png";

/* events fired on the draggable target */
document.addEventListener("drag", function( event ) { }, false);

document.addEventListener("dragstart", function( event ) {
	// store a ref. on the dragged elem
	dragged = event.target;
	// make it half transparent
	event.target.style.opacity = .5;
	event.target.style.border = "1px solid #cccccc";
	
	var img = new Image();
	img.src = "img/xofficecontact_103670.png";
	event.dataTransfer.setDragImage(img, 25, 25);
	
	event.dataTransfer.setData("text", event.target.cells[1].innerText );
}, false);

document.addEventListener("dragend", function( event ) {
	// reset the transparency
	event.target.style.opacity = "";
}, false);

/* events fired on the drop targets */
document.addEventListener("dragover", function( event ) {
	// prevent default to allow drop
	event.preventDefault();
}, false);

document.addEventListener("dragenter", function( event ) {
	// highlight potential drop target when the draggable element enters it
	
	var seledType = dragged.parentNode.childNodes[1].childNodes[1].innerHTML;
	var overType = event.toElement.innerText;
	
	if( seledType != overType ) {
	
		if ( event.target.className == "dropzone" ) {
			event.target.style.background = "purple";
		}
		event.dataTransfer.dropEffect = "copy";
	}
}, false);

document.addEventListener("dragleave", function( event ) {
	// reset background of potential drop target when the draggable element leaves it
	if ( event.target.className == "dropzone" ) {
		event.target.style.background = "";
	}
}, false);

document.addEventListener("drop", function( event ) {
	// prevent default action (open as link for some elements)
	event.preventDefault();

	// move dragged elem to the selected drop target
	if ( event.target.className == "dropzone" ) {
		event.target.style.background = "";

		var preType = dragged.childNodes[1].innerHTML;
		var postType = event.target.innerText;
		if( preType != postType ) {
			
			var selObj = {
				id:Number.parseInt( dragged.childNodes[0].innerHTML ),
				type:dragged.childNodes[1].innerHTML,
				company:dragged.childNodes[2].innerHTML,
				depart:dragged.childNodes[3].innerHTML, 
				team:dragged.childNodes[4].innerHTML, 
				posit:dragged.childNodes[5].innerHTML, 
				name:dragged.childNodes[6].innerHTML, 
				job:dragged.childNodes[7].innerHTML, 
				phone:dragged.childNodes[8].innerHTML, 
				cell:dragged.childNodes[9].innerHTML, 
				email:dragged.childNodes[10].innerHTML, 
				etc:dragged.childNodes[11].innerHTML
			}
			
			dragged.parentNode.removeChild( dragged );
			selObj.type = postType;
			IndexedDB.insert(selObj,function(data){
				if(selObj == 1){
					console.log ( "id:" + data.id + " ( " + preType + " --> " + postType + ") 이동 완료." );
				}
			});
		}
	}
}, false);

function genDatalists(){
	var tdlists = document.getElementById("typelists");
	var cdlists = document.getElementById("companylists");
	var ddlists = document.getElementById("departlists");
	var tedlists = document.getElementById("teamlists");
	var pdlists = document.getElementById("positlists");

    IndexedDB.GetUniqueValue( 'typeIdx', function(data){
		if( data.size != 0 ) {
			for( var [key, value] of data ) {
				tdlists.innerHTML	+= "<option value='" + key + "'/>";
			}	
		}
    });

    IndexedDB.GetUniqueValue( 'companyIdx', function(data){
		if( data.size != 0 ) {
			for( var [key, value] of data ) {
				cdlists.innerHTML	+= "<option value='" + key + "'/>";
			}	
		}
    });
	
    IndexedDB.GetUniqueValue( 'departIdx', function(data){
		if( data.size != 0 ) {
			for( var [key, value] of data ) {
				ddlists.innerHTML	+= "<option value='" + key + "'/>";
			}	
		}
    });

    IndexedDB.GetUniqueValue( 'teamIdx', function(data){
		if( data.size != 0 ) {
			for( var [key, value] of data ) {
				tedlists.innerHTML	+= "<option value='" + key + "'/>";
			}	
		}
    });

    IndexedDB.GetUniqueValue( 'positIdx', function(data){
		if( data.size != 0 ) {
			for( var [key, value] of data ) {
				pdlists.innerHTML	+= "<option value='" + key + "'/>";
			}	
		}
    });
}