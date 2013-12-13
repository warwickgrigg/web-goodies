
(function(glob){

	// Require JQuery
	if (jQuery == undefined) {
		console.error("jQuery is required by the VocalPresentation.");
		return;
	}
	var $ = jQuery;

	/**
	 * Create a new timeline object
	 */
	var Timeline = function(editor) {

		// Reset variables
		this.scale = 1.0;
		this.playCursor = 0.0;
		this.mouseCursor = 0.0;
		this.words = [ ];
		this.duration = 0.0;
		this.audio = null;

		// Prepare elements
		this.element = $('<div class="peTimeline"></div>');
		this.elmWordframe = $('<div class="wordframe"></div>');
		this.elmCursor = $('<div class="cursor"></div>');
		this.elmPlayFrame = $('<div class="playframe"></div>');

		// Nest elements
		this.element.append( this.elmPlayFrame );
		this.element.append( this.elmWordframe );
		this.element.append( this.elmCursor );

		// Move cursor with mouse
		$(this.element).mousemove( (function(e) {

			// Calculate the position in pixels of the mouse cursor
			var scrollPos = this.element.scrollLeft(),
				targetPos = $(this.element).position(),
				xPos = e.pageX + scrollPos - targetPos.left;

			// Calculate the position in milliseconds of the mouse
			this.mouseCursor = xPos / this.scale;
			$(this).trigger('timeMove', this.mouseCursor);

			// Update cursor position
			this.elmCursor.css({
				'left': xPos
			});

		}).bind(this) );

		// Fire click events
		$(this.element).mousedown( (function(e) {
			$(this).trigger('timeClick', this.mouseCursor);
		}).bind(this) );

		// Rescale with wheel
		$(this.element).bind('mousewheel', (function(e) {
		    if(e.originalEvent.wheelDelta / 120 > 0) {
		        this.rescale( this.scale + 0.025 );
		    } else {
		    	if (this.scale > 0.05) {
		        	this.rescale( this.scale - 0.025 );
		    	}
		    }
		}).bind(this) );

	}

	/**
	 * Update words array
	 */
	Timeline.prototype.update = function(data) {

		// Update arrays
		this.words = data['words'];
		this.duration = data['duration'];

		// Update window by rescaling
		this.rescale();

	}

	/**
	 * Rescale the timeline
	 */
	Timeline.prototype.rescale = function(scale) {

		// Get/Update scale
		if (scale == undefined) scale = this.scale;
		this.scale = scale;

		// Rebuild elements in word frame
		this.elmWordframe.empty();
		var borderPadding = 2;
		for (var i=0; i<this.words.length; i++) {
			var ofs = Number(this.words[i][0]),
				word = this.words[i][1],
				elm = $('<span>' + word + '</span>');

			// Get the next element offset
			var end = this.duration;
			if (i+1<this.words.length) {
				end = Number(this.words[i+1][0]);
			}

			// Calculate item width
			var itemW = (end - ofs) * scale - borderPadding*2;

			// Set item width
			console.log(itemW);
			$(elm).css({
				'width': itemW,
			});

			// First item gets an offset
			if (i == 0) {
				$(elm).css({
					'margin-left': ofs*scale
				});
			}
			this.elmWordframe.append(elm);
		}

		// Update host element width
		this.elmWordframe.css({
			'width': this.duration*scale + borderPadding*2 + 5
		});

		// Update play frame width
		this.elmPlayFrame.css({
			'width': (this.playCursor * 1000) * this.scale
		});


	}

	/**
	 * Set the audio object linked with this timeline
	 */
	Timeline.prototype.setAudio = function(audio) {
		this.audio = audio;

	}

	/**
	 * Set the position of the play buffer (in seconds)
	 */
	Timeline.prototype.setPlaybackCursor = function(time) {

		// Convert to scaled milliseconds
		if (this.playCursor == time) return;
		this.playCursor = time;

		// Set playback frame width
		this.elmPlayFrame.css({
			'width': (time * 1000) * this.scale
		});

	}

	/**
	 * Create a new presentation editor
	 */
	var PresentationEditor = glob.PresentationEditor = function(host, config) {
		var conf = config || { };
		this.apiURL = conf.apiURL || "voiceapi.php";

		// Reset variables
		this.audio = false;

		// Create and bind to timeline
		this.timeline = new Timeline(this);
		$(this.timeline).on('timeClick', (function(e, posMs) {
			if (this.audio != false) {
				this.audio.pause();
				this.audio.currentTime = posMs/1000;
				this.audio.play();
			}
		}).bind(this));
		
		// Create elements
		this.elmHost = $('<div class="peCore"></div>');
		this.elmTimeline = this.timeline.element;
		this.elmCanvas = $('<div class="peCanvas"></div>');
		this.cvCanvas = document.createElement('canvas');

		// Nest elements
		$(host).append( this.elmHost );
		this.elmHost.append( this.elmTimeline );
		this.elmHost.append( this.elmCanvas );
		this.elmCanvas.append( this.cvCanvas );

		// Setup UI update timer
		this.updateTimer = setInterval(this.updateUI.bind(this), 16);

	};

	PresentationEditor.prototype.updateUI = function() {
		if (this.audio != false)
			this.timeline.setPlaybackCursor( this.audio.currentTime );
	}

	PresentationEditor.prototype.buildText = function(text, voice) {

		var buf = '{"id":"359954382_d394bc431e268","soundURL":"http://vaas.acapela-group.com/MESSAGES/009086065076095086065065083/EVAL_1890721/sounds/359954382_d394bc431e268.mp3","wordURL":"http://vaas.acapela-group.com/MESSAGES/009086065076095086065065083/EVAL_1890721/sounds/359954382_d394bc431e268.wp.txt","duration":"8300.77","size":"50478","words":[["49","Hello"],["397","world."],["1553","This"],["1761","is"],["1874","a"],["1927","test"],["2561","to"],["2703","see"],["3017","how"],["3175","we"],["3281","can"],["3479","create"],["3871","a"],["3918","simple"],["4375","timeline"],["4943","based"],["5291","on"],["5462","vocal"],["5807","words."],["6933","Does"],["7117","it"],["7249","look"],["7442","good?"]],"res":"ok"}';

		var handleResponse = (function(data) {
			console.log(JSON.stringify(data));

			// Update timeline
			this.timeline.update( data );

			// Release past audio
			if (this.audio != false) {
				this.audio.pause();
				this.audi = null;
			}

			// Create new audio
			this.audio = new Audio();
			this.audio.src = data['soundURL'];
			this.audio.play();

		}).bind(this);

		//handleResponse(JSON.parse(buf));
		//return;

		// Contact VoiceAPI and generate new text
		$.ajax({
				url: this.apiURL,
				data: {
					'voice': voice,
					'text': text
				},
				dataType: 'json',
				success: handleResponse
			});

	}

})(window);