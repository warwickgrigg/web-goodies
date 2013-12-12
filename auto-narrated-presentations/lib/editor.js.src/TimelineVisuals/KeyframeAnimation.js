(function(glob) {

	/**
	 * A Voice object encapsulates a sound object
	 */
	var KeyframeAnimationVisual = glob.KeyframeAnimationVisual = function( voiceObject, timeline ) {
		VisualObject.call( this, voiceObject, timeline );
	}

	KeyframeAnimationVisual.prototype = Object.create( VisualObject.prototype );
	VisualObject.registerVisual( KeyframeAnimation, KeyframeAnimationVisual );

	/**
	 * Render context
	 */
	KeyframeAnimationVisual.prototype.render = function( ctx, x, y, height, scale ) {

		// Calculate width
		var w = (this.object.endTime() - this.object.beginTime()) * scale;

		// Render
		ctx.fillStyle = '#009933';
		ctx.fillRect( x, y, w, height );

	}

})(window);
