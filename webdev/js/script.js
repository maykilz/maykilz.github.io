
$('.team__teamslider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 3,
    adaptiveHeight: true,
    arrows: false,  
    responsive: [
      {
        breakpoint: 1024,
        settings: {
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 3,
            adaptiveHeight: true,
            arrows: false,  
        }
      },
      {
        breakpoint: 768,
        settings: {
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            arrows: false,  
        }
      },
      {
        breakpoint: 640,
        settings: {
            dots: true,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            adaptiveHeight: true,
            arrows: false,  
        }
      }
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ]
});
let openbutton = document.getElementsByClassName('menu__open');
let closebutton = document.getElementsByClassName('menu__close');
let menu = document.getElementsByClassName('header__menulist');
menu = menu[0];

openbutton = openbutton[0];
closebutton = closebutton[0];
console.log(openbutton);

openbutton.addEventListener('click', function() {  
 closebutton.style.display = "block";
 openbutton.style.display = "none";
 menu.style.display = "flex";
});



closebutton.addEventListener('click', function () {   
 closebutton.style.display = "none";
 openbutton.style.display = "block";
 menu.style.display = "none";
});

$(document).ready(function(){
 
 $("#menu").on("click","a", function (event) {

  
     event.preventDefault();

  
     var id  = $(this).attr('href'), 

         top = $(id).offset().top;
 

     $('body,html').animate({scrollTop: top}, 1500);

 });

});


let typebuttons = document.getElementsByClassName('typebutton');
let allbutton  = document.getElementsByClassName('allbutton');
let designbutton  = document.getElementsByClassName('designbutton');
let allitem = document.getElementsByClassName('latestworks__item');
let designitems = document.getElementsByClassName('webdesign');
let uxbutton = document.getElementsByClassName('uxbutton');
let uxitems = document.getElementsByClassName('uxdesign');
let mockupbutton  = document.getElementsByClassName('mockupbutton');
let mockupitems = document.getElementsByClassName('mockups');

allbutton = allbutton[0];
designbutton = designbutton[0];
uxbutton = uxbutton[0];
mockupbutton = mockupbutton[0];


allbutton.addEventListener('click', function(event) { 
     
 for(let i=0; i<allitem.length; i++) {
  allitem[i].style.display= "block";
 }  
 for(let i=0; i< typebuttons.length;i++) {
    typebuttons[i].classList.remove('activetype');  
 }
 allbutton.classList.add('activetype');
  
 event.preventDefault();
});


designbutton.addEventListener('click', function(event) { 
     
    for(let i=0; i<allitem.length; i++) {
     allitem[i].style.display= "none";
    }   
 
 for (let i=0; i< designitems.length; i++) { 
  designitems[i].style.display = "block";     
 }
 
 for(let i=0; i< typebuttons.length;i++) {
    typebuttons[i].classList.remove('activetype');  
 }

 designbutton.classList.add('activetype'); 
 event.preventDefault();
});


 
uxbutton.addEventListener('click', function() { 
     
    for(let i=0; i<allitem.length; i++) {
     allitem[i].style.display= "none";
    }   
    for (let i=0; i< uxitems.length; i++) { 
    uxitems[i].style.display = "block";     
    }
    for(let i=0; i< typebuttons.length;i++) {
        typebuttons[i].classList.remove('activetype');  
     }
     
    uxbutton.classList.add('activetype');
     
 event.preventDefault();
});


mockupbutton.addEventListener('click', function(event) {  
    for(let i=0; i<allitem.length; i++) {
     allitem[i].style.display= "none";
    }   
    for (let i=0; i< uxitems.length; i++) { 
        mockupitems[i].style.display = "block";     
    }
    
    for(let i=0; i< typebuttons.length;i++) {
        typebuttons[i].classList.remove('activetype');  
     }
    
     mockupbutton.classList.add('activetype');
      
 event.preventDefault();
});


