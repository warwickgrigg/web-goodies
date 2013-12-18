(function(glob) {

	/**
	 * A ObjectAnimation timeline object is a more advanced timeline object
	 * that provides tweens and entry/exit animation control.
	 */
	var ObjectAnimation = glob.ObjectAnimation = function( object ) {
		glob.TimelineObject.call( this );

		// The entry and exit animation
		this.entryAniDuration = 200;
		this.exitAniDuration = 200;
		this.entryAnimation = null;
		this.exitAnimation = null;

		// The front/back tail
		this.frontOffset = 0;
		this.backOffset = 0;

		// Prepare keyframes
		this.keyframes = [
			Object.create( object.variables ),	// First
			Object.create( object.variables )	// Last
		];

		// The easing function
		this.easing = Easing.easeInOutElastic;

		// The object reference
		this.object = object;

	}

	ObjectAnimation.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Interpolate the values for the object
	 */
	ObjectAnimation.prototype.interpolate = function( time ) {
		if (time <= this.beginTime()+this.frontOffset) {
			return this.keyframes[0];
		} else if (time >= this.endTime()-this.backOffset) {
			return this.keyframes[1];
		} else {
			var o = Object.create( this.object.variables ),
				timeW = this.timeWide() - this.frontOffset - this.backOffset, // Time Width
				timeS = time-this.beginTime()-this.frontOffset; // The start

			// Interpolate to other variables
			for (var i=0; i<this.object.varNames.length; i++) {
				var n = this.object.varNames[i];
				if (typeof(o[n]) == 'number') {
					w = this.keyframes[1][n] - this.keyframes[0][n];
					//o[n] = this.keyframes[0][n] +  v*w;
					o[n] = this.easing( null, timeS, this.keyframes[0][n], w, timeW );
				}
			}
			return o;
		}
	}

	/**
	 * When the object was placed on the timeline (everything else is initialized)
	 */
	ObjectAnimation.prototype.onPlace = function() {
		// Update max value
		this.duration = this.timeline.frameCount * this.timeline.frameWidth / 2;
	}

	/**
	 * Update object information
	 */
	ObjectAnimation.prototype.onUpdate = function( delta, frame, time ) {
		if (!this.object) return;

		// Enable editor only on border frames
		if (frame == this.beginFrame()) {
			this.object.variables = this.keyframes[0];
			this.object.locked = false;
		} else if (frame == this.endFrame()-1) {
			this.object.variables = this.keyframes[1];
			this.object.locked = false;
		} else {
			this.object.locked = true;
			this.object.variables = this.interpolate(time );
		}

		// Entry/Exit opacity value calculation
		var v = 0.0, end = this.beginTime() + this.timeWide();
		if ( (time >= this.beginTime()) && (time <= this.beginTime()+this.entryAniDuration) ) {
			v = (time - this.beginTime()) / this.entryAniDuration;
		} else if ( (time >= end-this.exitAniDuration) && (time <= end) ) {
			v = (end - time) / this.exitAniDuration;
		} else if (time <= end) {
			v = 1.0;
		}
		this.object.variables['opacity'] = v*0.5+0.5;
		
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