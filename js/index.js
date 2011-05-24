$(document).ready(function(){
	var $win, $target, paper, perspective, update;

	$win = $(window);
	$target = $('#target');

	$win.resize(function(){
		paper.setSize($win.width(), $win.height());
	});

	paper = Raphael('paper', $win.width(), $win.height());

	update = function(event, ui) {
		perspective.update();
	};

	$('#dialog')
		.dialog({
			autoOpen: false,
			show: 'slide-down',
			closeText: 'X',
			width: '30%',
			closeOnEscape: false,
			open: function(event){
				var $dialog = $(this).closest('.ui-dialog');
				$('.ui-dialog-titlebar-close', $dialog).hide();
				setTimeout(function(){
					$target.css({
						top: $dialog.position().top + $dialog.height() + 100,
						left: $dialog.position().left - 100
					});

					$dialog.PerspectivePlugin({
						paper: paper,
						target: '#target',
						wireframe: true,
						hasBack: true,
						appearance: {
							'stroke': '#fff',
							'stroke-width': 2
						},
						customAppearance: {
							top: { 'fill': '90-#ccc-#fff' },
							right: { 'fill': '0-#888-#fff' },
							bottom: { 'fill': '270-#aaa-#fff' },
							left: { 'fill': '180-#888-#fff' },
							front: { 'fill-opacity': 0.5 },
							back: {'fill-opacity': 0.5 }
						}
					});
					perspective = $dialog.data('perspective-plugin');
				}, 500);
			},
			drag: update,
			dragStop: update,
			resize: update,
			resizeStop: update
		})
		.hide();
	$('#target')
		.draggable({
			drag: function(event, ui){
				perspective.update();
			}
		});

	$('#dialog').dialog('open');
});