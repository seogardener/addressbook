
IndexedDB.checkDB();
IndexedDB.createSchema('id');
catDisplay();

genDatalists();

/** 변경전 Addr의 내용이 저장 */
var GVari = {
	addrList	: [],	// 목록 내용 저장
	preAddr		: [],
	sel_Category: "",	// 선택된 Category
	sel_curPage : 1	// 선택된 현재 page
};

/* Address Book */

/** "등록" 버튼 */
document.getElementById("b_insert").addEventListener("click", function(){
	var addr = {
		pos:0,
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
		etc:a_etc.value
		//id:
	}

	/** 해당 분류에 마지막 pos 값을 구한 후 등록 진행 */
	movingAddr( a_cat.value, addr );

});

/** "삭제" 버튼 */
document.getElementById("b_delete").addEventListener("click", function(){

	if( a_id.value == "" ) {
		alert( "선택된 Address가 없습니다.\n\n선택 후 삭제하십시오." );
		return false;
	}

	var addr = {
		id :parseInt( a_id.value ),
		cat:"휴지통",
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
		pos:0
	}

	var postData	= "선택된 " + a_name.value + "를 삭제 하시겠습니까?\n";
		postData	+= "\n구분 : " + a_cat.value;
		postData	+= "\n회사 : " + a_company.value;
		postData	+= "\n부서 : " + a_depart.value;
		postData	+= "\n팀 : " + a_team.value;
		postData	+= "\n직급 : " + a_posit.value;
		postData	+= "\n이름 : " + a_name.value;
		postData	+= "\n업무 : " + a_job.value;
		postData	+= "\n회사 전화 : " + a_phone.value;
		postData	+= "\n휴대 전화 : " + a_cell.value;
		postData	+= "\ne-Mail : " + a_email.value;
		postData	+= "\n기타 : " + a_etc.value;
		postData	+= "\n순번 : " + a_pos.value;

	if( confirm( postData ) ) {
		movingAddr( "휴지통" , addr );
		clearForm();
		pagedList(GVari.sel_curPage, GVari.sel_Category );
	}
});

/**
 * "전체 목록" 버튼 : 전체 Address 목록 표시
 */
document.getElementById("b_list").addEventListener("click", function(){
	pagedList( 1, "ALL" );
});

/** 
 * "Data 백업" 버튼 
 * IndexedDB에 저장된 내용을 JSON 포멧으로 출력
 * 출력 내용은 Data Import 시에 사용 함.
 * */
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

function clearForm() {
	a_id.value		= "";
	a_name.value	= "";
	a_cat.value		= "";
	a_company.value	= "";
	a_depart.value	= "";
	a_team.value	= "";
	a_posit.value	= "";
	a_name.value	= "";
	a_job.value		= "";
	a_phone.value	= "";
	a_cell.value	= "";
	a_email.value	= "";
	a_etc.value		= "";
	a_pos.value		= "";
};

/**
 * 전체 Address 목록 표시
 * curPage : 시작 페이지
 * cat : 분류 이름, 전체는 "ALL"
 */
