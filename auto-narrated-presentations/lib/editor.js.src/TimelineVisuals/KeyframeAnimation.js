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

		// Fill background
		ctx.fillStyle = this.timeline.palette.framesBack;
		ctx.fillRect( x+0.5, y+0.5, w, height );

		// Render keyframes
		for (var i=0; i<this.object.keyframes.length; i++) {
			var kf = this.object.keyframes[i],
				aStart = kf.begin * this.timeline.frameWidth * scale,
				aStop = kf.end * this.timeline.frameWidth * scale;

			// Draw rect
			ctx.beginPath();
			ctx.strokeStyle = this.timeline.palette.framesBorder;
			ctx.rect( x, y, w, height );
			ctx.stroke();

		}

	}

})(window);
