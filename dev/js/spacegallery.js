/**
 *
 * Spacegallery
 * Author: Stefan Petre www.eyecon.ro
 * 
 */

(function($){
	EYE.extend({
		
		spacegallery: {
			
			//default options (many options are controled via CSS)
			defaults: {
				border: 6, // border arround the image
				perspective: 140, // perpective height
				minScale: 0.2, // minimum scale for the image in the back
				duration: 800, // aimation duration
				loadingClass: null, // CSS class applied to the element while looading images
				before: function(){return false},
				after: function(){return false}
			},
			
			animated: false,
			
			//position images
			positionImages: function(el) {
				var top = 0;
				EYE.spacegallery.animated = false;
				$(el)
					.find('a')
						.removeClass(el.spacegalleryCfg.loadingClass)
						.end()
					.find('img')
						.removeAttr('height')
						.each(function(nr){
							var newWidth = this.spacegallery.origWidth - (this.spacegallery.origWidth - this.spacegallery.origWidth * el.spacegalleryCfg.minScale) * el.spacegalleryCfg.asins[nr];
							$(this)
								.css({
									top: el.spacegalleryCfg.tops[nr] + 'px',
									marginLeft: - parseInt((newWidth + el.spacegalleryCfg.border)/2, 10) + 'px',
									opacity: 1 - el.spacegalleryCfg.asins[nr]
								})
								.attr('width', parseInt(newWidth));
							this.spacegallery.next = el.spacegalleryCfg.asins[nr+1];
							this.spacegallery.nextTop = el.spacegalleryCfg.tops[nr+1] - el.spacegalleryCfg.tops[nr];
							this.spacegallery.origTop = el.spacegalleryCfg.tops[nr];
							this.spacegallery.opacity = 1 - el.spacegalleryCfg.asins[nr];
							this.spacegallery.increment = el.spacegalleryCfg.asins[nr] - this.spacegallery.next;
							this.spacegallery.current = el.spacegalleryCfg.asins[nr];
							this.spacegallery.width = newWidth;
						})
			},
			
			//animate to nex image
			next: function(e) {
				if (EYE.spacegallery.animated === false) {
					EYE.spacegallery.animated = true;
					var el = this.parentNode;
					el.spacegalleryCfg.before.apply(el);
					$(el)
						.css('spacegallery', 0)
						.animate({
							spacegallery: 100
						},{
							easing: 'easeOut',
							duration: el.spacegalleryCfg.duration,
							complete: function() {
								$(el)
									.find('img:last')
									.prependTo(el);
								EYE.spacegallery.positionImages(el);
								el.spacegalleryCfg.after.apply(el);
							},
							step: function(now) {
								$('img', this)
									.each(function(nr){
										var newWidth, top, next;
										if (nr + 1 == el.spacegalleryCfg.images) {
											top = this.spacegallery.origTop + this.spacegallery.nextTop * 4 * now /100;
											newWidth = this.spacegallery.width * top / this.spacegallery.origTop;
											$(this)
												.css({
													top: top + 'px',
													opacity: 0.7 - now/100,
													marginLeft: - parseInt((newWidth + el.spacegalleryCfg.border)/2, 10) + 'px'
												})
												.attr('width', newWidth);
										} else {
											next = this.spacegallery.current - this.spacegallery.increment * now /100;
											newWidth = this.spacegallery.origWidth - (this.spacegallery.origWidth - this.spacegallery.origWidth * el.spacegalleryCfg.minScale) * next;
											$(this).css({
												top: this.spacegallery.origTop + this.spacegallery.nextTop * now /100 + 'px',
												opacity: 1 - next,
												marginLeft: - parseInt((newWidth + el.spacegalleryCfg.border)/2, 10) + 'px'
											})
											.attr('width', newWidth);
										}
									});
							}
						});
				}
					
				this.blur();
				return false;
			},
			
			//constructor
			init: function(opt) {
				opt = $.extend({}, EYE.spacegallery.defaults, opt||{});
				return this.each(function(){
					var el = this;
					if ($(el).is('.spacegallery')) {
						$('<a href="#"></a>')
							.appendTo(this)
							.addClass(opt.loadingClass)
							.bind('click', EYE.spacegallery.next);
						el.spacegalleryCfg = opt;
						el.spacegalleryCfg.images = el.getElementsByTagName('img').length;
						el.spacegalleryCfg.loaded = 0;
						el.spacegalleryCfg.asin = Math.asin(1);
						el.spacegalleryCfg.asins = {};
						el.spacegalleryCfg.tops = {};
						el.spacegalleryCfg.increment = parseInt(el.spacegalleryCfg.perspective/el.spacegalleryCfg.images, 10);
						var top = 0;
						$('img', el)
							.each(function(nr){
								var imgEl = new Image();
								var elImg = this;
								el.spacegalleryCfg.asins[nr] = 1 - Math.asin((nr+1)/el.spacegalleryCfg.images)/el.spacegalleryCfg.asin;
								top += el.spacegalleryCfg.increment - el.spacegalleryCfg.increment * el.spacegalleryCfg.asins[nr];
								el.spacegalleryCfg.tops[nr] = top;
								elImg.spacegallery = {};
								imgEl.src = this.src;
								if (imgEl.complete) {
									el.spacegalleryCfg.loaded ++;
									elImg.spacegallery.origWidth = imgEl.width;
									elImg.spacegallery.origHeight = imgEl.height
								} else {
									imgEl.onload = function() {
										el.spacegalleryCfg.loaded ++;
										elImg.spacegallery.origWidth = imgEl.width;
										elImg.spacegallery.origHeight = imgEl.height
										if (el.spacegalleryCfg.loaded == el.spacegalleryCfg.images) {
										
											EYE.spacegallery.positionImages(el);
										}
									};
								}
							});
						el.spacegalleryCfg.asins[el.spacegalleryCfg.images] = el.spacegalleryCfg.asins[el.spacegalleryCfg.images - 1] * 1.3;
						el.spacegalleryCfg.tops[el.spacegalleryCfg.images] = el.spacegalleryCfg.tops[el.spacegalleryCfg.images - 1] * 1.3;
						if (el.spacegalleryCfg.loaded == el.spacegalleryCfg.images) {
							EYE.spacegallery.positionImages(el);
						}
					}
				});
			}
		}
	});
	
	$.fn.extend({
	
		/**
		 * Create a space gallery
		 * @name spacegallery
		 * @description create a space gallery
		 * @option	int			border			Images' border. Default: 6
		 * @option	int			perspective		Perpective height. Default: 140
		 * @option	float		minScale		Minimum scale for the image in the back. Default: 0.2
		 * @option	int			duration		Animation duration. Default: 800
		 * @option	string		loadingClass	CSS class applied to the element while looading images. Default: null
		 * @option	function	before			Callback function triggered before going to the next image
		 * @option	function	after			Callback function triggered after going to the next image
		 */
		spacegallery: EYE.spacegallery.init
	});
	$.extend($.easing,{
		easeOut:function (x, t, b, c, d) {
			return -c *(t/=d)*(t-2) + b;
		}
	});
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzcGFjZWdhbGxlcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqXHJcbiAqIFNwYWNlZ2FsbGVyeVxyXG4gKiBBdXRob3I6IFN0ZWZhbiBQZXRyZSB3d3cuZXllY29uLnJvXHJcbiAqIFxyXG4gKi9cclxuXHJcbihmdW5jdGlvbigkKXtcclxuXHRFWUUuZXh0ZW5kKHtcclxuXHRcdFxyXG5cdFx0c3BhY2VnYWxsZXJ5OiB7XHJcblx0XHRcdFxyXG5cdFx0XHQvL2RlZmF1bHQgb3B0aW9ucyAobWFueSBvcHRpb25zIGFyZSBjb250cm9sZWQgdmlhIENTUylcclxuXHRcdFx0ZGVmYXVsdHM6IHtcclxuXHRcdFx0XHRib3JkZXI6IDYsIC8vIGJvcmRlciBhcnJvdW5kIHRoZSBpbWFnZVxyXG5cdFx0XHRcdHBlcnNwZWN0aXZlOiAxNDAsIC8vIHBlcnBlY3RpdmUgaGVpZ2h0XHJcblx0XHRcdFx0bWluU2NhbGU6IDAuMiwgLy8gbWluaW11bSBzY2FsZSBmb3IgdGhlIGltYWdlIGluIHRoZSBiYWNrXHJcblx0XHRcdFx0ZHVyYXRpb246IDgwMCwgLy8gYWltYXRpb24gZHVyYXRpb25cclxuXHRcdFx0XHRsb2FkaW5nQ2xhc3M6IG51bGwsIC8vIENTUyBjbGFzcyBhcHBsaWVkIHRvIHRoZSBlbGVtZW50IHdoaWxlIGxvb2FkaW5nIGltYWdlc1xyXG5cdFx0XHRcdGJlZm9yZTogZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9LFxyXG5cdFx0XHRcdGFmdGVyOiBmdW5jdGlvbigpe3JldHVybiBmYWxzZX1cclxuXHRcdFx0fSxcclxuXHRcdFx0XHJcblx0XHRcdGFuaW1hdGVkOiBmYWxzZSxcclxuXHRcdFx0XHJcblx0XHRcdC8vcG9zaXRpb24gaW1hZ2VzXHJcblx0XHRcdHBvc2l0aW9uSW1hZ2VzOiBmdW5jdGlvbihlbCkge1xyXG5cdFx0XHRcdHZhciB0b3AgPSAwO1xyXG5cdFx0XHRcdEVZRS5zcGFjZWdhbGxlcnkuYW5pbWF0ZWQgPSBmYWxzZTtcclxuXHRcdFx0XHQkKGVsKVxyXG5cdFx0XHRcdFx0LmZpbmQoJ2EnKVxyXG5cdFx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoZWwuc3BhY2VnYWxsZXJ5Q2ZnLmxvYWRpbmdDbGFzcylcclxuXHRcdFx0XHRcdFx0LmVuZCgpXHJcblx0XHRcdFx0XHQuZmluZCgnaW1nJylcclxuXHRcdFx0XHRcdFx0LnJlbW92ZUF0dHIoJ2hlaWdodCcpXHJcblx0XHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKG5yKXtcclxuXHRcdFx0XHRcdFx0XHR2YXIgbmV3V2lkdGggPSB0aGlzLnNwYWNlZ2FsbGVyeS5vcmlnV2lkdGggLSAodGhpcy5zcGFjZWdhbGxlcnkub3JpZ1dpZHRoIC0gdGhpcy5zcGFjZWdhbGxlcnkub3JpZ1dpZHRoICogZWwuc3BhY2VnYWxsZXJ5Q2ZnLm1pblNjYWxlKSAqIGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tucl07XHJcblx0XHRcdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHRcdFx0LmNzcyh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRvcDogZWwuc3BhY2VnYWxsZXJ5Q2ZnLnRvcHNbbnJdICsgJ3B4JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFyZ2luTGVmdDogLSBwYXJzZUludCgobmV3V2lkdGggKyBlbC5zcGFjZWdhbGxlcnlDZmcuYm9yZGVyKS8yLCAxMCkgKyAncHgnLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRvcGFjaXR5OiAxIC0gZWwuc3BhY2VnYWxsZXJ5Q2ZnLmFzaW5zW25yXVxyXG5cdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdC5hdHRyKCd3aWR0aCcsIHBhcnNlSW50KG5ld1dpZHRoKSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zcGFjZWdhbGxlcnkubmV4dCA9IGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tucisxXTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnNwYWNlZ2FsbGVyeS5uZXh0VG9wID0gZWwuc3BhY2VnYWxsZXJ5Q2ZnLnRvcHNbbnIrMV0gLSBlbC5zcGFjZWdhbGxlcnlDZmcudG9wc1tucl07XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zcGFjZWdhbGxlcnkub3JpZ1RvcCA9IGVsLnNwYWNlZ2FsbGVyeUNmZy50b3BzW25yXTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnNwYWNlZ2FsbGVyeS5vcGFjaXR5ID0gMSAtIGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tucl07XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zcGFjZWdhbGxlcnkuaW5jcmVtZW50ID0gZWwuc3BhY2VnYWxsZXJ5Q2ZnLmFzaW5zW25yXSAtIHRoaXMuc3BhY2VnYWxsZXJ5Lm5leHQ7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zcGFjZWdhbGxlcnkuY3VycmVudCA9IGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tucl07XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zcGFjZWdhbGxlcnkud2lkdGggPSBuZXdXaWR0aDtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0fSxcclxuXHRcdFx0XHJcblx0XHRcdC8vYW5pbWF0ZSB0byBuZXggaW1hZ2VcclxuXHRcdFx0bmV4dDogZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmIChFWUUuc3BhY2VnYWxsZXJ5LmFuaW1hdGVkID09PSBmYWxzZSkge1xyXG5cdFx0XHRcdFx0RVlFLnNwYWNlZ2FsbGVyeS5hbmltYXRlZCA9IHRydWU7XHJcblx0XHRcdFx0XHR2YXIgZWwgPSB0aGlzLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHRlbC5zcGFjZWdhbGxlcnlDZmcuYmVmb3JlLmFwcGx5KGVsKTtcclxuXHRcdFx0XHRcdCQoZWwpXHJcblx0XHRcdFx0XHRcdC5jc3MoJ3NwYWNlZ2FsbGVyeScsIDApXHJcblx0XHRcdFx0XHRcdC5hbmltYXRlKHtcclxuXHRcdFx0XHRcdFx0XHRzcGFjZWdhbGxlcnk6IDEwMFxyXG5cdFx0XHRcdFx0XHR9LHtcclxuXHRcdFx0XHRcdFx0XHRlYXNpbmc6ICdlYXNlT3V0JyxcclxuXHRcdFx0XHRcdFx0XHRkdXJhdGlvbjogZWwuc3BhY2VnYWxsZXJ5Q2ZnLmR1cmF0aW9uLFxyXG5cdFx0XHRcdFx0XHRcdGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHRcdCQoZWwpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5maW5kKCdpbWc6bGFzdCcpXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5wcmVwZW5kVG8oZWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0RVlFLnNwYWNlZ2FsbGVyeS5wb3NpdGlvbkltYWdlcyhlbCk7XHJcblx0XHRcdFx0XHRcdFx0XHRlbC5zcGFjZWdhbGxlcnlDZmcuYWZ0ZXIuYXBwbHkoZWwpO1xyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0c3RlcDogZnVuY3Rpb24obm93KSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCdpbWcnLCB0aGlzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQuZWFjaChmdW5jdGlvbihucil7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dmFyIG5ld1dpZHRoLCB0b3AsIG5leHQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKG5yICsgMSA9PSBlbC5zcGFjZWdhbGxlcnlDZmcuaW1hZ2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0b3AgPSB0aGlzLnNwYWNlZ2FsbGVyeS5vcmlnVG9wICsgdGhpcy5zcGFjZWdhbGxlcnkubmV4dFRvcCAqIDQgKiBub3cgLzEwMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG5ld1dpZHRoID0gdGhpcy5zcGFjZWdhbGxlcnkud2lkdGggKiB0b3AgLyB0aGlzLnNwYWNlZ2FsbGVyeS5vcmlnVG9wO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JCh0aGlzKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHR0b3A6IHRvcCArICdweCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0b3BhY2l0eTogMC43IC0gbm93LzEwMCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW5MZWZ0OiAtIHBhcnNlSW50KChuZXdXaWR0aCArIGVsLnNwYWNlZ2FsbGVyeUNmZy5ib3JkZXIpLzIsIDEwKSArICdweCdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgbmV3V2lkdGgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRuZXh0ID0gdGhpcy5zcGFjZWdhbGxlcnkuY3VycmVudCAtIHRoaXMuc3BhY2VnYWxsZXJ5LmluY3JlbWVudCAqIG5vdyAvMTAwO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0bmV3V2lkdGggPSB0aGlzLnNwYWNlZ2FsbGVyeS5vcmlnV2lkdGggLSAodGhpcy5zcGFjZWdhbGxlcnkub3JpZ1dpZHRoIC0gdGhpcy5zcGFjZWdhbGxlcnkub3JpZ1dpZHRoICogZWwuc3BhY2VnYWxsZXJ5Q2ZnLm1pblNjYWxlKSAqIG5leHQ7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdHRvcDogdGhpcy5zcGFjZWdhbGxlcnkub3JpZ1RvcCArIHRoaXMuc3BhY2VnYWxsZXJ5Lm5leHRUb3AgKiBub3cgLzEwMCArICdweCcsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9wYWNpdHk6IDEgLSBuZXh0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRtYXJnaW5MZWZ0OiAtIHBhcnNlSW50KChuZXdXaWR0aCArIGVsLnNwYWNlZ2FsbGVyeUNmZy5ib3JkZXIpLzIsIDEwKSArICdweCdcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuYXR0cignd2lkdGgnLCBuZXdXaWR0aCk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuYmx1cigpO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0XHJcblx0XHRcdC8vY29uc3RydWN0b3JcclxuXHRcdFx0aW5pdDogZnVuY3Rpb24ob3B0KSB7XHJcblx0XHRcdFx0b3B0ID0gJC5leHRlbmQoe30sIEVZRS5zcGFjZWdhbGxlcnkuZGVmYXVsdHMsIG9wdHx8e30pO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdHZhciBlbCA9IHRoaXM7XHJcblx0XHRcdFx0XHRpZiAoJChlbCkuaXMoJy5zcGFjZWdhbGxlcnknKSkge1xyXG5cdFx0XHRcdFx0XHQkKCc8YSBocmVmPVwiI1wiPjwvYT4nKVxyXG5cdFx0XHRcdFx0XHRcdC5hcHBlbmRUbyh0aGlzKVxyXG5cdFx0XHRcdFx0XHRcdC5hZGRDbGFzcyhvcHQubG9hZGluZ0NsYXNzKVxyXG5cdFx0XHRcdFx0XHRcdC5iaW5kKCdjbGljaycsIEVZRS5zcGFjZWdhbGxlcnkubmV4dCk7XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZyA9IG9wdDtcclxuXHRcdFx0XHRcdFx0ZWwuc3BhY2VnYWxsZXJ5Q2ZnLmltYWdlcyA9IGVsLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdpbWcnKS5sZW5ndGg7XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy5sb2FkZWQgPSAwO1xyXG5cdFx0XHRcdFx0XHRlbC5zcGFjZWdhbGxlcnlDZmcuYXNpbiA9IE1hdGguYXNpbigxKTtcclxuXHRcdFx0XHRcdFx0ZWwuc3BhY2VnYWxsZXJ5Q2ZnLmFzaW5zID0ge307XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy50b3BzID0ge307XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy5pbmNyZW1lbnQgPSBwYXJzZUludChlbC5zcGFjZWdhbGxlcnlDZmcucGVyc3BlY3RpdmUvZWwuc3BhY2VnYWxsZXJ5Q2ZnLmltYWdlcywgMTApO1xyXG5cdFx0XHRcdFx0XHR2YXIgdG9wID0gMDtcclxuXHRcdFx0XHRcdFx0JCgnaW1nJywgZWwpXHJcblx0XHRcdFx0XHRcdFx0LmVhY2goZnVuY3Rpb24obnIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGltZ0VsID0gbmV3IEltYWdlKCk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZWxJbWcgPSB0aGlzO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZWwuc3BhY2VnYWxsZXJ5Q2ZnLmFzaW5zW25yXSA9IDEgLSBNYXRoLmFzaW4oKG5yKzEpL2VsLnNwYWNlZ2FsbGVyeUNmZy5pbWFnZXMpL2VsLnNwYWNlZ2FsbGVyeUNmZy5hc2luO1xyXG5cdFx0XHRcdFx0XHRcdFx0dG9wICs9IGVsLnNwYWNlZ2FsbGVyeUNmZy5pbmNyZW1lbnQgLSBlbC5zcGFjZWdhbGxlcnlDZmcuaW5jcmVtZW50ICogZWwuc3BhY2VnYWxsZXJ5Q2ZnLmFzaW5zW25yXTtcclxuXHRcdFx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy50b3BzW25yXSA9IHRvcDtcclxuXHRcdFx0XHRcdFx0XHRcdGVsSW1nLnNwYWNlZ2FsbGVyeSA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdFx0aW1nRWwuc3JjID0gdGhpcy5zcmM7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoaW1nRWwuY29tcGxldGUpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWwuc3BhY2VnYWxsZXJ5Q2ZnLmxvYWRlZCArKztcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZWxJbWcuc3BhY2VnYWxsZXJ5Lm9yaWdXaWR0aCA9IGltZ0VsLndpZHRoO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlbEltZy5zcGFjZWdhbGxlcnkub3JpZ0hlaWdodCA9IGltZ0VsLmhlaWdodFxyXG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aW1nRWwub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWwuc3BhY2VnYWxsZXJ5Q2ZnLmxvYWRlZCArKztcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRlbEltZy5zcGFjZWdhbGxlcnkub3JpZ1dpZHRoID0gaW1nRWwud2lkdGg7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxJbWcuc3BhY2VnYWxsZXJ5Lm9yaWdIZWlnaHQgPSBpbWdFbC5oZWlnaHRcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZWwuc3BhY2VnYWxsZXJ5Q2ZnLmxvYWRlZCA9PSBlbC5zcGFjZWdhbGxlcnlDZmcuaW1hZ2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRFWUUuc3BhY2VnYWxsZXJ5LnBvc2l0aW9uSW1hZ2VzKGVsKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tlbC5zcGFjZWdhbGxlcnlDZmcuaW1hZ2VzXSA9IGVsLnNwYWNlZ2FsbGVyeUNmZy5hc2luc1tlbC5zcGFjZWdhbGxlcnlDZmcuaW1hZ2VzIC0gMV0gKiAxLjM7XHJcblx0XHRcdFx0XHRcdGVsLnNwYWNlZ2FsbGVyeUNmZy50b3BzW2VsLnNwYWNlZ2FsbGVyeUNmZy5pbWFnZXNdID0gZWwuc3BhY2VnYWxsZXJ5Q2ZnLnRvcHNbZWwuc3BhY2VnYWxsZXJ5Q2ZnLmltYWdlcyAtIDFdICogMS4zO1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwuc3BhY2VnYWxsZXJ5Q2ZnLmxvYWRlZCA9PSBlbC5zcGFjZWdhbGxlcnlDZmcuaW1hZ2VzKSB7XHJcblx0XHRcdFx0XHRcdFx0RVlFLnNwYWNlZ2FsbGVyeS5wb3NpdGlvbkltYWdlcyhlbCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdCQuZm4uZXh0ZW5kKHtcclxuXHRcclxuXHRcdC8qKlxyXG5cdFx0ICogQ3JlYXRlIGEgc3BhY2UgZ2FsbGVyeVxyXG5cdFx0ICogQG5hbWUgc3BhY2VnYWxsZXJ5XHJcblx0XHQgKiBAZGVzY3JpcHRpb24gY3JlYXRlIGEgc3BhY2UgZ2FsbGVyeVxyXG5cdFx0ICogQG9wdGlvblx0aW50XHRcdFx0Ym9yZGVyXHRcdFx0SW1hZ2VzJyBib3JkZXIuIERlZmF1bHQ6IDZcclxuXHRcdCAqIEBvcHRpb25cdGludFx0XHRcdHBlcnNwZWN0aXZlXHRcdFBlcnBlY3RpdmUgaGVpZ2h0LiBEZWZhdWx0OiAxNDBcclxuXHRcdCAqIEBvcHRpb25cdGZsb2F0XHRcdG1pblNjYWxlXHRcdE1pbmltdW0gc2NhbGUgZm9yIHRoZSBpbWFnZSBpbiB0aGUgYmFjay4gRGVmYXVsdDogMC4yXHJcblx0XHQgKiBAb3B0aW9uXHRpbnRcdFx0XHRkdXJhdGlvblx0XHRBbmltYXRpb24gZHVyYXRpb24uIERlZmF1bHQ6IDgwMFxyXG5cdFx0ICogQG9wdGlvblx0c3RyaW5nXHRcdGxvYWRpbmdDbGFzc1x0Q1NTIGNsYXNzIGFwcGxpZWQgdG8gdGhlIGVsZW1lbnQgd2hpbGUgbG9vYWRpbmcgaW1hZ2VzLiBEZWZhdWx0OiBudWxsXHJcblx0XHQgKiBAb3B0aW9uXHRmdW5jdGlvblx0YmVmb3JlXHRcdFx0Q2FsbGJhY2sgZnVuY3Rpb24gdHJpZ2dlcmVkIGJlZm9yZSBnb2luZyB0byB0aGUgbmV4dCBpbWFnZVxyXG5cdFx0ICogQG9wdGlvblx0ZnVuY3Rpb25cdGFmdGVyXHRcdFx0Q2FsbGJhY2sgZnVuY3Rpb24gdHJpZ2dlcmVkIGFmdGVyIGdvaW5nIHRvIHRoZSBuZXh0IGltYWdlXHJcblx0XHQgKi9cclxuXHRcdHNwYWNlZ2FsbGVyeTogRVlFLnNwYWNlZ2FsbGVyeS5pbml0XHJcblx0fSk7XHJcblx0JC5leHRlbmQoJC5lYXNpbmcse1xyXG5cdFx0ZWFzZU91dDpmdW5jdGlvbiAoeCwgdCwgYiwgYywgZCkge1xyXG5cdFx0XHRyZXR1cm4gLWMgKih0Lz1kKSoodC0yKSArIGI7XHJcblx0XHR9XHJcblx0fSk7XHJcbn0pKGpRdWVyeSk7Il0sImZpbGUiOiJzcGFjZWdhbGxlcnkuanMifQ==
