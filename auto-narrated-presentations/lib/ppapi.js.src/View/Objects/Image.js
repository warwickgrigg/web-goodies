
var Image = PP.Core.Image = function( config, canvas, timeline ) {
	PP.Core.SceneObject.call( this, config, canvas, timeline );


};

Image.prototype = Object.create( PP.Core.SceneObject.prototype );
