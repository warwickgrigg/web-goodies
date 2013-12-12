(function(glob) {

	/**
	 * SceneControls is an object that introduces editing capabilities to the canvas
	 */
	var SceneControls = glob.SceneControls = function( scene ) {

		// Prepare variables
		this.scene = scene;

		// Prepare host element
		this.element = $('<div class="canvas-controls"></div>');

		// Prepare control elements
		this.btnCreate = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus-sign"></span></button>');
		this.lblTime = $('<span>00:00.000</span>');

		// Nest everything
		this.element.append( this.btnCreate );
		this.element.append( $('<span>&nbsp;</span>') );

		// Bind events
		$(this.btnCreate).click((function() {

		}).bind(this));

	}


})(window);