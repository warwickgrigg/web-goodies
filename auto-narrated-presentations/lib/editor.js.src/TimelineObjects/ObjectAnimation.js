(function(glob) {

	/**
	 * A ObjectAnimation timeline object is a more advanced timeline object
	 * that provides tweens and entry/exit animation control.
	 */
	var ObjectAnimation = glob.ObjectAnimation = function( object ) {
		glob.TimelineObject.call( this );

		// The entry and exit animation
		this.entryAniDuration = 200;
		this.entryAnimation = null;
		this.exitAniDuration = 200;
		this.exitAnimation = null;

		this.object = object;

	}

	ObjectAnimation.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * When the object was placed on the timeline (everything else is initialized)
	 */
	ObjectAnimation.prototype.onPlace = function() {

		// Update max value
		this.duration = this.timeline.frameCount * this.timeline.frameWidth / 2;

	}

	/**
	 * When we enter timeline, show object
	 */
	ObjectAnimation.prototype.onEnter = function() {
		if (!this.object) return;
		this.object.variables['visible'] = true;
	}

	/**
	 * When we exit timeline, hide object
	 */
	ObjectAnimation.prototype.onExit = function() {
		if (!this.object) return;
		this.object.variables['visible'] = false;
	}

})(window);