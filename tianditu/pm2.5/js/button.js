$(document).ready(function(){
$('button').on('mouseenter',function(){
   $(this).css('background-color','orange');
});
$('button').on('mouseleave',function(){
   $(this).css('background-color','#888');
});
});