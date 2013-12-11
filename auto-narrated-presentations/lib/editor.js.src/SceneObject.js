(function(glob) {

	/**
	 * Scene object is placed on scene
	 */
	var SceneObject = glob.SceneObject = function() {
		this.width = 0;
		this.height = 0;

		this.filters = [ ];

		this.variables = {
			x:0, y:0, scalex:1.0, scaley:1.0, rotation:0.0, visible: true
		};
		this.renderVariables = {
			x:0, y:0, scalex:1.0, scaley:1.0, rotation:0.0, visible: true
		}

	}

	/**
	 * Update the filters
	 */
	SceneObject.prototype.updateVariables = function( time ) {
		var vars=['x','y','scalex','scaley','rotation','visible'];
		for (var i=0; i<vars.length; i++) {
			this.renderVariables[vars[i]] = this.variables[vars[i]];
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
			'centerx' : x + w/2,
			'centery' : y + h/2,
			'rotation': this.renderVariables.rotation*Math.PI/180
		};

	}


})(window);