$(document).ready(function(){
	$('#button3').on('click',function(){
		
	   $('.addInput').css('display','block');
	});
	$('#close').on('click',function(){
	   $('.addInput').css('display','none');
	});
		$('#button4').on('click',function(){
	   $('.addOutput').css('display','block');
	});
	$('#close2').on('click',function(){
	   $('.addOutput').css('display','none');
	});
	$('#addInputButton').on('click',function(){
	    $(this).css('background','red');
	});
});