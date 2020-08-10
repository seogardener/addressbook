
window.onload = function() {
	utils.addListener( document.getElementById('addrBox'),   "click",   Show.details );
	utils.addListener( document.getElementById('favofile0'), "change",  Doing.favofile );
	utils.addListener( document.getElementById('favofile'),  "change",  Doing.favofile );

	Show.catDisplay();
	Show.pagedList4Favo();
	Show.genDatalists();
}

FavoritesDB.checkDB();
FavoritesDB.createSchema('id');

/** 변경전 Addr의 내용이 저장 */
var GVari = {
	addrList	: [],	// 목록 내용 저장
	addr		: [],	// 선택된 Address
	cperpage	: 20,	// 목록 화면에 보여지는 주소의 갯수
	sel_Category: "",	// 선택된 Category
	sel_curPage : 1,	// 선택된 현재 page
	catlists	: "",
	poslists	: ""
};

var Show = {

	/** "전체 목록" 버튼 : 전체 Address 목록 표시 20200806 */
	b_list : function() {
		Show.pagedList( 1, "ALL" );
	},

	/** Dummy 연락처 생성 20200805 **/
	b_genData : function() {

		var catArr =["광고","디자인","홈페이지","패션","컨셉","칼라","팬시","에이전시","스타일","클럽"]
		var catArr2 =["advert","design","homepage","fasion","concept","color","fancy","agency","style","club"]
		var catVal = Math.floor( Math.random() * 10 );
		var val = Math.floor(1000 + Math.random() * 9000);

		i_cat.value		= catArr[catVal];			//  협력사, 가족사, 퇴사자, 전직동료, 친구, 가족
		i_name.value	= catArr[catVal] + val;
		i_url.value		= "www." + catArr2[catVal] + val + ".com";	// www.naver.com
		i_hint.value	= catArr2[catVal] + "/admin" + val;	// 인증 관련 Hint
		detail_etc.value= catArr[catVal] + " / " + catArr2[catVal] + " / " + val;
		i_favo.value	= catVal;
	},

	/** 목록에서 선택한 Address에 대한 상세 정보를 보여줌. 20200805  */
	details : function( event ) {
		var data = [], clickElement, idx;

		if( event == undefined ) {	// 직접 호출인 경우
			data	= GVari.addr;
		} else {					// list를 통한 선택 호출이 경우
			clickElement	= event.target || event.srcElement;
			idx				= clickElement.parentNode.rowIndex - 1;
			data			= GVari.addrList[idx];
			GVari.addr		= data;		// 변경전 Addr 저장, Global Variable
		}

		cltitle.innerHTML		= data.cat + " &nbsp; " + data.name;
		td_title2.innerHTML		= "<b onclick='Doing.remove();'>삭제</b> | <b onclick='Show.update();'>수정</b>";

		if( data.favo == undefined )	data.favo	= 1;

		detail_update.innerHTML		= " &nbsp; " + data.update + " &nbsp; ";
		detail_cat.innerHTML		= " &nbsp; " + data.cat;
		detail_name.innerHTML		= " &nbsp; " + data.name;
		detail_url.innerHTML		= " &nbsp; " + data.url;
		detail_hint.innerHTML		= " &nbsp; " + data.hint;
		/**
		 * var array = textbox.value.split(/\r\n|\r|\n/)  <-- 쪼개서 저장
		 * textbox.value = array.join("\r\n");	<-- CRLF를 붙여서 출력
		 */
		detail_etc.value			= data.etc.split(/\r\n|\r|\n/).join("\r\n");
		detail_etc.readOnly			= true;
		detail_favo.innerHTML		= " &nbsp; " + data.pos + " / " + data.favo;

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>닫기</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	/** 상세보기 Lightbox 닫기 20200806 */
	offDetail : function() {
		Doing.cntChkFavo();
		document.getElementById("address_detail_view").style.display	= 'none';
	},

	/** 즐겨찾기 등록 20200805 */
	insert : function( event ) {
		cltitle.innerHTML		= " 즐겨찾기 URL 등록 ";
		td_title2.innerHTML		= "<b onclick='Show.b_genData();'>자동 생성</b>";

		detail_update.innerHTML		= "  &nbsp; " + now() + " &nbsp; ";
		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat list="catlists" placeholder="선택 또는 등록(20자)" required>' + GVari.catlists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name placeholder="최대 20자" required>';
		detail_url.innerHTML		= '  &nbsp; <input type=text id=i_url placeholder="최대 40자" required  size=50>';
		detail_hint.innerHTML		= '  &nbsp; <input type=text id=i_hint placeholder="최대 20자" required>';
		detail_etc.value			= "";
		detail_etc.readOnly			= false;

		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo placeholder="숫자 입력">';

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>취소</b> | <b onclick='Doing.insert();'>등록</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	/** 즐겨찾기 수정 20200805 */
	update : function( event ) {
		var data	= GVari.addr;

		cltitle.innerHTML		= data.name + " 정보 수정";
		td_title2.innerHTML		= "<b onclick='Show.details();'>취소</b>";

		if( data.favo == undefined )	data.favo	= 1;

		detail_update.innerHTML		= "  &nbsp; " + data.update + " &nbsp; ";
		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat value="' + data.cat + '" list="catlists">' + GVari.catlists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name value="' + data.name + '">';
		detail_url.innerHTML		= '  &nbsp; <input type=text id=i_url value="' + data.url + '">';
		detail_hint.innerHTML		= '  &nbsp; <input type=text id=i_hint value="' + data.hint + '">';
		detail_etc.value			= data.etc;
		detail_etc.readOnly			= false;
		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo value="' + data.favo + '">';

		cbutton.innerHTML	= "<b onclick='Show.details();'>취소</b> | <b onclick='Doing.update();'>적용</b>";
	},

	/** 상단 각 분류 표시 20200805 */
	catDisplay : function() {
		var cell	= "";
		if( GVari !== undefined ) {
			cell	= GVari.sel_Category;
		}
		FavoritesDB.GroupByMenu( function(data){
			if( data.size == 0 ) {
				document.getElementById("welcom_div").style.display	= 'block';
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
				document.getElementById("list_div").style.display	= 'block';
				document.getElementById("bottom_div").style.display	= 'block';
				document.getElementById("welcom_div").style.display	= 'none';
			}
		});
	},

	/** 조회 입력 창 ,Enter key 인지를 확인 한 후 처리 실행 20200806 */
	doSearch0 : function() {
        if( event.which == 13 || event.keyCode == 13 ) {
            Show.searchList(1);
            return false;
        }
        return true;
	},

	/** 검색어와 매치되는 Address 목록 표시 + Paging 20200806 */
	searchList : function( curPage ) {
		var txt	= a_search.value;
		// 검색어 최소 2자 이상부터 가능
		if( txt.length < 2 ) {
			alert("  최소 글자 수는 2자 이상입니다. \n\r  다시 입력해주세요.");
			return false;
		}

		var totalpost	= 0,
			start		= ( curPage - 1 ) * GVari.cperpage;

		/** 검색어 일치하는 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
		FavoritesDB.countSearch( txt, function( data ) {
			totalpost	= parseInt( data );

			if( totalpost > GVari.cperpage ) {
				// 하단 네비게이션 메뉴 바 표시
				//totalcnt.style.backgroundColor	= "#54D1F1";
				//paging.style.backgroundColor	= "#54D1F1";

				if( ! ( curPage > 0 ) )		curPage	= 1;

				var pagePerBlock = 5,	// NavigationBar 항목 갯수
					totalPage	= Math.ceil( totalpost / GVari.cperpage ),
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

		/** 갯수(GVari.cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		FavoritesDB.searchStr( start, GVari.cperpage, txt, function( data ) {
			var lng	= data.length;
			if( lng == 0 ) Show.searchList( curPage - 1 );
			GVari.addrList = data;
			for( var i = 0 ; i < lng ; i++ ){
				addrBox.innerHTML += "<tr draggable='true'><td>" + data[i].name + "</td><td>" 
					+ data[i].url + "</td><td>" 
					+ data[i].hint + "</td><td>" 
					+ data[i].update + "</td><td>" 
					+ data[i].favo + "</td></tr>";
			}
			Common.tblRollOver(document.getElementById("addrBox"));
		});
	},

	/** 기능 테스트 시험을 위한 행위 */
	b_test : function(){

		var contents  = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		contents	+= '<HTML  xmlns="http://www.w3.org/1999/xhtml"><HEAD>';
		contents	+= '<TITLE>F5 :: Error Messages.</TITLE>';
		contents	+= '<link rel=stylesheet href="/separt/css/addressbook.css" type="text/css">';
		contents	+= '<script type="text/javascript">';
		contents	+= 'window.onload = function () {';
		contents	+= '  opener.utils.addListener( document.getElementById(\'errmsgs\'), "click",  opener.Show.click_err );';
		contents	+= '};';
		contents	+= ' </script>';
		contents	+= '</HEAD><BODY>';
		contents	+= '<center>';
		
		contents	+= '<table class="barList" style="width:100%; font: 70% Verdana; line-height: 22px;">';
		contents	+= '<thead>';
		contents	+= '<tr><th colspan=5>사용자 이모티콘 선택</th></tr>';
		contents	+= '</thead>';
		contents	+= '<tbody id="errmsgs">';

		var idLng	= Object.keys(GVari.idPhotos).length + 1;
		var i		= 1;
		for(  ; i < idLng ; i++ ) {
			if( i%5 == 1 ) {	contents	+= '<tr>';	}		// tr 열기
			contents	+= '<td><img src="img/' + GVari.idPhotos[i] + '"></td>';
			if( i%5 == 0 ) {	contents	+= '</tr>';	}		// tr 닫기
		}
		// tr 당 모자른 td 를 채움
		for( var j = ( 5 - ( i - 1 ) % 5 ) ; j > 0 ; j-- ) {
			contents	+= '<td>x</td>';
		}
		contents	+= '</tr>';
		
		contents	+= '</tbody></table></BODY></HTML>';
		
		var all = window.open('', 'errMsg', 'width=680,height=400,menubar=no,resizable=yes,scrollbars=yes,toolbar=nolocation=no,status=no');
		all.document.write(contents);
		all.document.close();
	},

	/** 
	 * "Data 백업" 버튼  20200805
	 * FavoritesDB에 저장된 내용을 JSON 포멧으로 출력
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
				FavoritesDB.selectAll( function(data) {
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

	/** 휴지통 보기 20200805 */
	trashcan : function() {
		Show.pagedList( 1, "휴지통" );
	},

	/**
	 * 전체 Address 목록 표시 20200805
	 * curPage : 시작 페이지
	 * cat : 분류 이름, 전체는 "ALL"
	 */
	pagedList : function ( curPage, cat ) {
		GVari.sel_curPage	= curPage;
		GVari.sel_Category	= cat;

		var totalpost	= 0,
			start		= ( curPage - 1 ) * GVari.cperpage;

		/** 상단 Category 매뉴 표시 */
		Show.catDisplay();

		/** 전체 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
		FavoritesDB.countCat( cat, function( data ) {
			totalpost	= parseInt( data );

			if( totalpost > GVari.cperpage ) {
				// 하단 네비게이션 메뉴 바 표시
				if( ! ( curPage > 0 ) )		curPage	= 1;

				var pagePerBlock = 5,	// NavigationBar 항목 갯수
					totalPage	= Math.ceil( totalpost / GVari.cperpage ),
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
				totalcnt.innerHTML	= "[ 1 / 1 ]";
				paging.innerHTML	= "[1]";
			}
		});

		/** 갯수(GVari.cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		FavoritesDB.getData( start, GVari.cperpage, cat ).then( function( data ) {
			var lng	= data.length;
			if( curPage != 1 && lng == 0 ) Show.pagedList( curPage - 1, cat );
			if( lng != 0 ) {
				GVari.addrList = data;
				for( var i = 0 ; i < lng ; i++ ){
					addrBox.innerHTML += "<tr draggable='true'><td>" + data[i].name + "</td><td>" 
						+ data[i].url + "</td><td>" 
						+ data[i].hint + "</td><td>" 
						+ data[i].update + "</td><td>" 
						+ data[i].favo + "</td></tr>";
				}
				Common.tblRollOver(document.getElementById("addrBox"));
			}
		});
	},

	/**
	 * 전체 Address 목록 표시 20200805
	 * curPage : 시작 페이지
	 * cat : 분류 이름, 전체는 "ALL"
	 */
	pagedList4Favo : function () {

		GVari.sel_Category	= "";
		Show.catDisplay();

		/** 갯수(GVari.cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		FavoritesDB.getFavo( GVari.cperpage, function( data ) {
			var lng	= data.length;
			GVari.addrList = data;
			for( var i = 0 ; i < lng ; i++ ){
				addrBox.innerHTML += "<tr><td>" + data[i].name + "</td><td>" 
					+ data[i].url + "</td><td>" 
					+ data[i].hint + "</td><td>" 
					+ data[i].update + "</td><td>" 
					+ data[i].favo + "</td></tr>";
			}
			Common.tblRollOver(document.getElementById("addrBox"));
		});
		totalcnt.innerHTML	= "";
		paging.innerHTML	= "[ Top " + GVari.cperpage + " Address List ]";
	},

	/** 구분, 회사, 부서, 팀, 직급에 대한 목록을 Select Box로 구성함. 20200806 */
	genDatalists : function() {

		FavoritesDB.GetUniqueValue( 'catIdx', function(data){
			if( data.size != 0 ) {
				GVari.catlists = "<datalist id='catlists'>";
				for( var [key, value] of data ) {
					GVari.catlists	+= "<option value='" + key + "'/>";
				}
				GVari.catlists += "</datalist>";
			}
		});
	},

	/** 필수 입력 항목 검사 20200805 */
	checkRequiredInput : function( data ) {
		var errMsg	= "";

		if( data.cat == "" )	errMsg	+= "구분 ex) 가족, 협력업체, 동료,..\n";
		if( data.name == "" )	errMsg	+= "즐겨찾기 이름 : 최소 2글자 이상\n";
		if( data.url == "" )	errMsg	+= "즐겨찾기 URL : 최소 10글자 이상\n";
		if( errMsg == "" ) {
			return true;
		} else {
			alert( "필수 입력 내용이 빠졌습니다.\n\n" + errMsg + "\n위의 내용을 입력해 주세요.");
			return false;
		}
	}
};

var Doing = {

	/** 조회수 Counting 20200805 */
	cntChkFavo : function() {
		var addr	= GVari.addr;
		if( addr.favo == undefined )	addr.favo	= 1;
		else							addr.favo	= addr.favo + 1;

		FavoritesDB.insert(addr,function(data){
			if( data != false ) {
				//console.log ( addr.name + " : 이동 완료." );
				//Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
			} else {
				console.log( "조회수 Counting 중 오류 발생." );
			}
		});
	},

	/** "등록" 버튼 20200805 */
	insert : function() {
		var addr = {
			pos:0,
			cat:i_cat.value,
			name:i_name.value, 
			url:i_url.value,
			hint:i_hint.value, 
			etc:detail_etc.value,
			favo:parseInt( i_favo.value ),
			update:now(),
			//id:
		}

		if( Show.checkRequiredInput( addr ) ) {
			/** 해당 분류에 마지막 pos 값을 구한 후 등록 진행 */
			GVari.addr			= addr;
			GVari.sel_curPage	= 1;
			GVari.sel_Category	= addr.cat;
			Doing.movingAddr( i_cat.value, addr );
			Show.details();
		}
	},

	/** "삭제" 실행 20200806 */
	remove : function() {

		var data	= GVari.addr;
		var precat	= data.cat;
		if( data.id == "" ) {
			alert( "선택된 즐겨찾기가 없습니다.\n\n선택 후 삭제하십시오." );
			return false;
		}

		var postData	= "선택된 즐겨찾기( " + data.name + " )를 삭제 하시겠습니까?\n";
			postData	+= "\n구분 : " + data.cat;
			postData	+= "\n이름 : " + data.name;
			postData	+= "\nURL : " + data.url;
			postData	+= "\nHint : " + data.hint;
			postData	+= "\n기타 : " + data.etc;
			postData	+= "\n조회수 : " + data.favo;

		if( confirm( postData ) ) {
			Doing.movingAddr( "휴지통" , data );
			Show.offDetail();
		}
	},

	/** 지정된 Category로 Address 이동 20200805 */
	movingAddr : function ( cat, addr ) {

		// 선택된 분류(Cat)에 위치(pos)의 최대값 가져오기
		var _promise = function () {
			return new Promise(function(resolve, reject) {
				FavoritesDB.getCatMaxValue( cat, function(data){
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
			addr.cat	= cat;
			addr.pos	= parseInt( data );
			FavoritesDB.insert(addr,function(data){
				if( data != false ) {
					GVari.addr.id	= data;
					Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
				} else {
					console.log( "이동 중 오류가 발생하였습니다." );
				}
			});
		});
	},

	/** 수정 내용 저장 20200805 */
	update : function() {

		var data	= GVari.addr;
		var selID	= parseInt( data.id );
		if ( selID == 0 ) {
			alert( "수정할 수 없습니다. ( 아래 이유 참고 ) \r\n 1.기존에 등록된 주소가 아닙니다. 등록 버튼을 누르세요." );
			return false;
		}
		var addr = {
			id:selID,	// id 변경 불가
			cat:i_cat.value,
			name:i_name.value, 
			url:i_url.value, 
			hint:i_hint.value,
			etc:detail_etc.value,
			favo:parseInt( i_favo.value ),
			pos:parseInt( data.pos ),	// pos 변경 불가
			update:now(),
		}

		if( Show.checkRequiredInput( addr ) ) {
			/** 분류(Category)가 수정이 되었는지 확인 */
			if( data.cat == i_cat.value ) {	// 분류(Category)가 변경되지 않은 경우, pos를 제외하고 변경
				FavoritesDB.insert(addr,function(data){
					if(data != false){
						// console.log( "수정 완료" );
					} else {
						alert( "수정되지 않았습니다. \n전체적으로 확인 후 다시 시도하세요." );
					}
				});
			} else {	// 분류(Category)가 변경된 경우 분류(Category)의 마지막 addr로 pos를 이동
				Doing.movingAddr( i_cat.value, addr );
				alert( "변경된 내용은 " + data.cat + "에서 " + i_cat.value + "로 이동되어 저장이 되었습니다." );
			}
			Show.pagedList(GVari.sel_curPage, i_cat.value );
			GVari.addr	= addr;
			Show.details();
		}
	},

	/** 전체 데이터 삭제 20200806 */
	db_delete : function() {

		var postData	= "전체 즐겨찾기 데이터를 삭제하시겠습니까?";
		if( confirm( postData ) ) {
			FavoritesDB.deleteAll( function(isOk){
				if(isOk == true) {
					alert( "전체 즐겨찾기 데이터 삭제 작업 완료." );
					location.reload();
				} else {
					alert( "전체 즐겨찾기 데이터 삭제 작업 실패. <br> 브라우저 재실행 후 다시 시도하세요." );
				}
			});
		}
	},

	/** 일괄 입력 (파일) 20200806 */
	favofile : function() {
		console.log("시작");
		var file = this.files[0];
		console.log( "파일로 부터 데이터를 읽어오는 중입니다." );
		var fReader = new FileReader();
		fReader.addEventListener("load", function(e){
			console.log("파일 읽기 완료");
			if(isText(file.type)){
				var content = JSON.parse( fReader.result );
				
				var lng = content.length;
				for( var i = 0 ; i < lng ; i++ ) {
					FavoritesDB.insert(content[i],function(data){
						if(data != false){
							console.log( "Data 추가 중 ... [" + i + "/" + lng + "]" );
						}
					});
				}
				Show.catDisplay();
				Show.pagedList4Favo();
				Show.genDatalists();
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

/* File Control Zone */
function isText(type){
	return type.match(/^text/g);
}

/* Drag&Drop Zone */
var g_oldidx;

// images-preloader
(new Image()).src = "img/dragImage.png";

/* events fired on the draggable target */
document.addEventListener("drag", function( event ) { 
	var clickElement	= event.target || event.srcElement;
	g_oldidx			= clickElement.rowIndex - 1;
}, false);

document.addEventListener("dragstart", function( event ) {
	// store a ref. on the dragged elem
	var clickElement	= event.target || event.srcElement;

	clickElement.style.opacity = 5;
	clickElement.style.border = "1px solid #cccccc";
	
	var img = new Image();
	img.src = "img/dragImage.png";
	event.dataTransfer.setDragImage(img, 25, 25);
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
// 선택된 항목을 끌면서 아래에 놓이게 되는 항목에 대한 액션
document.addEventListener("dragenter", function( event ) {
	var clickElement	= event.target || event.srcElement;
	var g_newidx		= clickElement.parentNode.rowIndex - 1;
	var seltLine		= g_oldidx;
	var overLine		= g_newidx;

	/** 
	 * 화면 표현 문제 해결
	 * 
	 * 선택된 항목(주소록)을 위쪽으로 이동시키기 위해 끌어 올리는 경우 아래에 놓여지는 항목의 위쪽으로 이동이 됨으로 항목의 위쪽 테두리를 두껍게 표시하여 이동하는 위치를 명확하게 표시함.
	 * 선택된 항목을 아래쪽으로 이동시키기 위해 끌어 내리는 경우 아래에 놓여지는 항목의 아래쪽으로 이동이 됨으로 항목의 아래쪽 테두리를 두껍게 표시하여 이동하는 위치를 명확하게 표시함.
	 */
	if( event.target.parentNode.parentNode.id == "addrBox") {
		if( seltLine > overLine ) {
			event.target.parentNode.style.borderTop 	= "3px solid #cccccc";
		} else {
			event.target.parentNode.style.borderBottom  = "3px solid #cccccc";
		}
	} else if( event.target.parentNode.id == "catBoard") {
		event.target.style.fontWeight="bold";
	}
}, false);

// 선택된 항목을 끌면서 아래에 놓였다가 빠져나간 후의 액션
document.addEventListener("dragleave", function( event ) {
	if( event.target.parentNode.parentNode.id == "addrBox") {
		event.target.parentNode.style.borderTop  	= "initial";
		event.target.parentNode.style.borderBottom  = "initial";
	} else if( event.target.parentNode.id == "catBoard") {
		event.target.style.fontWeight="normal";
	}
}, false);

/**
 * 
 * 1
 * 2
 * 3
 * 4
 * 5
 * 6
 * 7
 * 
 */

document.addEventListener("drop", function( event ) {
	// prevent default action (open as link for some elements)
	event.preventDefault();

	//var seledCat	= dragged.parentNode.childNodes[1].childNodes[1].innerHTML;
	var selAddr		= GVari.addrList[g_oldidx];	// 선택된 Address 저장
	var seledCat	= selAddr.cat;				// 끌리고 있는 Address의 Category 이름 저장

	var id			= selAddr.id;
	var oldpos		= selAddr.pos;

	// 현재 보여지는 창에서의 위치 이동 ( 분류 이동이 아닌 같은 분류내의 순서 변경 )
	if( event.target.parentNode.parentNode.id == "addrBox") {
		var clickElement	= event.target || event.srcElement;
		var g_newidx		= clickElement.parentNode.rowIndex - 1;

		var newAddr	= GVari.addrList[g_newidx];	// Drop된 위치에 있는 Address에 대한 정보
		var newCat	= newAddr.cat;				// 놓여진 곳의 Category 이름 저장

		var newpos	= newAddr.pos;

		var start	= 0;
		var end		= 0;
		
		// 범위를 지정하기 위한 시작과 끝값 설정
		if( oldpos > newpos ) {	// 7을 잡아서 3의 자리로 올린 상황
			start	= newpos;
			end		= oldpos;
		} else {				// 3을 잡아서 7의 자리로 내린 상황
			start	= oldpos;
			end		= newpos;
		}

		var _promise = function () {
			return new Promise(function(resolve, reject) {
				FavoritesDB.getPosInRange(seledCat, start, end, function(data){
					resolve( data );
				});
			});	
		};

		_promise().then(function (data) {
			// 범위내에 있는 Address의 Positon 값에 1을 더한다.
			if( oldpos > newpos ) {		// 7을 잡아서 3의 자리로 올린 상황
				for( var i = 0 , lng = data.length ; i < lng ; i++ ){
					data[i].pos	+= 1;	// 3 ~ 6 까지는 모두 1을 더해서 내린다.
					if( data[i].id == id ) {	// 처음에 잡았던 7은 변경할 위치 3으로
						data[i].pos	= newpos;
					}
				}
			} else {	// 3을 잡아서 7의 자리로 내린 상황
				for( var i = 0 , lng = data.length ; i < lng ; i++ ){
					data[i].pos	-= 1;	// 4 ~ 7 까지는 모두 1을 빼서 올린다.
					if( data[i].id == id ) {	// 처음에 잡았던 3은 변경할 위치 7로
						data[i].pos	= newpos;
					}
				}
			}

			// 변경된 데이터를 저장 시킴
			for( var i = 0 , lng = data.length ; i < lng ; i++ ){
				FavoritesDB.insert(data[i],function(rdata){
					if(rdata != false){
						console.log( "Data 추가 중 ... [" + i + "/" + lng + "]" );
					}
				});
			}
			// 위치 변경 후 목록 갱신
			Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
		});
	} else if( event.target.parentNode.id == "catBoard") {
		var newCat	= event.target.innerText;
		event.target.style.background = "";

		if( seledCat != newCat ) {			// 선택한 Address를 Drop한 위치의 Category가 다른 경우
			var _promise2 = function () {	// 선택된 Category내의 최대 Pos 값에 +1 한 값을 리턴한다
				return new Promise(function(resolve, reject) {
					FavoritesDB.getCatMaxValue( newCat ,function(data){
						resolve(parseInt( data ));
					});
				});
			};
			_promise2().then(function (nextPos) {
				var data	= selAddr;

				data.cat = newCat;	// 바뀐 Category로 변경
				data.pos = nextPos;	// Category내의 마지막 Pos 값으로 위치 지정
				
				FavoritesDB.insert(data,function(data){		// 바뀐 정보로 Update
					if( data != false ) {
						// 위치 이동 후 목록 갱신
						Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
					} else {
						console.log( "이동 중 오류가 발생하였습니다." );
					}
				});
			});
		} else {
			console.log( "동일 분류로 이동할 수 없습니다." );
		}
	}
}, false);

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
