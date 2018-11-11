let openmenu = document.getElementById('openmenu');
let closemenu = document.getElementById('closemenu');
let menu = document.getElementById('menu');

openmenu.addEventListener('click', function() { 
 menu.style.display = "flex";
 openmenu.style.display = "none";
 closemenu.style.display = "block";
})


closemenu.addEventListener('click', function() {
 menu.style.display = "none";
 openmenu.style.display = "block";
 closemenu.style.display = "none";
});

 
$(document).ready(function(){ 
    $("#menu").on("click","a", function (event) { 
        event.preventDefault(); 
        var id  = $(this).attr('href'), 
            top = $(id).offset().top;  
        $('body,html').animate({scrollTop: top}, 1500); 
    });
 
});

let searchbutton = document.getElementById('headersearch');
let seatchinput = document.getElementById('searchinput');
 

 

console.log(searchbutton);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHRzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBvcGVubWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvcGVubWVudScpO1xyXG5sZXQgY2xvc2VtZW51ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nsb3NlbWVudScpO1xyXG5sZXQgbWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZW51Jyk7XHJcblxyXG5vcGVubWVudS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyBcclxuIG1lbnUuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG4gb3Blbm1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gY2xvc2VtZW51LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn0pXHJcblxyXG5cclxuY2xvc2VtZW51LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcbiBtZW51LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuIG9wZW5tZW51LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbiBjbG9zZW1lbnUuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG59KTtcclxuXHJcbiBcclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXsgXHJcbiAgICAkKFwiI21lbnVcIikub24oXCJjbGlja1wiLFwiYVwiLCBmdW5jdGlvbiAoZXZlbnQpIHsgXHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgXHJcbiAgICAgICAgdmFyIGlkICA9ICQodGhpcykuYXR0cignaHJlZicpLCBcclxuICAgICAgICAgICAgdG9wID0gJChpZCkub2Zmc2V0KCkudG9wOyAgXHJcbiAgICAgICAgJCgnYm9keSxodG1sJykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiB0b3B9LCAxNTAwKTsgXHJcbiAgICB9KTtcclxuIFxyXG59KTtcclxuXHJcbmxldCBzZWFyY2hidXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGVhZGVyc2VhcmNoJyk7XHJcbmxldCBzZWF0Y2hpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2hpbnB1dCcpO1xyXG4gXHJcblxyXG4gXHJcblxyXG5jb25zb2xlLmxvZyhzZWFyY2hidXR0b24pOyJdLCJmaWxlIjoic2NyaXB0cy5qcyJ9
