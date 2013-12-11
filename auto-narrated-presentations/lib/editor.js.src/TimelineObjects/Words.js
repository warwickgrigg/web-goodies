(function(glob) {

	/**
	 * A TimelineWords timeline object encapsulates the audio object and the
	 * textual representation of the words.
	 */
	var TimelineWords = glob.TimelineWords = function( data ) {
		glob.TimelineObject.call( this );
		console.log("- new TimelineWords(", data, ")");

		// Store words
		this.words = data['words'];
		this.duration = parseInt( data['duration'] );

		// Set offsets
		this.begin = 0;
		this.end = this.duration;

		// Create the audio object
		this.audio = new Audio();
		this.audio.src = data['soundURL'];
		this.audio.play();
		this.audio.pause();

		// Flags
		this.playing = false;
		this.entered = false;

	}

	TimelineWords.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Update a tween object
	 */
	TimelineWords.prototype.onUpdate = function( timeline, delta, frame, time ) {
		var expectedTime = delta / 1000;

		try {

			// Sync audio if it drifts too far
			if (Math.abs(this.audio.currentTime - expectedTime) > 0.1 ) {
				this.audio.currentTime = expectedTime;
			}

		} catch (e) {
		}

	}

	TimelineWords.prototype.onEnter = function( timeline ) {
		console.log("+Enter");
		// Start audio
		this.entered = true;
		try {
			if (this.playing) {
				this.audio.currentTime = 0;
				this.audio.play();
			}
		} catch (e) {
		}

	}
	TimelineWords.prototype.onExit = function( timeline ) {
		console.log("+Exit");
		// Pause audio
		this.entered = false;
		try {
			this.audio.pause();
		} catch (e) {
		}
	}

	TimelineWords.prototype.onPlaying = function( timeline ) {
		console.log("+Playing");
		this.playing = true;
		if (this.entered) {
			this.audio.play();
		}
	}

	TimelineWords.prototype.onPaused = function( timeline ) {
		console.log("+Paused");
		this.playing = false;
		this.audio.pause();
	}


})(window);