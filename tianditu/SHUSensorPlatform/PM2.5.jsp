<%@page import="java.awt.Color,
java.awt.Font,
javax.servlet.http.HttpSession"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>PM2.5监控</title>

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
   url:'http://localhost:84/SHUSensorPlatform/PM2.5_data.jsp',
   dataType:'text',
   //xml.getElementsByTagName("city")[0].childNodes.length;
   success:function(object){
     var location=new Array([121.398443,31.263743],[121.251014,31.364338],[121.491919,31.282497],[121.446235,31.169152],[121.535717,31.30451],[121.091425,31.130862],[121.454756,31.235381],[121.371886,31.476831],[121.638481,31.230895],[121.591849,31.210825]);
     var arr1=object.replace("[","");
     var arr2=arr1.replace("]","");
     var arr3=arr2.replace("{","");
     var arr4=arr3.replace("}","");
     var array=arr4.split(',');
	 	var pm = new Array(10);  	
	  for(var i=2,j=0;i<99,j<10;i=i+9,j++){
		 pm[j]=array[i];	  
		} 
    var  pm_aver= new Array(10);
	for(var i=3,j=0;i<99,j<10;i=i+9,j++){
		 pm_aver[j]=array[i];	    
		} 
    var position_name=new Array(10);  
	for(var i=4,j=0;i<99,j<10;i=i+9,j++){
		 position_name[j]=array[i];	    
		}
	var quality=new Array(10);  
	for(var i=6,j=0;i<99,j<10;i=i+9,j++){
		 quality[j]=array[i];	    
		}
	var time_point=new Array(10);  
	for(var i=8,j=0;i<99,j<10;i=i+9,j++){
		 time_point[j]=array[i];	    
		}
	
		
		
 for(var i=0;i<10;i++){      
	        //修改于2014年1月6号
	var position_name1=position_name[i].split(":")[1];
	var position_name2=position_name1.substr(1,position_name1.length-2);
     var color1;
 // alert(location[i][1]);
 // alert(location[i][0]);
	var icon = new TIcon("images/smoke.png",new TSize(55,54));
		marker = new TMarker(new TLngLat(location[i][0],location[i][1]),{icon:icon});
	    map.addOverLay(marker); 
   
		 var config = { 
             text:position_name2, 
             offset:new TPixel(0,0), 
             position:new TLngLat(location[i][0],location[i][1]) 
         }; 
         var label=new TLabel(config); 
		 label.setBorderLine(0);
        map.addOverLay(label); 
	
	var quality1=quality[i].split(":")[1];
	var quality2=quality1.substr(1,quality1.length-2);
	var pm1=pm[i].split(":")[1];
	var time_point1=time_point[i].split(":")[1];
	var time_point2=time_point1.substr(1,time_point1.length);
	//alert(time_point2);
	    var html=[]; 
	    html.push('<div style="background:#CCCC99;height:20px;color:#000;">'); 
        html.push('     <span style="width:100px;margin-left:2px;background:" id="customers">'+position_name2+'</span>');    
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
        html.push('         <td >PM2.5值:</td>'); 
        html.push('         <td>'+pm1+'</td>'); 
        html.push('     </tr>');
        html.push('     <tr class="alt">'); 
        html.push('         <td >空气质量:</td>'); 
        html.push('         <td>'+quality2+'</td>'); 
        html.push('     </tr>');
		 html.push('     <tr class="alt">'); 
        html.push('         <td >观测时间:</td>'); 
        html.push('         <td>'+time_point2+'</td>'); 
        html.push('     </tr>');
        html.push(' </table>');
        html.push('</div>'); 	 
    TEvent.addListener(marker,"click",getClickCallBack(marker,html));	
   }  
   var sum=0;
   var error ='';
   strData="<chart caption='' subCaption='' sformatNumberScale='1'  xAxisName='上海市不同地区的PM2.5分布直方图' yAxisName='PM2.5'>";
  for(var i=0;i<10;i++){      
	        //修改于2014年9月22号
	var quality3=quality[i].split(":")[1];
	var quality4=quality3.substr(1,quality1.length-2);
	var pm3=pm[i].split(":")[1];
	var time_point3=time_point[i].split(":")[1];
	var time_point4=time_point3.substr(1,time_point1.length);
	var position_name3=position_name[i].split(":")[1];
	var position_name4=position_name3.substr(1,position_name1.length-2);
     var color;
    if(pm3>20){
	    color="#FF3333";  
    }else if(pm3>15){
	    color="#00CCFF"; 	
    }else{
	    color="#733077"; 
    }
    strData+="<set label='"+position_name4+"' value='"+pm3+"' color='"+color+"'/>";
	if(pm3>=20){
	   error+=position_name2+"异常:最高为"+pm3+"\n";
	}
	//var eachvalue=Double.parseDouble(pm3);
	sum+=parseFloat(pm3);
   
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
	var value=(sum/10).toFixed(1);		 
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
	map.centerAndZoom(new TLngLat(121.48,31.22),11); 
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