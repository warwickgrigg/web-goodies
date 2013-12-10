
(function(glob) {

	/**
	 * The timeline canvas is the clock source and
	 */
	var TimelineCanvas = glob.TimelineCanvas = function( editor ) {
		this.canvas = document.createElement(canvas);
		this.editor = editor;

		// Local variables
		this.cursorPos = 0.0;
		this.playbackPos = 0.0;
		this.scale = 1.0;

		// Move cursor with mouse
		$(this.canvas).mousemove( (function(e) {

			// Calculate the position in pixels of the mouse cursor
			var scrollPos = this.element.scrollLeft(),
				targetPos = $(this.element).position(),
				xPos = e.pageX + scrollPos - targetPos.left;

			// Calculate the position in milliseconds of the mouse
			this.cursorPos = xPos / this.scale;

			// Fire event
			$(this).trigger('timeHover', this.cursorPos);

			// Redraw
			this.redraw();

		}).bind(this) );

	}

	/**
	 * Change the dimentions of the timeline
	 */
	TimelineCanvas.prototype.resize = function( w,h ) {
		this.width = w;
		this.height = h;
		this.canvas.width = w;
		this.canvas.height = h;
		this.redraw();
	}

	/**
	 * Set a HTML5 audio object that will be used for synchronization
	 */
	TimelineCanvas.prototype.setAudio = function( audio ) {
	}

	TimelineCanvas.prototype.redraw = function() {
		// Redraw is synchronized with frame rate
		requestAnimationFrame(function() {

		});
	}

})(window);
