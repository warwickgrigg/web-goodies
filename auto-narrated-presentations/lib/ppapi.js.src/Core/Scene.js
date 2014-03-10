
var Scene = PP.Core.Scene = function() {
	Callbacks.call( this );

	// Callbacks
	this.supportCallback("objectAdded");
	this.supportCallback("objectRemoved");

	// Prepare variables
	this.objects = [ ];

};

Scene.prototype = Object.create( Callbacks.prototype );

