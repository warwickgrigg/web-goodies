(function(glob) {

	/**
	 * TimelineObjects can be placed on timeline and they are used
	 * for synchronizing arbitrary elements.
	 */
	var TimelineObject = glob.TimelineObject = function( ) {
		this.begin = 0;
		this.end = 0;
		this.timeline = null;
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
		return this.end;
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
	 * This function updates the visual representation of the object on the stage and on the timeline.
	 * Placeholder function that will be replaced upon insertion on timeline logic.
	 */
	TimelineObject.prototype.updateTimeline = function() {

	}

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