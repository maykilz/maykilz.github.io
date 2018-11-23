/**
 *
 * Zoomimage
 * Author: Stefan Petre www.eyecon.ro
 * 
 */
(function($){
	var EYE = window.EYE = function() {
		var _registered = {
			init: []
		};
		return {
			init: function() {
				$.each(_registered.init, function(nr, fn){
					fn.call();
				});
			},
			extend: function(prop) {
				for (var i in prop) {
					if (prop[i] != undefined) {
						this[i] = prop[i];
					}
				}
			},
			register: function(fn, type) {
				if (!_registered[type]) {
					_registered[type] = [];
				}
				_registered[type].push(fn);
			}
		};
	}();
	$(EYE.init);
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJleWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqXHJcbiAqIFpvb21pbWFnZVxyXG4gKiBBdXRob3I6IFN0ZWZhbiBQZXRyZSB3d3cuZXllY29uLnJvXHJcbiAqIFxyXG4gKi9cclxuKGZ1bmN0aW9uKCQpe1xyXG5cdHZhciBFWUUgPSB3aW5kb3cuRVlFID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgX3JlZ2lzdGVyZWQgPSB7XHJcblx0XHRcdGluaXQ6IFtdXHJcblx0XHR9O1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JC5lYWNoKF9yZWdpc3RlcmVkLmluaXQsIGZ1bmN0aW9uKG5yLCBmbil7XHJcblx0XHRcdFx0XHRmbi5jYWxsKCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGV4dGVuZDogZnVuY3Rpb24ocHJvcCkge1xyXG5cdFx0XHRcdGZvciAodmFyIGkgaW4gcHJvcCkge1xyXG5cdFx0XHRcdFx0aWYgKHByb3BbaV0gIT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdHRoaXNbaV0gPSBwcm9wW2ldO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cmVnaXN0ZXI6IGZ1bmN0aW9uKGZuLCB0eXBlKSB7XHJcblx0XHRcdFx0aWYgKCFfcmVnaXN0ZXJlZFt0eXBlXSkge1xyXG5cdFx0XHRcdFx0X3JlZ2lzdGVyZWRbdHlwZV0gPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0X3JlZ2lzdGVyZWRbdHlwZV0ucHVzaChmbik7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0fSgpO1xyXG5cdCQoRVlFLmluaXQpO1xyXG59KShqUXVlcnkpOyJdLCJmaWxlIjoiZXllLmpzIn0=
