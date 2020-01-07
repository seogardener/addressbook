/*!
 * indexedDB Plugin v0.0.1
 * License: https://github.com/ParkMinKyu/diary/blob/master/LICENSE
 * (c) 2017 niee
 */
var IndexedDB = {
	indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
	schemaName: null,
	dataBaseName: null,
	
	checkDB: function () {
		if (!this.indexedDB) {
			window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
		} else {
			console.log("Your browser does support a indexedDB");
		}
	},

	getConnection: function (version) {
		if (!this.dataBaseName) this.dataBaseName = "AddressDB";
		if (!version) version = 1;
		var database = this.indexedDB.open(this.dataBaseName, version);
		return database;
	},

	createSchema: function (id) {
		if (!this.schemaName) this.schemaName = "AddressDB";
		var database = this.getConnection();
		database.onupgradeneeded = function () {
			var db = database.result;
			var store = db.createObjectStore(IndexedDB.schemaName, { keyPath: "id", autoIncrement:true } );
			store.createIndex("typeIdx", "type", { unique : false });
			store.createIndex("companyIdx", "company", { unique : false });
			store.createIndex("departIdx", "depart", { unique : false });
			store.createIndex("teamIdx", "team", { unique : false });
			store.createIndex('typecomIdx', ['type', 'company', 'depart', 'team' ]);
		
			var index = store.createIndex("keyIndex", id);
		}
	},
	
	selectOne: function (id, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var store = tx.objectStore(IndexedDB.schemaName);
		
			var data = store.get(id);
		
			data.onsuccess = function () {
				callback(data.result);
			}
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
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
	selectAll: function (callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var store = tx.objectStore(IndexedDB.schemaName).index("keyIndex");
		
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
					console.log( "트랜잭션이 종료") ;
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

	selectMaxValue: function (indexName, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var store = tx.objectStore(IndexedDB.schemaName);
			var index = store.index(indexName);
			var cursor = index.openCursor(null, 'prev');
			var obj = null;
		
			cursor.onsuccess = function (event) {
				console.log( "Indexed DB 작업 성공") ;
				if (event.target.result) {
					obj = event.target.result.value; //the object with max revision
				}
			};
		
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
				db.close();
				callback(obj);
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

	insert: function (val, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readwrite");
			var store = tx.objectStore(IndexedDB.schemaName);
		
			store.put(val);
		
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
				db.close();
			};
			tx.onabort  = function(){
				console.log( "트랜잭션이 취소" );
			};
			tx.onerror = function(){
				console.log( "트랜잭션이 실패" );
			};
			callback(1);
		}
		
		database.onerror = function (event) {
			callback(event);
		}
	},

	delete: function (id, callback) {
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readwrite");
			var store = tx.objectStore(IndexedDB.schemaName);
		
			store.delete(id);
		
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
				db.close();
				callback(1);
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
	
	searchStr: function( searchTerm, callback ) {
		var result = [];
		var database = this.getConnection();
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var cursorReq = tx.objectStore(IndexedDB.schemaName).openCursor();
			var cursor, temdata, datas = [];
		
			cursorReq.onsuccess = function(e) {
				cursor = e.target.result;
				tempdata = "";
				datas = [];
				if(cursor) {
					for( var key in cursor.value ) {
						tempdata = cursor.value[key].toString();
						if( tempdata.search( searchTerm ) > -1 ) {
							datas.push(cursor.value);
							break;
						}
					}
					cursor.continue();
				}
				callback(datas);
			}
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
				db.close();
			};
		};
	},

	GroupByMenu : function( callback ) {
		var database = this.getConnection();
		var dupes = new Map();
		
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var cursor = tx.objectStore(IndexedDB.schemaName).index("typeIdx").openCursor(null, 'prev');
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
				console.log( "트랜잭션이 종료") ;
				db.close();
				callback(dupes);
			};
		}
	},

	selectType : function( txt, callback ) {
		var database = this.getConnection();
		var dupes = new Map();
		var datas = [];
		
		database.onsuccess = function () {
			var db = database.result;
			var tx = db.transaction(IndexedDB.schemaName, "readonly");
			var cursor = tx.objectStore(IndexedDB.schemaName).index("typeIdx").getAll( txt );
			
			cursor.onsuccess = function (event) {
				datas = cursor.result;
			};
			tx.oncomplete = function () {
				console.log( "트랜잭션이 종료") ;
				db.close();
				callback(datas);
			};
		}
	},
	

};
