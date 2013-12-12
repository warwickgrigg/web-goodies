(function(glob) {

	/**
	 * A Voice object encapsulates a sound object
	 */
	var VisualKeyframes = glob.VisualKeyframes = function( voiceObject, timeline ) {
		VisualObject.call( this, voiceObject, timeline );
	}

	VisualKeyframes.prototype = Object.create( VisualObject.prototype );

	/**
	 * Render context
	 */
	VisualKeyframes.prototype.render = function( ctx, x, y, height, scale ) {

		// Calculate width
		var w = (this.object.endTime() - this.object.beginTime()) * scale;

		// Render
		ctx.fillStyle = '#009933';
		ctx.fillRect( x, y, w, height );

	}

})(window);
