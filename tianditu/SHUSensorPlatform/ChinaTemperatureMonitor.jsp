<%@page import="java.awt.Color,
java.awt.Font,
javax.servlet.http.HttpSession"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>温度监控</title>

<LINK rel=stylesheet type=text/css href="css/comun.css">
<LINK rel=stylesheet type=text/css href="css2/comun2.css">
<SCRIPT type=text/javascript src="js/jquery-1.3.2.min.js"></SCRIPT>
<script type="text/javascript" src="http://api.tianditu.com/js/maps.js"></script> 
<script type="text/javascript" src="js/ajax.js"></script>
<script type="text/javascript" src="../FusionCharts/FusionCharts.js"></script>
<script src="js/jquery.js"></script>
<script src="js/jquery-1.4.min.js"></script>
<script src="js/jquery.speedometer.js"></script>
<script src="js/jquery.jqcanvas-modified.js"></script>
<script src="js/excanvas-modified.js"></script>
<SCRIPT type=text/javascript>
$(function(){
	$('#test').speedometer();

	$('.changeSpeedometer').click(function(){
		$('#test').speedometer({ percentage: $('.speedometer').val() || 0 });
	});

});

	
$(document).ready(function(){
  $('#opciones').show();
			$('#settings').click(function(){
				$('#opciones').slideToggle();
				$(this).toggleClass("cerrar");
		
    });
  });
$(document).ready(function(){
	  $('#opciones2').show();
				$('#settings2').click(function(){
					$('#opciones2').slideToggle();
					$(this).toggleClass("cerrar2");
			
	    });
	  });   
var tt;
    $(document).ready(function(){
        tt=window.setInterval(startTime,3000);
    });
