(function(glob) {

	/**
	 * TimelineObjects can be placed on timeline and they are used
	 * for synchronizing arbitrary elements.
	 */
	var TimelineObject = glob.TimelineObject = function( sceneObject ) {
		this.begin = 0;
		this.duration = 0;
		this.timeline = null;
		this.sceneObject = sceneObject;
	}

	/**
	 * Set the timeline object
	 * This function is called the instant the user calls the .add() function on 
	 * the timeline.
	 */
	TimelineObject.prototype.setTimeline = function( timeline ) {
		this.timeline = timeline;
	}

	/**
	 * Return the timestamp (in milliseconds) of the first frame
	 */
	TimelineObject.prototype.beginTime = function() {
		return this.begin;
	}

	/**
	 * Return the timestamp (in milliseconds) of the last frame
	 */
	TimelineObject.prototype.endTime = function() {
		return this.begin + this.duration;
	}

	/**
	 * Return the duration in milliseconds
	 */
	TimelineObject.prototype.timeWide = function() {
		return this.duration;
	}

	/**
	 * Return the first frame index
	 */
	TimelineObject.prototype.beginFrame = function() {
		if (!this.timeline) return null;
		return this.timeline.frameOf( this.beginTime() );
	}

	/**
	 * Return the last frame index
	 */
	TimelineObject.prototype.endFrame = function() {
		if (!this.timeline) return null;
		return this.timeline.frameOf( this.endTime() );
	}

	/**
	 * Return the width in frames
	 */
	TimelineObject.prototype.framesWide = function() {
		if (!this.timeline) return null;
		return this.timeline.frameOf( this.duration );
	}

	/**
	 * Check if the object is visible on stage
	 */
	TimelineObject.prototype.isVisible = function() {
		if (!this.timeline) return null;
		return ( ( this.timeline.currentFrame >= this.beginFrame()) && 
			     ( this.timeline.currentFrame <= this.endFrame() ) );
	}

	/**
	 * This function updates the visual representation of the object on the stage and on the timeline.
	 * Placeholder function that will be replaced upon insertion on timeline logic.
	 */
	TimelineObject.prototype.updateTimeline = function() { }

	/**
	 * Callback functions from the timeline logic
	 */
	TimelineObject.prototype.onUpdate = function( delta, frame, time ) { }	// Called on every tick
	TimelineObject.prototype.onEnter = function( ) { }		// Called when the cursor enters the time frame
	TimelineObject.prototype.onExit = function( ) { }		// Called when the cursor exits from the time frame
	TimelineObject.prototype.onPlaying = function( ) { }	// Called when the animation is started
	TimelineObject.prototype.onPaused = function( ) { }	// Called when the animation is ended

	/**
	 * Editor callbacks
	 */
	TimelineObject.prototype.onPlace = function( ) { }		// Called when the object was added by an editor
	TimelineObject.prototype.onRemove = function( ) { }	// Called when the object was removed by an editor

})(window);