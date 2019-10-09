
$(function(){
  $('a[href^="#"]').on('click', function(event) {
    // отменяем стандартное действие
    event.preventDefault();
    
    var sc = $(this).attr("href"),
        dn = $(sc).offset().top;
    /*
    * sc - в переменную заносим информацию о том, к какому блоку надо перейти
    * dn - определяем положение блока на странице
    */
    
    $('html, body').animate({scrollTop: dn}, 1000);
    
    /*
    * 1000 скорость перехода в миллисекундах
    */
  });
});
 

  if (document.body.clientWidth <= 768) {
   
  $('.works__items').slick(); 
  $('.newslist').slick();
  $('.newslist__newsitem').css("padding",  "0px"); 
  let menuopen = document.getElementsByClassName('navbar-toggler')[0];
  console.log(menuopen); 
  menuopen.addEventListener("click", function() { 
    let s = document.getElementsByClassName('show')[0];
    console.log(s); 
    if (s ==undefined) {
      let navbar = document.getElementsByClassName('navbar')[0];
      navbar.classList.add('opened');  
    }
    else {
      let navbar =    document.getElementsByClassName('navbar')[0];
      navbar.classList.remove('opened')
    } 
  }) ; 
} 
   
  
if (document.body.clientWidth < 992)  {
  $('.reviews__items').slick(
    {
      swipe: true, 
    }
  ); 
 $('.newslist').slick({
   swipe: true, 
 })
}
else {
  $('.reviews__items').slick({  
  slidesToShow: 1,  
  variableWidth: true,  
  swipe: false,  
}); 
}
 
  
