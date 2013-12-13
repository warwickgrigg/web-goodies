(function(glob) {

	/**
	 * A KeyframeAnimation timeline object just creates as many keyframe
	 * as it's length and it then populates the different variables for every frame.
	 */
	var KeyframeAnimation = glob.KeyframeAnimation = function( object ) {
		glob.TimelineObject.call( this );

		// Set some default values
		this.begin = 0;
		this.end = 1000;

		// Prepare keyframe info
		this.keyframes = [ ];
		this.keyframeIndex = [ ];

		// Keep the reference
		this.object = object;

		// Keep the template 
		this.objectTemplate = Object.create( object.variables );

	}

	KeyframeAnimation.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Static function to extract keyframe info from the given buffer
	 */
	KeyframeAnimation.fromBuffer = function() {

	}

	/**
	 * Add a keyframe on the current position of the timeline
	 */
	KeyframeAnimation.prototype.addKeyframe = function() {
		var frame = this.timeline.currentFrame;
		
	}

	/**
	 * Interpolate the variables for the current frame
	 */
	KeyframeAnimation.prototype.interpolate = function( frame ) {

	}

	/**
	 * Callback from the visual in order to change the length
	 */
	KeyframeAnimation.prototype.resize = function( beginFrame, endFrame ) {

	}

	/**
	 * Update a tween object
	 */
	KeyframeAnimation.prototype.onUpdate = function( delta, frame, time ) {
		this.object.variables = this.interpolate( frame );
	}

	/**
	 * When the object should be displayed
	 */
	KeyframeAnimation.prototype.onEnter = function() {
		this.object.variables.visible = true;
	}

	/**
	 * When the object should be hidden
	 */
	KeyframeAnimation.prototype.onExit = function() {
		this.object.variables.visible = false;
	}

	/**
	 * When the object was placed on the timeline (everything else is initialized)
	 */
	KeyframeAnimation.prototype.onPlace = function() {

		// Update max value
		this.end = this.timeline.frameCount * this.timeline.frameWidth;

		// Update keyframeInfo
		this.keyframeIndex = [];
		for (var i=0; i<this.timeline.frameCount; i++) {
			this.keyframeIndex.push( Object.create(this.objectTemplate) );
		}

		// Update default keyframes
		this.keyframes = [
			{
				'begin': this.beginFrame(),
				'end': this.endFrame(),
				'tween': 'linear'
			}
		];

	}


})(window);