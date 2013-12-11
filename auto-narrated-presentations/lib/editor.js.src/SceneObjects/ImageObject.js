(function(glob) {

	/**
	 * Scene object is placed on scene
	 */
	var ImageObject = glob.ImageObject = function( image ) {
		glob.SceneObject.call( this );

		// Set image information
		this.image = image;
		this.width = image.width;
		this.height = image.height;

		// Update image size when it's eventually loaded
		$(this.image).load((function(){
			this.width = image.width;
			this.height = image.height;
		}).bind(this));

	}

	ImageObject.prototype = Object.create( glob.SceneObject.prototype );

	/**
	 * Render the image
	 */
	ImageObject.prototype.render = function( ctx ) {
		if (!this.renderVariables.visible) return;

		// Render image
		ctx.save();
		ctx.translate( this.renderVariables.x, this.renderVariables.y );
		ctx.scale( this.renderVariables.scalex, this.renderVariables.scaley );
		ctx.rotate( this.renderVariables.rotation*Math.PI/180 );
		ctx.drawImage( this.image, -this.width/2, -this.height/2 );
		ctx.restore();
		
	}

})(window);