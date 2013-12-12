(function(glob) {

	/**
	 * Visual object that encapsulates timeline objects
	 */
	var VisualObject = glob.VisualObject = function( timelineObject, timeline ) {
		this.timeline = timeline;
		this.object = timelineObject;

		this.beginFrame = this.timeline.logic.frameOf( this.object.beginTime() );
		this.endFrame = this.timeline.logic.frameOf( this.object.endTime() );
	}

	/**
	 * Check if the object is within the visible region
	 */
	VisualObject.prototype.isVisible = function() {

		// The object boundaries
		var vBegin = this.object.beginTime() / this.timeline.scale,
			vEnd = this.object.endTime() / this.timeline.scale;

		// The timeline boundaries
		var sBegin = -this.timeline.scrollX,
			sEnd = sBegin + this.timeline.width;

		// Check
		return ( ((vBegin >= sBegin) && (vBegin <= sEnd)) ||  // Somebody can see our beginning
				 ((vEnd >= sBegin) && (vEnd <= sEnd)) || 	  // Somebody can see our ending
				 ((vBegin <= sBegin) && (vEnd >= sEnd)) );	  // The object is entirely inside the view
	}

	/**
	 * Render context
	 */
	VisualObject.prototype.render = function( ctx, x, y, height, scale ) {

		// The object boundaries
		var vBegin = this.object.beginTime() / this.timeline.scale + this.timeline.scrollX;

	}

	/**
	 * Handle mouse move event
	 * The coordinates are on time and frame values.
	 */
	VisualObject.prototype.mouseMove = function( xTime, xFrame ) {

	}

	/**
	 * Handle mouse down event
	 * The coordinates are on time and frame values.
	 */
	VisualObject.prototype.mouseDown = function( xTime, xFrame ) {

	}

	/**
	 * Handle mouse up event
	 * The coordinates are on time and frame values.
	 */
	VisualObject.prototype.mouseUp = function( xTime, xFrame ) {

	}

})(window);