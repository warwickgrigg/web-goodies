(function(glob) {

	/**
	 * TimelineObjects can be placed on timeline and they are used
	 * for synchronizing arbitrary elements.
	 */
	var TimelineObject = glob.TimelineObject = function() {
		this.begin = 0;
		this.end = 0;
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
	 * Callback functions from the timeline logic
	 */
	TimelineObject.prototype.onUpdate = function( timeline, delta, frame, time ) { }
	TimelineObject.prototype.onEnter = function( timeline ) { }
	TimelineObject.prototype.onExit = function( timeline ) { }

})(window);