
(function(glob) {

	/**
	 * Color palette for the timeline
	 */
	var TimelinePalette = {

		background 		: '#EFEFEF',
		cursorLine		: '#999999',

		gridLine 		: '#D0D0D0',
		gridLineStrong	: '#CFCFCF',
		gridLabelFont	: '8px Tahoma',
		gridLabelColor	: '#D0D0D0',

		scrollOuter 	: '#AAAAAA',
		scrollInner		: '#FFFFFF',
		scrollUnfocused : '#BBBBBB',

		playbackBack	: '#F0DDDD',
		playbackLine	: '#FF0000',

		wordColors		: [ '#FFFFFF', '#D0D0D0' ],
		wordFont		: '10pt Tahoma',
		wordFontColor	: '#333333',
		wordBorder		: '#666666',

		focusedWordBack	: '#FF9900',
		focusedWordFront: '#FFFFFF',

		framesBack		: '#BBBBBB',
		framesBorder	: '#333333',
		framesFront		: '#999999'

	};

	/**
	 * Timeline visual configuration
	 */
	var TimelineConfiguration = {

		paddingTop		: 15,
		heightWords 	: 24,
		heightObjects	: 12,
		paddingMiddle	: 2,
		wordsSpacer		: 5

	}

	/**
	 * The timeline canvas is the clock source and
	 */
	var TimelineCanvas = glob.TimelineCanvas = function( logic ) {

		this.canvas = document.createElement('canvas');
		this.logic = logic;
		this.clock = this.logic.clock;
		this.palette = TimelinePalette;

		// Tunable variables
		this.autoScroll = true;

		// Setup context
		this.context = this.canvas.getContext("2d");
		this.context.imageSmoothingEnabled = false;

		// Local variables
		this.cursorPos = 0.0;
		this.playbackPos = 0.0;
		this.scale = 0.5;

		// The left scroll
		this.scrollX = 0;
		this.scrollY = 0;

		// Dragging info
		this.dragTimeline = false;
		this.dragTimelineObject = null;
		this.dragTimelineOffset = 0;
		this.dragCursor = false;
		this.dragging = false;
		this.dragMode = 0;
		this.dragAnchorX = 0;
		this.dragOffsetX = 0;
		this.dragAnchorY = 0;
		this.dragOffsetY = 0;

		// Scrollbar values
		this.hoverScrollbar = false;
		this.scrollScale = 1.0;

		// Sub-areas sizes
		this.sizeScrollbarBottom = 15;
		this.sizeLabelsLeft = 50;

		// Visual objects
		this.visualObjects = [ ];
		this.wordObjects = [ ];

		// The frame size
		this.resize( 500, 200 );

		// Setup default cursor
		$(this.canvas).css('cursor', 'default');

		// Register a tick
		this.clock.onTick((function(time, delta){

			// Redraw the UI
			this.redraw();

		}).bind(this));

		// When an object is added in the timeline logic, create the visual wrapper
		$(this.logic).on('objectAdded', (function(e, object, index) {

			// Get visual representation of the specified timeline object
			var visualObject = TimelineVisualObject.visualFor( object, this );

			// Words visual go to a diferent array
			if (visualObject instanceof TimelineWordsVisual) {
				this.wordObjects.push( visualObject );
			} else {
				this.visualObjects.push( visualObject );
			}

		}).bind(this));

		// When an object is changed, update the visual representation of it
		$(this.logic).on('objectChanged', (function(e, object, index) {

			// Redraw stack
			this.redraw();

		}).bind(this));


		// When a frame is changed, update the playback position
		$(this.logic).on('frameChanged', (function(e, frame, oldFrame, time) {

			// Calculate the playback position
			this.playbackPos = frame * this.logic.frameWidth;

			// If we have autoScroll, follow the view
			if (this.autoScroll) {
				var padSize = 50,
					playbackLeft = this.playbackPos * this.scale;
				if (playbackLeft + this.scrollX > this.width-padSize) {
					this.scrollX = (this.width-padSize) - playbackLeft;
				}

			}

		}).bind(this));

		// Move cursor with mouse
		$(this.canvas).mousemove( (function(e) {

			// Check if we are in the middle of an operation
			if (this.dragging) {

				if (this.dragMode == 1) {
					this.scrollX = this.dragOffsetX + (e.offsetX - this.dragAnchorX);
				} else if (this.dragMode == 2) {
					this.scrollX = this.dragOffsetX - (e.offsetX - this.dragAnchorX) * this.scrollScale;
				}

				// Wrap scroll
				this.wrapScroll();

			} else if (this.dragTimeline) {

				// Change the begin time of the specified timeline object
				var newOffset = this.dragTimelineOffset + (e.offsetX - this.dragAnchorX) / this.scale;
				if (newOffset < 0) newOffset=0;
				if (newOffset + this.dragTimelineObject.timelineObject.duration > this.logic.frameCount * this.logic.frameWidth ) {
					newOffset = this.logic.frameCount * this.logic.frameWidth - this.dragTimelineObject.timelineObject.duration;
				}
				this.dragTimelineObject.timelineObject.begin = this.logic.frameSnap( newOffset );

				this.dragTimelineObject.timelineObject.updateTimeline();

			} else {

				// Calculate the position in pixels of the mouse cursor
				var xPos = e.offsetX - this.scrollX,
					yPos = e.offsetY - this.scrollY;

				// Use clipping regions
				if (yPos < this.height - this.sizeScrollbarBottom) {
					// Mouse in timeline

					// Calculate the position in milliseconds of the mouse
					this.cursorPos = xPos / this.scale;

					// Fire event
					$(this).trigger('timeHover', this.cursorPos);

					// Update flags
					this.hoverScrollbar = false;

					// If we are dragging the cursor, update clock
					if (this.dragCursor)
						this.clock.set( this.cursorPos );

					// Forward event to the objects
					this.forwardMouseEvent( 'mouseMove', e.offsetX, e.offsetY, false );

				} else {

					// Update flags
					this.hoverScrollbar = true;

				}

			}

			// Redraw
			this.redraw();

		}).bind(this) );

		// Reset states when mouse is out
		$(this.canvas).mouseout( (function(e) {

			if (this.dragging) return;
			if (this.dragTimeline) return;

			this.hoverScrollbar = false;
			this.cursorPos = -1;

			this.redraw();

		}).bind(this));

		// Move cursor with mouse
		$(this.canvas).mousedown( (function(e) {
			e.preventDefault();
			var x = e.offsetX, y = e.offsetY;
			var oDrag = this.timelineObjectFromCursor( e.offsetX, e.offsetY );

			// Forward event to the objects
			if (this.forwardMouseEvent( 'mouseDown', e.offsetX, e.offsetY, e.button, false )) {
				// Don't continue if we are handled
			    this.redraw();
			    // Let observers know that an object was selected
			    $(this).trigger('selectionChanged', oDrag);
				return;
			}

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

			} else if (e.button == 0) {

				// Check for dragging a timeline object
				if (oDrag != null) {

					// Let observers know that a timeline object was selected
			    	$(this).trigger('selectionChanged', oDrag);					

					// Set dragging flag on the object
					oDrag.dragging = true;

					// Setup dragging info
					this.dragTimeline = true;
					this.dragTimelineObject = oDrag;
					this.dragTimelineOffset = oDrag.timelineObject.begin;
					this.dragAnchorX = e.offsetX;

					// Redraw to apply the dragging flag
					this.redraw();

					// Change cursor
					$(this.canvas).css('cursor', 'move');

				} else {

					this.clock.set( this.cursorPos );
					this.dragCursor = true;

				}

			}

		}).bind(this));

		// Move cursor with mouse
		// (Capture events in window level so we can catch events
		//  fired when the timeline is not focused)
		$(window).mouseup( (function(e) {
			e.preventDefault();

			if (this.dragging) {
				this.dragging = false;
				this.dragMode = 0;
				$(this.canvas).css('cursor', 'default');
			}

			if (this.dragTimeline) {
				this.dragTimelineObject.dragging = false;
				this.dragTimeline = false;
				$(this.canvas).css('cursor', 'default');
			}

			this.dragCursor = false;
			this.dragTimeline = false;

			// Forward event to the objects
			this.forwardMouseEvent( 'mouseUp', e.offsetX, e.offsetY, e.button, true );
		    this.redraw();

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
	 * Get a visual timeline object from a scene object
	 */
	TimelineCanvas.prototype.visualFromSceneObject = function( sco ) {
		for (var i=0; i<this.visualObjects.length; i++) {
			if (this.visualObjects[i].timelineObject.sceneObject == sco)
				return this.visualObjects[i];
		}
		return null;
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
			var frameW = framesWidth - this.width;
			if (this.scrollX < -frameW) this.scrollX = -frameW;
		}
	}

	/**
	 * Draw the playback bar
	 */
	TimelineCanvas.prototype.drawPlayback = function( ctx ) {
		var playbackPos = this.playbackPos * this.scale + this.scrollX;
		if (playbackPos < 0) return;

		// Fill playback line
		ctx.fillStyle = this.palette.playbackBack;
		ctx.fillRect(0,0, Math.min( playbackPos, this.width ) ,this.height - this.sizeScrollbarBottom);

		// Draw playback line
		ctx.strokeStyle = this.palette.playbackLine;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo( playbackPos, 0 );
		ctx.lineTo( playbackPos, this.height - this.sizeScrollbarBottom );
		ctx.stroke();

	}

	/**
	 * Get a timeline object from the cursor
	 */
	TimelineCanvas.prototype.timelineObjectFromCursor = function( mouseX, mouseY, collideWords ) {
		var y = TimelineConfiguration.paddingTop,
			heightWords = TimelineConfiguration.heightWords,
			heightObjects = TimelineConfiguration.heightObjects,
			padding = TimelineConfiguration.paddingMiddle;


		// Check words
		for (var i=0; i<this.wordObjects.length; i++) {
			//if (this.wordObjects[i].isVisible()) {
				var x = this.wordObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.wordObjects[i].timelineObject.endTime() - this.wordObjects[i].timelineObject.beginTime()) * this.scale;
				if ((mouseX >= x) && (mouseX <= x+w) && (mouseY >= y) && (mouseY <= y+heightWords) && collideWords) {
					return this.wordObjects[i];
				}
				y += heightWords + padding;
			//}
		}

		// Spacer between the two objects
		y += TimelineConfiguration.wordsSpacer;

		// Render objects
		for (var i=0; i<this.visualObjects.length; i++) {
			//if (this.visualObjects[i].isVisible()) {
				var x = this.visualObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.visualObjects[i].timelineObject.endTime() - this.visualObjects[i].timelineObject.beginTime()) * this.scale;
				if ((mouseX >= x) && (mouseX <= x+w) && (mouseY >= y) && (mouseY <= y+heightObjects)) {
					return this.visualObjects[i];
				}
				y += heightObjects + padding;
			//}
		}

		// Return none
		return null;
	}

	/**
	 * Forward mouse event
	 */
	TimelineCanvas.prototype.forwardMouseEvent = function( type, mouseX, mouseY, button, overflow ) {
		var y = TimelineConfiguration.paddingTop,
			heightWords = TimelineConfiguration.heightWords,
			heightObjects = TimelineConfiguration.heightObjects,
			padding = TimelineConfiguration.paddingMiddle,
			ans = false;

		// Calculate frame based on current offset
		var currentFrame = this.logic.frameOf( this.cursorPos );

		// Render words
		for (var i=0; i<this.wordObjects.length; i++) {
			//if (this.wordObjects[i].isVisible()) {
				var x = this.wordObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.wordObjects[i].timelineObject.endTime() - this.wordObjects[i].timelineObject.beginTime()) * this.scale;

				if ( overflow || ((mouseY >= y) && (mouseY <= y+heightWords)) ) {
					ans = this.wordObjects[i][type](
						{
							'x': mouseX - x,
							'y': mouseY - y,
							'frame': currentFrame - this.wordObjects[i].timelineObject.beginFrame(),
							'time': this.cursorPos - this.wordObjects[i].timelineObject.beginTime()
						},
						{
							'x': mouseX,
							'y': mouseY,
							'frame': currentFrame,
							'time': this.cursorPos
						},
						{
							'button': button,
							'canvas': this.canvas,
							'w': w, 'h': heightWords
						});
					if ( !overflow && (ans === true)) {
						return true;
					}
				}

				y += heightWords + padding;
			//}
		}

		// Spacer between the two objects
		y += TimelineConfiguration.wordsSpacer;

		// Render objects
		for (var i=0; i<this.visualObjects.length; i++) {
			//if (this.visualObjects[i].isVisible()) {
				var x = this.visualObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.visualObjects[i].timelineObject.endTime() - this.visualObjects[i].timelineObject.beginTime()) * this.scale;

				if ( overflow || ((mouseY >= y) && (mouseY <= y+heightObjects)) ) {

					ans = this.visualObjects[i][type](
						{
							'x': mouseX - x,
							'y': mouseY - y,
							'frame': currentFrame - this.visualObjects[i].timelineObject.beginFrame(),
							'time': this.cursorPos - this.visualObjects[i].timelineObject.beginTime()
						},
						{
							'x': mouseX,
							'y': mouseY,
							'frame': currentFrame,
							'time': this.cursorPos
						},
						{
							'button': button,
							'canvas': this.canvas,
							'w': w, 'h': heightObjects
						});
					if ( !overflow && (ans === true)) {
						return true;
					}
				}

				y += heightObjects + padding;
			//}
		}

		// Default false
		return false;

	};

	/**
	 * Draw the timeline objects
	 */
	TimelineCanvas.prototype.drawObjects = function( ctx ) {
		var y = TimelineConfiguration.paddingTop,
			heightWords = TimelineConfiguration.heightWords,
			heightObjects = TimelineConfiguration.heightObjects,
			padding = TimelineConfiguration.paddingMiddle;

		// Render words
		for (var i=0; i<this.wordObjects.length; i++) {
			//if (this.wordObjects[i].isVisible()) {
				var x = this.wordObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.wordObjects[i].timelineObject.endTime() - this.wordObjects[i].timelineObject.beginTime()) * this.scale;

				// Crisp line fix
		        //var iStrokeWidth = 1 + x;  
		        //var iTranslate = (iStrokeWidth % 2) / 2;  
		        ctx.save();
		        ctx.translate(0.5,0.5);//iTranslate, iTranslate);  

		        // Render object
				this.wordObjects[i].render( ctx, x, y, w, heightWords, this.scale );
				y += heightWords + padding;

				// Restore fix
		        ctx.restore();

			//}
		}

		// Spacer between the two objects
		y += TimelineConfiguration.wordsSpacer;

		// Render objects
		for (var i=0; i<this.visualObjects.length; i++) {
			//if (this.visualObjects[i].isVisible()) {
				var x = this.visualObjects[i].timelineObject.beginTime() * this.scale + this.scrollX,
					w = (this.visualObjects[i].timelineObject.endTime() - this.visualObjects[i].timelineObject.beginTime()) * this.scale;

				// Crisp line fix
		        //var iStrokeWidth = 1 + x;  
		        //var iTranslate = (iStrokeWidth % 2) / 2;  
		        ctx.save();
		        ctx.translate(0.5,0.5);//iTranslate, iTranslate);  

		        // Render object
				this.visualObjects[i].render( ctx, x, y, w, heightObjects, this.scale );
				y += heightObjects + padding;

				// Restore fix
		        ctx.restore();
			//}
		}
	}

	/**
	 * Draw the background grid
	 */
	TimelineCanvas.prototype.drawGrid = function( ctx ) {
		var firstFrameOffset = this.scrollX % (this.logic.frameWidth * this.scale);

		// Draw the frames
		ctx.beginPath();
		ctx.strokeStyle = this.palette.gridLine;
		ctx.lineWidth = 1;

		// Draw gridlines
		var fNum = this.logic.frameOf(-this.scrollX);
		for (var x=firstFrameOffset; x<this.width; x+=this.logic.frameWidth * this.scale) {
			ctx.moveTo( parseInt(x)+0.5, 0 );
			ctx.lineTo( parseInt(x)+0.5, this.height-this.sizeScrollbarBottom );

			// If we are in reasonable scale, draw frame number
			if (this.scale > 0.35) {
				ctx.textAlign = "center"; 
				ctx.textBaseline = "top";
				ctx.font = this.palette.gridLabelFont;
				ctx.fillStyle = this.palette.gridLabelColor;
				ctx.fillText( fNum, x+this.logic.frameWidth * this.scale/2, 2 );
				fNum++;
			}

		}

		ctx.stroke();

	}

	/**
	 * Draw the cursor
	 */
	TimelineCanvas.prototype.drawCursor = function( ctx ) {
		var x = this.cursorPos * this.scale + this.scrollX;
		if ((x < 0) || (x > this.width)) return;

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
		var paddingOuter = 8, paddingInner = 2;
		var framesWidth = this.logic.frameCount * this.logic.frameWidth * this.scale,
			viewWidth = this.width - paddingOuter*2 - paddingInner*2,
			viewOffset = -this.scrollX;

		// If we are too wide, use the total width as the reference scale
		if (framesWidth > viewWidth ) {
			var scale = framesWidth / viewWidth;
			this.scrollScale = scale;
			framesWidth = viewWidth;
			viewWidth /= scale;
			viewOffset /= scale;
		} else {
			viewWidth = framesWidth;
			this.scrollScale = 1.0;
		}

		// Draw scrollbar separator
		ctx.strokeStyle = this.palette.gridLineStrong;
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0,this.height - this.sizeScrollbarBottom);
		ctx.lineTo(this.width,this.height - this.sizeScrollbarBottom);
		ctx.stroke();

		// Incorporate margins and prepare coordinates
		var y = this.height - this.sizeScrollbarBottom/2,
			x1 = paddingOuter, x2 = x1 + framesWidth+paddingInner*2;
			x3 = x1 + paddingInner + viewOffset, x4 = x3 + viewWidth;

		if (this.hoverScrollbar) {

			ctx.beginPath();
			ctx.lineWidth = 8;
			ctx.strokeStyle = this.palette.scrollOuter;
			ctx.lineCap = "round";
			ctx.moveTo( x1, y); ctx.lineTo( x2, y );
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = this.palette.scrollInner;
			ctx.lineCap = "butt";
			ctx.moveTo( x3, y); ctx.lineTo( x4, y );
			ctx.stroke();

		} else {

			ctx.beginPath();
			ctx.lineWidth = 3;
			ctx.strokeStyle = this.palette.scrollUnfocused;
			ctx.lineCap = "round";
			ctx.moveTo( x3, y); ctx.lineTo( x4, y );
			ctx.stroke();

		}

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
			this.drawPlayback( this.context );
			this.drawGrid( this.context );
			this.drawCursor( this.context );
			this.drawScrollBar( this.context );
			this.drawObjects( this.context );

		}).bind(this));
	}

})(window);
