/*
    Name: YouTubePopUp
    Description: jQuery plugin to display YouTube or Vimeo video in PopUp, responsive and retina, easy to use.
    Version: 1.0.1
    Plugin URL: http://wp-time.com/youtube-popup-jquery-plugin/
    Written By: Qassim Hassan
    Twitter: @QQQHZ
    Websites: wp-time.com | qass.im | wp-plugins.in
    Dual licensed under the MIT and GPL licenses:
        http://www.opensource.org/licenses/mit-license.php
        http://www.gnu.org/licenses/gpl.html
    Copyright (c) 2016 - Qassim Hassan
*/

(function ( $ ) {
 
    $.fn.YouTubePopUp = function(options) {

        var YouTubePopUpOptions = $.extend({
                autoplay: 1
        }, options );

        $(this).on('click', function (e) {

            var youtubeLink = $(this).attr("href");

            if( youtubeLink.match(/(youtube.com)/) ){
                var split_c = "v=";
                var split_n = 1;
            }

            if( youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(vimeo.com\/)+[0-9]/) ){
                var split_c = "/";
                var split_n = 3;
            }

            if( youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
                var split_c = "/";
                var split_n = 5;
            }

            var getYouTubeVideoID = youtubeLink.split(split_c)[split_n];

            var cleanVideoID = getYouTubeVideoID.replace(/(&)+(.*)/, "");

            if( youtubeLink.match(/(youtu.be)/) || youtubeLink.match(/(youtube.com)/) ){
                var videoEmbedLink = "https://www.youtube.com/embed/"+cleanVideoID+"?autoplay="+YouTubePopUpOptions.autoplay+"";
            }

            if( youtubeLink.match(/(vimeo.com\/)+[0-9]/) || youtubeLink.match(/(vimeo.com\/)+[a-zA-Z]/) ){
                var videoEmbedLink = "https://player.vimeo.com/video/"+cleanVideoID+"?autoplay="+YouTubePopUpOptions.autoplay+"";
            }

            $("body").append('<div class="YouTubePopUp-Wrap YouTubePopUp-animation"><div class="YouTubePopUp-Content"><span class="YouTubePopUp-Close"></span><iframe src="'+videoEmbedLink+'" allowfullscreen></iframe></div></div>');

            if( $('.YouTubePopUp-Wrap').hasClass('YouTubePopUp-animation') ){
                setTimeout(function() {
                    $('.YouTubePopUp-Wrap').removeClass("YouTubePopUp-animation");
                }, 600);
            }

            $(".YouTubePopUp-Wrap, .YouTubePopUp-Close").click(function(){
                $(".YouTubePopUp-Wrap").addClass("YouTubePopUp-Hide").delay(515).queue(function() { $(this).remove(); });
            });

            e.preventDefault();

        });

        $(document).keyup(function(e) {

            if ( e.keyCode == 27 ){
                $('.YouTubePopUp-Wrap, .YouTubePopUp-Close').click();
            }

        });

    };
 
}( jQuery ));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJZb3VUdWJlUG9wVXAuanF1ZXJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAgICBOYW1lOiBZb3VUdWJlUG9wVXBcclxuICAgIERlc2NyaXB0aW9uOiBqUXVlcnkgcGx1Z2luIHRvIGRpc3BsYXkgWW91VHViZSBvciBWaW1lbyB2aWRlbyBpbiBQb3BVcCwgcmVzcG9uc2l2ZSBhbmQgcmV0aW5hLCBlYXN5IHRvIHVzZS5cclxuICAgIFZlcnNpb246IDEuMC4xXHJcbiAgICBQbHVnaW4gVVJMOiBodHRwOi8vd3AtdGltZS5jb20veW91dHViZS1wb3B1cC1qcXVlcnktcGx1Z2luL1xyXG4gICAgV3JpdHRlbiBCeTogUWFzc2ltIEhhc3NhblxyXG4gICAgVHdpdHRlcjogQFFRUUhaXHJcbiAgICBXZWJzaXRlczogd3AtdGltZS5jb20gfCBxYXNzLmltIHwgd3AtcGx1Z2lucy5pblxyXG4gICAgRHVhbCBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGFuZCBHUEwgbGljZW5zZXM6XHJcbiAgICAgICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuICAgICAgICBodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvZ3BsLmh0bWxcclxuICAgIENvcHlyaWdodCAoYykgMjAxNiAtIFFhc3NpbSBIYXNzYW5cclxuKi9cclxuXHJcbihmdW5jdGlvbiAoICQgKSB7XHJcbiBcclxuICAgICQuZm4uWW91VHViZVBvcFVwID0gZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cclxuICAgICAgICB2YXIgWW91VHViZVBvcFVwT3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5OiAxXHJcbiAgICAgICAgfSwgb3B0aW9ucyApO1xyXG5cclxuICAgICAgICAkKHRoaXMpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgeW91dHViZUxpbmsgPSAkKHRoaXMpLmF0dHIoXCJocmVmXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoIHlvdXR1YmVMaW5rLm1hdGNoKC8oeW91dHViZS5jb20pLykgKXtcclxuICAgICAgICAgICAgICAgIHZhciBzcGxpdF9jID0gXCJ2PVwiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0X24gPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggeW91dHViZUxpbmsubWF0Y2goLyh5b3V0dS5iZSkvKSB8fCB5b3V0dWJlTGluay5tYXRjaCgvKHZpbWVvLmNvbVxcLykrWzAtOV0vKSApe1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0X2MgPSBcIi9cIjtcclxuICAgICAgICAgICAgICAgIHZhciBzcGxpdF9uID0gMztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoIHlvdXR1YmVMaW5rLm1hdGNoKC8odmltZW8uY29tXFwvKStbYS16QS1aXS8pICl7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3BsaXRfYyA9IFwiL1wiO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0X24gPSA1O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgZ2V0WW91VHViZVZpZGVvSUQgPSB5b3V0dWJlTGluay5zcGxpdChzcGxpdF9jKVtzcGxpdF9uXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBjbGVhblZpZGVvSUQgPSBnZXRZb3VUdWJlVmlkZW9JRC5yZXBsYWNlKC8oJikrKC4qKS8sIFwiXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYoIHlvdXR1YmVMaW5rLm1hdGNoKC8oeW91dHUuYmUpLykgfHwgeW91dHViZUxpbmsubWF0Y2goLyh5b3V0dWJlLmNvbSkvKSApe1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpZGVvRW1iZWRMaW5rID0gXCJodHRwczovL3d3dy55b3V0dWJlLmNvbS9lbWJlZC9cIitjbGVhblZpZGVvSUQrXCI/YXV0b3BsYXk9XCIrWW91VHViZVBvcFVwT3B0aW9ucy5hdXRvcGxheStcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggeW91dHViZUxpbmsubWF0Y2goLyh2aW1lby5jb21cXC8pK1swLTldLykgfHwgeW91dHViZUxpbmsubWF0Y2goLyh2aW1lby5jb21cXC8pK1thLXpBLVpdLykgKXtcclxuICAgICAgICAgICAgICAgIHZhciB2aWRlb0VtYmVkTGluayA9IFwiaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL3ZpZGVvL1wiK2NsZWFuVmlkZW9JRCtcIj9hdXRvcGxheT1cIitZb3VUdWJlUG9wVXBPcHRpb25zLmF1dG9wbGF5K1wiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmFwcGVuZCgnPGRpdiBjbGFzcz1cIllvdVR1YmVQb3BVcC1XcmFwIFlvdVR1YmVQb3BVcC1hbmltYXRpb25cIj48ZGl2IGNsYXNzPVwiWW91VHViZVBvcFVwLUNvbnRlbnRcIj48c3BhbiBjbGFzcz1cIllvdVR1YmVQb3BVcC1DbG9zZVwiPjwvc3Bhbj48aWZyYW1lIHNyYz1cIicrdmlkZW9FbWJlZExpbmsrJ1wiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT48L2Rpdj48L2Rpdj4nKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCAkKCcuWW91VHViZVBvcFVwLVdyYXAnKS5oYXNDbGFzcygnWW91VHViZVBvcFVwLWFuaW1hdGlvbicpICl7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoJy5Zb3VUdWJlUG9wVXAtV3JhcCcpLnJlbW92ZUNsYXNzKFwiWW91VHViZVBvcFVwLWFuaW1hdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoXCIuWW91VHViZVBvcFVwLVdyYXAsIC5Zb3VUdWJlUG9wVXAtQ2xvc2VcIikuY2xpY2soZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICQoXCIuWW91VHViZVBvcFVwLVdyYXBcIikuYWRkQ2xhc3MoXCJZb3VUdWJlUG9wVXAtSGlkZVwiKS5kZWxheSg1MTUpLnF1ZXVlKGZ1bmN0aW9uKCkgeyAkKHRoaXMpLnJlbW92ZSgpOyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGRvY3VtZW50KS5rZXl1cChmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGUua2V5Q29kZSA9PSAyNyApe1xyXG4gICAgICAgICAgICAgICAgJCgnLllvdVR1YmVQb3BVcC1XcmFwLCAuWW91VHViZVBvcFVwLUNsb3NlJykuY2xpY2soKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG4gXHJcbn0oIGpRdWVyeSApKTsiXSwiZmlsZSI6IllvdVR1YmVQb3BVcC5qcXVlcnkuanMifQ==
