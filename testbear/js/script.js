
$('.reviews__slider').slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 2000,
  dots: true,
  mobileFirst: true,
  arrows: false,
  dots: false,
  responsive: [
    {
      breakpoint: 576,
      settings: {
        slidesToShow:3,
        slidesToShow:3,
        arrows: true,
        dots: true,
      }
    }
  ]

});
