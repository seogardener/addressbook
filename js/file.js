var DoFile = {

	readSingleFile:function(e) {
		//var file = e.target.files[0];
		var file = new File( ["test"], 'file:///C:/Develop/pc_address_book/test.xml', { type: "text/plain" } );
		if (!file) {
			return;
		}
		var reader = new FileReader();
		reader.onload = function(e) {
			var contents = e.target.result;
			// Display file content
			DoFile.displayContents(contents);
		};
		reader.readAsText(file);
	},

	displayContents: function(contents) {
		var element = document.getElementById('file-content');
		element.innerHTML = contents;
	},

	// Synchronous XMLHttpRequest on the main thread is deprecated because of its detrimental effects to the end user's experience. For more help, check https://xhr.spec.whatwg.org/.
	readTextFile: function(file) {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function () {
			if(rawFile.readyState === 4) {
				if(rawFile.status === 200 || rawFile.status == 0) {
					var allText = rawFile.responseText;
					alert(allText);
				}
			}
		}
		rawFile.send(null);
	},
	
	readTextFile2: function() {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", "c:\Develop\testing.txt", true);
		rawFile.onreadystatechange = function() {
			if (rawFile.readyState === 4) {
				var allText = rawFile.responseText;
				//document.getElementById("textSection").innerHTML = allText;
				console.log( allText );
			}
		}
	  rawFile.send();
	},
	
	saveToFile_Chrome: function(fileName, content) {
		var blob	= new Blob([content], { type: 'text/plain' });
	 
		objURL	= window.URL.createObjectURL(blob);
				
		// 이전에 생성된 메모리 해제
		if (window.__Xr_objURL_forCreatingFile__) {
			window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
		}
		window.__Xr_objURL_forCreatingFile__ = objURL;
	 
		var a = document.createElement('a');
	 
		a.download	= fileName;
		a.href		= objURL;
		a.click();
	},
	
	openTextFile: function() {
		var input	= document.createElement("input");
	 
		input.type	= "file";
		input.accept= "text/plain";
	 
		input.onchange = function (event) {
			DoFile.processFile(event.target.files[0]);
		};
	 
		input.click();
	},
	 
	processFile: function(file) {
		var reader	= new FileReader();
	 
		reader.onload = function () {
			output.innerText = reader.result;
		};
	 
		reader.readAsText(file, /* optional */ "euc-kr");
	},

	moveFile: function() {
		var object	= new ActiveXObject("Scripting.FileSystemObject");
		var file	= object.GetFile("C:\\wamp\\www\\phptest.php");
		file.Move("C:\\wamp\\");
		//document.write("File is moved successfully");
	}

};

