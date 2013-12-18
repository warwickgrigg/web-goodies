(function(glob) {

	var ObjectAnimationPalette = {

		backKeyFrame:	'#cccccc',
		frontKeyFrame: 	'#666666',
		borderKeyFrame: '#666666',
		borderDragging: '#333333',

		backTween: 		'#99CCFF',
		frontTween: 	'#0066CC',

		backFade: 		'#99FF33', 
		anchorFade:  	'#669900',
		frontFade: 		'#003300',

		wordFont		: '7pt Tahoma',
		wordFontColor	: '#333333',
		wordBorder		: '#666666',

		anchorBorder	: '#666666',
		anchorFill   	: '#ffffff',
		anchorBack		: '#999999'

	};

	/**
	 * A Voice object encapsulates an ObjectAnimation object
	 */
	var ObjectAnimationVisual = glob.ObjectAnimationVisual = function( animationObject, timeline ) {
		TimelineVisualObject.call( this, animationObject, timeline );

		// Prepare palette
		this.palette = ObjectAnimationPalette;

		// Dragging
		this.resizing = false;
		this.resizeEdge = 0;
		this.resizeAnchor = 0;
		this.resizeOffset = 0;
		this.resizeDuration = 0;

	}

	ObjectAnimationVisual.prototype = Object.create( TimelineVisualObject.prototype );
	TimelineVisualObject.registerVisual( ObjectAnimation, ObjectAnimationVisual );

	/**
	 * Render context
	 */
	ObjectAnimationVisual.prototype.render = function( ctx, x, y, w, h, scale ) {

		// Fill background
		ctx.fillStyle = this.palette.backKeyFrame;
		ctx.fillRect( x, y, w, h );		

		// ====================================
		//  Calculate element dimentions
		// ====================================

		// Draw the drag handlers
		var maxh = h-5,
			hw = (this.timeline.logic.frameWidth * scale)-5;
		if (hw>maxh) hw=maxh;

		// Pick the maximum width
		var maxW = this.timeline.logic.frameWidth * scale,
			midW = maxW/2;

		// ====================================
		//  Draw tween edges
		// ====================================

		// Calculate offsets in pixels
		var fOffset = this.timelineObject.frontOffset * scale,
			bOffset = this.timelineObject.backOffset * scale;

		// Shorthand some variables
		var yp = y+h/2, wp = w-bOffset-fOffset, xp = x+fOffset;

		// Draw background
		ctx.fillStyle = this.palette.backTween;
		ctx.fillRect( xp, y, wp, h );

		// Left marker
		ctx.fillStyle = this.palette.frontTween;
		ctx.fillRect( xp, y, maxW, h );

		// Right marker
		ctx.fillStyle = this.palette.frontTween;
		ctx.fillRect( xp+wp-maxW, y, maxW, h );

		// Draw arrow
		xp += maxW; wp -= maxW*2;
		ctx.beginPath();

			// Left arrow
			ctx.moveTo( xp+midW, yp-h/3 );
			ctx.lineTo( xp+midW+h/3, yp );
			ctx.lineTo( xp+midW, yp+h/3 );

			// Straight line
			ctx.moveTo( xp+midW+h/3, yp );
			ctx.lineTo( xp+wp-midW, yp);

			// Right arrow
			ctx.moveTo( xp+wp-midW-h/3, yp-h/3 );
			ctx.lineTo( xp+wp-midW, yp );
			ctx.lineTo( xp+wp-midW-h/3, yp+h/3 );

		ctx.strokeStyle = this.palette.frontTween;
		ctx.lineWidth = 1;
		ctx.stroke();


		// ====================================
		//  Draw anchors
		// ====================================

		// Calculate the fade-in anchor
		var entryAniFrames = this.timeline.logic.frameOf( this.timelineObject.entryAniDuration ),
			exitAniFrames = this.timeline.logic.frameOf( this.timelineObject.exitAniDuration );
		if ((entryAniFrames == 0) && (this.timelineObject.entryAniDuration != 0)) entryAniFrames=1;
		if ((exitAniFrames == 0) && (this.timelineObject.exitAniDuration != 0)) exitAniFrames=1;

		// Render entry frames
		if (entryAniFrames > 0) {
			var ew = this.timeline.logic.frameWidth * (entryAniFrames-1) * scale;

			// Draw the green background
			ctx.fillStyle = this.palette.backFade;
			ctx.fillRect(x,y,ew,h/2);

			// Draw the left anchor
			ctx.fillStyle = this.palette.anchorFade;
			ctx.fillRect(x+ew,y,maxW,h/2);

		}

		// Render exit frames
		if (exitAniFrames > 0) {
			var ew = this.timeline.logic.frameWidth * exitAniFrames * scale;

			// Draw the green background
			ctx.fillStyle = this.palette.backFade;
			ctx.fillRect(x+w-ew,y,ew,h/2);

			// Draw the right anchor
			ctx.fillStyle = this.palette.anchorFade;
			ctx.fillRect(x+w-ew,y,maxW,h/2);

		}

		// Left anchor
		if (entryAniFrames > 0) {
			ctx.fillStyle = this.palette.anchorFade;
		} else {
			ctx.fillStyle = this.palette.anchorBack;
		}
		ctx.fillRect(x,y,maxW,h);
		if (hw>2) {
			ctx.beginPath();
			ctx.arc(x+midW, y+h/2, hw/2, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.palette.anchorFill;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.palette.anchorBorder;
			ctx.stroke();
		}

		// Right anchor
		if (exitAniFrames > 0) {
			ctx.fillStyle = this.palette.anchorFade;
		} else {
			ctx.fillStyle = this.palette.anchorBack;
		}
		ctx.fillRect(x+w-maxW,y,maxW,h);
		if (hw>2) {
			ctx.beginPath();
			ctx.arc(x+w-maxW+midW, y+h/2, hw/2, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.palette.anchorFill;
			ctx.fill();
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.palette.anchorBorder;
			ctx.stroke();
		}


		// ====================================
		//  Draw anchors
		// ====================================

		// Fill border
		if (this.dragging || this.resizing) {
			ctx.strokeStyle = this.palette.borderDragging;
			ctx.lineWidth = 2;
		} else {
			ctx.strokeStyle = this.palette.borderKeyFrame;
			ctx.lineWidth = 1;
		}
		ctx.beginPath();
		ctx.rect( x, y, w, h );		
		ctx.stroke();

	}

	ObjectAnimationVisual.prototype.mouseMove = function( relative, absolute, info ) {
		if (this.resizing) {
			// -------------------------
			//  Dragging implementation
			// -------------------------

			if (this.resizeEdge == 0) {
				var newBegin = this.resizeOffset + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth,
					newDiff = this.resizeOffset - newBegin
				this.timelineObject.begin = newBegin;
				this.timelineObject.duration = this.resizeDuration + newDiff;
			} else if (this.resizeEdge == 1) {
				var newDuration = this.resizeDuration + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				this.timelineObject.duration = newDuration;
			} else if (this.resizeEdge == 2) {
				var newDuration = this.resizeDuration + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.timelineObject.entryAniDuration = newDuration;
			} else if (this.resizeEdge == 3) {
				var newDuration = this.resizeDuration - (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.timelineObject.exitAniDuration = newDuration;
			} else if (this.resizeEdge == 4) {
				var newDuration = this.resizeDuration + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.timelineObject.frontOffset = newDuration;
			} else if (this.resizeEdge == 5) {
				var newDuration = this.resizeDuration - (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.timelineObject.backOffset = newDuration;
			}

			this.timelineObject.updateTimeline();

		} else {

			// --------------------
			//  Cursor switching
			// --------------------

			// Calculate the location of the easing anchors
			var entryAniFrames = this.timeline.logic.frameOf( this.timelineObject.entryAniDuration ),
				exitAniFrames = this.timeline.logic.frameOf( this.timelineObject.exitAniDuration ),
				frontOffsetFrame = this.timeline.logic.frameOf( this.timelineObject.frontOffset ),
				backOffsetFrame = this.timeline.logic.frameOf( this.timelineObject.backOffset ),
				eaEnter = this.timelineObject.beginFrame() + entryAniFrames - 1,
				eaExit = this.timelineObject.endFrame() - exitAniFrames,
				eaFront = this.timelineObject.beginFrame() + frontOffsetFrame,
				eaBack = this.timelineObject.endFrame() - backOffsetFrame - 1;
			if (this.timelineObject.entryAniDuration == 0) eaEnter = false;
			if (this.timelineObject.exitAniDuration == 0) eaExit = false;
			if (this.timelineObject.frontOffset == 0) eaFront = false;
			if (this.timelineObject.backOffset == 0) eaBack = false;

			// Check for cursor switching
			if ( (relative.frame == 0) || (relative.frame == this.timelineObject.framesWide()-1) ||
				 ( ((absolute.frame == eaEnter) || (absolute.frame == eaExit)) && (relative.y <= info.h/2) ) ||
				 ( ((absolute.frame == eaFront) || (absolute.frame == eaBack)) && (relative.y > info.h/2) ) ) {
				$(info.canvas).css('cursor', 'ew-resize');
			} else {
				$(info.canvas).css('cursor', 'default');			
			}
		}
	}

	ObjectAnimationVisual.prototype.mouseDown = function( relative, absolute, info ) {
		// Calculate the location of the easing anchors
		var entryAniFrames = this.timeline.logic.frameOf( this.timelineObject.entryAniDuration ),
			exitAniFrames = this.timeline.logic.frameOf( this.timelineObject.exitAniDuration ),
			frontOffsetFrame = this.timeline.logic.frameOf( this.timelineObject.frontOffset ),
			backOffsetFrame = this.timeline.logic.frameOf( this.timelineObject.backOffset ),
			eaEnter = this.timelineObject.beginFrame() + entryAniFrames - 1,
			eaExit = this.timelineObject.endFrame() - exitAniFrames,
			eaFront = this.timelineObject.beginFrame() + frontOffsetFrame,
			eaBack = this.timelineObject.endFrame() - backOffsetFrame - 1;
		if (this.timelineObject.entryAniDuration == 0) eaEnter = false;
		if (this.timelineObject.exitAniDuration == 0) eaExit = false;
		if (this.timelineObject.frontOffset == 0) eaFront = false;
		if (this.timelineObject.backOffset == 0) eaBack = false;

		if (relative.frame == 0) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeOffset = this.timelineObject.begin;
			this.resizeDuration = this.timelineObject.duration;
			this.resizeEdge = 0;
			console.log("Begin ");
			return true;
		} else if (relative.frame == this.timelineObject.framesWide()-1) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeDuration = this.timelineObject.duration;
			this.resizeEdge = 1;
			return true;
		} else if (relative.y <= info.h/2) {
			if (absolute.frame == eaEnter) {
				this.resizing = true;
				this.resizeAnchor = absolute.frame;
				this.resizeDuration = this.timelineObject.entryAniDuration;
				this.resizeEdge = 2;
				return true;
			} else if (absolute.frame == eaExit) {
				this.resizing = true;
				this.resizeAnchor = absolute.frame;
				this.resizeDuration = this.timelineObject.exitAniDuration;
				this.resizeEdge = 3;
				return true;
			}
		} else if (relative.y > info.h/2) {
			if (absolute.frame == eaFront) {
				this.resizing = true;
				this.resizeAnchor = absolute.frame;
				this.resizeDuration = this.timelineObject.frontOffset;
				this.resizeEdge = 4;
				return true;
			} else if (absolute.frame == eaBack) {
				this.resizing = true;
				this.resizeAnchor = absolute.frame;
				this.resizeDuration = this.timelineObject.backOffset;
				this.resizeEdge = 5;
				return true;
			}
		} 
	}

	ObjectAnimationVisual.prototype.mouseUp = function( relative, absolute, info ) {
		if (this.resizing) {
			this.resizing = false;
			$(info.canvas).css('cursor', 'default');			
			console.log("End");
		}
	}

})(window);