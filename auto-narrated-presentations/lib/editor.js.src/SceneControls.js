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
		this.btnCreate = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus"></span></button>');
		this.btnDrawPath = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-pencil"></span></button>');
		this.btnSettings = $('<button type="button" class="btn btn-default btn-sm pull-right"><span class="glyphicon glyphicon-cog"></span></button>');
		this.btnRecord = $('<button type="button" class="btn btn-danger btn-sm pull-right"><span class="glyphicon glyphicon-record"></span></button>');

		var eDropdownGroup = $('<div class="btn-group "></div>'),
			eCreate = $('<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown"><span class="glyphicon glyphicon-plus"></span> Create <span class="caret"></span></button>'),
			eUL = $('<ul class="dropdown-menu" role="menu"></ul>');

		// Create dropdown elements
		this.btnImage = $('<li><a href="#">Image</a></li>');


		// Prepare dropdown
		eDropdownGroup.append( eCreate );
		eCreate.append( eUL );
		eUL.append( this.btnImage );
		eCreate.dropdown();

		// Nest everything
		this.element.append( eDropdownGroup );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnDrawPath );
		this.element.append( $('<span>&nbsp;</span>') );

		this.element.append( this.btnRecord );
		this.element.append( $('<span class="pull-right">&nbsp;</span>') );
		this.element.append( this.btnSettings );

		// Bind events
		$(this.btnCreate).click((function() {

		}).bind(this));

	}


})(window);