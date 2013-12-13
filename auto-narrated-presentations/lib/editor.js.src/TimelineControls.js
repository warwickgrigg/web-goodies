(function(glob) {

	/**
	 * TimelineControls is an object that controls the timeline and the clock
	 */
	var TimelineControls = glob.TimelineControls = function( timeline ) {

		// Prepare variables
		this.timeline = timeline;
		this.clock = this.timeline.clock;

		// Prepare host element
		this.element = $('<div class="timeline-controls"></div>');

		// Prepare control elements
		this.btnRewind = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-fast-backward"></span></button>');
		this.btnPlay = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-play"></span></button>');
		this.btnStop = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-stop"></span></button>');
		this.lblTime = $('<span>00:00.000</span>');

		// Nest everything
		this.element.append( this.btnRewind );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnPlay );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnStop );
		this.element.append( $('<span>&nbsp;&nbsp;&nbsp;</span>') );
		this.element.append( this.lblTime );

		// Bind events
		$(this.btnRewind).click((function() {
			this.clock.set(0);
		}).bind(this));
		$(this.btnPlay).click((function() {
			this.clock.start();
		}).bind(this));
		$(this.btnStop).click((function() {
			this.clock.stop();
		}).bind(this));

		// Bind clock events
		$(this.clock).on('clockStart', (function() {
			this.btnPlay.removeClass( 'btn-default' );
			this.btnPlay.addClass( 'btn-warning' );
			this.btnStop.removeClass( 'btn-warning' );
			this.btnStop.addClass( 'btn-default' );
		}).bind(this));
		$(this.clock).on('clockStop', (function() {
			this.btnStop.removeClass( 'btn-default' );
			this.btnStop.addClass( 'btn-warning' );
			this.btnPlay.removeClass( 'btn-warning' );
			this.btnPlay.addClass( 'btn-default' );
		}).bind(this));

		// Check what's the default button state
		if (this.clock.running) {
			this.btnPlay.removeClass( 'btn-default' );
			this.btnPlay.addClass( 'btn-warning' );
		} else {
			this.btnStop.removeClass( 'btn-default' );
			this.btnStop.addClass( 'btn-warning' );
		}

		// Update clock on changes
		this.clock.onTick( (function(time, delta){
			var secs = parseInt(time / 1000),
				min = parseInt(Math.round( secs / 60 )),
				sec = secs % 60,
				msec = parseInt(time) % 1000;

			var strMin = String(min),
				strSec = String(sec),
				strMsec = String(msec);

			if (strMin.length == 1) strMin = "0" + strMin;
			if (strSec.length == 1) strSec = "0" + strSec;
			if (strMsec.length < 3) strMsec = new Array( 3-strMsec.length+1 ).join("0") + strMsec;

			this.lblTime.html(strMin + ":" + strSec + "." + strMsec);


		}).bind(this));

	}


})(window);