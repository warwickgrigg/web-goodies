
(function(glob) {

	/**
	 * Color palette for the timeline
	 */
	var TimelinePalette = {

		background 		: '#EFEFEF',
		gridLine 		: '#D0D0D0',
		gridLineStrong	: '#CFCFCF',
		cursorLine		: '#999999',

		scrollOuter 	: '#999999',
		scrollInner		: '#CCCCCC'

	};

	/**
	 * Visual object that encapsulates timeline objects
	 */
	var VisualObject = function( timelineObject, timeline ) {
		this.timeline = timeline;
		this.wrapped = timelineObject;
	}

	/**
	 * Check if the object is within the visible region
	 */
	VisualObject.prototype.isVisible = function() {

		// The object boundaries
		var vBegin = this.wrapped.beginTime() / this.timeline.scale,
			vEnd = this.wrapped.endTime() / this.timeline.scale;

		// The timeline boundaries
		var sBegin = this.timeline.offsetX,
			sEnd = sBegin + this.timeline.width;

		// Check
		return ( ((vBegin >= sBegin) && (vBegin <= sEnd)) ||  // Somebody can see our beginning
				 ((vEnd >= sBegin) && (vEnd <= sEnd)) || 	  // Somebody can see our ending
				 ((vBegin <= sBegin) && (vEnd >= sEnd)) );	  // The object is entirely inside the view
	}

	/**
	 * Render context
	 */
	VisualObject.prototype.render = function( ctx, y, height ) {
		
		// The object boundaries
		var vBegin = this.wrapped.beginTime() / this.timeline.scale,
			vEnd = this.wrapped.endTime() / this.timeline.scale;

	}

	/**
	 * A Voice object encapsulates a sound object
	 */
	var WordsObject = function( voiceObject, timeline ) {
		VisualObject.call( this, voiceObject, timeline );
	}

	WordsObject.prototype = Object.create( VisualObject.prototype );

	/**
	 * Render context
	 */
	WordsObject.prototype.render = function( ctx, y, height ) {

	}

	/**
	 * The timeline canvas is the clock source and
	 */
	var TimelineCanvas = glob.TimelineCanvas = function( logic ) {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext("2d");
		this.logic = logic;
		this.palette = TimelinePalette;

		// Local variables
		this.cursorPos = 0.0;
		this.playbackPos = 0.0;
		this.scale = 0.5;

		// The left scroll
		this.scrollX = 0;
		this.scrollY = 0;

		// Dragging info
		this.dragging = false;
		this.dragMode = 0;
		this.dragAnchorX = 0;
		this.dragOffsetX = 0;
		this.dragAnchorY = 0;
		this.dragOffsetY = 0;

		// Sub-areas sizes
		this.sizeScrollbarBottom = 20;
		this.sizeLabelsLeft = 50;

		// Visual objects
		this.objects = [ ];
		this.wordObjects = [ ];

		// The frame size
		this.resize( 500, 200 );

		// Setup default cursor
		$(this.canvas).css('cursor', 'default');

		// When an object is added in the timeline logic, create the visual wrapper
		$(this.logic).on('objectAdded', (function(e, object, index) {

			if ( object instanceof TimelineWords ) {

				// Words have a different renderer
				this.wordObjects.push( new WordsObject( object, this ) );

			} else {

				// Otherwise use the classic renderer
				this.objects.push( new VisualObject( object, this ) );

			}

		}).bind(this));

		// Move cursor with mouse
		$(this.canvas).mousemove( (function(e) {

			// Calculate the position in pixels of the mouse cursor
			var xPos = e.offsetX + this.scrollX,
				yPos = e.offsetY + this.scrollY;

			// Check if we are in the middle of an operation
			if (this.dragging) {

				if (this.dragMode == 1) {
					this.scrollX = this.dragOffsetX + (e.offsetX - this.dragAnchorX);
				} else if (this.dragMode == 2) {
					this.scrollX = this.dragOffsetX - (e.offsetX - this.dragAnchorX) ;
				}

				// Wrap scroll
				this.wrapScroll();

			} else {

				// Use clipping regions
				if (yPos < this.height - this.sizeScrollbarBottom) {
					// Mouse in timeline

					// Calculate the position in milliseconds of the mouse
					this.cursorPos = xPos / this.scale;

					// Fire event
					$(this).trigger('timeHover', this.cursorPos);

				} else {
					// Mouse in scrollbar

				}

			}

			// Redraw
			this.redraw();

		}).bind(this) );

		// Move cursor with mouse
		$(this.canvas).mousedown( (function(e) {
			e.preventDefault();
			var x = e.offsetX, y = e.offsetY;

			// Middle button enables dragging
			if (e.button == 1) {

				this.dragging = true;
				this.dragMode = 1;
				this.dragAnchorX = e.offsetX;
				this.dragOffsetX = this.scrollX;
				this.dragAnchorY = e.offsetY;
				this.dragOffsetY = this.scrollY;

				$(this.canvas).css('cursor', 'move');

			} else if ((e.button == 0) && (y > this.height - this.sizeScrollbarBottom)) {

				this.dragging = true;
				this.dragMode = 2;
				this.dragAnchorX = e.offsetX;
				this.dragOffsetX = this.scrollX;

			}

		}).bind(this));

		// Move cursor with mouse
		// (Capture events in window level so we can catch events
		//  fired when the timeline is not focused)
		$(window).mouseup( (function(e) {

			if (this.dragging) {
				this.dragging = false;
				this.dragMode = 0;
				$(this.canvas).css('cursor', 'default');
			}

		}).bind(this));

		// Rescale with wheel
		$(this.canvas).bind('mousewheel', (function(e) {
			e.preventDefault()

			// Change scale
		    if(e.originalEvent.wheelDelta / 120 > 0) {
		    	if (this.scale < 1.0) {
			        this.scale += 0.025;
		    	}
		    } else {
		    	if (this.scale > 0.05) {
		        	this.scale -= 0.025;
		    	}
		    }

		    // Wrap overfown offsets
		    this.wrapScroll();

		    // Redraw canvas
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
	 * Scroll the view
	 */
	TimelineCanvas.prototype.scroll = function( x,y ) {
		if (x !== undefined) this.scrollX = x;
		if (y !== undefined) this.scrollY = y;
	}

	/**
	 * Wrap scroll into known boundaries
	 */
	TimelineCanvas.prototype.wrapScroll = function() {
		var framesWidth = this.logic.frameCount * this.logic.frameWidth * this.scale;
		
		// Underflows
		if (this.scrollX > 0) this.scrollX = 0;

		// Overflows
		if (framesWidth < this.width) {
			this.scrollX = 0;
		} else {
			var frameW = framesWidth - this.width + 8;
			if (this.scrollX < -frameW) this.scrollX = -frameW;
		}
	}

	/**
	 * Draw the speech words
	 */
	TimelineCanvas.prototype.drawWords = function( ctx ) {

	}

	/**
	 * Draw the speech words
	 */
	TimelineCanvas.prototype.drawFrames = function( ctx ) {
		var y = 5,
			heightWords = 24,
			heightObjects = 12,
			padding = 2;

		// Render words
		for (var i=0; i<this.wordObjects.length; i++) {
			if (this.wordObjects[i].isVisible()) {
				this.wordObjects[i].render( ctx, y, heightWords );
				y += heightWords + padding;
			}
		}

		// Render objects
		for (var i=0; i<this.objects.length; i++) {
			if (this.objects[i].isVisible()) {
				this.objects[i].render( ctx, y, heightObjects );
				y += heightObjects + padding;
			}
		}
	}

	/**
	 * Draw the background grid
	 */
	TimelineCanvas.prototype.drawGrid = function( ctx ) {
		var firstFrameOffset = (this.scrollX % this.logic.frameWidth) * this.scale;

		// Draw the frames
		ctx.beginPath();
		ctx.strokeStyle = this.palette.gridLine;
		ctx.lineWidth = 1;

		for (var x=firstFrameOffset; x<this.width; x+=this.logic.frameWidth * this.scale) {
			ctx.moveTo( parseInt(x)+0.5, 0 );
			ctx.lineTo( parseInt(x)+0.5, this.height-this.sizeScrollbarBottom );
		}

		ctx.stroke();

	}

	/**
	 * Draw the cursor
	 */
	TimelineCanvas.prototype.drawCursor = function( ctx ) {
		var x = this.cursorPos * this.scale;
		if ((x < this.scrollX) || (x > this.scrollX+this.width)) return;

		ctx.beginPath();
		ctx.strokeStyle = this.palette.cursorLine;
		ctx.lineWidth = 1;
		ctx.moveTo( parseInt(x)+0.5, 0 );
		ctx.lineTo( parseInt(x)+0.5, this.height-this.sizeScrollbarBottom );
		ctx.stroke();

	}

	/**
	 * Draw scroll bars
	 */
	TimelineCanvas.prototype.drawScrollBar = function( ctx ) {
		var paddingOuter = 4, paddingInner = 2;
		var framesWidth = this.logic.frameCount * this.logic.frameWidth * this.scale,
			viewWidth = this.width - paddingOuter*2,
			viewOffset = -this.scrollX;

		// If we are too wide, use the total width as the reference scale
		if (framesWidth > viewWidth ) {
			var scale = framesWidth / viewWidth;
			viewWidth /= scale;
			viewOffset /= scale;
		} else {
			viewWidth = framesWidth - paddingInner*2;
		}
		
		// Draw the two shapes
		ctx.fillStyle = this.palette.scrollOuter;
		ctx.fillRect( paddingOuter + paddingInner + viewOffset,  
					  this.height - this.sizeScrollbarBottom + paddingOuter,
			          viewWidth, 
					  this.sizeScrollbarBottom - paddingOuter*2 );

		ctx.fillStyle = this.palette.scrollInner;
		ctx.fillRect( paddingOuter,
					  this.height - this.sizeScrollbarBottom + paddingOuter + paddingInner,
					  framesWidth, 
					  this.sizeScrollbarBottom - paddingOuter*2 - paddingInner*2 );

	}

	/**
	 * Redraw all elements
	 */
	TimelineCanvas.prototype.redraw = function() {
		// Redraw is synchronized with frame rate
		requestAnimationFrame((function() {

			// Clear canvas
			this.context.fillStyle = this.palette.background;
			this.context.fillRect(0, 0, this.width, this.height);

			// Draw elements
			this.drawGrid( this.context );
			this.drawCursor( this.context );
			this.drawScrollBar( this.context );


		}).bind(this));
	}

})(window);
