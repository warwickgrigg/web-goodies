
var SceneObject = PP.Core.SceneObject = function( config, canvas, timeline ) {
	Callbacks.call( this );

	// Register callbacks
	this.supportCallback("place");	// Timeline: We were placed on the canvas
	this.supportCallback("update");	// Timeline: Our values got updated
	this.supportCallback("enter");	// Timeline: The cursor entered our timeline span
	this.supportCallback("exit");	// Timeline: The cursor exited our timeline span

	// Keep refrences
	this.canvas = canvas;
	this.timeline = timeline;

	// Default rendering variables
	this.variables = {
		'angle': 0, 'left': 0, 'top': 0, 'width': 0, 'height': 0, 'fill': '', 'stroke': '',
		'opacity': 1.0, 'scaleX': 0, 'scaleY': 0
	};

	// Default timeline variables
	this.timeline = {
		
	};

};

SceneObject.prototype = Object.create( Callbacks.prototype );
