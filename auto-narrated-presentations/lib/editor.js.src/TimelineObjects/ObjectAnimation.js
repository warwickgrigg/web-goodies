(function(glob) {

	/**
	 * A ObjectAnimation timeline object is a more advanced timeline object
	 * that provides tweens and entry/exit animation control.
	 */
	var ObjectAnimation = glob.ObjectAnimation = function( sceneObject ) {
		glob.TimelineObject.call( this, sceneObject );

		// The entry and exit animation
		this.entryAniDuration = 200;
		this.exitAniDuration = 200;
		this.entryAnimation = null;
		this.exitAnimation = null;

		// The front/back tail
		this.frontOffset = 200;
		this.backOffset = 200;

		// Prepare keyframes
		this.keyframes = [
			Object.create( sceneObject.variables ),	// First
			Object.create( sceneObject.variables )	// Last
		];

		// The easing function
		this.easing = Easing.easeInOutElastic;

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
			var o = Object.create( this.keyframes[0] ),
				timeW = this.timeWide() - this.frontOffset - this.backOffset, // Time Width
				timeS = time-this.beginTime()-this.frontOffset; // The start

			// Interpolate to other variables
			for (var i=0; i<this.sceneObject.varNames.length; i++) {
				var n = this.sceneObject.varNames[i];
				if (typeof(o[n]) == 'number') {
					w = this.keyframes[1][n] - this.keyframes[0][n];
					if (w != 0) o[n] = this.easing( null, timeS, this.keyframes[0][n], w, timeW );
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

		// Update keyframes
		this.keyframes = [
			Object.create( this.sceneObject.variables ),	// First
			Object.create( this.sceneObject.variables )	// Last
		];

	}

	/**
	 * Update object information
	 */
	ObjectAnimation.prototype.onUpdate = function( delta, frame, time ) {
		if (!this.sceneObject) return;

		// Enable editor only on border frames
		if (time <= this.beginTime()+this.frontOffset) {
			this.sceneObject.variables = this.keyframes[0];
			this.sceneObject.locked = false;
		} else if (time >= this.endTime()-this.backOffset) {
			this.sceneObject.variables = this.keyframes[1];
			this.sceneObject.locked = false;
		} else {
			this.sceneObject.locked = true;
			this.sceneObject.variables = this.interpolate(time );
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
		this.sceneObject.variables['opacity'] = v;
		
	}

	/**
	 * When we enter timeline, show object
	 */
	ObjectAnimation.prototype.onEnter = function() {
		if (!this.sceneObject) return;
		this.sceneObject.variables['visible'] = true;
	}

	/**
	 * When we exit timeline, hide object
	 */
	ObjectAnimation.prototype.onExit = function() {
		if (!this.sceneObject) return;
		this.sceneObject.variables['visible'] = false;
	}

})(window);