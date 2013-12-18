(function(glob) {

	/**
	 * A Voice object encapsulates a sound object
	 */
	var TimelineWordsVisual = glob.TimelineWordsVisual = function( voiceObject, timeline ) {
		TimelineVisualObject.call( this, voiceObject, timeline );
	}

	TimelineWordsVisual.prototype = Object.create( TimelineVisualObject.prototype );
	TimelineVisualObject.registerVisual( TimelineWords, TimelineWordsVisual );

	/**
	 * Render context
	 */
	TimelineWordsVisual.prototype.render = function( ctx, x, y, width, h, scale ) {

		// Start rendering elements
		var l,w,focus;
		var c=0, cTime=this.timelineObject.beginTime();

		// Draw background
		ctx.fillStyle = this.timeline.palette.wordColors[c];
		ctx.fillRect( x,y, parseInt(this.timelineObject.duration)*scale ,h );

		// Draw boxes
		for (var i=0; i<this.timelineObject.words.length; i++) {
			var word = this.timelineObject.words[i];

			// Calculate left and width
			if ( i+1 >= this.timelineObject.words.length ) {
				l = parseInt(word[0]);
				w = parseInt(this.timelineObject.duration) - l;
			} else {
				l = parseInt(word[0]);
				w = parseInt(this.timelineObject.words[i+1][0]) - l;
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
			ctx.fillRect( l,y,w,h );

			// Draw font
			ctx.textAlign = "start"; 
			ctx.textBaseline = "middle";
			ctx.font = this.timeline.palette.wordFont;
			if (focus) {
				ctx.fillStyle = this.timeline.palette.focusedWordFront;
			} else {
				ctx.fillStyle = this.timeline.palette.wordFontColor;
			}
			ctx.fillText( word[1], l+2, y+h/2 );

			// Pick next color for the word
			if (++c >= this.timeline.palette.wordColors.length) c=0;

		}

		// Draw frame
		ctx.strokeStyle = this.timeline.palette.wordBorder;
		ctx.lineWidth = 1;
		ctx.strokeRect( x,y,w+l-x,h );


	}

})(window);
