$(document).ready(function(){
$('.div1 a').click(function(){
   $('.div1').removeClass('a-click');
   $('.div1 a').css('color','#888');
   $(this).parent().addClass('a-click');
   $(this).css('color','white');
});
});