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

		// Handle selection events
		$(this.timeline).on('selectionChanged', (function(e, tvo) {
			if (!tvo) {
				$(this).trigger('deselected');
			} else {
				var tmo = tvo.timelineObject,
					sco = tmo.sceneObject;
				
				$(this).trigger('selected', tmo, tvo, sco);

				// Focus object
				this.sceneCanvas.setControlBox( sco );
				
			}
		}).bind(this));
		$(this.sceneCanvas).on('selectionChanged', (function(e, sco) {
			if (!sco) {
				$(this).trigger('deselected');
			} else {
				var tvo = this.timeline.visualFromSceneObject(sco),
					tmo = tvo.timelineObject;
				$(this).trigger('selected', tmo, tvo, sco);
			}
		}).bind(this));

		// Set the proper dimentions
		this.resize();

		// Bind to window resize
		$(window).resize((function() {
			this.resize();
		}).bind(this));

	}

	StoryEditor.prototype.addImage = function( url ) {

		// Prepare the image object
		var imgObject = new Image();
			imgObject.src = url;

		// Create scene and timeline object
		var sco = new ImageObject( imgObject ),
			to = new ObjectAnimation( sco );

		// Store them in the stage and timeline
		this.timelineLogic.add( to );
		this.sceneCanvas.add( sco );

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