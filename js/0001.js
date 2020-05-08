
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
	poslists	: "",
	defaultimg	: "data:image/png;base64,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"
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
		detail_etc.innerHTML		= " &nbsp; " + data.etc;
		detail_pos.innerHTML		= " &nbsp; " + data.pos;
		detail_favo.innerHTML		= " &nbsp; " + data.favo;
		regphoto.src				= Show.photoImg( data.photo );
		detail_photo.innerHTML		= "";
		detail_info.innerHTML		= "";

		cbutton.innerHTML	= "<b onclick='Show.offDetail();'>닫기</b>";
		document.getElementById("address_detail_view").style.display	= 'block';
		console.log( data );

	},

	photoImg : function( photo ) {

		if( photo == undefined ) {
			console.log( "기본 사진 출력" );
			return GVari.defaultimg;
		} else {
			console.log( "등록된 사진 출력" );
			return photo;
		}
	},

	offDetail : function() {
		Doing.cntChkFavo();
		document.getElementById("address_detail_view").style.display	= 'none';
	},

	insert : function( event ) {
		var data= GVari.addr;

		cltitle.innerHTML		= " 주소록 등록 ";
		td_title2.innerHTML		= "<b onclick='Show.b_genData();'>자동 생성</b>";

		detail_update.innerHTML		= "  &nbsp; " + now() + " &nbsp; ";
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
		regphoto.src				= GVari.defaultimg;
		detail_photo.innerHTML		= '  &nbsp; <input type=file id=i_photo onchange="Show.photoFile(this.files);" class=hidden> 최적 크기 : 200x200';

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
		detail_etc.innerHTML		= '  &nbsp; <input type=text id=i_etc value="' + data.etc + '" size=55>';
		detail_favo.innerHTML		= '  &nbsp; <input type=text id=i_favo value="' + data.favo + '">';
		detail_info.innerHTML		= ' &nbsp;  최적 크기 : 200x200';
		detail_photo.innerHTML		= '  &nbsp; <input type=file id=i_photo onchange="Show.photoFile(this.files);" class=hidden>';
		// detail_pos.innerHTML		= '  &nbsp; <input type=text id=i_pos value=' + data.pos + '>';

		cbutton.innerHTML	= "<b onclick='Show.details();'>취소</b> | <b onclick='Doing.update();'>적용</b>";
	},

	photoFile : function( event ) {
		var file	= i_photo.files[0];
		var reader	= new FileReader();

		reader.readAsDataURL( file );
		reader.onload = function( e ) {
			var bits			= e.target.result;
			regphoto.src		= bits;
			GVari.addr.photo	= bits;
			// console.log( bits );
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
			favo:parseInt( i_favo.value ),
			update:now(),
			photo:GVari.addr.photo
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
			pos:parseInt( data.pos ),	// pos 변경 불가
			update:now(),
			photo:GVari.addr.photo
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
			alert( "변경된 내용은 " + data.cat + "에서 " + i_cat.value + "로 이동되어 저장이 되었습니다." );
		}
		Show.pagedList(GVari.sel_curPage, GVari.sel_Category );
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
