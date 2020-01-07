//-----------------------------------------------------
// Switch Module JavaScript ( /pc_address_book/js/address_book.js )
// SeoGardener
//-----------------------------------------------------

window.onload = function () {
	utils.addListener( document.getElementById('list_tbody'), "click",  Show.details );
	utils.addListener( document.getElementById('address_detail_view'), "click",  Show.offDetail );
	
	Show.topMenu( 0 );
	// Proc.dump();
}

var Show = {
	
	topMenu: function( selMenu ) {
		
		var newTR	= topMenu.insertRow(0),
			newTD,
			g,
			cell,
			tempTxt,
			datalng,
			celllng	= Mem.GRP.length,
			tdcells = document.getElementById('topMenu').getElementsByTagName('td');;
		
		/**  Diskplay Top Menu **/		
		Common.clearTbody('topMenu');
		
		for( var i = 0 ; i < celllng ; i++ ) {
			newTD			= newTR.insertCell(-1);
			newTD.style.width = '110px';
			newTD.style.height = '25px';
			newTD.innerHTML = "<a onclick='Show.topMenu(" + i + ");'>" + Mem.GRP[i][2] + "</a>";
		}
		topMenu.appendChild(newTR);

		if( selMenu == ( celllng  - 1 ) ) {
			tdcells[selMenu].innerHTML		= "<input type='text' name='searchvalue0' id='searchvalue' size=10 onkeypress='return Proc.doSearch0();' />";
		}
		
		/** Focusing Selected Menu **/
		tdcells[selMenu].style.backgroundColor = "#316A88";
		tdcells[selMenu].style.color = "white";
		
		/** Save Selected Company name **/
		var corp	= Mem.getCorp( selMenu );
		var data	= Mem.getData( corp );

		Common.clearTbody( "list_thead" );
		Common.clearTbody( "list_tbody" );

		if ( corp == "welcome" ) {			Show.listframe( "welcome_list_div" );
		} else if( corp == "dev1role" ) {	Show.listframe( "dev1role_list_div" );
		} else if( data === undefined ) {	Show.listframe( "none_list_div" );
		} else if ( data.length < 2 ) {		Show.listframe( "none_list_div" );
		} else {
			Show.listframe( "list_div" );
			
			// Table Header
			cell	= data[ 0 ];
			celllng	= cell.length;
			tempTxt	= "<tr>";
			for( var i = 0 ; i < celllng ; i++ ) {
				tempTxt	+= "<th>" + cell[i] + "</th>";
			}
			document.getElementById( "list_thead" ).innerHTML	+= tempTxt + "</tr>";
			
			// Table Body
			datalng	= data.length;
			tempTxt	= "";
			for( var i = 1 ; i < datalng ; i ++ ) {
				cell	= data[ i ];
				
				celllng	= cell.length;
				tempTxt	+= "<tr  draggable=\"true\" ondragstart=\"Proc.drag(event)\">";
				for( var j = 0 ; j < celllng ; j++ ) {
					tempTxt	+= "<td>" + Common.cutStr( cell[j], 18 ) + "</td>";
				}
				tempTxt += "</tr>";
				
			}
			document.getElementById( "list_tbody" ).innerHTML	= tempTxt
			Common.tblRollOver(document.getElementById("list_tbody"));
		}
	},
	
	details : function( event ) {
		
		var clickElement	= event.target || event.srcElement,
			idx				= clickElement.parentNode.rowIndex,
			cell			= Mem.ADDR[ Mem.corp ][ idx ];
	
		detail_team.innerHTML		= cell[0] + " &nbsp; ";
		detail_team.innerHTML		+= cell[2] + " ";
		detail_team.innerHTML		+= cell[1];
		detail_role.innerHTML		= cell[3];
		detail_phone.innerHTML		= cell[4];
		detail_cellphone.innerHTML	= cell[5];
		detail_email.innerHTML		= cell[6];
		detail_etc.innerHTML		= cell[7];

		detail_buttom.innerHTML	= "<a class='button2' href='javascript:Show.offDetail();'> <확인> </a>";
		document.getElementById("address_detail_view").style.display	= 'block';
	},
	
	offDetail : function() {
		document.getElementById("address_detail_view").style.display	= 'none';
	},
	
	listframe : function( name ) {
		document.getElementById("list_div").style.display	= 'none';
		document.getElementById("dev1role_list_div").style.display	= 'none';
		document.getElementById("welcome_list_div").style.display	= 'none';
		document.getElementById("none_list_div").style.display		= 'none';

		document.getElementById( name ).style.display		= 'block';
	}
};