function startTime(){
   $.ajax({
   type:'GET',
   url:'chinaxml.jsp',
   dataType:'text',
   //xml.getElementsByTagName("city")[0].childNodes.length;
   success:function(xmlDoc){
   var xmlDoc="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+xmlDoc.toString();
	   if (typeof xmlDoc == "string") {
        if (document.implementation.createDocument) {
            var parser = new DOMParser();
            xml = parser.parseFromString(xmlDoc, "text/xml");
        } else if (window.ActiveXObject) {
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = false;
            xml.loadXML(xml);
        }
       }
      else {
          xml = xml;
       }
      var location=new Array([126.41,45.45],[125.19,43.52],[123.24,41.50],[110.20,20.02],[111.48,40.49],[87.36,43.38],[90.08,29.39],[101.45,36.38],[106.16,38.20],[103.49,36.03],[114.28,38.02],[113.42,34.48],[114.21,30.37],[113.00,28.11],[117.00,36.38],[118.50,32.02],[117.18,31.51],[112.34,37.52],[108.54,34.16],[104.05,30.39],[102.41,25.00],[106.42,26.35],[120.09,30.14],[119.18,26.05],[115.52,28.41],[113.15,23.08],[108.20,22.48],[116.28,39.54],[117.11,39.09],[121.29,31.14],[106.32,29.32],[114.10,22.18],[113.35,22.14],[121.31,25.03],[112.00,16.25],[113.40,7.48],[123.284,25.446]);
 var length=37;  
 for(var i=0;i<length;i++){      
	        //修改于2014年1月6号
	var s1=xml.getElementsByTagName("city")[i].getAttribute("tem1");
	var s2=xml.getElementsByTagName("city")[i].getAttribute("tem2"); 
	var stateDetailed=xml.getElementsByTagName("city")[i].getAttribute("stateDetailed");
     var color1;
 // alert(location[i][1]);
 // alert(location[i][0]);
   if(stateDetailed=="晴"){
       var icon = new TIcon("images/re.png",new TSize(35,34));	
	}		
	else if (stateDetailed=="晴转多云")
	{
		var icon = new TIcon("images/qingzhuanduoyun.png",new TSize(35,34));
	}else if (stateDetailed=="多云")
	{
		var icon = new TIcon("images/yinzhuanduoyun.png",new TSize(35,34));
	}else if (stateDetailed=="阴转多云")
	{
		var icon = new TIcon("images/yinzhuanduoyun.png",new TSize(35,34));
	}else if (stateDetailed=="阵雨")
	{
		var icon = new TIcon("images/dayu.png",new TSize(35,34));
	}else if (stateDetailed=="小雨")
	{
		var icon = new TIcon("images/xiaoyu.png",new TSize(35,34));
	}else if (stateDetailed=="阵雨转小雨")
	{
		var icon = new TIcon("images/zhongyu.png",new TSize(35,34));
	}else if (stateDetailed=="阴转阵雨")
	{
		var icon = new TIcon("images/dayu.png",new TSize(35,34));
	}else if (stateDetailed=="雷阵雨")
	{
		var icon = new TIcon("images/leizhenyu.png",new TSize(35,34));
	}else if (stateDetailed=="阵雨转阴")
	{
		var icon = new TIcon("images/zhongyu.png",new TSize(35,34));
	}else if (stateDetailed=="多云转阵雨")
	{
		var icon = new TIcon("images/dayu.png",new TSize(35,34));
	}else if (stateDetailed=="晴转小雨")
	{
		var icon = new TIcon("images/xiaoyu.png",new TSize(35,34));
	}else if (stateDetailed=="多云转小雨")
	{
		var icon = new TIcon("images/xiaoyu.png",new TSize(35,34));
	}else if (stateDetailed=="多云转晴")
	{
		var icon = new TIcon("images/qingzhuanduoyun.png",new TSize(35,34));
	}else if (stateDetailed=="晴转雷阵雨")
	{
		var icon = new TIcon("images/leizhenyu.png",new TSize(35,34));
	}

		marker = new TMarker(new TLngLat(location[i][0],location[i][1]),{icon:icon});
	    map.addOverLay(marker); 
    var cityname=xml.getElementsByTagName("city")[i].getAttribute("cityname");
		 var config = { 
             text:cityname, 
             offset:new TPixel(0,0), 
             position:new TLngLat(location[i][0],location[i][1]) 
         }; 
         var label=new TLabel(config); 
		 label.setBorderLine(0);
        map.addOverLay(label); 
	var cityname=xml.getElementsByTagName("city")[i].getAttribute("cityname");

	var windState=xml.getElementsByTagName("city")[i].getAttribute("windState");
	    var html=[]; 
	    html.push('<div style="background:#CCCC99;height:20px;color:#000;">'); 
        html.push('     <span style="width:100px;margin-left:2px;background:" id="customers">'+cityname+'</span>');    
        html.push('</div>'); 
        html.push('<div id="deliver-legend-ctrl" style="background:#fff;border:1px solid #C0C0C0;">'); 
        html.push(' <table cellspacing="1" cellspadding="1" style="width:200px;border:1px solid #ff0000;" id="customers">'); 
        html.push('     <tr class="alt">'); 
        html.push('         <td>经度:</td>'); 
        html.push('         <td>'+location[i][0]+'</td>'); 
        html.push('     </tr>'); 
	    html.push('     <tr>'); 
        html.push('         <td>纬度:</td>'); 
        html.push('         <td>'+location[i][1]+'</td>'); 
        html.push('     </tr>');
		html.push('     <tr class="alt">'); 
        html.push('         <td >天气情况:</td>'); 
        html.push('         <td>'+stateDetailed+'</td>'); 
        html.push('     </tr>');
        html.push('     <tr class="alt">'); 
        html.push('         <td >风力情况:</td>'); 
        html.push('         <td>'+windState+'</td>'); 
        html.push('     </tr>');
        html.push('     <tr>'); 
        html.push('         <td>温度范围:</td>'); 
        html.push('         <td>'+s1+'<sup>。</sup>C'+'-'+s2+'<sup>。</sup>C'+'</td>'); 
        html.push('     </tr>');
        html.push(' </table>');
        html.push('</div>'); 	 
    TEvent.addListener(marker,"click",getClickCallBack(marker,html));	
   }  
   var sum=0;
   var error ='';
   strData="<chart caption='' subCaption='' sformatNumberScale='1'  xAxisName='不同地区的温度分布直方图' yAxisName='温度（cel）'>";
  for(var i=0;i<length;i++){      
	        //修改于2014年1月6号
	var s1=xml.getElementsByTagName("city")[i].getAttribute("tem1");
	var s2=xml.getElementsByTagName("city")[i].getAttribute("tem2");
	var cityname=xml.getElementsByTagName("city")[i].getAttribute("cityname");
	var maxtemp;
	if(parseFloat(s1)>parseFloat(s2)){
	   maxtemp=parseFloat(s1);
	}else{
	   maxtemp=parseFloat(s2);
	}
     var color;
    if(s1>=34||s2>=34){
	    color="#FF3333";  
    }else if(s1>=30||s2>=30){
	    color="#00CCFF"; 	
    }else{
	    color="#733077"; 
    }
    strData+="<set label='"+cityname+"' value='"+maxtemp+"' color='"+color+"'/>";
	if(maxtemp>=34){
	   error+=cityname+"异常:最高温度为"+maxtemp+"\n";
	}
	if(parseFloat(s1)>parseFloat(s2)){
	   maxtemp=parseFloat(s1);
	}else{
	   maxtemp=parseFloat(s2);
	}
    sum+=maxtemp;
  }
   strData+="</chart>";
   var mychart= new FusionCharts("../SHUSensorPlatform/Column3d.swf","myChartID","100%","100%","0","1");
   mychart.setXMLData(strData);
   mychart.render("chartcontainer");//-->
//errorExpress		
   if(error!=''){
	}else{
	error+="没有异常"; 
    }	
	var value=(sum/37).toFixed(1);		 
	document.getElementById("opciones2").innerHTML='';
//取平均值

		document.getElementById("opciones2").innerHTML='<div id="test">'+value+'</div><textarea name="request" id="requestTextarea"  style="width:230px; height:100px"></textarea>';
		$('#test').speedometer();
		$('.changeSpeedometer').click(function(){
		$('#test').speedometer({ percentage: $('.speedometer').val() || 0 });
	   });
		 document.getElementById("requestTextarea").innerHTML=error;	           	   
   },
   error:function(){
      alert('error');
   }
});	 
    
};
function getClickCallBack(marker,html){
	return function(){marker.openInfoWinHtml(html.join(''));};
}
function onLoad() 
{  
	map=new TMap("mapDiv"); 
   	//设置显示地图的中心点和级别 
	map.centerAndZoom(new TLngLat(114.36932,30.5353),5); 
	map.enableHandleMouseScroll();
    var config = { 
           type:"TMAP_NAVIGATION_CONTROL_LARGE",   //缩放平移的显示类型 
             anchor:"TMAP_ANCHOR_TOP_LEFT",          //缩放平移控件显示的位置 
             offset:[0,0],                           //缩放平移控件的偏移值 
             showZoomInfo:true                       //是否显示级别提示信息，true表示显示，false表示隐藏。 
      }; 
    control=new TNavigationControl(config); 
    map.addControl(control); 
} 
 
function onClose(){ 
    map.removeOverLay(customerWinInfo); 
} 
</SCRIPT>
</head>
<body onLoad="onLoad()">
<div id="mapDiv" style="position:absolute;width:100%; height:100%"></div> 
<DIV id=settings>Settings</DIV>
<DIV id=opciones style="width:100%;height:30%"">
  <div id="chartcontainer">FusionCharts will load here!</div>
</DIV>
<DIV id=settings2>Settings</DIV>
<DIV id=opciones2>
<div id="test">
		 
		</div>
  <textarea name="request" id="requestTextarea"  style="width:230px; height:100px"></textarea>
  </DIV>
</body>
</html>
</body>
</html>