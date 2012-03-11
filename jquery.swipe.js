(function($) {
	var type = 'swipe',
		ts = 'touchstart',
		tm = 'touchmove',
		te = 'touchend',
		tc = 'touchcancel',
		start = {x: 0, y: 0},
		end = {x: 0, y: 0},
		tolerance = 10,
		touchStart = function(e) {
			if (isTouchEvent(e)) {
				start = getPos(e);
				end = getPos(e);
			}
		},
		touchMove = function(e) {
			if (isTouchEvent(e)) {
				end = getPos(e);
				if (Math.abs(start.y - end.y) < tolerance) {
					e.preventDefault();
				}
			}
		},
		touchEnd = function(e) {
			var args = [].slice.call(arguments, 1),
				event = $.event.fix(e);

			event.type = type;
			event.dx = end.x - start.x;
			event.dy = end.y - start.y;
			
			touchCancel();
			
			if (Math.abs(event.dx) > tolerance || Math.abs(event.dy) > tolerance) {
				args.unshift(event);
				($.event.dispatch || $.event.handle).apply(this, args);
			}
		},
		touchCancel = function(e) {
			start.x = start.y = end.x = end.y = 0;
		},
		isTouchEvent = function(e) {
			return e.targetTouches && e.targetTouches.length === 1;
		},
		getPos = function(e) {
			var touch = e.targetTouches[0];
			return {
				x: touch.pageX,
				y: touch.pageY
			};
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