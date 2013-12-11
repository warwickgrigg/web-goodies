(function(glob) {

	/**
	 * Color palette for the timeline
	 */
	var ScenePalette = {

		background 		: '#EFEFEF',

		ctlBoxColor		: '#999999',
		ctlHandlerMove	: '#99CCFF',
		ctlHandleRotate	: '#00CC66'

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

		// Dragging 
		this.dragging = false;
		this.dragMode = 0;
		this.dragMouseX = 0;
		this.dragMouseY = 0;
		this.dragRef = null;

		// Set initial size
		this.resize( 800, 400 );

		// Prepare the clock callback function
		var drawCallback = (function(time, delta){

			// Redraw the UI
			this.redraw();

		}).bind(this);

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
			var ctrlPoint = this.controlElementFromPoint( e.offsetX, e.offsetY ),
				focusObject = this.objectFromPoint( e.offsetX, e.offsetY );
			console.log(ctrlPoint);

			// Defocus object only if we are not hitting any control point
			if ((focusObject == null) && (this.controlObject != null) && (ctrlPoint != 0)) {
				// Keep it
			} else {
				this.controlObject = focusObject;
			}

			// Handle clicks on object and other positions
			if ((this.controlObject != null) && (e.button == 0)) {

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

			this.redraw();

		}).bind(this));

		// Bind mouse move event
		$(this.canvas).mousemove((function(e) {

			if (this.dragging) {

				// Calculate the difference between the two mouse positions
				var diffX = e.offsetX - this.dragMouseX,
					diffY = e.offsetY - this.dragMouseY;

				// Check what kind of drag do we have
				if (this.dragMode == 0) {

					// Calculate the new drag values
					this.controlObject.variables.x = this.dragRef.x + diffX,
					this.controlObject.variables.y = this.dragRef.y + diffY;

				} else if (this.dragMode <= 4) {

					if (this.dragMode == 1) { // Top-left anchor -> x:-, y:-
						this.controlObject.variables.scalex = (-diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (-diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 2) { // Top-Right anchor -> x:+, y:-
						this.controlObject.variables.scalex = (diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (-diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 3) { // Bottom-Right anchor -> x:+, y:-
						this.controlObject.variables.scalex = (-diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					} else if (this.dragMode == 4) { // Bottom-Right anchor -> x:+, y:-
						this.controlObject.variables.scalex = (diffX / this.controlObject.width) + this.dragRef.sx;
						this.controlObject.variables.scaley = (diffY / this.controlObject.height) + this.dragRef.sy;
						this.controlObject.variables.x = this.dragRef.x + diffX/2;
						this.controlObject.variables.y = this.dragRef.y + diffY/2;

					}


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

		// Enable control box
		this.setControlBox( object );

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
		var bbox = this.controlBBox = this.controlObject.getBoundingBox();

		// Draw the bounding box rectangle
	    ctx.beginPath();
	    ctx.lineWidth = 0.8;
	    ctx.strokeStyle = this.palette.controlBoxColor;
		ctx.rect( bbox.left, bbox.top, bbox.width, bbox.height );

		// Draw dashed and reset
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [2];
		ctx.stroke();
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [];

		// Draw the 8 control points
		var drawBox = (function(x,y){
		    ctx.beginPath();
		    ctx.lineWidth = 1;
		    ctx.rect( x - PaletteConfig.handlerSize/2, 
		    		  y - PaletteConfig.handlerSize/2, 
		    		  PaletteConfig.handlerSize, 
		    		  PaletteConfig.handlerSize );
			ctx.fillStyle = this.palette.ctlHandlerMove;
			ctx.fill();
		    ctx.strokeStyle = this.palette.controlBoxColor;
		    ctx.stroke();
		}).bind(this);

		var drawCircle = (function(x,y){
		    ctx.beginPath();
		    ctx.lineWidth = 1;
		    ctx.arc(x, y, PaletteConfig.handlerSize/2, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.palette.ctlHandleRotate;
			ctx.fill();
		    ctx.strokeStyle = this.palette.controlBoxColor;
		    ctx.stroke();
		}).bind(this);

		// Draw bounding box
		drawBox( bbox.left, bbox.top );
		drawBox( bbox.right, bbox.top );
		drawBox( bbox.left, bbox.bottom );
		drawBox( bbox.right, bbox.bottom );

		// Calculate the position of the rotation bar
		var dist = Math.sqrt(
				Math.pow( bbox.width/2, 2 ) +
				Math.pow( bbox.height/2, 2 )
			),
			rotX = Math.sin( bbox.rotation ) * dist + (bbox.left + bbox.width/2),
			rotY = Math.cos( bbox.rotation ) * dist + (bbox.top + bbox.height/2);

		// Draw the line to the drag handler
		ctx.beginPath();
	    ctx.lineWidth = 0.8;
	    ctx.strokeStyle = this.palette.controlBoxColor;
		ctx.moveTo( bbox.left + bbox.width/2, bbox.top + bbox.height/2);
		ctx.lineTo( rotX, rotY );

		// Draw dashed and reset
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([2]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [2];
		ctx.stroke();
		if ( ctx.setLineDash !== undefined )   ctx.setLineDash([]);
		if ( ctx.mozDash !== undefined )       ctx.mozDash = [];

		// Render and store the position of the rotation point
		drawCircle(rotX, rotY);
		this.controlRotPoint = [rotX, rotY];

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