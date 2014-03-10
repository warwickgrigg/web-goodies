
/**
 * The visual area where objects can be placed and manipulated
 */
PP.Core.SceneCanvas = function( host, config ) {
	var elm = $(host),
		cfg = config || { };

	// Populate default parameters
	this.width = cfg.width || 800;
	this.height = cfg.height || 600;

	// Setup canvas
	if (elm.is("canvas")) {
		this.canvas = new fabric.Canvas(elm[0]);
		this.width = elm.width();
		this.height = elm.height();
	} else {
		var canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		elm.append(canvas);
		this.canvas = new fabric.Canvas(canvas);		
	}

};

PP.Core.SceneCanvas.addObject = function( class, visualConfig, timeConfig ) {

}