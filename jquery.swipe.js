(function() {
	var type = 'swipe',
		ts = 'touchstart',
		tm = 'touchmove',
		te = 'touchend',
		tc = 'touchcancel',
		startX = 0,
		startY = 0,
		endX = 0,
		endY = 0,
		tolerance = 10,
		touchStart = function(e) {
			if (e.targetTouches) {
				startX = endX = e.targetTouches[0].pageX;
				startY = endY = e.targetTouches[0].pageY;
			}
		},
		touchMove = function(e) {
			var x, y;
			if (e.targetTouches) {
				x = e.targetTouches[0].pageX;
				y = e.targetTouches[0].pageY;
				
				if (Math.abs(startY - y) < tolerance) {
					e.preventDefault();
				}
				endX = x;
				endY = y;
			}
		},
		touchEnd = function(e) {
			var args = [].slice.call(arguments, 1),
				event = $.event.fix(e);

			event.type = type;
			event.dx = endX - startX;
			event.dy = endY - startY;
			
			startX = startY = endX = endY = 0;
			
			if (Math.abs(event.dx) > tolerance) {
				args.unshift(event);
				($.event.dispatch || $.event.handle).apply(this, args);
			}
		},
		touchCancel = function(e) {
			startX = startY = endX = endY = 0;
		};
	
	$.event.special[type] = {
		setup: function() {
			if (this.addEventListener) {
				this.addEventListener(ts, touchStart, false);
				this.addEventListener(tm, touchMove, false);
				this.addEventListener(te, touchEnd, false);
				this.addEventListener(tc, touchCancel, false);
			}
		},
		teardown: function() {
			if (this.removeEventListener) {
				this.removeEventListener(ts, touchStart);
				this.removeEventListener(tm, touchMove);
				this.removeEventListener(te, touchEnd);
				this.removeEventListener(tc, touchCancel);
			}
		}
	};
	$.fn[type] = function(fn) {
		return fn ? this.bind(type, fn) : this.trigger(type);
	};
})(jQuery);