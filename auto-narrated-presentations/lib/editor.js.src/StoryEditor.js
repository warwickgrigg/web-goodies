(function(glob){

	/**
	 * The visual editor component that contains everything else
	 */
	var StoryEditor = glob.StoryEditor = function( container ) {

		// Locate container element
		this.container = $(container);
		if (this.container.length == 0) {
			console.error("Could not find element ", container);
			return;
		}

		// Setup clock
		this.clock = new Clock();

		// Setup timeline logic
		this.timelineLogic = new TimelineLogic( this.clock );

		// Setup timeline visualizer
		this.timeline = new TimelineCanvas( this.timelineLogic );
		$(this.container).append( this.timeline.canvas );

		// Set the proper dimentions
		this.resize();

		// Bind to window resize
		$(window).resize((function() {
			this.resize();
		}).bind(this));

	}

	StoryEditor.prototype.resize = function() {
		var width = this.container.innerWidth(),
			height = this.container.innerHeight()-5;

		// Resize timeline canvas
		console.log(width, height)
		this.timeline.resize( width, height );

	}

})(window);