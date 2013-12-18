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
			eCreateBtn = $('<button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-plus"></span> Create <span class="caret"></span></button>'),
			eUL = $('<ul class="dropdown-menu text-left" role="menu"></ul>');

		// Create dropdown elements
		this.btnImage = $('<li><a href="#"><span class="glyphicon glyphicon-picture"></span> Image</a></li>');
		this.btnText = $('<li><a href="#"><span class="glyphicon glyphicon-font"></span> Text</a></li>');
		this.btnDoodle = $('<li><a href="#"><span class="glyphicon glyphicon-pencil"></span> Doodle</a></li>');

		// Prepare dropdown
		eDropdownGroup.append( eCreateBtn );
		eCreateBtn.append( eUL );
		eUL.append( this.btnImage );
		eUL.append( this.btnText );
		eUL.append( this.btnDoodle );

		// Nest everything
		this.element.append( eDropdownGroup );
		this.element.append( $('<span>&nbsp;</span>') );
		this.element.append( this.btnDrawPath );
		this.element.append( $('<span>&nbsp;</span>') );

		this.element.append( this.btnRecord );
		this.element.append( $('<span class="pull-right">&nbsp;</span>') );
		this.element.append( this.btnSettings );

		// Prepare modals
		this.prepareImageModal();

		// Helper function to hide the menu
		var hideMenu = function(e) {
			e.stopPropagation();
			e.preventDefault();
			eCreateBtn.removeClass('active');
			eUL.hide();			
		}

		// Bind events
		$(eCreateBtn).click((function(e) {
			e.stopPropagation();
			e.preventDefault();
			eCreateBtn.addClass('active');
			eUL.show();
		}).bind(this));
		$(document.body).click((function(e) {
			hideMenu(e);
		}).bind(this));

		$(this.btnImage).click((function(e) {
			hideMenu(e);
			$(this.modalImage).modal();
		}).bind(this));

		$(this.btnText).click((function(e) {
			hideMenu(e);
		}).bind(this));

		$(this.btnDoodle).click((function(e) {
			hideMenu(e);
		}).bind(this));


	}


	SceneControls.prototype.prepareImageModal = function() {

		// Create modals
		this.modalImage = $('<div class="modal fade"></div>');
		var eDialog = $('<div class="modal-dialog"></div>'),
			eContent = $('<div class="modal-content"></div>'),
			eHeader = $('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">Insert new image</h4></div>'),
			eBody = $('<div class="modal-body"></div>'),
			eFooter = $('<div class="modal-footer">'),

			eBtnClose = $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'),
			eBtnSave = $('<button type="button" class="btn btn-primary">Insert</button>'),

			eTabs = $('<ul class="nav nav-tabs"></ul>'),
			eTabSearch = $('<li class="active"><a href="#image-search">Search</a></li>'),
			eTabUpload = $('<li><a href="#image-upload">Upload</a></li>');

		this.modalImage.append(eDialog);
		eDialog.append(eContent);
		eContent.append(eHeader);
		eContent.append(eBody);
		eContent.append(eFooter);

		eFooter.append(eBtnClose);
		eFooter.append(eBtnSave);

		eBody.append(eTabs);
		eTabs.append(eTabSearch);
		eTabs.append(eTabUpload);

		eTabSearch.click(function(e){ e.preventDefault(); $(this).tab('show') });
		eTabUpload.click(function(e){ e.preventDefault(); $(this).tab('show') });

		$(document.body).append(this.modalImage);

	}

})(window);