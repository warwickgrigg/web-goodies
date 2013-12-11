(function(glob) {

	/**
	 * A KeyframeAnimation timeline object just creates as many keyframes
	 * as it's length and it then populates the different variables for every frame.
	 */
	var KeyframeAnimation = glob.KeyframeAnimation = function( object ) {
		glob.TimelineObject.call( this );

		// Set some default values
		this.begin = 0;
		this.end = 1000;

		// Prepare keyframes
		this.keyframes = [ ];

		// Keep the reference
		this.object = object;

		// Keep the template 
		this.objectTemplate = Object.create( object.variables );

	}

	KeyframeAnimation.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Callback from the visual in order to change the length
	 */
	KeyframeAnimation.prototype.resize = function( beginFrame, endFrame ) {

	}

	/**
	 * Update a tween object
	 */
	KeyframeAnimation.prototype.onUpdate = function( timeline, delta, frame, time ) {
		this.object.variables = this.keyframes[frame];
	}

	/**
	 * When the object should be displayed
	 */
	KeyframeAnimation.prototype.onEnter = function( timeline ) {
		this.object.variables.visible = true;
	}

	/**
	 * When the object should be hidden
	 */
	KeyframeAnimation.prototype.onExit = function( timeline ) {
		this.object.variables.visible = false;
	}

	/**
	 * When the object was placed on the timeline
	 */
	KeyframeAnimation.prototype.onPlace = function( timeline ) {

		// Update max value
		this.end = timeline.frameCount * timeline.frameWidth;

		// Update keyframes
		this.keyframes = [];
		for (var i=0; i<timeline.frameCount; i++) {
			this.keyframes.push( Object.create(this.objectTemplate) );
		}

		// Keep timeline referene
		this.timeline = timeline;

	}


})(window);