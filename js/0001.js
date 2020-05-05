
window.onload = function() {
	utils.addListener( document.getElementById('addrBox'), "click",  Show.details );
	utils.addListener( document.getElementById('addrfile'), "change",  Doing.addrfile );

	Show.catDisplay();
	Show.pagedList4Favo();
	genDatalists();
}

IndexedDB.checkDB();
IndexedDB.createSchema('id');

/** 변경전 Addr의 내용이 저장 */
var GVari = {
	addrList	: [],	// 목록 내용 저장
	addr		: [],
	sel_Category: "",	// 선택된 Category
	sel_curPage : 1,	// 선택된 현재 page
	catlists	: "",
	comlists	: "",
	deplists	: "",
	tealists	: "",
	poslists	: ""
};

var Show = {

	/** "전체 목록" 버튼 : 전체 Address 목록 표시 */
	b_list : function() {
		Show.pagedList( 1, "ALL" );
	},

	/** Dummy 연락처 생성 */
	b_genData : function() {
		var val = Math.floor(1000 + Math.random() * 9000);

		for( var i = 0 ; i < 10 ; i++ ) {
			i_cat.value = "가족";			//  협력사, 가족사, 퇴사자, 전직동료, 친구, 가족
			i_company.value	= "YOUTUBE";	// 구글, 오라클, IBM, EMC, 애플, 삼성, SONY, PHILIPS, YOUTUBE
			i_depart.value	= "기술본부";	// 경영지원본부 , 기술본부, 사업1본부, 사업3본부, 교육평가연구소,
			i_team.value	= "개발1팀";		// 경영지원팀, 재무팀, 평가팀, 유학사업팀, 콘텐츠사업팀, 신규사업팀, 서비스운영팀, 서비스전략팀, 서비스영업팀, 마케팅사업팀, 디자인팀, 법무팀
			i_posit.value	= "매니저" + val;
			i_name.value	= "홍" + val;
			i_job.value		= "시스템" + val;
			i_phone.value	= "02-0000-" + val;
			i_cell.value	= "010-0000-" + val;
			i_email.value	= val + "@gmail.com";
			i_etc.value		= val;
			i_favo.value	= 0;
			//i_pos.value	= i;
			//i_id.value	= "";
			
			val = Math.floor(1000 + Math.random() * 9000);
		}
	},

	/** 목록에서 선택한 Address에 대한 상세 정보를 보여줌. */
	details : function( event ) {
		var data, clickElement, idx;

		if( event == undefined ) {	// 직접 호출인 경우
			data	= GVari.addr;
		} else {					// list를 통한 선택 호출이 경우
			clickElement	= event.target || event.srcElement,
			idx				= clickElement.parentNode.rowIndex - 1;
			data			= GVari.addrList[idx];
			GVari.addr	= data;		// 변경전 Addr 저장, Global Variable
		}

		cltitle.innerHTML		= data.company + " &nbsp; " + data.job + " &nbsp; " + data.name + " &nbsp; " + data.posit;
		td_title2.innerHTML		= "<b onclick='Doing.remove();'>삭제</b> | <b onclick='Show.update();'>수정</b>";

		detail_cat.innerHTML		= "  &nbsp; " + data.cat;
		detail_company.innerHTML	= "  &nbsp; " +data.company;
		detail_depart.innerHTML		= "  &nbsp; " +data.depart;
		detail_team.innerHTML		= "  &nbsp; " +data.team;
		detail_posit.innerHTML		= "  &nbsp; " +data.posit;
		detail_name.innerHTML		= "  &nbsp; " +data.name;
		detail_job.innerHTML		= "  &nbsp; " +data.job;
		detail_phone.innerHTML		= "  &nbsp; " +data.phone;
		detail_cellphone.innerHTML	= "  &nbsp; " +data.cell;
		detail_email.innerHTML		= "  &nbsp; " +data.email;
		detail_etc.innerHTML		= "  &nbsp; " +data.etc;
		detail_pos.innerHTML		= "  &nbsp; " +data.pos;
		detail_favo.innerHTML		= "  &nbsp; " +data.favo;

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>닫기</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	offDetail : function() {
		Doing.cntChkFavo();
		document.getElementById("address_detail_view").style.display	= 'none';
	},

	insert : function( event ) {
		var data= GVari.addr;

		cltitle.innerHTML		= " 주소록 등록 ";
		td_title2.innerHTML		= "<b onclick='Show.b_genData();'>자동 생성</b>";

		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat list="catlists" placeholder="선택 또는 등록(20자)">' + GVari.catlists;
		detail_company.innerHTML	= '  &nbsp; <input type=text id=i_company list="comlists" placeholder="선택 또는 등록(20자)">' + GVari.comlists;
		detail_depart.innerHTML		= '  &nbsp; <input type=text id=i_depart list="deplists" placeholder="선택 또는 등록(20자)">' + GVari.deplists;
		detail_team.innerHTML		= '  &nbsp; <input type=text id=i_team list="tealists" placeholder="선택 또는 등록(20자)">' + GVari.tealists;
		detail_posit.innerHTML		= '  &nbsp; <input type=text id=i_posit list="poslists" placeholder="선택 또는 등록(20자)">' + GVari.poslists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name placeholder="최대 20자">';
		detail_job.innerHTML		= '  &nbsp; <input type=text id=i_job placeholder="최대 20자">';
		detail_phone.innerHTML		= '  &nbsp; <input type=text id=i_phone placeholder="000-0000-0000">';
		detail_cellphone.innerHTML	= '  &nbsp; <input type=text id=i_cell placeholder="000-0000-0000">';
		detail_email.innerHTML		= '  &nbsp; <input type=text id=i_email placeholder="abc@abc.com">';
		detail_etc.innerHTML		= '  &nbsp; <input type=text id=i_etc placeholder="최대 20자">';
		detail_pos.innerHTML		= '  &nbsp; 자동 부여 됨';
		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo placeholder="숫자 입력">';

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>취소</b> | <b onclick='Doing.insert();'>등록</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	update : function( event ) {
		var data= GVari.addr;

		cltitle.innerHTML		= data.name + " 정보 수정";
		td_title2.innerHTML		= "<b onclick='Show.offDetail();'>취소</b>";

		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat value="' + data.cat + '" list="catlists"> &nbsp; [ 최대 20자 ]' + GVari.catlists;
		detail_company.innerHTML	= '  &nbsp; <input type=text id=i_company value="' + data.company + '" list="comlists"> &nbsp; [ 최대 20자 ]' + GVari.comlists;
		detail_depart.innerHTML		= '  &nbsp; <input type=text id=i_depart value="' + data.depart + '" list="deplists"> &nbsp; [ 최대 20자 ]' + GVari.deplists;
		detail_team.innerHTML		= '  &nbsp; <input type=text id=i_team value="' + data.team + '" list="tealists"> &nbsp; [ 최대 20자 ]' + GVari.tealists;
		detail_posit.innerHTML		= '  &nbsp; <input type=text id=i_posit value="' + data.posit + '" list="poslists"> &nbsp; [ 최대 20자 ]' + GVari.poslists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name value="' + data.name + '"> &nbsp; [ 최대 20자 ]';
		detail_job.innerHTML		= '  &nbsp; <input type=text id=i_job value="' + data.job + '"> &nbsp; [ 최대 20자 ]';
		detail_phone.innerHTML		= '  &nbsp; <input type=text id=i_phone value="' + data.phone + '"> &nbsp; [ 최대 20자 ]';
		detail_cellphone.innerHTML	= '  &nbsp; <input type=text id=i_cell value="' + data.cell + '"> &nbsp; [ 최대 20자 ]';
		detail_email.innerHTML		= '  &nbsp; <input type=text id=i_email value="' + data.email + '"> &nbsp; [ 최대 20자 ]';
		detail_etc.innerHTML		= '  &nbsp; <input type=text id=i_etc value="' + data.etc + '"> &nbsp; [ 최대 20자 ]';
		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo value="' + data.favo + '"> &nbsp; [ 숫자 ]';
		// detail_pos.innerHTML		= '  &nbsp; <input type=text id=i_pos value=' + data.pos + '> &nbsp; [ 최대 20자 ]';

		cbutton.innerHTML	= "<b onclick='Doing.update();'>적용</b>";
	},

	/** 상단 각 분류 표시 */
	catDisplay : function() {
		var cell	= "";
		if( GVari !== undefined ) {
			cell	= GVari.sel_Category;
		}
		IndexedDB.GroupByMenu( function(data){
			if( data.size == 0 ) {
				catBoard.innerHTML	= "<td>등록된 내용이 없습니다. 등록 후 사용하십시오.</td>";
			} else {
				catBoard.innerHTML	= "";
				for( var [key, value] of data ) {
					if( key == "휴지통" ) continue;
					if( key == cell ) {		// 선택된 Category는 표시하기
						catBoard.innerHTML	+= "<td style='background-color:#FFBF80; color:white; font-weight: bold;' class='dropzone' onclick=pagedList(1,\"" + key + "\");>" + key + "</td>";
					} else {
						catBoard.innerHTML	+= "<td class='dropzone' onclick=Show.pagedList(1,\"" + key + "\");>" + key + "</td>";
					}
				}
			}
		});
	},

	/** Enter key 인지를 확인 한 후 처리 실행 */
	doSearch0 : function() {
        if( event.which == 13 || event.keyCode == 13 ) {
            Show.searchList(1);
            return false;
        }
        return true;
	},

	/** 검색어와 매치되는 Address 목록 표시 + Paging */
	searchList : function( curPage ) {
		var txt	= a_search.value;
		// 검색어 최소 2자 이상부터 가능
		if( txt.length < 2 ) {
			alert("  최소 글자 수는 2자 이상입니다. \n\r  다시 입력해주세요.");
			return false;
		}

		var cperpage	= 15,
			totalpost	= 0,
			start		= ( curPage - 1 ) * cperpage;

		/** 검색어 일치하는 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
		IndexedDB.countSearch( txt, function( data ) {
			totalpost	= parseInt( data );

			if( totalpost > cperpage ) {
				// 하단 네비게이션 메뉴 바 표시
				//totalcnt.style.backgroundColor	= "#54D1F1";
				//paging.style.backgroundColor	= "#54D1F1";

				if( ! ( curPage > 0 ) )		curPage	= 1;

				var pagePerBlock = 5,	// NavigationBar 항목 갯수
					totalPage	= Math.ceil( totalpost / cperpage ),
					prev		= intval( (curPage - 1) / pagePerBlock ) * pagePerBlock,
					num			= totalPage - prev,
					page_link	= "",
					page		= 0;
				totalcnt.innerHTML	= " &nbsp; [ Total Page : " + curPage + " / " + totalPage + " ]";
				if(num > pagePerBlock)	num = pagePerBlock;
				if( prev )	page_link = "<a onclick='Show.searchList(1);'>[<<]</a> &nbsp; <a onclick='Show.searchList(" + prev + ");'>[<]</a> &nbsp; &nbsp; ";
				for( i = 0 ;  i < num ; i++ ) {
				page = prev + i + 1;
				if ( page == curPage )	page_link += "[" + page + "] &nbsp; ";
				else						page_link += "<a onclick='Show.searchList(" + page + ");' onFocus='this.blur()' style='cursor: pointer;'>" + page + "</a> &nbsp; ";
				}
				var next = page + 1;
				if( totalPage >= next )		page_link += " &nbsp; <a onclick='Show.searchList(" + next + ");'>[>]</a> &nbsp; <a onclick='Show.searchList(" + totalPage + ");'>[>>]</a>";
				paging.innerHTML = page_link;
			} else {
				//totalcnt.style.backgroundColor	= "#FFFFFF";
				//paging.style.backgroundColor	= "#FFFFFF";
				totalcnt.innerHTML	= "";
				paging.innerHTML	= "";
			}
		});

		/** 갯수(cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		IndexedDB.searchStr( start, cperpage, txt, function( data ) {
			var lng	= data.length;
			if( lng == 0 ) Show.searchList( curPage - 1 );
			GVari.addrList = data;
			for( var i = 0 ; i < lng ; i++ ){
				addrBox.innerHTML += "<tr draggable='true'><td>" + data[i].company + "</td><td>" 
					+ data[i].team + "</td><td>" 
					+ data[i].posit + "</td><td>" 
					+ data[i].name + "</td><td>" 
					+ data[i].job + "</td><td>" 
					+ data[i].cell + "</td></tr>";
			}
			Common.tblRollOver(document.getElementById("addrBox"));
		});
	},

	/** 기능 테스트 시험을 위한 행위 */
	b_test : function(){
		//var addrBox	= document.getElementById('addrBox');
		// console.log( GVari.catlists );
		Show.pagedList4Favo();

		// IndexedDB.getFavo( function(data){
		// 	if( data.size == 0 ) {
		// 		console.log("등록된 Favority가 없습니다.");
		// 	} else {
		// 		console.log( data);
		// 	}
		// });
	},

	/** 
	 * "Data 백업" 버튼 
	 * IndexedDB에 저장된 내용을 JSON 포멧으로 출력
	 * 출력 내용은 Data Import 시에 사용 함.
	 * */
	backup : function() {
		var contents  = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		contents	+= '<HTML  xmlns="http://www.w3.org/1999/xhtml"><HEAD>';
		contents	+= '<TITLE>Data Backup</TITLE>';
		contents	+= '</HEAD><BODY>';
		contents	+= '<table class="barList" style="width:100%; font: 70% Verdana; line-height: 18px;">';
		contents	+= '<tbody id="data">';
		contents	+= "<tr><td><br>'['를 포함해서 마지막 ']'까지 포함한 모든 내용을 복사해서 파일로 저장하세요. <br><br></td></tr><tr><td>[</td></tr>";

		var _promise = function () {
			return new Promise(function(resolve, reject) {
				IndexedDB.selectAll( function(data) {
					if( data.length == 0 ) {
						reject(Error("It broke"));
					} else {
						resolve(data);
					}
				});
			});
		};

		_promise().then(function (data) {
			var lng = data.length;
			var lastline = lng -1 ;
			for( var i = 0 ; i < lng ; i++ ) {
				if( i < lastline ) {
					contents += "<tr><td>" + JSON.stringify(data[i]) + ",</td></tr>";
				} else {
					contents += "<tr><td>" + JSON.stringify(data[i]) + "</td></tr>";
				}
			}
			contents	+= '<tr><td>]</td></tr></tbody></table></BODY></HTML>';
				
			var all = window.open('', 'errMsg', 'width=680,height=400,menubar=no,resizable=yes,scrollbars=yes,toolbar=nolocation=no,status=no');
			all.document.write(contents);
			all.document.close();

		}, function (error) {
			// 실패시 
			console.error(error);
		});
	},

	/**
	 * 전체 Address 목록 표시
	 * curPage : 시작 페이지
	 * cat : 분류 이름, 전체는 "ALL"
	 */
	pagedList : function ( curPage, cat ) {
		GVari.sel_curPage	= curPage;
		GVari.sel_Category	= cat;

		var cperpage	= 15,
			totalpost	= 0,
			start		= ( curPage - 1 ) * cperpage;

		/** 상단 Category 매뉴 표시 */
		Show.catDisplay();

		/** 전체 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
		IndexedDB.countCat( cat, function( data ) {
			totalpost	= parseInt( data );

			// console.log( "Count : "  + cat + " : " + data );
			if( totalpost > cperpage ) {
				// 하단 네비게이션 메뉴 바 표시
				//totalcnt.style.backgroundColor	= "#54D1F1";
				//paging.style.backgroundColor	= "#54D1F1";

				if( ! ( curPage > 0 ) )		curPage	= 1;

				var pagePerBlock = 5,	// NavigationBar 항목 갯수
					totalPage	= Math.ceil( totalpost / cperpage ),
					prev		= intval( (curPage - 1) / pagePerBlock ) * pagePerBlock,
					num			= totalPage - prev,
					page_link	= "",
					page		= 0;
				totalcnt.innerHTML	= "[ " + curPage + " / " + totalPage + " ]";
				if(num > pagePerBlock)	num = pagePerBlock;
				if( prev )	page_link = "<a onclick='Show.pagedList(1,\"" + cat + "\");'>[<<]</a> &nbsp; <a onclick='Show.pagedList(" + prev + ",\"" + cat + "\");'>[<]</a> &nbsp; &nbsp; ";
				for( i = 0 ;  i < num ; i++ ) {
				page = prev + i + 1;
				if ( page == curPage )	page_link += "[" + page + "] &nbsp; ";
				else						page_link += "<a onclick='Show.pagedList(" + page + ",\"" + cat + "\");' onFocus='this.blur()' style='cursor: pointer;'>" + page + "</a> &nbsp; ";
				}
				var next = page + 1;
				if( totalPage >= next )		page_link += " &nbsp; <a onclick='Show.pagedList(" + next + ",\"" + cat + "\");'>[>]</a> &nbsp; <a onclick='Show.pagedList(" + totalPage + ",\"" + cat + "\");'>[>>]</a>";
				paging.innerHTML = page_link;
			} else {
				//totalcnt.style.backgroundColor	= "#FFFFFF";
				//paging.style.backgroundColor	= "#FFFFFF";
				totalcnt.innerHTML	= "[ 1 / 1 ]";
				paging.innerHTML	= "[1]";
			}
		});

		/** 갯수(cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		IndexedDB.getData( start, cperpage, cat ).then( function( data ) {
			var lng	= data.length;
			if( lng == 0 ) Show.pagedList( curPage - 1, cat );
			GVari.addrList = data;
			for( var i = 0 ; i < lng ; i++ ){
				addrBox.innerHTML += "<tr draggable='true'><td>" + data[i].company + "</td><td>" 
					+ data[i].team + "</td><td>" 
					+ data[i].posit + "</td><td>" 
					+ data[i].name + "</td><td>" 
					+ data[i].job + "</td><td>" 
					+ data[i].cell + "</td></tr>";
			}
			Common.tblRollOver(document.getElementById("addrBox"));

		});

		document.getElementById("list_div").style.display	= 'block';
	},

	/**
	 * 전체 Address 목록 표시
	 * curPage : 시작 페이지
	 * cat : 분류 이름, 전체는 "ALL"
	 */
	pagedList4Favo : function () {

		GVari.sel_Category	= "";
		Show.catDisplay();

		/** 갯수(15) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		IndexedDB.getFavo( 15, function( data ) {
			var lng	= data.length;
			GVari.addrList = data;
			for( var i = 0 ; i < lng ; i++ ){
				addrBox.innerHTML += "<tr><td>" + data[i].company + "</td><td>" 
					+ data[i].team + "</td><td>" 
					+ data[i].posit + "</td><td>" 
					+ data[i].name + "</td><td>" 
					+ data[i].job + "</td><td>" 
					+ data[i].cell + "</td></tr>";
			}
			Common.tblRollOver(document.getElementById("addrBox"));
		});
		totalcnt.innerHTML	= "";
		paging.innerHTML	= "[ Top 15 Address List ]";
		document.getElementById("list_div").style.display	= 'block';
	},

};

var Doing = {

	/** 조회수 Counting */
	cntChkFavo : function() {
		var addr	= GVari.addr;
		if( addr.favo == undefined )	addr.favo	= 1;
		else							addr.favo	= addr.favo + 1;

		IndexedDB.insert(addr,function(data){
			if( data == true ) {
				//console.log ( addr.name + " : 이동 완료." );
				//Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
			} else {
				console.log( "조회수 Counting 중 오류 발생." );
			}
		});
	},

	/** "등록" 버튼 */
	insert : function() {
		var addr = {
			pos:0,
			cat:i_cat.value,
			company:i_company.value,
			depart:i_depart.value, 
			team:i_team.value, 
			posit:i_posit.value, 
			name:i_name.value, 
			job:i_job.value, 
			phone:i_phone.value, 
			cell:i_cell.value, 
			email:i_email.value, 
			etc:i_etc.value,
			favo:parseInt( i_favo.value )
			//id:
		}

		/** 해당 분류에 마지막 pos 값을 구한 후 등록 진행 */
		GVari.addr	= addr;
		GVari.sel_curPage	= 1;
		GVari.sel_Category	= addr.cat;
		Doing.movingAddr( i_cat.value, addr );
		Show.details();
	},

	/** "삭제" 버튼 */
	remove : function() {

		var data	= GVari.addr;
		var precat	= data.cat;
		if( data.id == "" ) {
			alert( "선택된 Address가 없습니다.\n\n선택 후 삭제하십시오." );
			return false;
		}

		var postData	= "선택된 " + data.name + "를 삭제 하시겠습니까?\n";
			postData	+= "\n구분 : " + data.cat;
			postData	+= "\n회사 : " + data.company;
			postData	+= "\n부서 : " + data.depart;
			postData	+= "\n팀 : " + data.team;
			postData	+= "\n직급 : " + data.posit;
			postData	+= "\n업무 : " + data.job;
			postData	+= "\n회사 전화 : " + data.phone;
			postData	+= "\n휴대 전화 : " + data.cell;
			postData	+= "\ne-Mail : " + data.email;
			postData	+= "\n기타 : " + data.etc;
			postData	+= "\n순번 : " + data.pos;
			postData	+= "\n조회수 : " + data.favo;

		if( confirm( postData ) ) {
			Doing.movingAddr( "휴지통" , data );
			//clearForm();
			Show.offDetail();
			//pagedList(1, precat );
		}
	},

	/** 지정된 Category로 Address 이동 */
	movingAddr : function ( cat, addr ) {

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
					//console.log ( addr.name + " : 이동 완료." );
					Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
				} else {
					console.log( "이동 중 오류가 발생하였습니다." );
				}
			});
		});
	},

	/** 수정 내용 저장 */
	update : function() {

		var data= GVari.addr;
		var selID = parseInt( data.id );
		if ( selID == 0 ) {
			alert( "수정할 수 없습니다. ( 아래 이유 참고 ) \r\n 1.기존에 등록된 주소가 아닙니다. 등록 버튼을 누르세요." );
			return false;
		}
		var addr = {
			id:selID,	// id 변경 불가
			cat:i_cat.value,
			company:i_company.value,
			depart:i_depart.value, 
			team:i_team.value, 
			posit:i_posit.value, 
			name:i_name.value, 
			job:i_job.value, 
			phone:i_phone.value, 
			cell:i_cell.value, 
			email:i_email.value, 
			etc:i_etc.value,
			favo:parseInt( i_favo.value ),
			pos:parseInt( data.pos )	// pos 변경 불가
		}

		/** 분류(Category)가 수정이 되었는지 확인 */
		if( data.cat == i_cat.value ) {	// 분류(Category)가 변경되지 않은 경우, pos를 제외하고 변경
			// console.log( addr );
			IndexedDB.insert(addr,function(data){
				//dashboard.innerHTML	= "";
				if(data == true){
					// console.log( "수정 완료" );
				} else {
					alert( "수정되지 않았습니다. \n전체적으로 확인 후 다시 시도하세요." );
				}
			});
		} else {	// 분류(Category)가 변경된 경우 분류(Category)의 마지막 addr로 pos를 이동
			Doing.movingAddr( i_cat.value, addr );
			//pagedList(GVari.sel_curPage, GVari.sel_Category );
			alert( "변경된 내용은 " + data.cat + "에서 " + i_cat.value + "로 이동되어 저장이 되었습니다." );
		}
		GVari.addr	= addr;
		Show.details();
	},

	/** 전체 데이터 삭제 */
	db_delete : function() {

		var postData	= "전체 데이터를 삭제하시겠습니까?";
		if( confirm( postData ) ) {
			IndexedDB.deleteAll( function(isOk){
				if(isOk == true) {
					alert( "전체 데이터 삭제 작업 완료." );
				} else {
					alert( "전체 데이터 삭제 작업 실패. <br> 브라우저 재실행 후 다시 시도하세요." );
				}
			});
			Show.catDisplay();
		}

	},

	addrfile : function() {
		var file = this.files[0];
		console.log( "파일로 부터 데이터를 읽어오는 중입니다." );
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
				Show.catDisplay();
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
	}
	
	
};

