
 $(document).ready(function(){
    $("#menu").on("click","a", function (event) {
        event.preventDefault();
        var id  = $(this).attr('href'),
            top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1500);
    });
});
 let form = document.getElementById('dialog');
 let closer = document.getElementById('closeform');
 let buttons = document.getElementsByClassName('button');
 let blur = document.getElementById('blur');
 let checkbox = document.getElementById('consent_checkbox');
 let submit = document.getElementsByClassName('form_button')[0];
 console.log(submit);
 checkbox.addEventListener('click', function() {
   if (checkbox.checked) { 
     submit.disabled = false;
   }
   else {

     submit.disabled = true;
   }
 });
 for (i=0; i<buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
      dialog.style.display = "block";
      blur.style.display  = "block";
      return false;
    })
 }
 closer.addEventListener('click', function() {
     dialog.style.display = "none";
     blur.style.display = "none";
     return false;
 })


 $("#dialog").submit(function() {
     $.ajax({
       type: "POST",
       url: "mail.php",
       data: $("#dialogbox").serialize()
     }).done(function() {
       setTimeout(function() {
       }, 1000);
     });
     var thank = confirm("Спасибо! ваша заявка поступила, в ближайшее время мы вам перезвоним");
     if (thank == true) {
       dialog.style.display = "none";
       blur.style.display = "none";
       return false;
     }
   });
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbiAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgJChcIiNtZW51XCIpLm9uKFwiY2xpY2tcIixcImFcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICB2YXIgaWQgID0gJCh0aGlzKS5hdHRyKCdocmVmJyksXHJcbiAgICAgICAgICAgIHRvcCA9ICQoaWQpLm9mZnNldCgpLnRvcDtcclxuICAgICAgICAkKCdib2R5LGh0bWwnKS5hbmltYXRlKHtzY3JvbGxUb3A6IHRvcH0sIDE1MDApO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4gbGV0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGlhbG9nJyk7XHJcbiBsZXQgY2xvc2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlZm9ybScpO1xyXG4gbGV0IGJ1dHRvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b24nKTtcclxuIGxldCBibHVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JsdXInKTtcclxuIGxldCBjaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb25zZW50X2NoZWNrYm94Jyk7XHJcbiBsZXQgc3VibWl0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZm9ybV9idXR0b24nKVswXTtcclxuIGNvbnNvbGUubG9nKHN1Ym1pdCk7XHJcbiBjaGVja2JveC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xyXG4gICBpZiAoY2hlY2tib3guY2hlY2tlZCkgeyBcclxuICAgICBzdWJtaXQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgfVxyXG4gICBlbHNlIHtcclxuXHJcbiAgICAgc3VibWl0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgfVxyXG4gfSk7XHJcbiBmb3IgKGk9MDsgaTxidXR0b25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICBidXR0b25zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGRpYWxvZy5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gICAgICBibHVyLnN0eWxlLmRpc3BsYXkgID0gXCJibG9ja1wiO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9KVxyXG4gfVxyXG4gY2xvc2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgZGlhbG9nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICBibHVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICByZXR1cm4gZmFsc2U7XHJcbiB9KVxyXG5cclxuXHJcbiAkKFwiI2RpYWxvZ1wiKS5zdWJtaXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgJC5hamF4KHtcclxuICAgICAgIHR5cGU6IFwiUE9TVFwiLFxyXG4gICAgICAgdXJsOiBcIm1haWwucGhwXCIsXHJcbiAgICAgICBkYXRhOiAkKFwiI2RpYWxvZ2JveFwiKS5zZXJpYWxpemUoKVxyXG4gICAgIH0pLmRvbmUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgfSwgMTAwMCk7XHJcbiAgICAgfSk7XHJcbiAgICAgdmFyIHRoYW5rID0gY29uZmlybShcItCh0L/QsNGB0LjQsdC+ISDQstCw0YjQsCDQt9Cw0Y/QstC60LAg0L/QvtGB0YLRg9C/0LjQu9CwLCDQsiDQsdC70LjQttCw0LnRiNC10LUg0LLRgNC10LzRjyDQvNGLINCy0LDQvCDQv9C10YDQtdC30LLQvtC90LjQvFwiKTtcclxuICAgICBpZiAodGhhbmsgPT0gdHJ1ZSkge1xyXG4gICAgICAgZGlhbG9nLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgIGJsdXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgIH1cclxuICAgfSk7Il0sImZpbGUiOiJzY3JpcHQuanMifQ==
