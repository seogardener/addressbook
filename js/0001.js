
IndexedDB.checkDB();
IndexedDB.createSchema('id');
catDisplay();
//databaseExists();

genDatalists();

/* Address Book */

document.getElementById("b_insert").addEventListener("click", function(){
	var event = {
		//id:,
		cat:a_cat.value,
		company:a_company.value,
		depart:a_depart.value, 
		team:a_team.value, 
		posit:a_posit.value, 
		name:a_name.value, 
		job:a_job.value, 
		phone:a_phone.value, 
		cell:a_cell.value, 
		email:a_email.value, 
		etc:a_etc.value,
		pos:a_pos.value
	}
    IndexedDB.insert(event,function(data){
		dashboard.innerHTML	= "";
    	if(data == 1){
    		dashboard.innerHTML+= JSON.stringify(event) + "<br>";
    	}
    });
});

document.getElementById("b_list").addEventListener("click", function(){
	// dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td></td><td>Category</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";
	IndexedDB.selectAll( function( data ) {
		for( var i = 0 , lng = data.length ; i < lng ; i++ ){
			addrBox.innerHTML += "<tr draggable='true'><td>" 
				+ data[i].id + "</td><td>" 
				+ data[i].cat + "</td><td>" 
				+ data[i].company + "</td><td>" 
				+ data[i].depart + "</td><td>" 
				+ data[i].team + "</td><td>" 
				+ data[i].posit + "</td><td>" 
				+ data[i].name + "</td><td>" 
				+ data[i].job + "</td><td>" 
				+ data[i].phone + "</td><td>" 
				+ data[i].cell + "</td><td>" 
				+ data[i].email + "</td><td>" 
				+ data[i].etc + "</td><td>"
				+ data[i].pos + "</td></tr>";
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
		a_cat.value = data.cat,
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
		a_pos.value = data.pos;
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
		cat:a_cat.value,
		company:a_company.value,
		depart:a_depart.value, 
		team:a_team.value, 
		posit:a_posit.value, 
		name:a_name.value, 
		job:a_job.value, 
		phone:a_phone.value, 
		cell:a_cell.value, 
		email:a_email.value, 
		etc:a_etc.value,
		pos:a_pos.value
	}
	console.log( event );
    IndexedDB.insert(event,function(data){
		dashboard.innerHTML	= "";
    	if(data == 1){
    		dashboard.innerHTML += "수정 완료";
    	}
    });
});

document.getElementById("b_catmax").addEventListener("click", function(){
	var max = 0;
	var max_id = null;
	dashboard.innerHTML	= a_catmax.value + " 최대 값 : ";
    IndexedDB.getCatMaxValue( a_catmax.value ,function(data){
  		dashboard.innerHTML += ( data - 1 ) + " , 다음 값 : " + data + " <br>";
   		dashboard.innerHTML += "최댓값 조회 완료";
    });
});

document.getElementById("b_search").addEventListener("click", function(){
	// dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td>ID</td><td>Category</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";

    IndexedDB.searchStr(a_search.value ,function(data){
		for(var i = 0, lng = data.length ; i < lng ; i ++){
			addrBox.innerHTML += "<tr draggable='true'><td>" 
				+ data[i].id + "</td><td>" 
				+ data[i].cat + "</td><td>" 
				+ data[i].company + "</td><td>" 
				+ data[i].depart + "</td><td>" 
				+ data[i].team + "</td><td>" 
				+ data[i].posit + "</td><td>" 
				+ data[i].name + "</td><td>" 
				+ data[i].job + "</td><td>" 
				+ data[i].phone + "</td><td>" 
				+ data[i].cell + "</td><td>" 
				+ data[i].email + "</td><td>" 
				+ data[i].etc + "</td><td>"
				+ data[i].pos + "</td></tr>";
		}
    });
});

document.getElementById("b_getOne").addEventListener("click", function(){
	dashboard.innerHTML	= "찾는 값 : " + a_getOne.value + "<br> 결과 : ";

	// available index name : phoneIdx, cellIdx, emailIdx
    IndexedDB.getOne(a_getOne.value, "cellIdx", function(data){
		var lng = data.length;
		if( lng == 0 ) {
			alert( "전화번호(" + a_getOne.value + ")가 없습니다. \r\n확인 후 다시 시도해 주세요." );
		}
		dashboard.innerHTML += JSON.stringify(data[0]);
    });
});

function catDisplay(){
	catBoard.innerHTML = "<table style='width=100%;'><tbody><tr id='catBox'></tr></tbody></table>";
    IndexedDB.GroupByMenu( function(data){
		if( data.size == 0 ) {
			catBoard.innerHTML	+= "등록된 내용이 없습니다. 등록 후 사용하십시오.";
		} else {
			for( var [key, value] of data ) {
				catBox.innerHTML	+= "<td class='dropzone' onclick=selectCatData(\"" + key + "\");> " + key + " </a></td>";
			}	
		}
    });
}

function selectCatData( txt ) {
	//dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><thead><tr><td>ID</td><td>Category</td><td>Company</td><td>Depart</td><td>Team</td><td>Posit</td><td>Name</td><td>Job</td><td>Phone</td><td>Cell Phone</td><td>E-Mail</td><td>Et.c</td></tr></thead><tbody id='addrBox'></tbody></table><br>";
	dashboard.innerHTML	= "<br><table style='width:100%;' class='addrlist'><tbody id='addrBox'></tbody></table><br>";

    IndexedDB.selectCat( txt, function(data) {
		for(var i = 0, lng = data.length ; i < lng ; i ++){
			addrBox.innerHTML += "<tr draggable='true'><td>" 
				+ data[i].id + "</td><td>" 
				+ data[i].cat + "</td><td>" 
				+ data[i].company + "</td><td>" 
				+ data[i].depart + "</td><td>" 
				+ data[i].team + "</td><td>" 
				+ data[i].posit + "</td><td>" 
				+ data[i].name + "</td><td>" 
				+ data[i].job + "</td><td>" 
				+ data[i].phone + "</td><td>" 
				+ data[i].cell + "</td><td>" 
				+ data[i].email + "</td><td>" 
				+ data[i].etc + "</td><td>"
				+ data[i].pos + "</td></tr>";
		}
    });
}

function dropOnCatCell(e) {
	var sel = JSON.parse( e.dataTransfer.getData("text") );
	var precat = sel.cat;
	var postcat = e.target.innerText;
	
	sel.cat = postcat;
	IndexedDB.insert(sel,function(data){
		if(data == 1){
			console.log ( "id:" + sel.id + " ( " + precat + " --> " + postcat + ") 이동 완료." );
		}
	});

	selectCatData( precat ) ;
	e.preventDefault();
}

document.getElementById("b_genData").addEventListener("click", function(){
	var val = Math.floor(1000 + Math.random() * 9000);
	var clickButton = document.getElementById("b_insert");

	dashboard.innerHTML	= "";
	for( var i = 0 ; i < 10 ; i++ ) {
		a_cat.value = "가족";			//  협력사, 가족사, 퇴사자, 전직동료, 친구, 가족
		a_company.value = "YOUTUBE";	// 구글, 오라클, IBM, EMC, 애플, 삼성, SONY, PHILIPS, YOUTUBE
		a_depart.value = "기술본부";	// 경영지원본부 , 기술본부, 사업1본부, 사업3본부, 교육평가연구소,
		a_team.value = "개발1팀";		// 경영지원팀, 재무팀, 평가팀, 유학사업팀, 콘텐츠사업팀, 신규사업팀, 서비스운영팀, 서비스전략팀, 서비스영업팀, 마케팅사업팀, 디자인팀, 법무팀
		a_posit.value = "매니저" + val;
		a_name.value = "홍" + val;
		a_job.value = "시스템" + val;
		a_phone.value = "02-0000-" + val;
		a_cell.value = "010-0000-" + val;
		a_email.value = val + "@gmail.com";
		a_etc.value = val;
		a_pos.value = i;
		
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
	catDisplay();
	//databaseExists();
});

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
			catDisplay();
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
	event.target.style.opacity = 5;
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
	
	var seledCat = dragged.parentNode.childNodes[1].childNodes[1].innerHTML;
	var overCat = event.toElement.innerText;
	
	if( seledCat != overCat ) {
	
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

		var id	= parseInt( dragged.childNodes[0].innerHTML );
		var _promise = function () {
			return new Promise(function(resolve, reject) {
				IndexedDB.selectId(id, function(data){
					if( data.length == 0 ) {
						console.log( "등록된 ID(" + id + ")가 없습니다." );
						reject(Error("It broke"));
					} else {
						console.log( "등록된 ID(" + id + ")가 있습니다." );
						resolve(data);
					}
				});
			});
		};
		
		_promise().then(function (data) {
			var precat = dragged.childNodes[1].innerHTML;
			var postcat = event.target.innerText;
			//var nextPos = 0;
			
			// Moving Same Category
			if( precat == postcat ) {
console.log(precat + "==" + postcat);
				// Same Category --> Change position number
				
				
			// Moving Deffent Catebory
			} else {
				// diffent Category --> Change Category & Position Number
				var _promise2 = function () {
					return new Promise(function(resolve, reject) {
						IndexedDB.getCatMaxValue( postcat ,function(data){
							resolve(parseInt( data ));
						});
					});
				};
				_promise2().then(function (nextPos) {
					data.cat = postcat;
					data.pos = nextPos;
					
					dragged.parentNode.removeChild( dragged );
					IndexedDB.insert(data,function(data){
						if( data == true ) {
							console.log ( "( " + precat + " --> " + postcat + ") 이동 완료." );
						} else {
							console.log( "이동 중 오류가 발생하였습니다." );
						}
					});
				});
			}
		}, function (error) {
			// 실패시 
			console.error(error);
		});
	}
}, false);

function genDatalists(){
	var tdlists = document.getElementById("catlists");
	var cdlists = document.getElementById("companylists");
	var ddlists = document.getElementById("departlists");
	var tedlists = document.getElementById("teamlists");
	var pdlists = document.getElementById("positlists");

    IndexedDB.GetUniqueValue( 'catIdx', function(data){
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
	
// document.getElementById("b_max").addEventListener("click", function(){
// 	dashboard.innerHTML	= "";
//     IndexedDB.selectMaxValue("keyIndex",function(data){
//   		dashboard.innerHTML = JSON.stringify(data) + "<br>";
//    		dashboard.innerHTML += "최댓값 조회 완료";
//     });
// });


// document.addEventListener("drop", function( event ) {
// 	// prevent default action (open as link for some elements)
// 	event.preventDefault();
// 
// 	// move dragged elem to the selected drop target
// 	if ( event.target.className == "dropzone" ) {
// 		event.target.style.background = "";
// 
// 		var precat = dragged.childNodes[1].innerHTML;
// 		var postcat = event.target.innerText;
// 		if( precat != postcat ) {
// 			
// 			var selObj = {
// 				id:Number.parseInt( dragged.childNodes[0].innerHTML ),
// 				cat:dragged.childNodes[1].innerHTML,
// 				company:dragged.childNodes[2].innerHTML,
// 				depart:dragged.childNodes[3].innerHTML, 
// 				team:dragged.childNodes[4].innerHTML, 
// 				posit:dragged.childNodes[5].innerHTML, 
// 				name:dragged.childNodes[6].innerHTML, 
// 				job:dragged.childNodes[7].innerHTML, 
// 				phone:dragged.childNodes[8].innerHTML, 
// 				cell:dragged.childNodes[9].innerHTML, 
// 				email:dragged.childNodes[10].innerHTML, 
// 				etc:dragged.childNodes[11].innerHTML,
// 				pos:dragged.childNodes[12].innerHTML		// 순번 계산을 옴겨지는 Category의 마지막 번호로 기입
// 			}
// 			
// 			dragged.parentNode.removeChild( dragged );
// 			selObj.cat = postcat;
// 			IndexedDB.insert(selObj,function(data){
// 				if(selObj == 1){
// 					console.log ( "id:" + data.id + " ( " + precat + " --> " + postcat + ") 이동 완료." );
// 				}
// 			});
// 		}
// 	}
// }, false);

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



}