/* Address Book */

function clearForm() {
	i_id.value		= 0;
	i_name.value	= "";
	i_cat.value		= "";
	i_company.value	= "";
	i_depart.value	= "";
	i_team.value	= "";
	i_posit.value	= "";
	i_name.value	= "";
	i_job.value		= "";
	i_phone.value	= "";
	i_cell.value	= "";
	i_email.value	= "";
	i_etc.value		= "";
	i_pos.value		= 0;
	i_favo.value	= 0;
};

/* File Control Zone */
function isText(type){
	return type.match(/^text/g);
}

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
							Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
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

    IndexedDB.GetUniqueValue( 'catIdx', function(data){
		if( data.size != 0 ) {
			GVari.catlists = "<datalist id='catlists'>";
			for( var [key, value] of data ) {
				GVari.catlists	+= "<option value='" + key + "'/>";
			}
			GVari.catlists += "</datalist>";
		}
    });

    IndexedDB.GetUniqueValue( 'companyIdx', function(data){
		if( data.size != 0 ) {
			GVari.comlists = "<datalist id='comlists'>";
			for( var [key, value] of data ) {
				GVari.comlists	+= "<option value='" + key + "'/>";
			}	
			GVari.comlists += "</datalist>";
		}
    });
	
    IndexedDB.GetUniqueValue( 'departIdx', function(data){
		if( data.size != 0 ) {
			GVari.deplists = "<datalist id='deplists'>";
			for( var [key, value] of data ) {
				GVari.deplists	+= "<option value='" + key + "'/>";
			}	
			GVari.deplists += "</datalist>";
		}
    });

    IndexedDB.GetUniqueValue( 'teamIdx', function(data){
		if( data.size != 0 ) {
			GVari.tealists = "<datalist id='tealists'>";
			for( var [key, value] of data ) {
				GVari.tealists	+= "<option value='" + key + "'/>";
			}	
			GVari.tealists += "</datalist>";
		}
    });

    IndexedDB.GetUniqueValue( 'positIdx', function(data){
		if( data.size != 0 ) {
			GVari.poslists = "<datalist id='poslists'>";
			for( var [key, value] of data ) {
				GVari.poslists	+= "<option value='" + key + "'/>";
			}
			GVari.poslists += "</datalist>";
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
