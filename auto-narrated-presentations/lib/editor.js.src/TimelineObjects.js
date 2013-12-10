(function(glob) {

	/**
	 * A TimelineTween encapsulates other timeline objects and can have
	 * multiple keyframes and tweening functions inbetween.
	 */
	var TimelineTween = glob.TimelineTween = function(id,begin,duration) {
		glob.TimelineObject.call( this );
		this.id = id;
		this.begin = begin;
		this.end = begin + duration;
	}

	TimelineTween.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Update a tween object
	 */
	TimelineTween.prototype.onUpdate = function( timeline, delta, frame, time ) {
		console.log(this.id, "- Time @", delta);
	}
	TimelineTween.prototype.onEnter = function( timeline ) {
		console.log(this.id, "+Show");
	}
	TimelineTween.prototype.onExit = function( timeline ) {
		console.log(this.id, "+Hide");
	}

	/**
	 * A TimelineWords timeline object encapsulates the audio object and the
	 * textual representation of the words.
	 */
	var TimelineWords = glob.TimelineWords = function( data ) {
		glob.TimelineObject.call( this );

		// Set offsets
		this.begin = 0;
		this.end = parseInt( data['duration'] );

		// Store words
		this.words = data['words'];

		// Create the audio object
		this.audio = new Audio();
		this.audio.src = data['soundURL'];
	}

	TimelineWords.prototype = Object.create( glob.TimelineObject.prototype );

	/**
	 * Update a tween object
	 */
	TimelineWords.prototype.onUpdate = function( timeline, delta, frame, time ) {
		var expectedTime = delta / 1000;

		try {

			// Sync audio if it drifts too far
			if (Math.abs(this.audio.currentTime - expectedTime) > 0.010 ) {
				this.audio.currentTime = expectedTime;
			}

		} catch (e) {
		}

	}

	TimelineWords.prototype.onEnter = function( timeline ) {
		// Start audio
		try {
			this.audio.currentTime = 0;
			this.audio.play();
		} catch (e) {
		}

	}
	TimelineWords.prototype.onExit = function( timeline ) {
		// Pause audio
		try {
			this.audio.pause();
		} catch (e) {
		}
	}


})(window);