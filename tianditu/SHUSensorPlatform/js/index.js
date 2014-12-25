$(document).ready(function(){

$('#bus').click(function(){
	$('.index_left').load('busService_left.html');
 });
 $('.guance').click(function(){
	$('.index_left').load('guance.jsp');
 });
  $('.kongzhi').click(function(){
	$('.index_left').load('kongzhi.jsp');
 });
 $('.sensorList').click(function(){
	$('.index_left').load('chuanganqiList.jsp');
 });
 $('.propertyList').click(function(){
	$('.index_left').load('SensorPropertyList.jsp');
 });
 $('.filter').click(function(){
	$('.index_left').load('Sensor_Filter.jsp');
 });
});
//$('.buttonGroup').css('display','none);
//	  $('#explodeButton').val()='展开';