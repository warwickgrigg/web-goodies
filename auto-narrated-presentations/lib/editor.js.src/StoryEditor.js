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

		// Setup timeline controls
		this.timelineControls = new TimelineControls( this.timelineLogic );

		// Crate scene canvas
		this.sceneCanvas = new SceneCanvas( this.timelineLogic );

		// Crate scene canvas
		this.sceneControls = new SceneControls( this.sceneCanvas );

		// Nest visual components
		var sceneHost = $('<p class="text-center story-back">');
		$(this.container).append( this.sceneControls.element );
		$(sceneHost).append( this.sceneCanvas.canvas );
		$(this.container).append( sceneHost );
		$(this.container).append( this.timeline.canvas );
		$(this.container).append( this.timelineControls.element );

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
		this.timeline.resize( width, 200 );
		this.sceneCanvas.resize( 800, 400 );

	}


})(window);