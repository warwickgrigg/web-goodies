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
	TimelineTween.prototype.onPlaying = function( timeline ) {
		console.log(this.id, "+Playing");
	}
	TimelineTween.prototype.onPaused = function( timeline ) {
		console.log(this.id, "+Paused");
	}


})(window);