console.clear();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzY3JpcHQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbiQoJy50ZWFtX190ZWFtc2xpZGVyJykuc2xpY2soe1xyXG4gICAgZG90czogdHJ1ZSxcclxuICAgIGluZmluaXRlOiB0cnVlLFxyXG4gICAgc3BlZWQ6IDMwMCxcclxuICAgIHNsaWRlc1RvU2hvdzogMyxcclxuICAgIGFkYXB0aXZlSGVpZ2h0OiB0cnVlLFxyXG4gICAgYXJyb3dzOiBmYWxzZSwgIFxyXG4gICAgcmVzcG9uc2l2ZTogW1xyXG4gICAgICB7XHJcbiAgICAgICAgYnJlYWtwb2ludDogMTAyNCxcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSwgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrcG9pbnQ6IDc2OCxcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSwgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGJyZWFrcG9pbnQ6IDY0MCxcclxuICAgICAgICBzZXR0aW5nczoge1xyXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc3BlZWQ6IDMwMCxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZSxcclxuICAgICAgICAgICAgYXJyb3dzOiBmYWxzZSwgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBZb3UgY2FuIHVuc2xpY2sgYXQgYSBnaXZlbiBicmVha3BvaW50IG5vdyBieSBhZGRpbmc6XHJcbiAgICAgIC8vIHNldHRpbmdzOiBcInVuc2xpY2tcIlxyXG4gICAgICAvLyBpbnN0ZWFkIG9mIGEgc2V0dGluZ3Mgb2JqZWN0XHJcbiAgICBdXHJcbn0pO1xyXG5sZXQgb3BlbmJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21lbnVfX29wZW4nKTtcclxubGV0IGNsb3NlYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnbWVudV9fY2xvc2UnKTtcclxubGV0IG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdoZWFkZXJfX21lbnVsaXN0Jyk7XHJcbm1lbnUgPSBtZW51WzBdO1xyXG5cclxub3BlbmJ1dHRvbiA9IG9wZW5idXR0b25bMF07XHJcbmNsb3NlYnV0dG9uID0gY2xvc2VidXR0b25bMF07XHJcbmNvbnNvbGUubG9nKG9wZW5idXR0b24pO1xyXG5cclxub3BlbmJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkgeyAgXHJcbiBjbG9zZWJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gb3BlbmJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiBtZW51LnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcclxufSk7XHJcblxyXG5cclxuXHJcbmNsb3NlYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkgeyAgIFxyXG4gY2xvc2VidXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gb3BlbmJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xyXG4gbWVudS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn0pO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuIFxyXG4gJChcIiNtZW51XCIpLm9uKFwiY2xpY2tcIixcImFcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcblxyXG4gIFxyXG4gICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gIFxyXG4gICAgIHZhciBpZCAgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKSwgXHJcblxyXG4gICAgICAgICB0b3AgPSAkKGlkKS5vZmZzZXQoKS50b3A7XHJcbiBcclxuXHJcbiAgICAgJCgnYm9keSxodG1sJykuYW5pbWF0ZSh7c2Nyb2xsVG9wOiB0b3B9LCAxNTAwKTtcclxuXHJcbiB9KTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbmxldCB0eXBlYnV0dG9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3R5cGVidXR0b24nKTtcclxubGV0IGFsbGJ1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhbGxidXR0b24nKTtcclxubGV0IGRlc2lnbmJ1dHRvbiAgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZXNpZ25idXR0b24nKTtcclxubGV0IGFsbGl0ZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdsYXRlc3R3b3Jrc19faXRlbScpO1xyXG5sZXQgZGVzaWduaXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd3ZWJkZXNpZ24nKTtcclxubGV0IHV4YnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndXhidXR0b24nKTtcclxubGV0IHV4aXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd1eGRlc2lnbicpO1xyXG5sZXQgbW9ja3VwYnV0dG9uICA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ21vY2t1cGJ1dHRvbicpO1xyXG5sZXQgbW9ja3VwaXRlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdtb2NrdXBzJyk7XHJcblxyXG5hbGxidXR0b24gPSBhbGxidXR0b25bMF07XHJcbmRlc2lnbmJ1dHRvbiA9IGRlc2lnbmJ1dHRvblswXTtcclxudXhidXR0b24gPSB1eGJ1dHRvblswXTtcclxubW9ja3VwYnV0dG9uID0gbW9ja3VwYnV0dG9uWzBdO1xyXG5cclxuXHJcbmFsbGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7IFxyXG4gICAgIFxyXG4gZm9yKGxldCBpPTA7IGk8YWxsaXRlbS5sZW5ndGg7IGkrKykge1xyXG4gIGFsbGl0ZW1baV0uc3R5bGUuZGlzcGxheT0gXCJibG9ja1wiO1xyXG4gfSAgXHJcbiBmb3IobGV0IGk9MDsgaTwgdHlwZWJ1dHRvbnMubGVuZ3RoO2krKykge1xyXG4gICAgdHlwZWJ1dHRvbnNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZldHlwZScpOyAgXHJcbiB9XHJcbiBhbGxidXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZldHlwZScpO1xyXG4gIFxyXG4gZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxufSk7XHJcblxyXG5cclxuZGVzaWduYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHsgXHJcbiAgICAgXHJcbiAgICBmb3IobGV0IGk9MDsgaTxhbGxpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgYWxsaXRlbVtpXS5zdHlsZS5kaXNwbGF5PSBcIm5vbmVcIjtcclxuICAgIH0gICBcclxuIFxyXG4gZm9yIChsZXQgaT0wOyBpPCBkZXNpZ25pdGVtcy5sZW5ndGg7IGkrKykgeyBcclxuICBkZXNpZ25pdGVtc1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiOyAgICAgXHJcbiB9XHJcbiBcclxuIGZvcihsZXQgaT0wOyBpPCB0eXBlYnV0dG9ucy5sZW5ndGg7aSsrKSB7XHJcbiAgICB0eXBlYnV0dG9uc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmV0eXBlJyk7ICBcclxuIH1cclxuXHJcbiBkZXNpZ25idXR0b24uY2xhc3NMaXN0LmFkZCgnYWN0aXZldHlwZScpOyBcclxuIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbn0pO1xyXG5cclxuXHJcbiBcclxudXhidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHsgXHJcbiAgICAgXHJcbiAgICBmb3IobGV0IGk9MDsgaTxhbGxpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgYWxsaXRlbVtpXS5zdHlsZS5kaXNwbGF5PSBcIm5vbmVcIjtcclxuICAgIH0gICBcclxuICAgIGZvciAobGV0IGk9MDsgaTwgdXhpdGVtcy5sZW5ndGg7IGkrKykgeyBcclxuICAgIHV4aXRlbXNbaV0uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjsgICAgIFxyXG4gICAgfVxyXG4gICAgZm9yKGxldCBpPTA7IGk8IHR5cGVidXR0b25zLmxlbmd0aDtpKyspIHtcclxuICAgICAgICB0eXBlYnV0dG9uc1tpXS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmV0eXBlJyk7ICBcclxuICAgICB9XHJcbiAgICAgXHJcbiAgICB1eGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdhY3RpdmV0eXBlJyk7XHJcbiAgICAgXHJcbiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59KTtcclxuXHJcblxyXG5tb2NrdXBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkgeyAgXHJcbiAgICBmb3IobGV0IGk9MDsgaTxhbGxpdGVtLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgYWxsaXRlbVtpXS5zdHlsZS5kaXNwbGF5PSBcIm5vbmVcIjtcclxuICAgIH0gICBcclxuICAgIGZvciAobGV0IGk9MDsgaTwgdXhpdGVtcy5sZW5ndGg7IGkrKykgeyBcclxuICAgICAgICBtb2NrdXBpdGVtc1tpXS5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiOyAgICAgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGZvcihsZXQgaT0wOyBpPCB0eXBlYnV0dG9ucy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICAgdHlwZWJ1dHRvbnNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZldHlwZScpOyAgXHJcbiAgICAgfVxyXG4gICAgXHJcbiAgICAgbW9ja3VwYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZXR5cGUnKTtcclxuICAgICAgXHJcbiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG59KTtcclxuXHJcblxyXG5jb25zb2xlLmNsZWFyKCk7Il0sImZpbGUiOiJzY3JpcHQuanMifQ==
