var Common = {
	tblRollOver : function( tbody_id ) {
		try {
			var trItem;
			for( var i =0, rowsCnt = tbody_id.rows.length ; i < rowsCnt ; i++ ) {
				trItem = tbody_id.rows[i];
				if( i%2 == 1 ) {
					trItem.bgColor = "#F1EFE2";
					trItem.onmouseout  = function(){       this.className='normal02';    }; 
				} else {
					trItem.onmouseout  = function(){       this.className='normal01';    }; 
				}
				trItem.onmouseover = function(){       this.className='highlight';    }; 
			}
		} finally {
			trItem = null, i = null, rowsCnt = null, tbody_id = null;
		}
	},
	
	clearTbody : function( name) {
		try {
			var tVer = document.getElementById(name);
			if ( tVer.hasChildNodes() ) {
				var node = tVer.firstChild;
				while(node){
					var nextNode = node.nextSibling;
					tVer.removeChild(node);
					node = nextNode;
				}
			}
		} finally {
			tVer = null, node = null, nextNode =null;
		}
	},
	
	charCheck : function( chr ){
		var char_ASCII = chr.charCodeAt(0); 
		
		if (char_ASCII == 32)									return 0;	//공백
		else if (char_ASCII >= 48 && char_ASCII <= 57 )			return 1;	//숫자
		else if (char_ASCII>=65 && char_ASCII<=90)				return 2;	//영어(대문자)
		else if (char_ASCII>=97 && char_ASCII<=122)				return 3;	//영어(소문자)
		else if ((char_ASCII>=33 && char_ASCII<=47) 
			|| (char_ASCII>=58 && char_ASCII<=64) 
			|| (char_ASCII>=91 && char_ASCII<=96) 
			|| (char_ASCII>=123 && char_ASCII<=126)) 			return 4;	//특수기호 
		else if ((char_ASCII >= 12592) || (char_ASCII <= 12687))return 5;	//한글
		else  													return 9;
		
/* 		
		var pattern_num = /[0-9]/;	// 숫자 
		var pattern_eng = /[a-zA-Z]/;	// 문자 
		var pattern_spc = /[~!@#$%^&*()_+|<>?:{}]/; // 특수문자
		var pattern_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글체크
		pattern_kor.test( searchText )
 */
 
	},
	
	/** Cut String for HanGul **/
	cutStr : function( str,limit ) {
		var tmpStr		= str,
			byte_count	= 0,
			len			= str.length,
			dot			= "";
		
		for( var i = 0 ; i < len ; i++ ) {
			byte_count += Common.chr_byte(str.charAt(i));
			if( byte_count == limit-1 ) {
				if( Common.chr_byte( str.charAt( i+1 ) ) == 2 ){
					tmpStr	= str.substring( 0, i+1 );
					dot		= "...";
				} else {
					if( i+2 != len )	dot = "...";
					tmpStr = str.substring( 0, i+2 );
				}
				break;
			} else if( byte_count == limit ) {
				if( i+1 != len ) dot = "...";
				tmpStr = str.substring( 0, i+1 );
				break;
			}
		}
		return tmpStr + dot;
	},

	chr_byte : function ( chr ) {
		if( escape(chr).length > 4 )
			return 2;
		else
			return 1;
	}
	
}

// the interface
var utils = {
	addListener:null,
	removeListener:null
};

// the implementation
if (typeof window.addEventListener === 'function') {	
	utils.addListener = function (el, type, fn) {
		el.addEventListener(type, fn, false);
	};
} else if (typeof document.attachEvent !== 'undefined') { // IE
	utils.addListener = function (el, type, fn) {
		el.attachEvent('on' + type, fn);	
	};
	utils.removeListener = function (el, type, fn) {
		el.detachEvent('on' + type, fn);
	};
} else { // older browsers
	utils.addListener = function (el, type, fn) {
		el['on' + type] = fn;
	};
	utils.removeListener = function (el, type, fn) {
		el['on' + type] = null;
	};
}
