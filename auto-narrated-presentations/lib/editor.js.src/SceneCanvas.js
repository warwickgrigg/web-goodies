(function(glob) {

	// Cached images
	var IMG_PADLOCK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0U3QjkxQTY2N0Y3MTFFMzkxNDk5NDdENzFBODBBRjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0U3QjkxQTc2N0Y3MTFFMzkxNDk5NDdENzFBODBBRjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDRTdCOTFBNDY3RjcxMUUzOTE0OTk0N0Q3MUE4MEFGNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDRTdCOTFBNTY3RjcxMUUzOTE0OTk0N0Q3MUE4MEFGNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pg65R4cAAAH4SURBVHjarJU9SMNAFMeTNrR1qKARUfzE1g8EdangUHBTxEmtqxRxcHGTgrgLOrk4uShKQREcXNRJHKXaQRx1UBR0ULQo0qap/yuv5drm0gTz4Me95i73f/fe60XO5XISs1AoJAlsEMyxJWAAfIAkOAO7IFP+QiKRKPqKZG4zYA/UcM/qQQBEwDRYAC+iDVwmm4+DI27zb3AN7oFOzybAAfDaFXCDFe73PkXN0hQEk+Cd5sJ0UlsCY2CU/EsQBa/c/CnVpWBLonSLBIY5fwtkDdacgyvy+4HfjkAH5z8J1rDuuSWf1aDNVECWZf55gPN/TBrhjUYPaDZaYJg3/DdiEOyEmwIPhRj4JTTugBvwy0b2nyoLtEKgCywDlSKXqYAerjUlTvALfNL8PBV/mwugRKAPHLOxPAqrhvemMDSAtYoa4HizJPJfWxR1UbvkjNWKBDSzt+hSfK7SVbbuoqLpui75fL4NuK3wwxC7c1QA9gg2vd78nZZEMeOOCmDDpnQ63QPyfe5yuboL3xGnBFifr7JUwUYwRq22stUUsSL72aZZmONFplPUsfWwFjsCStlHxuwEvey+cbvdjVbzXyKgaVpKUap9oqWhaptjXjdMkaqqJ0hDyk50glTGRSm6wPEjqOE6FgXpRtStZgKBZfDeIWoU4yf+BBgAGseNDX6U5ckAAAAASUVORK5CYII=",
		IMG_MOVIE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo1MkRDNjM3RkY4NjdFMzExQTlEQ0YzQjVFNkRGNkQ3RCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2M0E0REVERjY3RjkxMUUzODcyMTlGOUIwRjUxRDgwQiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2M0E0REVERTY3RjkxMUUzODcyMTlGOUIwRjUxRDgwQiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjUyREM2MzdGRjg2N0UzMTFBOURDRjNCNUU2REY2RDdEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjUyREM2MzdGRjg2N0UzMTFBOURDRjNCNUU2REY2RDdEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+dVvggAAAArBJREFUeNrUlb+q1EAUxndmktW9gnBFLATxCXwCQREuqIWN9QXfQEULW0ErbQR9C8HGB7ATBG0Eq4vaiChaidfd7CYbf99kTpzNXe22MDDMzPn7ne+cJL5t29Emlx9t+Nl4Asdzkf0y5Uwz4YqRSpVMe6afcH/J+alMTG42ye92wX4OxQX2n4PMfeBhYtcdjrLk/5w1XQP+DGY7hff+KodtOcSmeL+CYh0y7lzb7eVyucN+EtH7HAiyKyGExxzHBYpvRVHUGFeG2NYgaE+XQPAskH1vmiYMkN8k+B1sSs57BZcWQ8/uSHKgB1aRdCmw2fiUsEkjeYTrA8DuEusr5xk+XhX0QVCuJABdHxCnlQRKmCqd4nsa3RP8z7N/RD1HPlEY9cChEHqX06CnLMt4ViIFN9rS2SGvuZfc743H40uI3uFWCw/yWKQo6lHbMnQWLEeeV4ReqA4DUOuLikbmzV7ARJFTFcphyI0q60nei3y45MdqSVZp78y8jTestE4UqYxRQ7CEqkevRHk1TtRkL57s02409yx0rHQ9GAW4HtV1XnpPm5Wbj3DW6LZjwE0KUDI0rXppVcTBcF1rnVCoZHt0tydR0VPpg7mNNOv7xHrLGlPFlsZedjEeNh1FUGHTkiMMyJtU2RA93kIYFAzf+yD/5X24QSUFoX4YR9aUiEg8GvqIFrnOkeOyjPqQ0FmF2B3SxJLg4XxeXYe1Gt3xINtEUZnKWhnJ/B57kSrwqbH6HqEL6YNng/BssVjs1nW9R/oTxI3zWKI8JS6tyfnLduAH8mcMj7Fm3CMdBLUBeV1V1TV0j6jqbAHvd8mqV3yafwaGHzi7111PxM4Wdm84f17zk/mETpXcUgWvCLCPYGHB+v9pomvNR1AHxnL54R8/sxkxXri/UfHf/JM3nuC3AAMAu+y2iAAAAAAAAAAAAAAAAAAAAAA=";

	// Cached image elements
	var eImgPadlock = new Image(); eImgPadlock.src=IMG_PADLOCK;
	var eImgMovie = new Image(); eImgMovie.src=IMG_MOVIE;

	/**
	 * Color palette for the timeline
	 */
	var ScenePalette = {

		background 		: '#EFEFEF',

		// Bounding box
		ctlBoxColor		: '#000000',
		ctlBoxDisabled	: '#999999',

		// Control handlers
		ctlHandlerMove	: '#99CCFF',
		ctlHBorderMove  : '#336699',

		ctlHandlerRotate: '#00CC66',
		ctlHBorderRotate: '#006600',

		ctlActiveHandle	: '#FF6666',
		ctlHBorderActive: '#800000',

		// The border of the "RECORD Frame"
		ctlAnimateBorder: '#FF0000'

	};

	/**
	 * Palette configuration
	 */
	var PaletteConfig = {

		handlerSize		: 10

	};

	/**
	 * The scene is where stuff happens
	 */
	var SceneCanvas = glob.SceneCanvas = function( timeline, clock ) {

		// Setup variables
		this.canvas = document.createElement('canvas');
		$(this.canvas).addClass('scene-canvas');
		this.context = this.canvas.getContext("2d");
		this.palette = ScenePalette;
		this.clock = timeline.clock;
		this.objects = [ ];

		// Prepare control box
		this.controlObject = null;
		this.controlBBox = null;
		this.controlRotPoint = [0,0];
		this.animateMode = false;

		// Dragging 
		this.dragging = false;
		this.dragMode = 0;
		this.dragMouseX = 0;
		this.dragMouseY = 0;
		this.dragRef = null;
		this.dragRotPoint = [0, 0];

		// Set initial size
		this.resize( 800, 400 );

		// Flags
		this.editable = true;

		// Prepare the clock callback function
		var drawCallback = (function(time, delta){

			// Redraw the UI
			this.redraw();

		}).bind(this);

		// Bind on the clock and change the mode when the design mode when the time changes
		$(this.clock).on('clockStart', (function(e) {
			this.animateMode = true;
			this.redraw();
		}).bind(this));
		$(this.clock).on('clockStop', (function(e) {
			this.animateMode = false;
			this.redraw();
		}).bind(this));

		// If we have a clock specified, use that as the tick source
		if (clock != undefined) {
			this.clock.onTick(drawCallback);
		} else {
			setInterval( function() {
				requestAnimationFrame( drawCallback );
			}, 1000/25 );
		}

		// Bind mouse down event
		$(this.canvas).mousedown((function(e) {
			if (!this.editable) return;
			var ctrlPoint = this.controlElementFromPoint( e.offsetX, e.offsetY ),
				focusObject = this.objectFromPoint( e.offsetX, e.offsetY );

			// Prevent default
			e.preventDefault();

			// [L] Button Click
			if (e.button == 0)  {

				// Defocus object only if we are not hitting any control point
				if ((this.controlObject != null) && (ctrlPoint != 0)) {
					// Keep it
				} else {
					this.controlObject = focusObject;
					// Let observers know that an object was selected on canvas
			    	$(this).trigger('selectionChanged', focusObject);					
				}

				// Handle clicks on object and other positions
				if ((this.controlObject != null) && (!this.controlObject.locked)) {

					// Update control point from movement
					if (ctrlPoint != 0) {
						// [1] Check for hitting a control point

						// Setup dragger
						this.dragging = true;
						this.dragMode = ctrlPoint;
						this.dragMouseX = e.offsetX;
						this.dragMouseY = e.offsetY;

						// Keep the reference information
						this.dragRef = {
							w: this.controlObject.width,
							h: this.controlObject.height,
							x: this.controlObject.variables.x,
							y: this.controlObject.variables.y,
							sx: this.controlObject.variables.scalex,
							sy: this.controlObject.variables.scaley
						}

						// If we are dragging the rotation point,
						// update the dragRotPoint
						if (ctrlPoint == 5) {
							this.dragRotPoint = [ e.offsetX, e.offsetY ];
						}

					} else {
						// [2] Start moving object

						// Setup dragger
						this.dragging = true;
						this.dragMode = 0;
						this.dragMouseX = e.offsetX;
						this.dragMouseY = e.offsetY;

						// Keep reference the old position
						this.dragRef = {
							x: this.controlObject.variables.x,
							y: this.controlObject.variables.y,
						}

						$(this.canvas).css('cursor', 'move');

					}

				}


			// [R] Button Click
			} else if (e.button == 2) {

				// Dropdown

			}

			this.redraw();

		}).bind(this));

		// Bind mouse move event
		$(this.canvas).mousemove((function(e) {
			if (!this.editable) return;

			var snap = function( value, snapIsOn, step ) {
				if (!snapIsOn) return value;
				return Math.round( value / step ) * step;
			}

			// Prevent default
			e.preventDefault();

			if (this.dragging) {

				// Calculate the difference between the two mouse positions
				var diffX = e.offsetX - this.dragMouseX,
					diffY = e.offsetY - this.dragMouseY;

				// Check what kind of drag do we have
				if (this.dragMode == 0) {

					// Calculate the new drag values
					this.controlObject.variables.x = snap( this.dragRef.x + diffX, !e.ctrlKey, 10),
					this.controlObject.variables.y = snap( this.dragRef.y + diffY, !e.ctrlKey, 10);

				} else if (this.dragMode <= 4) {

					// Calculate constrained proportions
					var v = diffX;
					if (diffX == 0) v=0;

					if (this.dragMode == 1) { // Top-left anchor -> x:-, y:-
						if (!e.ctrlKey) { diffX = v; diffY = v; }
						this.controlObject.variables.scalex = (-diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (-diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 2) { // Top-Right anchor -> x:+, y:-
						if (!e.ctrlKey) { diffX = v; diffY = -v; }
						this.controlObject.variables.scalex = (diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (-diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 3) { // Bottom-Right anchor -> x:+, y:-
						if (!e.ctrlKey) { diffX = v; diffY = -v; }
						this.controlObject.variables.scalex = (-diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 4) { // Bottom-Right anchor -> x:+, y:-
						if (!e.ctrlKey) { diffX = v; diffY = v; }
						this.controlObject.variables.scalex = (diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					}

				} else if (this.dragMode == 5) {

					// Calculate the rotation angle
					var angle = Math.atan2( this.dragRef.y - e.offsetY , this.dragRef.x - e.offsetX );
					this.controlObject.variables.rotation = snap( angle*180/Math.PI + 180, !e.ctrlKey, 15 );

					// Update the position of the visual object
					this.dragRotPoint = [ e.offsetX, e.offsetY ];

				}

			} else {

				// Change mouse cursors on hover
				var id = this.controlElementFromPoint( e.offsetX, e.offsetY );
				if (id == 0) {
					$(this.canvas).css('cursor', 'default');
				} else {
					$(this.canvas).css('cursor', 'pointer');
				}

			}

			this.redraw();

		}).bind(this));

		// Bind mouse up event
		$(this.canvas).mouseup((function(e) {
			if (!this.editable) return;

			// Prevent default
			e.preventDefault();

			// Stop dragging
			this.dragging = false;
			$(this.canvas).css('cursor', 'default');

		}).bind(this));


	}

	/**
	 * Change the dimentions of the timeline
	 */
	SceneCanvas.prototype.resize = function( w,h ) {
		this.width = w;
		this.height = h;
		this.canvas.width = w;
		this.canvas.height = h;
		this.redraw();
	}

	/**
	 * Set the control box on the given object
	 */
	SceneCanvas.prototype.setControlBox = function( object ) {
		this.controlObject = object;
	}

	/**
	 * Get the object under the given mouse coordinates
	 */
	SceneCanvas.prototype.objectFromPoint = function( x,y ) {

		// Tool function
		function inBBox(bbox) {
			return ( (x >= bbox.left) && (x <= bbox.right) &&
					 (y >= bbox.top) && (y <= bbox.bottom) );
		}

		// Scan objects and return the one that hits the cursor
		for (var i=0; i<this.objects.length; i++) {
			if (inBBox(this.objects[i].getBoundingBox())) {
				if ( (this.objects[i].timelineObject != null) &&
					 (this.objects[i].timelineObject.isVisible() ) &&
					  !this.objects[i].locked )
					return this.objects[i];
			}
		}

		// Not found
		return null;

	}

	/**
	 * Get the index of the control box element under the mouse cursor
	 */
	SceneCanvas.prototype.controlElementFromPoint = function( x,y ) {
		if (this.controlObject == null) return 0;
		if (this.animateMode) return 0;
		function inRect(rx,ry,rsz) {
			return ( (x >= rx-rsz/2) && (x <= rx+rsz/2) &&
					 (y >= ry-rsz/2) && (y <= ry+rsz/2) );
		}

		// Test all control points
		if (inRect( this.controlBBox.left, this.controlBBox.top, PaletteConfig.handlerSize )) return 1;
		if (inRect( this.controlBBox.right, this.controlBBox.top, PaletteConfig.handlerSize )) return 2;
		if (inRect( this.controlBBox.left, this.controlBBox.bottom, PaletteConfig.handlerSize )) return 3;
		if (inRect( this.controlBBox.right, this.controlBBox.bottom, PaletteConfig.handlerSize )) return 4;
		if (inRect( this.controlRotPoint[0], this.controlRotPoint[1], PaletteConfig.handlerSize )) return 5;
		return 0;

	}


	/**
	 * Add an element on canvas
	 */
	SceneCanvas.prototype.add = function( object ) {
		this.objects.push( object );

		// Center object
		object.variables.x = this.width/2;
		object.variables.y = this.height/2;

	};

	/**
	 * Draw the scene objects
	 */
	SceneCanvas.prototype.drawObjects = function( ctx ) {
		for (var i=0; i<this.objects.length; i++) {

			// Update filter values
			this.objects[i].updateVariables( this.clock.currentTime );

			// Render object
			this.objects[i].render( ctx );

		}
	};

	/**
	 * Draw the control box
	 */
	SceneCanvas.prototype.drawControlBox = function( ctx ) {
		if (this.controlObject == null) return;
		if ((this.controlObject.timelineObject != null) && !this.controlObject.timelineObject.isVisible()) return;
		if (!this.editable) return;
		var bbox = this.controlBBox = this.controlObject.getBoundingBox();

		// Crisp line fix
        //var iStrokeWidth = 1 + x;  
        //var iTranslate = (iStrokeWidth % 2) / 2;  
        ctx.save();
        ctx.translate(0.5,0.5);//iTranslate, iTranslate);  

		// Draw the bounding box rectangle
	    ctx.beginPath();
		ctx.rect( bbox.left, bbox.top, bbox.width, bbox.height );

		// If the object is locked, just draw the paddlock and exit
		if (this.controlObject.locked || this.animateMode) {

			// Draw dashed border
			if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2]);
			if ( ctx.mozDash !== undefined )       ctx.mozDash = [2];
		    ctx.lineWidth = 0.8;
		    ctx.strokeStyle = this.palette.ctlBoxDisabled;
			ctx.stroke();
	        ctx.restore();

	        // Draw paddlock
			ctx.drawImage( eImgPadlock, bbox.right-25, bbox.bottom-25 );
			return;

		}

		// Draw dashed and reset
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [2];
	    ctx.lineWidth = 0.8;
	    ctx.strokeStyle = this.palette.ctlBoxColor;
		ctx.stroke();
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [];

		// Draw the 8 control points
		var drawBox = (function(x,y,active){
		    ctx.beginPath();
		    ctx.lineWidth = 1;
		    ctx.rect( x - PaletteConfig.handlerSize/2, 
		    		  y - PaletteConfig.handlerSize/2, 
		    		  PaletteConfig.handlerSize, 
		    		  PaletteConfig.handlerSize );
		    if (active) {
		    	ctx.fillStyle = this.palette.ctlActiveHandle;
			    ctx.strokeStyle = this.palette.ctlHBorderActive;
		    } else {
				ctx.fillStyle = this.palette.ctlHandlerMove;
			    ctx.strokeStyle = this.palette.ctlHBorderMove;
		    }
			ctx.fill();
		    ctx.stroke();
		}).bind(this);

		var drawCircle = (function(x,y,active){
		    ctx.beginPath();
		    ctx.lineWidth = 1;
		    ctx.arc(x, y, PaletteConfig.handlerSize/2, 0, 2 * Math.PI, false);
		    if (active) {
		    	ctx.fillStyle = this.palette.ctlActiveHandle;
			    ctx.strokeStyle = this.palette.ctlHBorderActive;
		    } else {
				ctx.fillStyle = this.palette.ctlHandlerRotate;
			    ctx.strokeStyle = this.palette.ctlHBorderRotate;
		    }
			ctx.fill();
		    ctx.stroke();
		}).bind(this);

		// Draw bounding box (with the active handler in a different color)
		drawBox( bbox.left, bbox.top, (this.dragging && (this.dragMode == 1)) );
		drawBox( bbox.right, bbox.top, (this.dragging && (this.dragMode == 2)) );
		drawBox( bbox.left, bbox.bottom, (this.dragging && (this.dragMode == 3)) );
		drawBox( bbox.right, bbox.bottom, (this.dragging && (this.dragMode == 4)) );

		// Calculate the position of the rotation bar
		var dist = Math.sqrt(
				Math.pow( bbox.width/2, 2 ) +
				Math.pow( bbox.height/2, 2 )
			) + PaletteConfig.handlerSize + 5,
			rotX = Math.cos( bbox.rotation ) * dist + (bbox.left + bbox.width/2),
			rotY = Math.sin( bbox.rotation ) * dist + (bbox.top + bbox.height/2);

		// If we are dragging, get the position of the rotating point
		if (this.dragging && (this.dragMode == 5)) {
			rotX = this.dragRotPoint[0];
			rotY = this.dragRotPoint[1];
		}

		// Draw the line to the drag handler
		ctx.beginPath();
	    ctx.lineWidth = 0.8;
	    ctx.strokeStyle = this.palette.ctlBoxColor;
		ctx.moveTo( bbox.left + bbox.width/2, bbox.top + bbox.height/2);
		ctx.lineTo( rotX, rotY );

		// Draw dashed and reset
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [2];
		ctx.stroke();
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [];

		// Render and store the position of the rotation point
		drawCircle(rotX, rotY, (this.dragging && (this.dragMode == 5)));
		this.controlRotPoint = [rotX, rotY];

		// Restore
		ctx.restore();

	}

	/**
	 * Redraw all elements
	 */
	SceneCanvas.prototype.redraw = function() {
		// Redraw is synchronized with frame rate
		requestAnimationFrame((function() {

			// Clear canvas
			this.context.fillStyle = this.palette.background;
			this.context.fillRect(0, 0, this.width, this.height);

			// Draw elements
			this.drawObjects( this.context );
			this.drawControlBox( this.context );

		}).bind(this));
	};


})(window);