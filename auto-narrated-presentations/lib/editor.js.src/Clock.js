(function(glob) {

	/**
	 * Tunable parameters for audio synchronization (in milliseconds)
	 */
	var AUDIO_SYNC_TOLLERANCE = 50,
		AUDIO_END_TRIM = 10;

	/**
	 * The Clock class is our clock source.
	 * It keeps of time changes and notifies all the interested parties.
	 */
	var Clock = glob.Clock = function( fps ) {

		// Flags
		this.running = false;

		// Timekeeping
		this.fps = fps || 25;
		this.currentTime = 0;
		this.lastFrameTime = 0;

		// Audio synchronization
		this.audio = null;
		this.audioSyncTime = 0;

		// Tick callbacks
		this.tickCallbacks = [ ];

	}

	/**
	 * Start big ben
	 */
	Clock.prototype.start = function() {
		this.lastFrameTime = 0;
		this.running = true;
		this.scheduleTick();
		$(this).trigger('clockStart');
	}

	/**
	 * Stop big ben
	 */
	Clock.prototype.stop = function() {
		this.running = false;
		$(this).trigger('clockStop');
	}

	/**
	 * Set clock position (in milliseconds)
	 */
	Clock.prototype.set = function( t ) {

		// Calculate delta
		var delta = t - this.currentTime;
		this.currentTime = t;

		// Fire tick handlers
		for (var i=0; i<this.tickCallbacks.length; i++) {
			this.tickCallbacks[i]( this.currentTime, delta );
		}

	}

	/**
	 * Add a tick callback
	 */
	Clock.prototype.onTick = function( handler ) {
		this.tickCallbacks.push(handler);
	}

	/**
	 * Remove a tick callback
	 */
	Clock.prototype.offTick = function( handler ) {
		var i = this.tickCallbacks.indexOf(handler);
		if (i >= 0) this.tickCallbacks.splice(i,1);
	}

	/**
	 * Set an object that will be synchronized (and synchronized with)
	 * the timeline.
	 */
	Clock.prototype.syncWithAudio = function( audio, startTime ) {
		this.audio = audio;
		this.audioSyncTime = startTime;
	}

	/**
	 * Schedule next tick
	 */
	Clock.prototype.scheduleTick = function() {
		if (!this.running) return;
		var self = this;

		// Schedule next frame
		setTimeout(function() {
			requestAnimationFrame( self.tick.bind(self) );
		}, 1000 / this.fps);
	}

	/**
	 * Handle the clock tick
	 */
	Clock.prototype.tick = function() {

		// Keep a copy of the last frame time
		var lastFrame = this.lastFrameTime;

		// Calculate time delta
		var time = Date.now()
			delta = 1000 / this.fps;
		if (this.lastFrameTime != 0) { delta = time - this.lastFrameTime; }
		this.lastFrameTime = time;

		// Increment time
		this.currentTime += delta;

		// Synchronization tollerance between audio and real-time
		var SYNC_TOLLERANCE = 1000 / this.fps;

		// Check if we are within the audio frame
		// and if yes, check for time adaption
		if (this.audio != null) {
			if (( this.currentTime >= this.audioSyncTime ) && ( this.currentTime <= (this.audioSyncTime + this.audio.duration * 1000 - AUDIO_END_TRIM) )) {

				// Calculate the expected audio position
				var expectedTime = this.currentTime - time.audioSyncTime,
					audioDrift = (this.audio.currentTime * 1000) - expectedTime;

				// If we are outisde tollerance, adapt the audio time as ours
				if (Math.abs(audioDrift) > Math.min( SYNC_TOLLERANCE, AUDIO_SYNC_TOLLERANCE )) {

					// Calculate new delta and times
					delta = lastFrame - expectedTime;
					this.currentTime = expectedTime;
					this.lastFrameTime = expectedTime;

				}

			}
		}

		// Fire tick handlers
		for (var i=0; i<this.tickCallbacks.length; i++) {
			this.tickCallbacks[i]( this.currentTime, delta );
		}

		// Schedule the next tick
		this.scheduleTick();

	}

})(window);