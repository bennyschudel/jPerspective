(function($) {
	var PerspectivePlugin = function(element, options) {
		var $element, $target, defaults, set;

		// defaults
		defaults = {
			paper: null,
			target: null,
			margin: 0,
			wireframe: false,
			hasBack: false,
			hasFront: true,
			appearance: {
				'fill': '#ccc',
				'fill-opacity': 0.6,
				'stroke': '#fff',
				'stroke-opacity': 0.2
			},
			customAppearance: {
				top: {},
				right: {},
				bottom: {},
				left: {}
			}
		};

		// public
		this.init = function() {
			$element = $(element);
			options = $.extend(true, {}, defaults, options);

			this.setup();
		};

		this.setup = function() {
			set = options.paper.set();
			this.setTarget(options.target);
			this.update();
		};

		this.setTarget = function(target) {
			$target = $(target);
			options.target = $target.attr('id');
		};

		this.getDimensions = function(el) {
			var $el, obj;

			$el = $(el);
			obj = {};

			obj.top = $el.position().top;
			obj.left = $el.position().left;
			obj.width = $el.outerWidth();
			obj.height = $el.outerHeight();

			return obj;
		};

		this.getAppearance = function(name) {
			var attrs, custom;

			attrs = $.extend({}, options.appearance);
			custom = options.customAppearance[name];
			if (custom) {
				attrs = $.extend({}, attrs, custom);
			}

			return attrs;
		};

		this.update = function() {

			var el, target, align, sides, sidesMap,
				path, chr, attrs, p1, p2, p3, p4;

			p1 = {};
			p2 = {};
			p3 = {};
			p4 = {};

			sidesMap = {
				T: 'top',
				R: 'right',
				B: 'bottom',
				L: 'left'
			};
			sides = {
				TL: 'TLRB',
				T:  'TLRB',
				TR: 'TRLB',
				R:  'TRBL',
				L:  'TLBR',
				BL: 'BLRT',
				B:  'BLRT',
				BR: 'BRLT'
			};

			// get dimensions
			el = this.getDimensions($element);
			target = this.getDimensions($target);

			// calc alignment
			align = '';
			if (el.top > target.top) {
				align += 'B';
			} else if (el.top + el.height < target.top + target.height) {
				align += 'T';
			}
			if (el.left > target.left) {
				align += 'R';
			} else if (el.left + el.width < target.left + target.width) {
				align += 'L';
			}

			// remove old set
			this.clear();

			// when the element covers the target, then exit
			if (!align.length) { return; }

			// calc sides to draw
			sides = sides[align];
			if (!options.wireframe) {
				// take only the visible sides
				sides = sides.substr(-align.length);
			}

			// adjust margins
			el.left = el.left + options.margin;
			el.top = el.top + options.margin;
			el.width -= 2 * options.margin;
			el.height -= 2 * options.margin;

			// draw back
			if (options.hasBack && options.wireframe && (target.width > 0 && target.height > 0)) {
				set.push(
					options.paper
						.rect(target.left, target.top, target.width, target.height)
						.attr(this.getAppearance('back'))
				);
			}

						// calc and draw sides
			for (var i = 0, ii = sides.length; i < ii; i++) {
				chr = sides.charAt(i);
				switch (chr) {
					case 'T':
						p1.x = el.left;
						p1.y = el.top;
						p2.x = target.left;
						p2.y = target.top;
						p3.x = p2.x + target.width;
						p3.y = p2.y;
						p4.x = p1.x + el.width;
						p4.y = p1.y;
						break;
					case 'R':
						p1.x = el.left + el.width;
						p1.y = el.top;
						p2.x = target.left + target.width;
						p2.y = target.top;
						p3.x = p2.x;
						p3.y = p2.y + target.height;
						p4.x = p1.x;
						p4.y = p1.y + el.height;
						break;
					case 'B':
						p1.x = el.left;
						p1.y = el.top + el.height;
						p2.x = target.left;
						p2.y = target.top + target.height;
						p3.x = p2.x + target.width;
						p3.y = p2.y;
						p4.x = p1.x + el.width;
						p4.y = p1.y;
						break;
					case 'L':
						p1.x = el.left;
						p1.y = el.top;
						p2.x = target.left;
						p2.y = target.top;
						p3.x = p2.x;
						p3.y = p2.y + target.height;
						p4.x = p1.x;
						p4.y = p1.y + el.height;
						break;
				}

				// create path
				path = [['M', p1.x, p1.y],
						['L', p2.x, p2.y],
						['L', p3.x, p3.y],
						['L', p4.x, p4.y],
						['L', p1.x, p1.y]];
				// add it to the set
				set.push(
					options.paper
						.path(path)
						.attr(this.getAppearance(sidesMap[chr]))
				);
			}

			// draw front
			if (options.hasFront) {
				set.push(
					options.paper
						.rect(el.left, el.top, el.width, el.height)
						.attr(this.getAppearance('front'))
				);
			}

			return this;
		};

		this.clear = function() {
			set.remove();
		};

		this.init();
	};

	$.fn.extend({
		PerspectivePlugin: function(options) {
			return this.each(function() {
				var $this = $(this);
				if (!$this.data('perspective-plugin')) {
					$this.data('perspective-plugin', new PerspectivePlugin(this, options));
				}
			});
		}
	});
})(jQuery);


