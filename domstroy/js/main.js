 
var elements = document.getElementsByClassName('phoneinput');
for (var i = 0; i < elements.length; i++) {
  new IMask(elements[i], {
    mask: '+{7}(000)000-00-00',
  });
}




$(document).ready(function(){
 
  $("#body").on("click","a", function (event) {

      event.preventDefault();

      var id  = $(this).attr('href'),

          top = $(id).offset().top;

      $('body,html').animate({scrollTop: top}, 1500);

  }); 
});