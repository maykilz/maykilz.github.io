(function($){
	var initLayout = function() {
		var hash = window.location.hash.replace('#', '');
		var currentTab = $('ul.navigationTabs a')
							.bind('click', showTab)
							.filter('a[rel=' + hash + ']');
		if (currentTab.size() == 0) {
			currentTab = $('ul.navigationTabs a:first');
		}
		showTab.apply(currentTab.get(0));
		$('#myGallery').spacegallery({loadingClass: 'loading'});
	};
	
	var showTab = function(e) {
		var tabIndex = $('ul.navigationTabs a')
							.removeClass('active')
							.index(this);
		$(this)
			.addClass('active')
			.blur();
		$('div.tab')
			.hide()
				.eq(tabIndex)
				.show();
	};
	
	EYE.register(initLayout, 'init');
})(jQuery)
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsYXlvdXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCQpe1xyXG5cdHZhciBpbml0TGF5b3V0ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoJyMnLCAnJyk7XHJcblx0XHR2YXIgY3VycmVudFRhYiA9ICQoJ3VsLm5hdmlnYXRpb25UYWJzIGEnKVxyXG5cdFx0XHRcdFx0XHRcdC5iaW5kKCdjbGljaycsIHNob3dUYWIpXHJcblx0XHRcdFx0XHRcdFx0LmZpbHRlcignYVtyZWw9JyArIGhhc2ggKyAnXScpO1xyXG5cdFx0aWYgKGN1cnJlbnRUYWIuc2l6ZSgpID09IDApIHtcclxuXHRcdFx0Y3VycmVudFRhYiA9ICQoJ3VsLm5hdmlnYXRpb25UYWJzIGE6Zmlyc3QnKTtcclxuXHRcdH1cclxuXHRcdHNob3dUYWIuYXBwbHkoY3VycmVudFRhYi5nZXQoMCkpO1xyXG5cdFx0JCgnI215R2FsbGVyeScpLnNwYWNlZ2FsbGVyeSh7bG9hZGluZ0NsYXNzOiAnbG9hZGluZyd9KTtcclxuXHR9O1xyXG5cdFxyXG5cdHZhciBzaG93VGFiID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIHRhYkluZGV4ID0gJCgndWwubmF2aWdhdGlvblRhYnMgYScpXHJcblx0XHRcdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHRcdFx0XHRcdC5pbmRleCh0aGlzKTtcclxuXHRcdCQodGhpcylcclxuXHRcdFx0LmFkZENsYXNzKCdhY3RpdmUnKVxyXG5cdFx0XHQuYmx1cigpO1xyXG5cdFx0JCgnZGl2LnRhYicpXHJcblx0XHRcdC5oaWRlKClcclxuXHRcdFx0XHQuZXEodGFiSW5kZXgpXHJcblx0XHRcdFx0LnNob3coKTtcclxuXHR9O1xyXG5cdFxyXG5cdEVZRS5yZWdpc3Rlcihpbml0TGF5b3V0LCAnaW5pdCcpO1xyXG59KShqUXVlcnkpIl0sImZpbGUiOiJsYXlvdXQuanMifQ==
