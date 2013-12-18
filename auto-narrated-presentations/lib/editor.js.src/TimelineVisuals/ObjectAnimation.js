(function(glob) {

	var ObjectAnimationPalette = {

		backKeyFrame:	'#cccccc',
		frontKeyFrame: 	'#666666',
		borderKeyFrame: '#666666',
		borderDragging: '#333333',

		backTween: 		'#6699FF',
		frontTween: 	'#0066CC',

		backFade: 		'rgba(153,255,51,0.5)', 
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
		//  Draw anchors
		// ====================================

		// Calculate the fade-in anchor
		var entryAniFrames = this.timeline.logic.frameOf( this.object.entryAniDuration ),
			exitAniFrames = this.timeline.logic.frameOf( this.object.exitAniDuration );
		if ((entryAniFrames == 0) && (this.object.entryAniDuration != 0)) entryAniFrames=1;
		if ((exitAniFrames == 0) && (this.object.exitAniDuration != 0)) exitAniFrames=1;

		// Draw the drag handlers
		var maxh = h-5,
			hw = (this.timeline.logic.frameWidth * scale)-5;
		if (hw>maxh) hw=maxh;

		// Pick the maximum width
		var maxW = this.timeline.logic.frameWidth * scale,
			midW = maxW/2;

		// Render entry frames
		if (entryAniFrames > 0) {
			var ew = this.timeline.logic.frameWidth * (entryAniFrames-1) * scale;

			// Draw the green background
			ctx.fillStyle = this.palette.backFade;
			ctx.fillRect(x,y,ew,h);

			// Draw the left anchor
			ctx.fillStyle = this.palette.anchorFade;
			ctx.fillRect(x+ew,y,maxW,h);

		}

		// Render exit frames
		if (exitAniFrames > 0) {
			var ew = this.timeline.logic.frameWidth * exitAniFrames * scale;

			// Draw the green background
			ctx.fillStyle = this.palette.backFade;
			ctx.fillRect(x+w-ew,y,ew,h);

			// Draw the right anchor
			ctx.fillStyle = this.palette.anchorFade;
			ctx.fillRect(x+w-ew,y,maxW,h);

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
			if (this.resizeEdge == 0) {
				var newBegin = this.resizeOffset + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth,
					newDiff = this.resizeOffset - newBegin
				this.object.begin = newBegin;
				this.object.duration = this.resizeDuration + newDiff;
			} else if (this.resizeEdge == 1) {
				var newDuration = this.resizeDuration + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				this.object.duration = newDuration;
			} else if (this.resizeEdge == 2) {
				var newDuration = this.resizeDuration + (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.object.entryAniDuration = newDuration;
			} else if (this.resizeEdge == 3) {
				var newDuration = this.resizeDuration - (absolute.frame - this.resizeAnchor) * this.timeline.logic.frameWidth;
				if (newDuration <= this.timeline.logic.frameWidth) newDuration = 0;
				this.object.exitAniDuration = newDuration;
			}

			this.object.updateTimeline();

		} else {

			// Calculate the location of the easing anchors
			var entryAniFrames = this.timeline.logic.frameOf( this.object.entryAniDuration ),
				exitAniFrames = this.timeline.logic.frameOf( this.object.exitAniDuration ),
				eaEnter = this.object.beginFrame() + entryAniFrames -1,
				eaExit = this.object.endFrame() - exitAniFrames;
			if (this.object.entryAniDuration == 0) eaEnter = false;
			if (this.object.exitAniDuration == 0) eaExit = false;

			// Check for cursor switching
			if ( (relative.frame == 0) || (relative.frame == this.object.framesWide()-1) ||
				 (absolute.frame == eaEnter) || (absolute.frame == eaExit) ) {
				$(info.canvas).css('cursor', 'ew-resize');
			} else {
				$(info.canvas).css('cursor', 'default');			
			}
		}
	}

	ObjectAnimationVisual.prototype.mouseDown = function( relative, absolute, info ) {
		// Calculate the location of the easing anchors
		var entryAniFrames = this.timeline.logic.frameOf( this.object.entryAniDuration ),
			exitAniFrames = this.timeline.logic.frameOf( this.object.exitAniDuration ),
			eaEnter = this.object.beginFrame() + entryAniFrames -1,
			eaExit = this.object.endFrame() - exitAniFrames;
		if (this.object.entryAniDuration == 0) eaEnter = false;
		if (this.object.exitAniDuration == 0) eaExit = false;

		if (relative.frame == 0) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeOffset = this.object.begin;
			this.resizeDuration = this.object.duration;
			this.resizeEdge = 0;
			console.log("Begin ");
			return true;
		} else if (relative.frame == this.object.framesWide()-1) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeDuration = this.object.duration;
			this.resizeEdge = 1;
			return true;
		} else if (absolute.frame == eaEnter) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeDuration = this.object.entryAniDuration;
			this.resizeEdge = 2;
			return true;
		} else if (absolute.frame == eaExit) {
			this.resizing = true;
			this.resizeAnchor = absolute.frame;
			this.resizeDuration = this.object.exitAniDuration;
			this.resizeEdge = 3;
			return true;
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