function pagedList( curPage, cat ) {
	// var htmlData	= "<br><table style='width:100%;'>";
	// htmlData	+= "<thead><tr style='background-color:#F5CF6A;'><th></th><th>ID</th><th>분류</th><th>회사</th><th>부서</th><th>팀</th><th>직급</th><th>이름</th><th>업무</th><th>회사 전화</th><th>휴대 전화</th><th>eMail</th><th>기타</th><th>Pos</th></tr></thead>";
	// htmlData	+= "<tbody id='addrBox'></tbody>";
	// htmlData	+= "<tfoot><tr><td colspan=8><input type='checkbox' onClick='toggle4cb(this)'> 전체 선택</td><td colspan=6 style='text-align: right;'>이동 &nbsp; <a href='#' onClick='delete4cb();'>삭제</a> &nbsp; 추가 &nbsp; </td></tr><tr><th colspan='10' id='paging'></th><th colspan='4' id='totalcnt'></th></tr></tfoot></table><br>";

	// dashboard.innerHTML	= htmlData;
	GVari.sel_curPage	= curPage;
	GVari.sel_Category	= cat;

	var cperpage	= 15,
		totalpost	= 0,
		start		= ( curPage - 1 ) * cperpage;
	
	/** 전체 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
	IndexedDB.countCat( cat, function( data ) {
		totalpost	= parseInt( data );

		// console.log( "Count : "  + cat + " : " + data );
		if( totalpost > cperpage ) {
			// 하단 네비게이션 메뉴 바 표시
			totalcnt.style.backgroundColor	= "#54D1F1";
			paging.style.backgroundColor	= "#54D1F1";

			if( ! ( curPage > 0 ) )		curPage	= 1;

			var pagePerBlock = 5,	// NavigationBar 항목 갯수
				totalPage	= Math.ceil( totalpost / cperpage ),
				prev		= intval( (curPage - 1) / pagePerBlock ) * pagePerBlock,
				num			= totalPage - prev,
				page_link	= "",
				page		= 0;
			totalcnt.innerHTML	= " &nbsp; [ Total Page : " + curPage + " / " + totalPage + " ]";
			if(num > pagePerBlock)	num = pagePerBlock;
			if( prev )	page_link = "<b onclick='pagedList(1,\"" + cat + "\");'>[<<]</b> &nbsp; <b onclick='pagedList(" + prev + ",\"" + cat + "\");'>[<]</b> &nbsp; &nbsp; ";
			for( i = 0 ;  i < num ; i++ ) {
			   page = prev + i + 1;
			   if ( page == curPage )	page_link += "[" + page + "] &nbsp; ";
			   else						page_link += "<b onclick='pagedList(" + page + ",\"" + cat + "\");' onFocus='this.blur()' style='cursor: pointer;'>" + page + "</b> &nbsp; ";
			}
			var next = page + 1;
			if( totalPage >= next )		page_link += " &nbsp; <b onclick='pagedList(" + next + ",\"" + cat + "\");'>[>]</b> &nbsp; <b onclick='pagedList(" + totalPage + ",\"" + cat + "\");'>[>>]</b>";
			paging.innerHTML = page_link;
		} else {
			totalcnt.style.backgroundColor	= "#FFFFFF";
			paging.style.backgroundColor	= "#FFFFFF";
			totalcnt.innerHTML	= "";
			paging.innerHTML	= "";
		}
	});

	/** 갯수(cperpage) 만큼 Address 를 가져와서 표시 */
	addrBox.innerHTML	= "";
	IndexedDB.getData( start, cperpage, cat ).then( function( data ) {
		var lng	= data.length;
		if( lng == 0 ) pagedList( curPage - 1, cat );
		GVari.addrList = [];
		for( var i = 0 ; i < lng ; i++ ){
			GVari.addrList[i]	= data;
			//GVari.addrList.push	= data;
			addrBox.innerHTML += "<tr draggable='true' onclick='select(" + data[i].id + ");'><td>" 
				+ "<input type='checkbox' name='cb_addr' value='" + data[i].id + "'></td><td>"
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
		Common.tblRollOver(document.getElementById("addrBox"));
	});

	document.getElementById("list_div").style.display	= 'block';
};

/** 기능 테스트 시험을 위한 행위 */
document.getElementById("b_test").addEventListener("click", function(){
	//var addrBox	= document.getElementById('addrBox');
	console.log( GVari.addrList );
	console.log( GVari.addrList.length );
});


/** CheckBox 전체 선택 및 해제 */
function toggle4cb(source) {
	var checkboxes = document.getElementsByName('cb_addr');
	for(var i=0, n = checkboxes.length ; i < n ; i++ ) {
		checkboxes[i].checked = source.checked;
	}
};

/** CheckBox에 체크된 Address에 대한 삭제 작업 진행 */
function delete4cb() {
	var checkboxes	= document.getElementsByName('cb_addr'),
		n			= checkboxes.length,
		selcnt		= 0,
		cat			= "휴지통",
		selid;

	for( var i = 0 ; i < n ; i++ ) {
		if( checkboxes[i].checked == true ) {
			selcnt++;
		}
	}

	if( confirm( "선택된 " + selcnt + "개의 Address를 삭제 하시겠습니까?" ) ) {

		for( var i = 0 ; i < n ; i++ ) {
			if( checkboxes[i].checked == true ) {
				selid	= parseInt( checkboxes[i].value );
//-------------
				var _promise = function () {	// 선택된 Address에 대한 정보를 가져온다.
					return new Promise(function(resolve, reject) {
						IndexedDB.selectId(selid, function(data){
							if( data.length == 0 ) {
								reject(Error("It broke"));
							} else {
								console.log("selectId");
								resolve(data);
							}
						});
					});
				};
			
				// 선택된 Category내의 최대 Pos 값에 +1 한 값을 리턴한다
				var _promise2 = function () {	
					return new Promise(function(resolve, reject) {
						IndexedDB.getCatMaxValue( cat ,function(data){
							console.log("getCatMaxValue");
							resolve(parseInt( data ));
						});
					});
				};
			
				_promise().then(function (data) {
					_promise2().then(function (nextPos) {
						data.cat = cat;		// 바뀐 Category로 변경
						data.pos = nextPos;	// Category내의 마지막 Pos 값으로 위치 지정
						
						IndexedDB.insert(data,function(data){			// 바뀐 정보로 Update
							console.log("insert");
							if( data == true ) {
								//console.log ( cat + "로 이동 완료." );
								// addrBox.innerHTML = selid + "를 삭제하였습니다.";
							} else {
								//console.log( "이동 중 오류가 발생하였습니다." );
							}
						});
					});
				}, function (error) {
					// 실패시 
					console.error(error);
				});

//---------------
			}
		}
		pagedList(1, GVari.sel_Category );
	}
};

/** 지정된 Category로 Address 이동 */
function movingAddr( cat, addr ) {

	// 선택된 분류(Cat)에 위치(pos)의 최대값 가져오기
	var _promise = function () {
		return new Promise(function(resolve, reject) {
			IndexedDB.getCatMaxValue( cat, function(data){
				if( data == 0 ) {
					reject(Error("It broke"));
					return false;
				} else {
					resolve(data);
				}
			});
		});
	};

	_promise().then(function (data) {
		// console.log( "pos = " + data );
		addr.cat	= cat;
		addr.pos	= parseInt( data );
		IndexedDB.insert(addr,function(data){
			if( data == true ) {
				console.log ( addr.name + " : 이동 완료." );
			} else {
				console.log( "이동 중 오류가 발생하였습니다." );
			}
		});
	});
};

/** 검색어와 매치되는 Address 목록 표시 + Paging */
function searchList( curPage, txt ) {

	// 검색어 최소 2자 이상부터 가능
	if( txt.length < 2 ) {
		alert("  최소 글자 수는 2자 이상입니다. \n\r  다시 입력해주세요.");
		return false;
	}

	var htmlData	= "<br><table style='width:100%;'>";
	htmlData	+= "<thead><tr style='background-color:#F5CF6A;'><th></th><th>ID</th><th>분류</th><th>회사</th><th>부서</th><th>팀</th><th>직급</th><th>이름</th><th>업무</th><th>회사 전화</th><th>휴대 전화</th><th>eMail</th><th>기타</th><th>Pos</th></tr></thead>";
	htmlData	+= "<tbody id='addrBox'></tbody>";
	htmlData	+= "<tfoot><tr><td colspan=8><input type='checkbox' onClick='toggle4cb(this)'> 전체 선택</td><td colspan=6 style='text-align: right;'>이동 &nbsp; 삭제 &nbsp; 추가 &nbsp; </td></tr><tr><th colspan='10' id='paging'></th><th colspan='4' id='totalcnt'></th></tr></tfoot></table><br>";

	dashboard.innerHTML	= htmlData;

	var cperpage	= 15,
		totalpost	= 0,
		start		= ( curPage - 1 ) * cperpage;

	/** 검색어 일치하는 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
	IndexedDB.countSearch( txt, function( data ) {
		totalpost	= parseInt( data );

		if( totalpost > cperpage ) {
			// 하단 네비게이션 메뉴 바 표시
			totalcnt.style.backgroundColor	= "#54D1F1";
			paging.style.backgroundColor	= "#54D1F1";

			if( ! ( curPage > 0 ) )		curPage	= 1;

			var pagePerBlock = 5,	// NavigationBar 항목 갯수
				totalPage	= Math.ceil( totalpost / cperpage ),
				prev		= intval( (curPage - 1) / pagePerBlock ) * pagePerBlock,
				num			= totalPage - prev,
				page_link	= "",
				page		= 0;
			totalcnt.innerHTML	= " &nbsp; [ Total Page : " + curPage + " / " + totalPage + " ]";
			if(num > pagePerBlock)	num = pagePerBlock;
			if( prev )	page_link = "<b onclick='searchList(1,\"" + txt + "\");'>[<<]</b> &nbsp; <b onclick='searchList(" + prev + ",\"" + txt + "\");'>[<]</b> &nbsp; &nbsp; ";
			for( i = 0 ;  i < num ; i++ ) {
			   page = prev + i + 1;
			   if ( page == curPage )	page_link += "[" + page + "] &nbsp; ";
			   else						page_link += "<b onclick='searchList(" + page + ",\"" + txt + "\");' onFocus='this.blur()' style='cursor: pointer;'>" + page + "</b> &nbsp; ";
			}
			var next = page + 1;
			if( totalPage >= next )		page_link += " &nbsp; <b onclick='searchList(" + next + ",\"" + txt + "\");'>[>]</b> &nbsp; <b onclick='searchList(" + totalPage + ",\"" + txt + "\");'>[>>]</b>";
			paging.innerHTML = page_link;
		} else {
			totalcnt.style.backgroundColor	= "#FFFFFF";
			paging.style.backgroundColor	= "#FFFFFF";
			totalcnt.innerHTML	= "";
			paging.innerHTML	= "";
		}
	});

	/** 갯수(cperpage) 만큼 Address 를 가져와서 표시 */
	IndexedDB.searchStr( start, cperpage, txt, function( data ) {
		for( var i = 0 , lng = data.length ; i < lng ; i++ ){
			addrBox.innerHTML += "<tr draggable='true' onclick='select(" + data[i].id + ");'><td>" 
				+ "<input type='checkbox' name='cb_addr' value='" + data[i].id + "'></td><td>"
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
};

/**
 * 목록에서 선택한 Address에 대한 상세 정보를 보여줌.
 * @param {*} id 
 */
function select(id){
	IndexedDB.selectId( id, function(data){
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

		GVari.preAddr	= data;		// 변경전 Addr 저장, Global Variable
	});

};
	
document.getElementById("b_modify").addEventListener("click", function(){
	var selID = Number.parseInt( a_id.value );
	if ( selID == 0 || a_id.value == "" ) {
		alert( "수정할 수 없습니다. ( 아래 이유 참고 ) \r\n 1.기존에 등록된 주소가 아닙니다. 등록 버튼을 누르세요." );
	}
	var addr = {
		id:parseInt( GVari.preAddr.id ),	// id 변경 불가
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
		pos:parseInt( GVari.preAddr.pos )	// pos 변경 불가
	}

	/** 분류가 수정이 되었는지 확인 */
	if( GVari.preAddr.cat == a_cat.value ) {	// 분류가 변경되지 않은 경우, pos를 제외하고 변경
		console.log( addr );
		IndexedDB.insert(addr,function(data){
			dashboard.innerHTML	= "";
			if(data == true){
				dashboard.innerHTML += "수정 완료";
			} else {
				dashboard.innerHTML += "수정되지 않았습니다. <br>천천히 확인 후 다시 시도하세요.";
			}
		});
	} else {	// 분류가 변경된 경우 분류의 마지막 addr로 pos를 이동
		movingAddr( a_cat.value, addr );
		dashboard.innerHTML = "변경된 내용이 " + a_cat.value + "로 이동되어 저장이 되었습니다.";
	}
});

/**
 * "최대값" 버튼
 * 각 분류에 대한 최대 개수의 정보를 출력
 */
document.getElementById("b_catmax").addEventListener("click", function(){
	var max = 0;
	var max_id = null;
	dashboard.innerHTML	= a_catmax.value + " 최대 값 : ";
    IndexedDB.getCatMaxValue( a_catmax.value ,function(data){
  		dashboard.innerHTML += ( data - 1 ) + " , 다음 값 : " + data + " <br>";
   		dashboard.innerHTML += "최댓값 조회 완료";
    });
});

/**
 * "조회" 버튼
 * Input 창에 있는 내용을 기반으로 검색하여 매치되는 결과를 출력
 */
document.getElementById("b_search").addEventListener("click", function(){
	searchList( 1, a_search.value );
});

/** 삭제되어진(휴지통으로 옴겨진) Address 리스트 표시 */
document.getElementById("b_deleted").addEventListener("click", function(){
	pagedList( 1, "휴지통" );
});

/** 상단 각 분류 표시 */
function catDisplay(){
	//catBoard.innerHTML = "<table style='width=100%;'><tbody><tr id='catBox'></tr></tbody></table>";
	//catBoard.innerHTML	+= "<tr>";
    IndexedDB.GroupByMenu( function(data){
		if( data.size == 0 ) {
			catBoard.innerHTML	+= "<td>등록된 내용이 없습니다. 등록 후 사용하십시오.</td>";
		} else {
			//console.log(data);
			for( var [key, value] of data ) {
				if( key == "휴지통" ) continue;
				catBoard.innerHTML	+= "<td class='dropzone' onclick=pagedList(1,\"" + key + "\");> " + key + "</td>";
			}	
		}
	});
	//console.log(catBoard.innerHTML);
	//catBoard.innerHTML	+= "</tr>";
}

/** Dummy 연락처 생성 */
document.getElementById("b_genData").addEventListener("click", function(){
	var val = Math.floor(1000 + Math.random() * 9000);

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
		a_id.value	= "";
		
		val = Math.floor(1000 + Math.random() * 9000);
	}
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
					if(data == true){
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
var oldidx;
var newidx;

// images-preloader
(new Image()).src = "img/xofficecontact_103670.png";

/* events fired on the draggable target */
document.addEventListener("drag", function( event ) { }, false);

document.addEventListener("dragstart", function( event ) {
	// store a ref. on the dragged elem
	dragged = event.target;
	oldidx	= event.target.sectionRowIndex;

	// make it half transparent
	event.target.style.opacity = 5;
	event.target.style.border = "1px solid #cccccc";
	
	var img = new Image();
	img.src = "img/xofficecontact_103670.png";
	event.dataTransfer.setDragImage(img, 25, 25);
	
	event.dataTransfer.setData("text/plain", event.target.cells[0].innerText );
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

// highlight potential drop target when the draggable element enters it
document.addEventListener("dragenter", function( event ) {
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
	// console.log( event.target.parentNode );
}, false);

document.addEventListener("drop", function( event ) {
	// prevent default action (open as link for some elements)
	event.preventDefault();

	var precat	= dragged.childNodes[1].innerHTML;
	var postcat	= event.target.innerText;
	var id		= parseInt( dragged.childNodes[1].innerHTML );

	// move dragged elem to the selected drop target
	if ( event.target.className == "dropzone" ) {
		event.target.style.background = "";

		if( precat != postcat ) {			// 선택한 Address를 Drop한 위치의 Category가 다른 경우
			var _promise = function () {	// 선택된 Address에 대한 정보를 가져온다.
				return new Promise(function(resolve, reject) {
					IndexedDB.selectId(id, function(data){
						if( data.length == 0 ) {
							reject(Error("It broke"));
						} else {
							resolve(data);
						}
					});
				});
			};
			
			_promise().then(function (data) {
				//var nextPos = 0;
				
				// diffent Category --> Change Category & Position Number
				var _promise2 = function () {	// 선택된 Category내의 최대 Pos 값에 +1 한 값을 리턴한다
					return new Promise(function(resolve, reject) {
						IndexedDB.getCatMaxValue( postcat ,function(data){
							resolve(parseInt( data ));
						});
					});
				};
				_promise2().then(function (nextPos) {
					data.cat = postcat;		// 바뀐 Category로 변경
					data.pos = nextPos;		// Category내의 마지막 Pos 값으로 위치 지정
					
					dragged.parentNode.removeChild( dragged );	// 화면상에서 선택된 Address 삭제
					IndexedDB.insert(data,function(data){		// 바뀐 정보로 Update
						if( data == true ) {
							pagedList(GVari.sel_curPage, GVari.sel_Category );
							// console.log ( "( " + precat + " --> " + postcat + ") 이동 완료." );
						} else {
							console.log( "이동 중 오류가 발생하였습니다." );
						}
					});
				});
			}, function (error) {
				// 실패시 
				console.error(error);
			});
		}
	// re-order in same category
	} else if( event.target.parentNode.parentNode.id == "addrBox" ) {
		var newpin	= event.target.parentNode;
		var newid	= parseInt( newpin.childNodes[0].innerHTML );
		var oldpos	= parseInt( dragged.childNodes[12].innerHTML );
		var newpos	= parseInt( newpin.childNodes[12].innerHTML );
		var start	= 0;
		var end		= 0;
		
		if( oldpos > newpos ) {
			start	= newpos;
			end		= oldpos;
		} else {
			start	= oldpos;
			end		= newpos;
		}

		var _promise = function () {
			return new Promise(function(resolve, reject) {
				IndexedDB.getPosInRange(precat, start, end, function(data){
					resolve( data );
				});
			});	
		};
		_promise().then(function (data) {
			if( oldpos > newpos ) {
				for( var i = 0 , lng = data.length ; i < lng ; i++ ){
					data[i].pos	+= 1;
					if( data[i].id == id ) {
						data[i].pos	= newpos;
					}
				}
			} else {
				for( var i = 0 , lng = data.length ; i < lng ; i++ ){
					data[i].pos	-= 1;
					if( data[i].id == id ) {
						data[i].pos	= newpos;
					}
				}
			}
			for( var i = 0 , lng = data.length ; i < lng ; i++ ){
				IndexedDB.insert(data[i],function(rdata){
					if(rdata == true){
						console.log( "Data 추가 중 ... [" + i + "/" + lng + "]" );
					}
				});
			}
			
			// Change Display Table
			newidx	= event.target.parentNode.sectionRowIndex;
			listlng	= newpin.parentNode.children.length;
			var tables = event.target.parentNode.parentNode;

			if( oldidx > newidx ) {		// Pull up
				start	= newidx;
				end		= oldidx;

				var sel = tables.childNodes[end].innerHTML
				var startpos = tables.childNodes[start].childNodes[12].innerHTML
				for( var i = end ; i > start ; i-- ){
					tables.childNodes[i].innerHTML = tables.childNodes[i-1].innerHTML
					tables.childNodes[i].childNodes[12].innerHTML ++;
				}
				tables.childNodes[start].innerHTML = sel;
				tables.childNodes[start].childNodes[12].innerHTML = startpos;
			} else {	// Pull out
				start	= oldidx;
				end		= newidx;

				var sel		= tables.childNodes[start].innerHTML
				var endpos	= tables.childNodes[end].childNodes[12].innerHTML
				for( var i = start ; i < end ; i++ ){
					tables.childNodes[i].innerHTML = tables.childNodes[i+1].innerHTML
					tables.childNodes[i].childNodes[12].innerHTML --;
				}
				tables.childNodes[end].innerHTML = sel;
				tables.childNodes[end].childNodes[12].innerHTML = endpos;
			}
		});
	}
}, false);

/** 구분, 회사, 부서, 팀, 직급에 대한 목록을 Select Box로 구성함. */
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
}

function intval (mixed_var, base) {
    // Get the integer value of a variable using the optional base for the conversion  
    // 
    // version: 1109.2015
    // discuss at: http://phpjs.org/functions/intval    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: stensi
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   input by: Matteo
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)    // +   bugfixed by: Rafał Kukawski (http://kukawski.pl)
    // *     example 1: intval('Kevin van Zonneveld');
    // *     returns 1: 0
    // *     example 2: intval(4.2);
    // *     returns 2: 4    // *     example 3: intval(42, 8);
    // *     returns 3: 42
    // *     example 4: intval('09');
    // *     returns 4: 9
    // *     example 5: intval('1e', 16);    // *     returns 5: 30
    var tmp;
 
    var type = typeof(mixed_var);
     if (type === 'boolean') {
        return +mixed_var;
    } else if (type === 'string') {
        tmp = parseInt(mixed_var, base || 10);
        return (isNaN(tmp) || !isFinite(tmp)) ? 0 : tmp;    } else if (type === 'number' && isFinite(mixed_var)) {
        return mixed_var | 0;
    } else {
        return 0;
    }
    
    tmp = null, type = null;
}

// function dropOnCatCell(e) {
// 	var sel = JSON.parse( e.dataTransfer.getData("text") );
// 	var precat = sel.cat;
// 	var postcat = e.target.innerText;
	
// 	sel.cat = postcat;
// 	IndexedDB.insert(sel,function(data){
// 		if(data == true){
// 			console.log ( "id:" + sel.id + " ( " + precat + " --> " + postcat + ") 이동 완료." );
// 		}
// 	});

// 	pagedList( 1, precat ) ;
// 	e.preventDefault();
// }

