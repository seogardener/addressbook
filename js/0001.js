
window.onload = function() {
	utils.addListener( document.getElementById('addrBox'),   "click",   Show.details );
	utils.addListener( document.getElementById('addrfile0'), "change",  Doing.addrfile );
	utils.addListener( document.getElementById('addrfile'),  "change",  Doing.addrfile );

	Show.catDisplay();
	Show.pagedList4Favo();
	Show.genDatalists();
	
}

IndexedDB.checkDB();
IndexedDB.createSchema('id');

/** 변경전 Addr의 내용이 저장 */
var GVari = {
	addrList	: [],	// 목록 내용 저장
	addr		: [],	// 선택된 Address
	cperpage	: 20,	// 목록 화면에 보여지는 주소의 갯수
	sel_Category: "",	// 선택된 Category
	sel_curPage : 1,	// 선택된 현재 page
	catlists	: "",
	comlists	: "",
	deplists	: "",
	tealists	: "",
	poslists	: "",
	defIdPhoto	: "012.png",
	idPhotoPath	: "img/idPhoto/",
	idPhotos	: {
		  1 : "001.png",  2 : "002.png",  3 : "003.png",  4 : "004.png",  5 : "005.png",
		  6 : "006.png",  7 : "007.png",  8 : "008.png",  9 : "009.png", 10 : "010.png",
		 11 : "011.png", 12 : "012.png", 13 : "013.png", 14 : "014.png", 15 : "015.png",
		 16 : "016.png", 17 : "017.png", 18 : "018.png"
		}
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
			i_cat.value = "직장동료";			//  협력사, 가족사, 퇴사자, 전직동료, 친구, 가족
			i_company.value	= "YOUTUBE";	// 구글, 오라클, IBM, EMC, 애플, 삼성, SONY, PHILIPS, YOUTUBE
			i_depart.value	= "기술본부";	// 경영지원본부 , 기술본부, 사업1본부, 사업3본부, 교육평가연구소,
			i_team.value	= "개발1팀";	// 경영지원팀, 재무팀, 평가팀, 유학사업팀, 콘텐츠사업팀, 신규사업팀, 서비스운영팀, 서비스전략팀, 서비스영업팀, 마케팅사업팀, 디자인팀, 법무팀
			i_posit.value	= "매니저" + val;
			i_name.value	= "홍" + val;
			i_job.value		= "시스템" + val;
			i_phone.value	= "02-0000-" + val;
			i_cell.value	= "010-0000-" + val;
			i_email.value	= val + "@gmail.com";
			detail_etc.value= val;
			i_favo.value	= 0;
			//i_pos.value	= i;
			//i_id.value	= "";
			
			val = Math.floor(1000 + Math.random() * 9000);
		}
	},

	/** 목록에서 선택한 Address에 대한 상세 정보를 보여줌. */
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

		cltitle.innerHTML		= data.company + " &nbsp; " + data.job + " &nbsp; " + data.name + " &nbsp; " + data.posit;
		td_title2.innerHTML		= "<b onclick='Doing.remove();'>삭제</b> | <b onclick='Show.update();'>수정</b>";

		if( data.favo == undefined )	data.favo	= 1;

		detail_update.innerHTML		= " &nbsp; " + now() + " &nbsp; ";
		detail_cat.innerHTML		= " &nbsp; " + data.cat;
		detail_company.innerHTML	= " &nbsp; " + data.company;
		detail_depart.innerHTML		= " &nbsp; " + data.depart;
		detail_team.innerHTML		= " &nbsp; " + data.team;
		detail_posit.innerHTML		= " &nbsp; " + data.posit;
		detail_name.innerHTML		= " &nbsp; " + data.name;
		detail_job.innerHTML		= " &nbsp; " + data.job;
		detail_phone.innerHTML		= " &nbsp; " + data.phone;
		detail_cellphone.innerHTML	= " &nbsp; " + data.cell;
		detail_email.innerHTML		= " &nbsp; " + data.email;
		/**
		 * var array = textbox.value.split(/\r\n|\r|\n/)  <-- 쪼개서 저장
		 * textbox.value = array.join("\r\n");	<-- CRLF를 붙여서 출력
		 */
		detail_etc.value			= data.etc.split(/\r\n|\r|\n/).join("\r\n");
		detail_etc.readOnly			= true;
		detail_favo.innerHTML		= " &nbsp; " + data.pos + " / " + data.favo;
		idphoto.src					= Show.photoImg( data.photo );
		detail_photo.innerHTML		= "";
		detail_info.innerHTML		= "";

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>닫기</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	photoImg : function( photo ) {

		if( photo == undefined ) {
			return GVari.idPhotoPath + GVari.defIdPhoto;
		} else {
			if( photo.length < 100 ) {	// 제공하는 아바타를 이용한 이미지
				return GVari.idPhotoPath + photo;
			} else {	// 별도로 등록한 이지미
				return photo;
			}
		}
	},

	offDetail : function() {
		Doing.cntChkFavo();
		document.getElementById("address_detail_view").style.display	= 'none';
	},

	insert : function( event ) {
		cltitle.innerHTML		= " 주소록 등록 ";
		td_title2.innerHTML		= "<b onclick='Show.b_genData();'>자동 생성</b>";

		detail_update.innerHTML		= "  &nbsp; " + now() + " &nbsp; ";
		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat list="catlists" placeholder="선택 또는 등록(20자)" required>' + GVari.catlists;
		detail_company.innerHTML	= '  &nbsp; <input type=text id=i_company list="comlists" placeholder="선택 또는 등록(20자)">' + GVari.comlists;
		detail_depart.innerHTML		= '  &nbsp; <input type=text id=i_depart list="deplists" placeholder="선택 또는 등록(20자)">' + GVari.deplists;
		detail_team.innerHTML		= '  &nbsp; <input type=text id=i_team list="tealists" placeholder="선택 또는 등록(20자)">' + GVari.tealists;
		detail_posit.innerHTML		= '  &nbsp; <input type=text id=i_posit list="poslists" placeholder="선택 또는 등록(20자)">' + GVari.poslists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name placeholder="최대 20자" required>';
		detail_job.innerHTML		= '  &nbsp; <input type=text id=i_job placeholder="최대 20자">';
		detail_phone.innerHTML		= '  &nbsp; <input type=text id=i_phone placeholder="000-0000-0000">';
		detail_cellphone.innerHTML	= '  &nbsp; <input type=text id=i_cell placeholder="000-0000-0000" required>';
		detail_email.innerHTML		= '  &nbsp; <input type=text id=i_email placeholder="abc@abc.com">';
		detail_etc.value			= "";
		detail_etc.readOnly			= false;

		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo placeholder="숫자 입력">';
		idphoto.src					= Show.photoImg();
		detail_info.innerHTML		= ' &nbsp;  최적 크기 : 100x100';
		detail_photo.innerHTML		= '  &nbsp; <input type=file id=i_photo onchange="Show.photoFile(this.files);" class=hidden>';
		detail_photo.innerHTML		+= '  &nbsp;<button onclick="Show.avatar();"> 아바타 선택</button> ';

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>취소</b> | <b onclick='Doing.insert();'>등록</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},

	update : function( event ) {
		var data	= GVari.addr;

		cltitle.innerHTML		= data.name + " 정보 수정";
		td_title2.innerHTML		= "<b onclick='Show.details();'>취소</b>";

		if( data.favo == undefined )	data.favo	= 1;

		detail_update.innerHTML		= "  &nbsp; " + now() + " &nbsp; ";
		detail_cat.innerHTML		= '  &nbsp; <input type=text id=i_cat value="' + data.cat + '" list="catlists">' + GVari.catlists;
		detail_company.innerHTML	= '  &nbsp; <input type=text id=i_company value="' + data.company + '" list="comlists">' + GVari.comlists;
		detail_depart.innerHTML		= '  &nbsp; <input type=text id=i_depart value="' + data.depart + '" list="deplists">' + GVari.deplists;
		detail_team.innerHTML		= '  &nbsp; <input type=text id=i_team value="' + data.team + '" list="tealists">' + GVari.tealists;
		detail_posit.innerHTML		= '  &nbsp; <input type=text id=i_posit value="' + data.posit + '" list="poslists">' + GVari.poslists;
		detail_name.innerHTML		= '  &nbsp; <input type=text id=i_name value="' + data.name + '">';
		detail_job.innerHTML		= '  &nbsp; <input type=text id=i_job value="' + data.job + '">';
		detail_phone.innerHTML		= '  &nbsp; <input type=text id=i_phone value="' + data.phone + '">';
		detail_cellphone.innerHTML	= '  &nbsp; <input type=text id=i_cell value="' + data.cell + '">';
		detail_email.innerHTML		= '  &nbsp; <input type=text id=i_email value="' + data.email + '">';
		// detail_etc.innerHTML		= '  &nbsp; <input type=text id=i_etc value="' + data.etc + '" size=55>';
		detail_etc.value			= data.etc;
		detail_etc.readOnly			= false;
		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo value="' + data.favo + '">';
		detail_info.innerHTML		= ' &nbsp;  최적 크기 : 100x100';
		detail_photo.innerHTML		= '  &nbsp; <input type=file id=i_photo onchange="Show.photoFile(this.files);" class=hidden>';
		detail_photo.innerHTML		+= '  &nbsp;<button onclick="Show.avatar();"> 아바타 선택</button> ';
		// detail_pos.innerHTML		= '  &nbsp; <input type=text id=i_pos value=' + data.pos + '>';

		cbutton.innerHTML	= "<b onclick='Show.details();'>취소</b> | <b onclick='Doing.update();'>적용</b>";
	},

	photoFile : function( event ) {
		var file	= i_photo.files[0];
		var reader	= new FileReader();

		reader.readAsDataURL( file );
		reader.onload = function( e ) {
			var bits		= e.target.result;
			idphoto.src		= bits;
			GVari.addr.photo= bits;
		}
	},

	/** 상단 각 분류 표시 */
	catDisplay : function() {
		var cell	= "";
		if( GVari !== undefined ) {
			cell	= GVari.sel_Category;
		}
		IndexedDB.GroupByMenu( function(data){
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

		var totalpost	= 0,
			start		= ( curPage - 1 ) * GVari.cperpage;

		/** 검색어 일치하는 Address 갯수 값을 가져와서 하단 네비게이션 바 생성 */
		IndexedDB.countSearch( txt, function( data ) {
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
		IndexedDB.searchStr( start, GVari.cperpage, txt, function( data ) {
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

	/** 휴지통 보기 */
	trashcan : function() {
		Show.pagedList( 1, "휴지통" );
	},

	/**
	 * 전체 Address 목록 표시
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
		IndexedDB.countCat( cat, function( data ) {
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
		IndexedDB.getData( start, GVari.cperpage, cat ).then( function( data ) {
			var lng	= data.length;
			if( curPage != 1 && lng == 0 ) Show.pagedList( curPage - 1, cat );
			if( lng != 0 ) {
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
			}
		});
	},

	/**
	 * 전체 Address 목록 표시
	 * curPage : 시작 페이지
	 * cat : 분류 이름, 전체는 "ALL"
	 */
	pagedList4Favo : function () {

		GVari.sel_Category	= "";
		Show.catDisplay();

		/** 갯수(GVari.cperpage) 만큼 Address 를 가져와서 표시 */
		addrBox.innerHTML	= "";
		IndexedDB.getFavo( GVari.cperpage, function( data ) {
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
		paging.innerHTML	= "[ Top " + GVari.cperpage + " Address List ]";
	},

	/** 아바타 선택 창에서 클릭한 경우 : 주화면 아바타 변경, GVari.addr 저장 */
	theChangedAvatar : function( img ) {
		idphoto.src			= GVari.idPhotoPath + img;
		GVari.addr.photo	= img;
	},

	avatar : function(){

		var contents  = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		contents	+= '<HTML  xmlns="http://www.w3.org/1999/xhtml"><HEAD>';
		contents	+= '<TITLE>AddressBook :: 사용자 아바타 선택</TITLE>';
		contents	+= '<link rel=stylesheet href="css/address_book.css" type="text/css">';
		contents	+= '</HEAD><BODY><center>';
		
		contents	+= '<table class="list02" style="width:100%; font: 70% Verdana; line-height: 22px;">';
		contents	+= '<thead><tr><th colspan=5>사용자 아바타 선택</th></tr></thead>';
		contents	+= '<tbody id="errmsgs">';

		var idLng	= Object.keys(GVari.idPhotos).length + 1;
		var i		= 1;
		for(  ; i < idLng ; i++ ) {
			if( i%5 == 1 ) {	contents	+= '<tr>';	}		// tr 열기
			contents	+= "<td><a href='#' onclick='opener.Show.theChangedAvatar(\"" + GVari.idPhotos[i] + "\");window.close();'><img src='img/idphoto/" + GVari.idPhotos[i] + "'></a></td>";
			if( i%5 == 0 ) {	contents	+= '</tr>';	}		// tr 닫기
		}
		// tr 당 모자른 td 를 채움
		for( var j = ( 5 - ( i - 1 ) % 5 ) ; j > 0 ; j-- ) {
			contents	+= '<td> &nbsp; </td>';
		}
		contents	+= '</tr></tbody></table></center></BODY></HTML>';
		
		var all = window.open('', 'errMsg', 'width=680,height=600,menubar=no,resizable=yes,scrollbars=yes,toolbar=nolocation=no,status=no');
		all.document.write(contents);
		all.document.close();
	},

	/** 구분, 회사, 부서, 팀, 직급에 대한 목록을 Select Box로 구성함. */
	genDatalists : function() {

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
	},

	whetherCorrect : function( data ) {
		var errMsg	= "";

		if( data.cat == "" )	errMsg	+= "구분 ex) 가족, 협력업체, 동료,..\n";
		if( data.name == "" )	errMsg	+= "이름 : 최소 2글자 이상\n";
		if( data.phone == "" && data.cell == "" ) {
			if( data.phone == "" )	errMsg	+= "사무실 전화번호 ex) 02-0000-0000,..\n";
			if( data.cell == "" )	errMsg	+= "휴대 전화번 ex) 010-0000-0000, 01012341234\n";
		}
		if( errMsg == "" ) {
			return true;
		} else {
			alert( "필수 입력 내용이 빠졌습니다.\n\n" + errMsg + "\n위의 내용을 입력해 주세요.");
			return false;
		}
	}
};

var Doing = {

	/** 조회수 Counting */
	cntChkFavo : function() {
		var addr	= GVari.addr;
		if( addr.favo == undefined )	addr.favo	= 1;
		else							addr.favo	= addr.favo + 1;

		IndexedDB.insert(addr,function(data){
			if( data != false ) {
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
			etc:detail_etc.value,
			favo:parseInt( i_favo.value ),
			update:now(),
			photo:GVari.addr.photo
			//id:
		}

		if( Show.whetherCorrect( addr ) ) {
			/** 해당 분류에 마지막 pos 값을 구한 후 등록 진행 */
			GVari.addr			= addr;
			GVari.sel_curPage	= 1;
			GVari.sel_Category	= addr.cat;
			Doing.movingAddr( i_cat.value, addr );
			Show.details();
		}
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
			Show.offDetail();
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
			addr.cat	= cat;
			addr.pos	= parseInt( data );
			IndexedDB.insert(addr,function(data){
				if( data != false ) {
					GVari.addr.id	= data;
					Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
				} else {
					console.log( "이동 중 오류가 발생하였습니다." );
				}
			});
		});
	},

	/** 수정 내용 저장 */
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
			company:i_company.value,
			depart:i_depart.value, 
			team:i_team.value, 
			posit:i_posit.value, 
			name:i_name.value, 
			job:i_job.value, 
			phone:i_phone.value, 
			cell:i_cell.value, 
			email:i_email.value, 
			etc:detail_etc.value,
			favo:parseInt( i_favo.value ),
			pos:parseInt( data.pos ),	// pos 변경 불가
			update:now(),
			photo:GVari.addr.photo
		}

		if( Show.whetherCorrect( addr ) ) {
			/** 분류(Category)가 수정이 되었는지 확인 */
			if( data.cat == i_cat.value ) {	// 분류(Category)가 변경되지 않은 경우, pos를 제외하고 변경
				IndexedDB.insert(addr,function(data){
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

	/** 전체 데이터 삭제 */
	db_delete : function() {

		var postData	= "전체 데이터를 삭제하시겠습니까?";
		if( confirm( postData ) ) {
			IndexedDB.deleteAll( function(isOk){
				if(isOk == true) {
					alert( "전체 데이터 삭제 작업 완료." );
					location.reload();
				} else {
					alert( "전체 데이터 삭제 작업 실패. <br> 브라우저 재실행 후 다시 시도하세요." );
				}
			});
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
		console.log( "selected = " + seltLine + " / Over = " + overLine );
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
		event.target.parentNode.style.borderTop 	= "initial";
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
				IndexedDB.getPosInRange(seledCat, start, end, function(data){
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
				IndexedDB.insert(data[i],function(rdata){
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
					IndexedDB.getCatMaxValue( newCat ,function(data){
						resolve(parseInt( data ));
					});
				});
			};
			_promise2().then(function (nextPos) {
				var data	= selAddr;

				data.cat = newCat;	// 바뀐 Category로 변경
				data.pos = nextPos;	// Category내의 마지막 Pos 값으로 위치 지정
				
				IndexedDB.insert(data,function(data){		// 바뀐 정보로 Update
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
