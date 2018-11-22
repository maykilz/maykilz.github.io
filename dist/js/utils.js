/**
 *
 * Utilities
 * Author: Stefan Petre www.eyecon.ro
 * 
 */
(function($) {
EYE.extend({
	getPosition : function(e, forceIt)
	{
		var x = 0;
		var y = 0;
		var es = e.style;
		var restoreStyles = false;
		if (forceIt && jQuery.curCSS(e,'display') == 'none') {
			var oldVisibility = es.visibility;
			var oldPosition = es.position;
			restoreStyles = true;
			es.visibility = 'hidden';
			es.display = 'block';
			es.position = 'absolute';
		}
		var el = e;
		if (el.getBoundingClientRect) { // IE
			var box = el.getBoundingClientRect();
			x = box.left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) - 2;
			y = box.top + Math.max(document.documentElement.scrollTop, document.body.scrollTop) - 2;
		} else {
			x = el.offsetLeft;
			y = el.offsetTop;
			el = el.offsetParent;
			if (e != el) {
				while (el) {
					x += el.offsetLeft;
					y += el.offsetTop;
					el = el.offsetParent;
				}
			}
			if (jQuery.browser.safari && jQuery.curCSS(e, 'position') == 'absolute' ) {
				x -= document.body.offsetLeft;
				y -= document.body.offsetTop;
			}
			el = e.parentNode;
			while (el && el.tagName.toUpperCase() != 'BODY' && el.tagName.toUpperCase() != 'HTML') 
			{
				if (jQuery.curCSS(el, 'display') != 'inline') {
					x -= el.scrollLeft;
					y -= el.scrollTop;
				}
				el = el.parentNode;
			}
		}
		if (restoreStyles == true) {
			es.display = 'none';
			es.position = oldPosition;
			es.visibility = oldVisibility;
		}
		return {x:x, y:y};
	},
	getSize : function(e)
	{
		var w = parseInt(jQuery.curCSS(e,'width'), 10);
		var h = parseInt(jQuery.curCSS(e,'height'), 10);
		var wb = 0;
		var hb = 0;
		if (jQuery.curCSS(e, 'display') != 'none') {
			wb = e.offsetWidth;
			hb = e.offsetHeight;
		} else {
			var es = e.style;
			var oldVisibility = es.visibility;
			var oldPosition = es.position;
			es.visibility = 'hidden';
			es.display = 'block';
			es.position = 'absolute';
			wb = e.offsetWidth;
			hb = e.offsetHeight;
			es.display = 'none';
			es.position = oldPosition;
			es.visibility = oldVisibility;
		}
		return {w:w, h:h, wb:wb, hb:hb};
	},
	getClient : function(e)
	{
		var h, w;
		if (e) {
			w = e.clientWidth;
			h = e.clientHeight;
		} else {
			var de = document.documentElement;
			w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
			h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight;
		}
		return {w:w,h:h};
	},
	getScroll : function (e)
	{
		var t=0, l=0, w=0, h=0, iw=0, ih=0;
		if (e && e.nodeName.toLowerCase() != 'body') {
			t = e.scrollTop;
			l = e.scrollLeft;
			w = e.scrollWidth;
			h = e.scrollHeight;
		} else  {
			if (document.documentElement) {
				t = document.documentElement.scrollTop;
				l = document.documentElement.scrollLeft;
				w = document.documentElement.scrollWidth;
				h = document.documentElement.scrollHeight;
			} else if (document.body) {
				t = document.body.scrollTop;
				l = document.body.scrollLeft;
				w = document.body.scrollWidth;
				h = document.body.scrollHeight;
			}
			if (typeof pageYOffset != 'undefined') {
				t = pageYOffset;
				l = pageXOffset;
			}
			iw = self.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
			ih = self.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
		}
		return { t: t, l: l, w: w, h: h, iw: iw, ih: ih };
	},
	getMargins : function(e, toInteger)
	{
		var t = jQuery.curCSS(e,'marginTop') || '';
		var r = jQuery.curCSS(e,'marginRight') || '';
		var b = jQuery.curCSS(e,'marginBottom') || '';
		var l = jQuery.curCSS(e,'marginLeft') || '';
		if (toInteger)
			return {
				t: parseInt(t, 10)||0,
				r: parseInt(r, 10)||0,
				b: parseInt(b, 10)||0,
				l: parseInt(l, 10)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getPadding : function(e, toInteger)
	{
		var t = jQuery.curCSS(e,'paddingTop') || '';
		var r = jQuery.curCSS(e,'paddingRight') || '';
		var b = jQuery.curCSS(e,'paddingBottom') || '';
		var l = jQuery.curCSS(e,'paddingLeft') || '';
		if (toInteger)
			return {
				t: parseInt(t, 10)||0,
				r: parseInt(r, 10)||0,
				b: parseInt(b, 10)||0,
				l: parseInt(l, 10)
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	getBorder : function(e, toInteger)
	{
		var t = jQuery.curCSS(e,'borderTopWidth') || '';
		var r = jQuery.curCSS(e,'borderRightWidth') || '';
		var b = jQuery.curCSS(e,'borderBottomWidth') || '';
		var l = jQuery.curCSS(e,'borderLeftWidth') || '';
		if (toInteger)
			return {
				t: parseInt(t, 10)||0,
				r: parseInt(r, 10)||0,
				b: parseInt(b, 10)||0,
				l: parseInt(l, 10)||0
			};
		else
			return {t: t, r: r,	b: b, l: l};
	},
	traverseDOM : function(nodeEl, func)
	{
		func(nodeEl);
		nodeEl = nodeEl.firstChild;
		while(nodeEl){
			EYE.traverseDOM(nodeEl, func);
			nodeEl = nodeEl.nextSibling;
		}
	},
	getInnerWidth :  function(el, scroll) {
		var offsetW = el.offsetWidth;
		return scroll ? Math.max(el.scrollWidth,offsetW) - offsetW + el.clientWidth:el.clientWidth;
	},
	getInnerHeight : function(el, scroll) {
		var offsetH = el.offsetHeight;
		return scroll ? Math.max(el.scrollHeight,offsetH) - offsetH + el.clientHeight:el.clientHeight;
	},
	getExtraWidth : function(el) {
		if($.boxModel)
			return (parseInt($.curCSS(el, 'paddingLeft'))||0)
				+ (parseInt($.curCSS(el, 'paddingRight'))||0)
				+ (parseInt($.curCSS(el, 'borderLeftWidth'))||0)
				+ (parseInt($.curCSS(el, 'borderRightWidth'))||0);
		return 0;
	},
	getExtraHeight : function(el) {
		if($.boxModel)
			return (parseInt($.curCSS(el, 'paddingTop'))||0)
				+ (parseInt($.curCSS(el, 'paddingBottom'))||0)
				+ (parseInt($.curCSS(el, 'borderTopWidth'))||0)
				+ (parseInt($.curCSS(el, 'borderBottomWidth'))||0);
		return 0;
	},
	isChildOf: function(parentEl, el, container) {
		if (parentEl == el) {
			return true;
		}
		if (!el || !el.nodeType || el.nodeType != 1) {
			return false;
		}
		if (parentEl.contains && !$.browser.safari) {
			return parentEl.contains(el);
		}
		if ( parentEl.compareDocumentPosition ) {
			return !!(parentEl.compareDocumentPosition(el) & 16);
		}
		var prEl = el.parentNode;
		while(prEl && prEl != container) {
			if (prEl == parentEl)
				return true;
			prEl = prEl.parentNode;
		}
		return false;
	},
	centerEl : function(el, axis)
	{
		var clientScroll = EYE.getScroll();
		var size = EYE.getSize(el);
		if (!axis || axis == 'vertically')
			$(el).css(
				{
					top: clientScroll.t + ((Math.min(clientScroll.h,clientScroll.ih) - size.hb)/2) + 'px'
				}
			);
		if (!axis || axis == 'horizontally')
			$(el).css(
				{
					left: clientScroll.l + ((Math.min(clientScroll.w,clientScroll.iw) - size.wb)/2) + 'px'
				}
			);
	}
});
if (!$.easing.easeout) {
	$.easing.easeout = function(p, n, firstNum, delta, duration) {
		return -delta * ((n=n/duration-1)*n*n*n - 1) + firstNum;
	};
}
	
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ1dGlscy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICpcclxuICogVXRpbGl0aWVzXHJcbiAqIEF1dGhvcjogU3RlZmFuIFBldHJlIHd3dy5leWVjb24ucm9cclxuICogXHJcbiAqL1xyXG4oZnVuY3Rpb24oJCkge1xyXG5FWUUuZXh0ZW5kKHtcclxuXHRnZXRQb3NpdGlvbiA6IGZ1bmN0aW9uKGUsIGZvcmNlSXQpXHJcblx0e1xyXG5cdFx0dmFyIHggPSAwO1xyXG5cdFx0dmFyIHkgPSAwO1xyXG5cdFx0dmFyIGVzID0gZS5zdHlsZTtcclxuXHRcdHZhciByZXN0b3JlU3R5bGVzID0gZmFsc2U7XHJcblx0XHRpZiAoZm9yY2VJdCAmJiBqUXVlcnkuY3VyQ1NTKGUsJ2Rpc3BsYXknKSA9PSAnbm9uZScpIHtcclxuXHRcdFx0dmFyIG9sZFZpc2liaWxpdHkgPSBlcy52aXNpYmlsaXR5O1xyXG5cdFx0XHR2YXIgb2xkUG9zaXRpb24gPSBlcy5wb3NpdGlvbjtcclxuXHRcdFx0cmVzdG9yZVN0eWxlcyA9IHRydWU7XHJcblx0XHRcdGVzLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuXHRcdFx0ZXMuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdGVzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdH1cclxuXHRcdHZhciBlbCA9IGU7XHJcblx0XHRpZiAoZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KSB7IC8vIElFXHJcblx0XHRcdHZhciBib3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHRcdFx0eCA9IGJveC5sZWZ0ICsgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCkgLSAyO1xyXG5cdFx0XHR5ID0gYm94LnRvcCArIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AsIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wKSAtIDI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR4ID0gZWwub2Zmc2V0TGVmdDtcclxuXHRcdFx0eSA9IGVsLm9mZnNldFRvcDtcclxuXHRcdFx0ZWwgPSBlbC5vZmZzZXRQYXJlbnQ7XHJcblx0XHRcdGlmIChlICE9IGVsKSB7XHJcblx0XHRcdFx0d2hpbGUgKGVsKSB7XHJcblx0XHRcdFx0XHR4ICs9IGVsLm9mZnNldExlZnQ7XHJcblx0XHRcdFx0XHR5ICs9IGVsLm9mZnNldFRvcDtcclxuXHRcdFx0XHRcdGVsID0gZWwub2Zmc2V0UGFyZW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoalF1ZXJ5LmJyb3dzZXIuc2FmYXJpICYmIGpRdWVyeS5jdXJDU1MoZSwgJ3Bvc2l0aW9uJykgPT0gJ2Fic29sdXRlJyApIHtcclxuXHRcdFx0XHR4IC09IGRvY3VtZW50LmJvZHkub2Zmc2V0TGVmdDtcclxuXHRcdFx0XHR5IC09IGRvY3VtZW50LmJvZHkub2Zmc2V0VG9wO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsID0gZS5wYXJlbnROb2RlO1xyXG5cdFx0XHR3aGlsZSAoZWwgJiYgZWwudGFnTmFtZS50b1VwcGVyQ2FzZSgpICE9ICdCT0RZJyAmJiBlbC50YWdOYW1lLnRvVXBwZXJDYXNlKCkgIT0gJ0hUTUwnKSBcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChqUXVlcnkuY3VyQ1NTKGVsLCAnZGlzcGxheScpICE9ICdpbmxpbmUnKSB7XHJcblx0XHRcdFx0XHR4IC09IGVsLnNjcm9sbExlZnQ7XHJcblx0XHRcdFx0XHR5IC09IGVsLnNjcm9sbFRvcDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWwgPSBlbC5wYXJlbnROb2RlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAocmVzdG9yZVN0eWxlcyA9PSB0cnVlKSB7XHJcblx0XHRcdGVzLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdGVzLnBvc2l0aW9uID0gb2xkUG9zaXRpb247XHJcblx0XHRcdGVzLnZpc2liaWxpdHkgPSBvbGRWaXNpYmlsaXR5O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt4OngsIHk6eX07XHJcblx0fSxcclxuXHRnZXRTaXplIDogZnVuY3Rpb24oZSlcclxuXHR7XHJcblx0XHR2YXIgdyA9IHBhcnNlSW50KGpRdWVyeS5jdXJDU1MoZSwnd2lkdGgnKSwgMTApO1xyXG5cdFx0dmFyIGggPSBwYXJzZUludChqUXVlcnkuY3VyQ1NTKGUsJ2hlaWdodCcpLCAxMCk7XHJcblx0XHR2YXIgd2IgPSAwO1xyXG5cdFx0dmFyIGhiID0gMDtcclxuXHRcdGlmIChqUXVlcnkuY3VyQ1NTKGUsICdkaXNwbGF5JykgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHdiID0gZS5vZmZzZXRXaWR0aDtcclxuXHRcdFx0aGIgPSBlLm9mZnNldEhlaWdodDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBlcyA9IGUuc3R5bGU7XHJcblx0XHRcdHZhciBvbGRWaXNpYmlsaXR5ID0gZXMudmlzaWJpbGl0eTtcclxuXHRcdFx0dmFyIG9sZFBvc2l0aW9uID0gZXMucG9zaXRpb247XHJcblx0XHRcdGVzLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuXHRcdFx0ZXMuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdGVzLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuXHRcdFx0d2IgPSBlLm9mZnNldFdpZHRoO1xyXG5cdFx0XHRoYiA9IGUub2Zmc2V0SGVpZ2h0O1xyXG5cdFx0XHRlcy5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRlcy5wb3NpdGlvbiA9IG9sZFBvc2l0aW9uO1xyXG5cdFx0XHRlcy52aXNpYmlsaXR5ID0gb2xkVmlzaWJpbGl0eTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB7dzp3LCBoOmgsIHdiOndiLCBoYjpoYn07XHJcblx0fSxcclxuXHRnZXRDbGllbnQgOiBmdW5jdGlvbihlKVxyXG5cdHtcclxuXHRcdHZhciBoLCB3O1xyXG5cdFx0aWYgKGUpIHtcclxuXHRcdFx0dyA9IGUuY2xpZW50V2lkdGg7XHJcblx0XHRcdGggPSBlLmNsaWVudEhlaWdodDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBkZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHRcdFx0dyA9IHdpbmRvdy5pbm5lcldpZHRoIHx8IHNlbGYuaW5uZXJXaWR0aCB8fCAoZGUmJmRlLmNsaWVudFdpZHRoKSB8fCBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xyXG5cdFx0XHRoID0gd2luZG93LmlubmVySGVpZ2h0IHx8IHNlbGYuaW5uZXJIZWlnaHQgfHwgKGRlJiZkZS5jbGllbnRIZWlnaHQpIHx8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHt3OncsaDpofTtcclxuXHR9LFxyXG5cdGdldFNjcm9sbCA6IGZ1bmN0aW9uIChlKVxyXG5cdHtcclxuXHRcdHZhciB0PTAsIGw9MCwgdz0wLCBoPTAsIGl3PTAsIGloPTA7XHJcblx0XHRpZiAoZSAmJiBlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT0gJ2JvZHknKSB7XHJcblx0XHRcdHQgPSBlLnNjcm9sbFRvcDtcclxuXHRcdFx0bCA9IGUuc2Nyb2xsTGVmdDtcclxuXHRcdFx0dyA9IGUuc2Nyb2xsV2lkdGg7XHJcblx0XHRcdGggPSBlLnNjcm9sbEhlaWdodDtcclxuXHRcdH0gZWxzZSAge1xyXG5cdFx0XHRpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSB7XHJcblx0XHRcdFx0dCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XHJcblx0XHRcdFx0bCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xyXG5cdFx0XHRcdHcgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsV2lkdGg7XHJcblx0XHRcdFx0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxIZWlnaHQ7XHJcblx0XHRcdH0gZWxzZSBpZiAoZG9jdW1lbnQuYm9keSkge1xyXG5cdFx0XHRcdHQgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcDtcclxuXHRcdFx0XHRsID0gZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0O1xyXG5cdFx0XHRcdHcgPSBkb2N1bWVudC5ib2R5LnNjcm9sbFdpZHRoO1xyXG5cdFx0XHRcdGggPSBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodHlwZW9mIHBhZ2VZT2Zmc2V0ICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0dCA9IHBhZ2VZT2Zmc2V0O1xyXG5cdFx0XHRcdGwgPSBwYWdlWE9mZnNldDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpdyA9IHNlbGYuaW5uZXJXaWR0aHx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRofHxkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRofHwwO1xyXG5cdFx0XHRpaCA9IHNlbGYuaW5uZXJIZWlnaHR8fGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHR8fGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0fHwwO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHsgdDogdCwgbDogbCwgdzogdywgaDogaCwgaXc6IGl3LCBpaDogaWggfTtcclxuXHR9LFxyXG5cdGdldE1hcmdpbnMgOiBmdW5jdGlvbihlLCB0b0ludGVnZXIpXHJcblx0e1xyXG5cdFx0dmFyIHQgPSBqUXVlcnkuY3VyQ1NTKGUsJ21hcmdpblRvcCcpIHx8ICcnO1xyXG5cdFx0dmFyIHIgPSBqUXVlcnkuY3VyQ1NTKGUsJ21hcmdpblJpZ2h0JykgfHwgJyc7XHJcblx0XHR2YXIgYiA9IGpRdWVyeS5jdXJDU1MoZSwnbWFyZ2luQm90dG9tJykgfHwgJyc7XHJcblx0XHR2YXIgbCA9IGpRdWVyeS5jdXJDU1MoZSwnbWFyZ2luTGVmdCcpIHx8ICcnO1xyXG5cdFx0aWYgKHRvSW50ZWdlcilcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHR0OiBwYXJzZUludCh0LCAxMCl8fDAsXHJcblx0XHRcdFx0cjogcGFyc2VJbnQociwgMTApfHwwLFxyXG5cdFx0XHRcdGI6IHBhcnNlSW50KGIsIDEwKXx8MCxcclxuXHRcdFx0XHRsOiBwYXJzZUludChsLCAxMClcclxuXHRcdFx0fTtcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIHt0OiB0LCByOiByLFx0YjogYiwgbDogbH07XHJcblx0fSxcclxuXHRnZXRQYWRkaW5nIDogZnVuY3Rpb24oZSwgdG9JbnRlZ2VyKVxyXG5cdHtcclxuXHRcdHZhciB0ID0galF1ZXJ5LmN1ckNTUyhlLCdwYWRkaW5nVG9wJykgfHwgJyc7XHJcblx0XHR2YXIgciA9IGpRdWVyeS5jdXJDU1MoZSwncGFkZGluZ1JpZ2h0JykgfHwgJyc7XHJcblx0XHR2YXIgYiA9IGpRdWVyeS5jdXJDU1MoZSwncGFkZGluZ0JvdHRvbScpIHx8ICcnO1xyXG5cdFx0dmFyIGwgPSBqUXVlcnkuY3VyQ1NTKGUsJ3BhZGRpbmdMZWZ0JykgfHwgJyc7XHJcblx0XHRpZiAodG9JbnRlZ2VyKVxyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHQ6IHBhcnNlSW50KHQsIDEwKXx8MCxcclxuXHRcdFx0XHRyOiBwYXJzZUludChyLCAxMCl8fDAsXHJcblx0XHRcdFx0YjogcGFyc2VJbnQoYiwgMTApfHwwLFxyXG5cdFx0XHRcdGw6IHBhcnNlSW50KGwsIDEwKVxyXG5cdFx0XHR9O1xyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4ge3Q6IHQsIHI6IHIsXHRiOiBiLCBsOiBsfTtcclxuXHR9LFxyXG5cdGdldEJvcmRlciA6IGZ1bmN0aW9uKGUsIHRvSW50ZWdlcilcclxuXHR7XHJcblx0XHR2YXIgdCA9IGpRdWVyeS5jdXJDU1MoZSwnYm9yZGVyVG9wV2lkdGgnKSB8fCAnJztcclxuXHRcdHZhciByID0galF1ZXJ5LmN1ckNTUyhlLCdib3JkZXJSaWdodFdpZHRoJykgfHwgJyc7XHJcblx0XHR2YXIgYiA9IGpRdWVyeS5jdXJDU1MoZSwnYm9yZGVyQm90dG9tV2lkdGgnKSB8fCAnJztcclxuXHRcdHZhciBsID0galF1ZXJ5LmN1ckNTUyhlLCdib3JkZXJMZWZ0V2lkdGgnKSB8fCAnJztcclxuXHRcdGlmICh0b0ludGVnZXIpXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0dDogcGFyc2VJbnQodCwgMTApfHwwLFxyXG5cdFx0XHRcdHI6IHBhcnNlSW50KHIsIDEwKXx8MCxcclxuXHRcdFx0XHRiOiBwYXJzZUludChiLCAxMCl8fDAsXHJcblx0XHRcdFx0bDogcGFyc2VJbnQobCwgMTApfHwwXHJcblx0XHRcdH07XHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiB7dDogdCwgcjogcixcdGI6IGIsIGw6IGx9O1xyXG5cdH0sXHJcblx0dHJhdmVyc2VET00gOiBmdW5jdGlvbihub2RlRWwsIGZ1bmMpXHJcblx0e1xyXG5cdFx0ZnVuYyhub2RlRWwpO1xyXG5cdFx0bm9kZUVsID0gbm9kZUVsLmZpcnN0Q2hpbGQ7XHJcblx0XHR3aGlsZShub2RlRWwpe1xyXG5cdFx0XHRFWUUudHJhdmVyc2VET00obm9kZUVsLCBmdW5jKTtcclxuXHRcdFx0bm9kZUVsID0gbm9kZUVsLm5leHRTaWJsaW5nO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0SW5uZXJXaWR0aCA6ICBmdW5jdGlvbihlbCwgc2Nyb2xsKSB7XHJcblx0XHR2YXIgb2Zmc2V0VyA9IGVsLm9mZnNldFdpZHRoO1xyXG5cdFx0cmV0dXJuIHNjcm9sbCA/IE1hdGgubWF4KGVsLnNjcm9sbFdpZHRoLG9mZnNldFcpIC0gb2Zmc2V0VyArIGVsLmNsaWVudFdpZHRoOmVsLmNsaWVudFdpZHRoO1xyXG5cdH0sXHJcblx0Z2V0SW5uZXJIZWlnaHQgOiBmdW5jdGlvbihlbCwgc2Nyb2xsKSB7XHJcblx0XHR2YXIgb2Zmc2V0SCA9IGVsLm9mZnNldEhlaWdodDtcclxuXHRcdHJldHVybiBzY3JvbGwgPyBNYXRoLm1heChlbC5zY3JvbGxIZWlnaHQsb2Zmc2V0SCkgLSBvZmZzZXRIICsgZWwuY2xpZW50SGVpZ2h0OmVsLmNsaWVudEhlaWdodDtcclxuXHR9LFxyXG5cdGdldEV4dHJhV2lkdGggOiBmdW5jdGlvbihlbCkge1xyXG5cdFx0aWYoJC5ib3hNb2RlbClcclxuXHRcdFx0cmV0dXJuIChwYXJzZUludCgkLmN1ckNTUyhlbCwgJ3BhZGRpbmdMZWZ0JykpfHwwKVxyXG5cdFx0XHRcdCsgKHBhcnNlSW50KCQuY3VyQ1NTKGVsLCAncGFkZGluZ1JpZ2h0JykpfHwwKVxyXG5cdFx0XHRcdCsgKHBhcnNlSW50KCQuY3VyQ1NTKGVsLCAnYm9yZGVyTGVmdFdpZHRoJykpfHwwKVxyXG5cdFx0XHRcdCsgKHBhcnNlSW50KCQuY3VyQ1NTKGVsLCAnYm9yZGVyUmlnaHRXaWR0aCcpKXx8MCk7XHJcblx0XHRyZXR1cm4gMDtcclxuXHR9LFxyXG5cdGdldEV4dHJhSGVpZ2h0IDogZnVuY3Rpb24oZWwpIHtcclxuXHRcdGlmKCQuYm94TW9kZWwpXHJcblx0XHRcdHJldHVybiAocGFyc2VJbnQoJC5jdXJDU1MoZWwsICdwYWRkaW5nVG9wJykpfHwwKVxyXG5cdFx0XHRcdCsgKHBhcnNlSW50KCQuY3VyQ1NTKGVsLCAncGFkZGluZ0JvdHRvbScpKXx8MClcclxuXHRcdFx0XHQrIChwYXJzZUludCgkLmN1ckNTUyhlbCwgJ2JvcmRlclRvcFdpZHRoJykpfHwwKVxyXG5cdFx0XHRcdCsgKHBhcnNlSW50KCQuY3VyQ1NTKGVsLCAnYm9yZGVyQm90dG9tV2lkdGgnKSl8fDApO1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fSxcclxuXHRpc0NoaWxkT2Y6IGZ1bmN0aW9uKHBhcmVudEVsLCBlbCwgY29udGFpbmVyKSB7XHJcblx0XHRpZiAocGFyZW50RWwgPT0gZWwpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRpZiAoIWVsIHx8ICFlbC5ub2RlVHlwZSB8fCBlbC5ub2RlVHlwZSAhPSAxKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmIChwYXJlbnRFbC5jb250YWlucyAmJiAhJC5icm93c2VyLnNhZmFyaSkge1xyXG5cdFx0XHRyZXR1cm4gcGFyZW50RWwuY29udGFpbnMoZWwpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCBwYXJlbnRFbC5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiApIHtcclxuXHRcdFx0cmV0dXJuICEhKHBhcmVudEVsLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGVsKSAmIDE2KTtcclxuXHRcdH1cclxuXHRcdHZhciBwckVsID0gZWwucGFyZW50Tm9kZTtcclxuXHRcdHdoaWxlKHByRWwgJiYgcHJFbCAhPSBjb250YWluZXIpIHtcclxuXHRcdFx0aWYgKHByRWwgPT0gcGFyZW50RWwpXHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdHByRWwgPSBwckVsLnBhcmVudE5vZGU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRjZW50ZXJFbCA6IGZ1bmN0aW9uKGVsLCBheGlzKVxyXG5cdHtcclxuXHRcdHZhciBjbGllbnRTY3JvbGwgPSBFWUUuZ2V0U2Nyb2xsKCk7XHJcblx0XHR2YXIgc2l6ZSA9IEVZRS5nZXRTaXplKGVsKTtcclxuXHRcdGlmICghYXhpcyB8fCBheGlzID09ICd2ZXJ0aWNhbGx5JylcclxuXHRcdFx0JChlbCkuY3NzKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRvcDogY2xpZW50U2Nyb2xsLnQgKyAoKE1hdGgubWluKGNsaWVudFNjcm9sbC5oLGNsaWVudFNjcm9sbC5paCkgLSBzaXplLmhiKS8yKSArICdweCdcclxuXHRcdFx0XHR9XHJcblx0XHRcdCk7XHJcblx0XHRpZiAoIWF4aXMgfHwgYXhpcyA9PSAnaG9yaXpvbnRhbGx5JylcclxuXHRcdFx0JChlbCkuY3NzKFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGxlZnQ6IGNsaWVudFNjcm9sbC5sICsgKChNYXRoLm1pbihjbGllbnRTY3JvbGwudyxjbGllbnRTY3JvbGwuaXcpIC0gc2l6ZS53YikvMikgKyAncHgnXHJcblx0XHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdH1cclxufSk7XHJcbmlmICghJC5lYXNpbmcuZWFzZW91dCkge1xyXG5cdCQuZWFzaW5nLmVhc2VvdXQgPSBmdW5jdGlvbihwLCBuLCBmaXJzdE51bSwgZGVsdGEsIGR1cmF0aW9uKSB7XHJcblx0XHRyZXR1cm4gLWRlbHRhICogKChuPW4vZHVyYXRpb24tMSkqbipuKm4gLSAxKSArIGZpcnN0TnVtO1xyXG5cdH07XHJcbn1cclxuXHRcclxufSkoalF1ZXJ5KTsiXSwiZmlsZSI6InV0aWxzLmpzIn0=
