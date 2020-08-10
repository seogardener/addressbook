/*!
 * FavoritesDB Plugin v0.0.1
*
id		= id
favo	= 해당 즐겨찾기 클릭 횟수
pos		= 위치
cat		= 분류
name	= 즐겨찾기 이름
url		= 즐겨찾기 주소
hint	= 인증(authentication) 힌트
etc		= 기타 정보
crdate	= 즐겨찾기 생성 시간
laupdate	= 즐겨찾기 마지막 수정 시간

 */
var FavoritesDB = {
	FavoritesDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
	schemaName: null,
	dataBaseName: null,
	
	checkDB: function () {
		if (!this.FavoritesDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
		} else {
			console.log("Your browser does support a indexedDB");
		}
	},

	getConnection: function (version) {
		if (!this.dataBaseName) this.dataBaseName = "FavoritesDB";
		if (!version) version = 1;
		var database = this.FavoritesDB.open(this.dataBaseName, version);
		return database;
	},

	/** IndexedDB index 생성 20200805 */
	createSchema: function (id) {
		if (!this.schemaName) this.schemaName = "FavoritesDB";
		var database = this.getConnection();
		database.onupgradeneeded = function () {
			var db = database.result;
			var store = db.createObjectStore(FavoritesDB.schemaName, { keyPath: "id", autoIncrement:true } );
			store.createIndex("favoIdx", "favo", { unique : false });
			store.createIndex("posIdx", "pos", { unique : false });
			store.createIndex("catIdx", "cat", { unique : false });
			store.createIndex("nameIdx", "name", { unique : false });
			store.createIndex("urlIdx", "url", { unique : false });
			store.createIndex('poscatIdx', ['cat', 'pos']);
			var index = store.createIndex("keyIndex", id);
		}
	},
	
	/** 전체 데이터 보여기 : 전체 백업 20200805  */
	selectAll: function (callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");
			var store = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx");
			//var store = tx.objectStore(FavoritesDB.schemaName).index("keyIndex");
		
			if ('getAll' in store) {
				store.getAll().onsuccess = function (event) {
					callback(event.target.result);
				};
			} else {
				var datas = [];
				store.openCursor().onsuccess = function (event) {
					var cursor = event.target.result;
					if (cursor) {
						datas.push(cursor.value);
						cursor.continue();
					} else {
						callback(datas);
					}
				};
				tx.oncomplete = function () {
					// console.log( "트랜잭션이 종료") ;
					db.close();
				};
				tx.onabort  = function(){
					console.log( "트랜잭션이 취소" );
				};
				tx.onerror = function(){
					console.log( "트랜잭션이 실패" );
				};
			}
		}
		database.onerror = function (event) {
			callback(event);
		}
	},

	/** 
	 * 각 분류에 대한 Address를 목록을 반환 20200805
	 * start : 첫번째 Address의 시작 위치
	 * total : 반환할 Address의 개수
	 * cat : 분류 지정 ( 없으면 전체 )
	 */
	getData : function ( start, total, cat, callback ) {

		var database = this.getConnection();
		return new Promise(function(resolve, reject) {

			database.onsuccess = function () {
				var keyRange	= null;
				var db = database.result;
				var tx = db.transaction(FavoritesDB.schemaName, "readonly");
				// cat에 값이 없는 경우 전체 개수 반환
				if( cat == "ALL" )	{
					var store = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx");
				} else {
					keyRange	= IDBKeyRange.bound( [cat, 0], [cat, 999999999] );
					var store = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx");
				}
				var store = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx");
				// console.log('start='+start+' total='+total);
				var hasSkipped = false;
				var datas = [];

				store.openCursor(keyRange).onsuccess = function (event) {
					var cursor = event.target.result;
					if(!hasSkipped && start > 0) {
						hasSkipped = true;
						cursor.advance(start);
						return;
					}
					if (cursor) {
						// console.log('pushing ',cursor.value);
						datas.push(cursor.value);
						if(datas.length < total) {
							cursor.continue();
						} else {
							resolve(datas);
						}
					} else {
						// console.log('resolving ',datas);
						resolve(datas);
					}
				};
			}
			database.onerror = function (event) {
				callback(event);
			}
		});
	},

	/** 가장 많은 클릭 수를 갖는 즐겨찾기 가져오기 20200805 */
	getFavo: function (repcnt, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");
			var index = tx.objectStore(FavoritesDB.schemaName).index("favoIdx");
		
			var datas	= [];
			var cnt		= 0;
			index.openCursor( null, "prev").onsuccess = function (event) {
				var cursor = event.target.result;
				if (cursor) {
					if( cnt < repcnt ) {
						cnt++;
						datas.push(cursor.value);
						cursor.continue();
					} else {
						callback(datas);
					}
				} else {
					callback(datas);
				}
			};
			tx.oncomplete = function () {
				// console.log( "트랜잭션이 종료") ;
				db.close();
			};
			tx.onabort  = function(){
				console.log( "트랜잭션이 취소" );
			};
			tx.onerror = function(){
				console.log( "트랜잭션이 실패" );
			};
		}
		database.onerror = function (event) {
			callback(event);
		}
	},

	/** 선택된 Category내의 최대 Pos 값에 +1 한 값을 리턴한다. 20200805 **/
	getCatMaxValue: function (catName, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db		= database.result;
			var tx		= db.transaction(FavoritesDB.schemaName, "readonly");
			var obj		= null;
			var last 	= null;
			var data	= null;
			var max		= 1;

			var keyRange = IDBKeyRange.bound( [catName, 0], [catName, 999999999] );
			var cursor = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx").getAll( keyRange );

			cursor.onsuccess = function (event) {
				data = cursor.result;
				var lng = data.length;
				
				if( lng == 0 ) {
					console.log("No Record.");
				} else {
					for(var i = 0 ; i < lng ; i ++){
						if( data[i].pos > max ) {
							max = data[i].pos;
						}
					}
					max++;
				}
			};
			tx.oncomplete = function () {
				// console.log( "getCatMaxValue 종료") ;
				db.close();
				callback(max);
			};
			tx.onerror = function () {
				console.log( "getCatMaxValue 실패") ;
				db.close();
				callback(0);
			}
		}
		database.onerror = function (event) {
			callback(0);
		}
	},

	/** Address 추가 등록 20200805 */
	insert: function (val, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db		= database.result;
			var tx		= db.transaction(FavoritesDB.schemaName, "readwrite");
			var store	= tx.objectStore(FavoritesDB.schemaName);

			store.put(val).onsuccess = function(e) {
				callback( e.target.result );	// return id
			};
			tx.oncomplete = function () {
				//console.log( "트랜잭션이 종료") ;
				db.close();
				//callback(true);
			};
			tx.onabort  = function(){
				console.log( "트랜잭션이 취소" );
				callback(false);
			};
			tx.onerror = function(){
				console.log( "트랜잭션이 실패" );
				callback(false);
			};
		}
		
		database.onerror = function (event) {
			callback(event);
		}
	},

	/** 상단 각 분류 표시를 위한 분류에 대한 유일한 값 찾기 20200806 */
	GroupByMenu : function( callback ) {
		var database	= this.getConnection();
		var dupes		= new Map();
		
		database.onsuccess = function () {
			var db		= database.result;
			var tx		= db.transaction(FavoritesDB.schemaName, "readonly");
			var cursor	= tx.objectStore(FavoritesDB.schemaName).index("catIdx").openCursor(null, 'prev');
			var last	= null;
			cursor.onsuccess = function (event) {
				var req = cursor.result;
				if (!req) return; // Done!
				var name= req.key,
					id	= req.primaryKey;
				if (name == last) {
					dupes.get(name).push(id);
				} else {
					// It's a duplicate!
					if (!dupes.has(name)) dupes.set(name, []);
					last = name;
					dupes.get(name).push(id);
				}
				req.continue();
			};
			tx.oncomplete = function () {
				// console.log( "트랜잭션이 종료") ;
				db.close();
				callback(dupes);
			};
		}
	},

	/** 해당 Category(txt)내 주어진 범위의 Position값을 갖는 Record들을 출력 20200806 */
	getPosInRange : function( txt, start, end, callback ) {
		var database = this.getConnection();
		var dupes = new Map();
		var datas = [];

		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");

			// select * from FavoritesDB where cat = "본사" order by pos;
			var keyRange = IDBKeyRange.bound( [txt, start], [txt, end] );
			var cursor = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx").getAll( keyRange );

			cursor.onsuccess = function (event) {
				datas = cursor.result;
			};
			tx.oncomplete = function () {
				// console.log( "트랜잭션이 종료") ;
				db.close();
				callback(datas);
			};
		}
	},
	
	/** 전체 데이터 삭제 실행 20200806 */
	deleteAll: function ( callback ) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readwrite");
			var store = tx.objectStore(FavoritesDB.schemaName);
		
			store.clear();
		
			tx.oncomplete = function () {
				// console.log( "트랜잭션이 종료") ;
				db.close();
				callback(true);
			};
			tx.onabort  = function(){
				console.log( "트랜잭션이 취소" );
			};
			tx.onerror = function(){
				console.log( "트랜잭션이 실패" );
			};
		}
		database.onerror = function () {
			callback(false);
		}
	},
	
	/** 개별 항목에 대한 Uniq 데이터를 수집해서 반환 20200806 */
	GetUniqueValue : function( idx, callback ) {
		var database = this.getConnection();
		var dupes = new Map();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");
			var cursor = tx.objectStore(FavoritesDB.schemaName).index(idx).openCursor(null, 'prev');
			var last = null;
			cursor.onsuccess = function (event) {
				var req = cursor.result;
				if (!req) return; // Done!
				var name = req.key, id = req.primaryKey;
				if (name === last) {
					// It's a duplicate!
					if (!dupes.has(name)) dupes.set(name, []);
					dupes.get(name).push(id);
				} else {
					last = name;
				}
				req.continue();
			};
			tx.oncomplete = function () {
				// console.log( "트랜잭션이 종료") ;
				db.close();
				callback(dupes);
			};
		}
	},
	
	/** 각 분류에 대한 Address 전체 개수 반환 20200805 */
	countCat : function( cat, callback ) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db		= database.result;
			var tx		= db.transaction(FavoritesDB.schemaName,'readonly');
			var data	= 0;
			var keyRange, cursor;
			if( cat == "ALL" ) {
				var cursor	= tx.objectStore(FavoritesDB.schemaName).index("keyIndex").count();
			} else {
				keyRange	= IDBKeyRange.bound( [cat, 0], [cat, 99999999] );
				cursor		= tx.objectStore(FavoritesDB.schemaName).index("poscatIdx").count(keyRange);
			}
			cursor.onsuccess = function(event) {
				data	= cursor.result;
			};
			tx.oncomplete = function () {
				// console.log( "연결 종료") ;
				db.close();
				callback(data);
			};
			tx.onerror = function () {
				console.log( "countCat 실패") ;
				db.close();
				callback(0);
			}
		}
		database.onerror = function (event) {
			callback(event);
		}
	},

	/** 
	 * 검색어와 매치되는 Address를 목록을 반환 20200806
	 * start : 첫번째 Address의 시작 위치
	 * total : 반환할 Address의 개수
	 * txt : 검색어
	 */
	searchStr : function ( start, total, txt, callback ) {
		var database = this.getConnection();
		var exclCol = ['photo', 'id', 'favo', 'pos'];
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");
			var cursorReq = tx.objectStore(FavoritesDB.schemaName).index("poscatIdx").openCursor();
			var cursor, temdata, datas = [];
			var mstart	= 0;
			var mcount	= 0;
			var tcount	= 0;

			cursorReq.onsuccess = function(e) {
				cursor = e.target.result;
				tempdata = "";
				if(cursor) {
					for( var key in cursor.value ) {
						// 특수 컬럼 검색에서 제외
						if( exclCol.includes( key ) )	continue;
						tempdata = cursor.value[key].toString();

						if( tempdata.search( txt ) > -1 ) {
							mstart++;
							if( start < mstart && total > mcount ) {
								datas.push(cursor.value);
								mcount++;
							}
							break;
						}
					}
					cursor.continue();
				}
			}
			tx.oncomplete = function () {
				callback(datas);
				// console.log( "트랜잭션이 종료") ;
				db.close();
			};
		}
		database.onerror = function (event) {
			callback(event);
		}
	},

	/** 검색어를 포함하는 즐겨찾기 전체 개수 반환 ( 최소 2글자 이상 ) 20200806 */
	countSearch : function( txt, callback ) {
		var database= this.getConnection();
		var exclCol	= ['id', 'favo', 'pos'];	// 검색 제외 컬럼
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(FavoritesDB.schemaName, "readonly");
			var cursorReq = tx.objectStore(FavoritesDB.schemaName).openCursor();
			var cursor, temdata, datas = 0;

			cursorReq.onsuccess = function(e) {
				cursor = e.target.result;
				tempdata = "";
				if(cursor) {
					for( var key in cursor.value ) {
						// 특수 컬럼 검색에서 제외
						if( exclCol.includes( key ) )	continue;
						tempdata = cursor.value[key].toString();
						if( tempdata.search( txt ) > -1 ) {
							datas++;
							break;
						}
					}
					cursor.continue();
				}
			}
			tx.oncomplete = function () {
				callback(datas);
				// console.log( "트랜잭션이 종료") ;
				db.close();
			};
		}
		database.onerror = function (event) {
			callback(event);
		}
	}
}
