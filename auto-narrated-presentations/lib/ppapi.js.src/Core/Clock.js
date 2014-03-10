/**
 * Tunable parameters for audio synchronization (in milliseconds)
 */
var AUDIO_SYNC_TOLLERANCE = 50,
	AUDIO_END_TRIM = 10;

/**
 * The Clock class is our clock source.
 * It keeps of time changes and notifies all the interested parties.
 */
var Clock = PP.Core.Clock = function( fps ) {
	Callbacks.call( this );

	// Flags
	this.running = false;

	// Timekeeping
	this.fps = fps || 25;
	this.currentTime = 0;
	this.lastFrameTime = 0;

	// Callbacks
	this.supportCallback("tick");
	this.supportCallback("start");
	this.supportCallback("stop");

}

Clock.prototype = Object.create( Callbacks.prototype );

/**
 * Start big ben
 */
Clock.prototype.start = function() {
	this.lastFrameTime = 0;
	this.running = true;
	this.scheduleTick();

	// Fire start handlers
	this.fireStart();

}

/**
 * Stop big ben
 */
Clock.prototype.stop = function() {
	this.running = false;

	// Fire stop handlers
	this.fireStop();

}

/**
 * Set clock position (in milliseconds)
 */
Clock.prototype.set = function( t ) {

	// Calculate delta
	var delta = t - this.currentTime;
	this.currentTime = t;
	this.lastFrameTime = 0;

	// Fire tick handlers
	this.fireTick( this.currentTime, delta );

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

	// Schedule next tick
	setTimeout(function() {
		if (window['requestAnimationFrame'] != undefined) {
			requestAnimationFrame( self.tick.bind(self) );
		} else {
			self.tick.bind(self);
		}
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
	this.fireTick( this.currentTime, delta );

	// Schedule the next tick
	this.scheduleTick();

}
