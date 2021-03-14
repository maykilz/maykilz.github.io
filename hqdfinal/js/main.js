var elements = document.getElementsByClassName('form-number');
for (var i = 0; i < elements.length; i++) {
  new IMask(elements[i], {
    mask: '+{7}(000)000-00-00',
  });
}
 let button = document.getElementsByClassName('.ship__button')[0];

 $(document).ready(function(){
  $('input[type=checkbox]').change(function(){
    var count = 0;
    $.each($('input[type=checkbox]'), function(){
      if($(this).prop('checked') == true){
        count++;
      }
    });
    if(count == 1) {
      $('.ship__button').prop('disabled', false); 
    }
    else { 
      $('.ship__button').prop('disabled', true);  
    }
  });
});



$("#popup-form").submit(function() {
  $.ajax({
    type: "POST",
    url: "send.php",
    data: $("#popup-form").serialize()
  }).done(function() {
    setTimeout(function() {
    }, 1000);
  });
  var thank = confirm("Спасибо! ваша заявка поступила, в ближайшее время мы вам перезвоним");
  if (thank == true) { 
    return false;
  }
});

 