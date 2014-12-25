	function showsubmenu(sid){
		whichEl = eval("submenu" + sid);
		if (whichEl.style.display == "none"){
			eval("submenu" + sid + ".style.display=\"\";");
		}else{
			eval("submenu" + sid + ".style.display=\"none\";");
	 	}
	}
	function cwin(){
		if(parent.testframeset.cols!='200,*'){
			parent.testframeset.cols='200,*';
		}else{
			parent.testframeset.cols='-10,*';
		}
	}
	function closenavi() {
		w-=10;
		if (w>-10) {
			window.parent.testframeset.cols = ''+w+',*';repeat=setTimeout("closenavi()",100);
		}else {
			clearTimeout(repeat);w=220;
		}
	}