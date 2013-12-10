(function(glob) {

	/**
	 * The BigBen is our clock. 
	 * It keeps of time changes and notifies all the interested parties.
	 */
	var BigBen = glob.BigBen = function( fps ) {
		this.fps = fps || 25;
		this.running = false;
		this.currentTime = 0;
		this.audioSync = 0;
		this.audio = null;
		this.lastFrameTime = 0;
		this.lastAudioPos = 0;
	}

	BigBen.prototype.start = function() {
		this.running = true;
		this.scheduleTick();
	}

	BigBen.prototype.stop = function() {
		this.running = false;
	}

	BigBen.prototype.scheduleTick = function() {
		if (!this.running) return;
		var self = this;

		// Schedule next frame
		setTimeout(function() {
			requestAnimationFrame( self.tick.bind(self) );
		}, 1000 / this.fps);
	}

	BigBen.prototype.setAudio = function( audio ) {
		this.audio = audio;
		this.lastAudioPos = audio.currentTime * 1000;
	}

	BigBen.prototype.tick = function() {

		// Calculate time delta
		var time = new Date().getMilliseconds(),
			delta = 1000 / this.fps;
		if (this.lastFrameTime != 0) { delta = this.lastFrameTime - time; }
		this.lastFrameTime = time;

		// Increment time
		this.currentTime += delta;

		// Check for audio drifts
		var audio = 0;
		if (this.audio != null) {

			// Expected audio position
			

		}

		// Schedule the next tick
		this.scheduleTick();

	}

})(window);