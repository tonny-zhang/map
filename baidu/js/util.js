!function(global){
	global.loadXML = (function(){
		if (window.ActiveXObject){
			return function(xmlURl){
				xmlDoc = new ActiveXObject('Msxml2.DOMDocument');
		        xmlDoc.async=false;
		        xmlDoc.load(xmlURl);
		        return xmlDoc;
			}
		}else if (document.implementation && document.implementation.createDocument){
			return function(xmlURl){
				var xmlhttp = new window.XMLHttpRequest();
		        xmlhttp.open("GET",xmlURl,false);
		        xmlhttp.send(null);
		        return xmlhttp.responseXML.documentElement; 
			}
		}else{
			return function(){}
		}
	})()
}(this)