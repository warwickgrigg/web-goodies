(function(glob) {

	/**
	 * A Voice object encapsulates a sound object
	 */
	var KeyframeAnimationVisual = glob.KeyframeAnimationVisual = function( voiceObject, timeline ) {
		TimelineVisualObject.call( this, voiceObject, timeline );
	}

	KeyframeAnimationVisual.prototype = Object.create( TimelineVisualObject.prototype );
	TimelineVisualObject.registerVisual( KeyframeAnimation, KeyframeAnimationVisual );

	/**
	 * Render context
	 */
	KeyframeAnimationVisual.prototype.render = function( ctx, x, y, w, h, scale ) {

		// Fill background
		ctx.lineWidth = 1;
		ctx.fillStyle = this.timeline.palette.framesBack;
		ctx.fillRect( x, y, w, h );

		// Render keyframes
		for (var i=0; i<this.object.keyframes.length; i++) {
			var kf = this.object.keyframes[i],
				aStart = kf.begin * this.timeline.frameWidth * scale,
				aStop = kf.end * this.timeline.frameWidth * scale;

			// Draw rect
			ctx.beginPath();
			ctx.strokeStyle = this.timeline.palette.framesBorder;
			ctx.rect( x, y, w, h );
			ctx.stroke();

		}

	}

})(window);
