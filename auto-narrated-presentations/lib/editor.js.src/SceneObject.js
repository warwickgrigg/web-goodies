(function(glob) {

	/**
	 * Scene object is placed on scene
	 */
	var SceneObject = glob.SceneObject = function() {
		this.width = 0;
		this.height = 0;
		this.locked = true;

		this.filters = [ ];

		this.varNames = ['x','y','scalex','scaley','rotation','visible','opacity'];
		this.variables = {
			x:0, y:0, scalex:1.0, scaley:1.0, rotation:0.0, visible: true, opacity: 1.0
		};
		this.renderVariables = {
			x:0, y:0, scalex:1.0, scaley:1.0, rotation:0.0, visible: true, opacity: 1.0
		}

	}

	/**
	 * Update the filters
	 */
	SceneObject.prototype.updateVariables = function( time ) {
		for (var i=0; i<this.varNames.length; i++) {
			this.renderVariables[this.varNames[i]] = this.variables[this.varNames[i]];
		}
	}

	/**
	 * Return the bounding box for the scene object
	 */
	SceneObject.prototype.getBoundingBox = function() {

		// Calculate variables
		var w = this.width * this.renderVariables.scalex,
			h = this.height * this.renderVariables.scaley,
			x = this.renderVariables.x - w / 2.0,
			y = this.renderVariables.y - h / 2.0;

		// Return bounding box coordinates
		return {
			'left': x, 'top': y,
			'right': x+w, 'bottom': y+h,
			'width': w, 'height': h,
			'centerx' : this.renderVariables.x,
			'centery' : this.renderVariables.y,
			'rotation': this.renderVariables.rotation*Math.PI/180
		};

	}


})(window);