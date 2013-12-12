(function(glob) {

	// Timeline index chunk size (in milliseconds)
	var TIMELINE_CHUNK_SIZE = 100;

	/**
	 * Timeline Logic
	 */
	var TimelineLogic = glob.TimelineLogic = function( clock, fps ) {

		// Prepare variables
		this.clock = clock;
		this.fps = fps || clock.fps;
		this.frameWidth = 1000 / this.fps;

		// Bind clock events
		this.clock.onTick( (function(time,delta) { this.handleTick(time,delta) } ).bind(this) );

		// Register a notification when the clock starts
		$(this.clock).on('clockStart', (function(){
			// Let all timeline objects know that we started
			for (var i=0; i<this.timelineObjects.length; i++) {
				this.timelineObjects[i].onPlaying( this );
			}

		}).bind(this));

		// Register a notification when the clock stops
		$(this.clock).on('clockStop', (function(){
			// Let all timeline objects know that we are paused
			for (var i=0; i<this.timelineObjects.length; i++) {
				this.timelineObjects[i].onPaused( this );
			}

		}).bind(this));

		// The timeline objects and the lookup table for them
		this.timelineObjects = [ ];
		this.timelineFrames = [ ];

		// Timeline info
		this.frameCount = 0;
		this.currentFrame = 0;
		this.loop = false;

	}

	/**
	 * Convert time (in milliseconds) into a frame index
	 */
	TimelineLogic.prototype.frameOf = function( time ) {
		return parseInt(Math.floor( time / this.frameWidth ));
	}

	/**
	 * Snap time (in milliseconds) in frame-sized chunks
	 */
	TimelineLogic.prototype.frameSnap = function( time ) {
		return parseInt(Math.floor( time / this.frameWidth ) * this.frameWidth);
	}

	/**
	 * Clock ticks
	 */
	TimelineLogic.prototype.handleTick = function( time, delta ) {

		// If we have no frames, do nothing
		if (this.timelineFrames.length == 0) return;

		// Get the frame we are going to enter
		var nextFrame = this.frameOf(time);

		// Check for out-of-bounds
		if (nextFrame > this.frameCount) {
			if (!this.loop) {
				this.clock.stop();
			} else {
				this.clock.stop();
				this.clock.set(0);
				this.clock.start();
			}
			return;
		}

		// Check if we really changed frame
		if (this.currentFrame != nextFrame) {

			// Let everybody know that the frame is changed
			$(this).trigger('frameChanged', nextFrame, this.currentFrame );

			// Find the objects removed
			for (var i=0; i<this.timelineFrames[this.currentFrame].length; i++) {
				var o = this.timelineFrames[this.currentFrame][i];
				if (this.timelineFrames[nextFrame].indexOf(o) == -1) {
					// Object deleted
					this.timelineObjects[o].onExit();
					$(this).trigger('objectHidden', this.timelineObjects[o], o );
				}
			}

			// Find the objects added
			for (var i=0; i<this.timelineFrames[nextFrame].length; i++) {
				var o = this.timelineFrames[nextFrame][i];
				if (this.timelineFrames[this.currentFrame].indexOf(o) == -1) {
					// Object added
					this.timelineObjects[o].onEnter();
					$(this).trigger('objectShown', this.timelineObjects[o], o );
				}
			}

			// Change frame
			this.currentFrame = nextFrame;

		}

		// Update every active timeline object, on every tick
		for (var i=0; i<this.timelineFrames[nextFrame].length; i++) {
			var o = this.timelineFrames[nextFrame][i];

			// Update timeline object values in order to match the new values
			this.timelineObjects[o].onUpdate( 
				time - this.timelineObjects[o].beginTime(), 
				nextFrame, time 
			);

			// Let everybody know that an object has changed
			$(this).trigger('objectChanged', this.timelineObjects[o], o );

		}

	}

	/**
	 * Re-index the given timeline object
	 */
	TimelineLogic.prototype.reIndex = function( object, lastIndex ) {
		var index = object;
		if (typeof(index) != "number") {
			index = this.timelineObjects.indexOf(object);
		} else {
			object = this.timelineObjects[index];
		}

		// Remove from previous indices
		if (object.__timelineBounds !== undefined) {
			var past = object.__timelineBounds;
			for (var i=past[0]; i<past[1]; i++) {
				var j = this.timelineFrames[i].indexOf(index);
				if (j != -1) this.timelineFrames[i].splice(j,1);
			}
		}

		// Find first and last frame from the timeline object
		var firstFrame = this.frameOf(object.beginTime()),
			lastFrame = this.frameOf(object.endTime());

		// Stretch timeline
		if (lastFrame > this.frameCount) {
			for (var i=this.frameCount; i<=lastFrame; i++) {
				this.timelineFrames.push([]);
			}
			this.frameCount = lastFrame;
		}

		// Register it on timeline
		for (var i=firstFrame; i<=lastFrame; i++) {
			this.timelineFrames[i].push( index );
		}

		// Update bounds
		object.__timelineBounds = [ firstFrame, lastFrame ];

		// Fire object changed for this object
		$(this).trigger('objectChanged', object, index );

	}

	/**
	 * Re-build the timeline index
	 */
	TimelineLogic.prototype.rebuildIndex = function() {

		// Reset timeline frames
		this.timelineFrames.splice(0);
		this.frameCount = 0;

		// Update frames
		for (var index=0; index<this.timelineObjects.length; index++) {
			var object = this.timelineObjects[index];

			// Find first and last frame from the timeline object
			var firstFrame = parseInt(Math.round(object.beginTime() / this.frameWidth)),
				lastFrame = parseInt(Math.round(object.endTime() / this.frameWidth));

			// Stretch timeline
			if (lastFrame > this.frameCount) {
				for (var i=this.frameCount; i<=lastFrame; i++) {
					this.timelineFrames.push([]);
				}
				this.frameCount = lastFrame;
			}

			// Register it on timeline
			for (var i=firstFrame; i<=lastFrame; i++) {
				this.timelineFrames[i].push( index );
			}

			// Update bounds
			object.__timelineBounds = [ firstFrame, lastFrame ];

		}

		// Timeline changed
		$(this).trigger('timelineChange');		

	}

	/**
	 * Add an object on timeline
	 */
	TimelineLogic.prototype.add = function( object ) {

		// Store object on timeline
		var objectIndex = this.timelineObjects.length;
		this.timelineObjects.push(object);
		object.setTimeline( this );

		// Editable objects need to provide a way of reporting back to the timeline.
		// If they have the updateTimeline placeholder, the timeline is going to
		// register a callback function, appropriate for re-indexing the timeline object.
		if (object.updateTimeline) {
			object.updateTimeline = (function() {
				this.reIndex( object, objectIndex );
			}).bind(this);
		}

		// Let the object know that it was placed
		object.onPlace();

		// Rebuild index
		this.rebuildIndex();

		// Check if the object exists in the current frame and show it.
		var fBegin = this.frameOf( object.beginTime() ),
			fEnd = this.frameOf( object.endTime() );
		if ((this.currentFrame >= fBegin) && (this.currentFrame <= fEnd)) {
			object.onEnter();
			$(this).trigger('objectShown', object, objectIndex );
		}

		// Let people know that we have added an object
		$(this).trigger('objectAdded', object, objectIndex );

		// If the clock is already running, let the object know
		if (this.clock.running) {
			object.onPlaying();
		} else {
			object.onPaused();
		}

	}

})(window);