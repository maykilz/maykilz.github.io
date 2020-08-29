

galleryThumbs = new Swiper('.gallery-thumbs', {
 spaceBetween: 10,
 slidesPerView: 4,
 loop: true,
 freeMode: true,
 loopedSlides: 5, //looped slides should be the same
 watchSlidesVisibility: true,
 watchSlidesProgress: true,
});

galleryTop = new Swiper('.gallery-top', {
 spaceBetween: 10,
 loop: true,
 loopedSlides: 5, //looped slides should be the same
 navigation: {
   nextEl: '.swiper-button-next',
   prevEl: '.swiper-button-prev',
 },
 thumbs: {
   swiper: galleryThumbs,
 },
});


var swiper = new Swiper('.swiper-container2', {
 slidesPerView: 3,
 spaceBetween: 30,
 navigation: {
   nextEl: '.swiper-button-next',
   prevEl: '.swiper-button-prev',
 },
 pagination: {
   el: '.swiper-pagination',
   clickable: true,
 },
});