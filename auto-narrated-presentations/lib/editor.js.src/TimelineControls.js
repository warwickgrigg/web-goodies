(function(glob) {

	/**
	 * TimelineControls is an object that controls the timeline and the clock
	 */
	var TimelineControls = glob.TimelineControls = function( timeline ) {

		// Prepare variables
		this.timeline = timeline;
		this.clock = this.timeline.clock;

		// Prepare host element
		this.element = $('<div id="timeline-controls"></div>');

		// Prepare control elements
		this.btnRewind = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-fast-backward"></span></button>');
		this.btnPlay = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-play"></span></button>');
		this.btnStop = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-stop"></span></button>');

		// Nest everything
		this.element.append( this.btnRewind );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnPlay );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnStop );

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

	}


})(window);