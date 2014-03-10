
PP.View = function( element, config ) {
	var cfg = config || { };

	// Setup config
	cfg.fps = cfg.fps || 25;

	// Create the clock which is going to steer the animation
	this.clock = new PP.Core.Clock(cfg.fps);

	// Create a timeline logic that is going to translate the
	// raw clock to sequenced events
	this.timeline = new PP.Core.Timeline( this.clock );

	// Create a canvas where the scene objects are going to be rendered
	this.canvas = new PP.Core.SceneCanvas( element );

};