var Proc = {
	
	drag : function( ev ) {
		ev.preventDefault();
		alert("Hi..");
	},
	
	search : function() {
		
	},
	
	directSearch : function() {
		var searchText  = "";
		if( event.which == 13 || event.keyCode == 13 ) {
			document.getElementById('search_div').style.display = 'block';
			searchText  = document.getElementById('searchvalue0').value.replace(/\s+/g, ''), // 입력된 검색문자중에서 공백 문자를 제거한 후 저장
			document.getElementById('searchvalue').value    = searchText;
			Proc.doSearch();
			return false;
		}
		return true;
	},

	doSearch0 : function() {
        if( event.which == 13 || event.keyCode == 13 ) {
            Proc.doSearch();
			Show.topMenu( 8 );
            return false;
        }
        return true;
	},

	doSearch : function() {
		var searchText	= document.getElementById('searchvalue').value.replace(/\s+/g, ''),	// 입력된 검색문자중에서 공백 문자를 제거한 후 저장
			finalText	= "",	// 불필요한 또는 잘못된 표기에 대한 최종 검색문을 찾아 저장
			dot		= "",
			part	= [],
			num		= /^-{0,1}\d*\.{0,1}\d+$/,
			tDetail	= document.getElementById('searchReBody'),
			celllng	= Mem.GRP.length,
			grp		= "",
			linelng	= 0,
			tempTxt	= "",
			line	= [],
			pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크

		Mem.ADDR["search"]	= [];
		Mem.ADDR["search"].push( ["근무지","직급","이름","업무","회사전화","휴대전화","eMail","기타"] );
		
		/** 입력값 == "-를 포함하거나"  or "숫자" **/
		if( searchText.indexOf("-") > -1 || num.test(searchText) ) {

			part	= searchText.split("-");
			
			// 전화번호 정비
			for( i = 0 ; i < part.length ; i++ ) {
				if( part[i] == "")			continue;			// 내용이 없은 경우 건너 뛰기
				finalText	+=	dot + part[i];
				dot	= "\-";
			}
			
			for( var i = 0 ; i < celllng ; i++ ) {
				grp	= Mem.GRP[i][1];

				if( Mem.ADDR[ grp ] === undefined ) {		continue;
				} else if ( grp == "search" ) {				continue;
				} else if ( Mem.ADDR[ grp ].length == 0 ) {	continue;
				} else {
					linelng	= Mem.ADDR[ grp ].length;
					for( var j = 1 ; j < linelng ; j ++ ) {
						line	= Mem.ADDR[ grp ][ j ];
						if( line[4].search( finalText ) > -1 || line[5].search( finalText ) > -1 ) {		// 회사번호 & 휴대전화
							Mem.ADDR["search"].push( [line[0],line[1],line[2],line[3],line[4],line[5],line[6],line[7]] );
						}
					}
				}
			}

		} else {

			var seLC	= "",	// 소문자 변환 검색 문자
				lineLC1	= "",	// 소문자 변환 저장 데이터
				lineLC2	= "";	// 소문자 변환 저장 데이터
				
			/** 문자 검색 : 이름, eMail **/
			for( var i = 0 ; i < celllng ; i++ ) {
				grp	= Mem.GRP[i][1];

				if( Mem.ADDR[ grp ] === undefined ) {		continue;
				} else if ( grp == "search" ) {				continue;
				} else if ( Mem.ADDR[ grp ].length == 0 ) {	continue;
				} else {
					linelng	= Mem.ADDR[ grp ].length;
					for( var j = 1 ; j < linelng ; j ++ ) {
						line	= Mem.ADDR[ grp ][ j ];
 
						if( pattern_kor.test( searchText ) ) {	// 한글 : 팀(회사이름) & 직급 & 이름 & 업무 & 기타
							if( line[0].search( searchText ) > -1  || 	// 팀(회사이름)
								line[1].search( searchText ) > -1  ||	// 직급
								line[2].search( searchText ) > -1  ||	// 이름
								line[3].search( searchText ) > -1  ||	// 업무
								line[7].search( searchText ) > -1 ) {	// 기타
								Mem.ADDR["search"].push( [ line[0],line[1],line[2],line[3],line[4],line[5],line[6],line[7] ] );
							}
						} else {	// 영문
						
							seLC	= searchText.toLowerCase();
							lineLC1	= line[3].toLowerCase();
							lineLC2	= line[6].toLowerCase();

							if( lineLC1.search( seLC ) > -1 || 	// 업무
								lineLC2.search( seLC ) > -1 ) {	// eMail
								Mem.ADDR["search"].push( [line[0],line[1],line[2],line[3],line[4],line[5],line[6],line[7]] );
							}
						}
 					}
				}
			}
		}
	},
	
	move : function() {
		
	},
	
	insert : function() {
		
	},
	
	dump : function() {
		var tempTxt	= "",
			commTxt	= "",
			iName	= "",
			jName	= "",
			iLng	= Mem.GRP.length,
			jLng	= 0,
			kLng	= 0;
		const date = new Date();;
		
		tempTxt	= "//\n// Update : " + date + " \n//\n\n";
		tempTxt	+= "(function() {\nvar ADDR	= [];	\nvar GRP	= [\n\t// id, name, title \n";
		
		for( var i = 0 ; i < iLng ; i++ ) {
			iName	= Mem.GRP[i];
			jLng	= iName.length;
			tempTxt	+= "\t[ " + iName[0];
			for( var j = 1 ; j < jLng ; j++ ) {
				tempTxt	+=	",\"" + iName[j] + "\"";
			}
			tempTxt	+= "]";
			if( i < ( iLng - 1 ) ) {
				tempTxt	+= ",\n";
			}
		}
		tempTxt	+= "\n];";

		iLng	= Mem.GRP.length;
		for( var i = 0 ; i < iLng ; i++ ) {
			iName	= Mem.GRP[i][1];
			tempTxt	+= "\nADDR[\"" + iName + "\"] = [\n";
			
			jLng	= Mem.ADDR[iName].length;
			for( var j = 0 ; j < jLng ; j++ ) {
				kLng	= Mem.ADDR[iName][j].length;
				tempTxt	+= "\t[\"" + Mem.ADDR[iName][j][0] + "\"";
				for( var k = 1 ; k < kLng ; k++ ) {
					tempTxt	+= ",\"" + Mem.ADDR[iName][j][k] + "\"";
				}
				tempTxt	+= "]";
				if( j < ( jLng - 1 ) ) {
					tempTxt	+= ",\n";
				}
			}
			tempTxt	+= "\n];\n";
		}
		
		tempTxt	+="\nMem.GRP	= GRP;\nMem.ADDR	= ADDR;\n}());"
		console.log( tempTxt );

	}
};

var Mem = {
	
	GRP		: [],
	MAN		: [],
	ADDR	: [],
	corp	: [],

	getCorp : function ( selMenu ) {
		Mem.corp	= Mem.GRP[selMenu][1];
		return Mem.GRP[selMenu][1];
	},
	
	getData : function ( corp ) {
		return Mem.ADDR[ corp ];
	}
	
};