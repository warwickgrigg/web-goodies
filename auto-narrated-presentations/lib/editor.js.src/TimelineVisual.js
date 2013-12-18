(function(glob) {

	/**
	 * Static type registry used by the registerVisual and visualFor functions.
	 */
	var typeRegistry = [ ];

	/**
	 * Visual object that encapsulates timeline objects
	 */
	var TimelineVisualObject = glob.TimelineVisualObject = function( timelineObject, timeline ) {
		this.timeline = timeline;
		this.timelineObject = timelineObject;
		this.dragging = false;

		this.beginFrame = this.timeline.logic.frameOf( this.timelineObject.beginTime() );
		this.endFrame = this.timeline.logic.frameOf( this.timelineObject.endTime() );
	}

	/**
	 * Static function that is used to register a translation
	 * between the Timeline object and it's visual representation
	 */
	TimelineVisualObject.registerVisual = function( timelineClass, visualClass ) {
		typeRegistry.push([timelineClass, visualClass]);
	}

	/**
	 * Translate a timeline object to a visual object
	 */
	TimelineVisualObject.visualFor = function( object, timeline ) {
		for (var i=0; i<typeRegistry.length; i++) {
			// Check if class matches
			if (object instanceof typeRegistry[i][0]) {
				// Wrap into a visual object
				return new typeRegistry[i][1]( object, timeline );
			}
		}
	}

	/**
	 * Check if the object is within the visible region
	 */
	TimelineVisualObject.prototype.isVisible = function() {

		// The object boundaries
		var vBegin = this.timelineObject.beginTime() / this.timeline.scale,
			vEnd = this.timelineObject.endTime() / this.timeline.scale;

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
	TimelineVisualObject.prototype.render = function( ctx, x, y, width, height, scale ) {

		// The object boundaries
		var vBegin = this.timelineObject.beginTime() / this.timeline.scale + this.timeline.scrollX;

	}

	/**
	 * Handle mouse move event
	 * The coordinates are on time and frame values.
	 */
	TimelineVisualObject.prototype.mouseMove = function( relative, absolute, info ) {

	}

	/**
	 * Handle mouse down event
	 * The coordinates are on time and frame values.
	 */
	TimelineVisualObject.prototype.mouseDown = function( relative, absolute, info ) {
	}

	/**
	 * Handle mouse up event
	 * The coordinates are on time and frame values.
	 */
	TimelineVisualObject.prototype.mouseUp = function( relative, absolute, info ) {

	}

})(window);