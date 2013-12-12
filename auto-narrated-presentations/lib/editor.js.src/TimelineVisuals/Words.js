(function(glob) {

	/**
	 * A Voice object encapsulates a sound object
	 */
	var VisualWords = glob.VisualWords = function( voiceObject, timeline ) {
		VisualObject.call( this, voiceObject, timeline );
	}

	VisualWords.prototype = Object.create( VisualObject.prototype );

	/**
	 * Render context
	 */
	VisualWords.prototype.render = function( ctx, x, y, height, scale ) {

		// Start rendering elements
		var l,w,focus;
		var c=0, cTime=this.object.beginTime();

		// Draw background
		ctx.fillStyle = this.timeline.palette.wordColors[c];
		ctx.fillRect( x,y, parseInt(this.object.duration)*scale ,height );

		// Draw boxes
		for (var i=0; i<this.object.words.length; i++) {
			var word = this.object.words[i];

			// Calculate left and width
			if ( i+1 >= this.object.words.length ) {
				l = parseInt(word[0]);
				w = parseInt(this.object.duration) - l;
			} else {
				l = parseInt(word[0]);
				w = parseInt(this.object.words[i+1][0]) - l;
			}

			// Check if we should be focused
			focus =  (this.timeline.playbackPos-cTime >= l) && (this.timeline.playbackPos-cTime <= l+w);

			// Apply scale and offset
			l = l*scale + x;
			w = w*scale;

			// Draw rect
			if (focus) {
				ctx.fillStyle = this.timeline.palette.focusedWordBack;
			} else {
				ctx.fillStyle = this.timeline.palette.wordColors[c];
			}
			ctx.fillRect( l,y,w,height );

			// Draw font
			ctx.textAlign = "start"; 
			ctx.textBaseline = "middle";
			ctx.font = this.timeline.palette.wordFont;
			if (focus) {
				ctx.fillStyle = this.timeline.palette.focusedWordFront;
			} else {
				ctx.fillStyle = this.timeline.palette.wordFontColor;
			}
			ctx.fillText( word[1], l+2, y+height/2 );

			// Pick next color for the word
			if (++c >= this.timeline.palette.wordColors.length) c=0;

		}

		// Draw frame
		ctx.strokeStyle = this.timeline.palette.wordBorder;
		ctx.lineWidth = 1;
		ctx.strokeRect( x,y,w+l-x,height );


	}

})(window);
