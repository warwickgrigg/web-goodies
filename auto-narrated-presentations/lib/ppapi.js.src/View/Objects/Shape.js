
var Shape = PP.Core.Shape = function( config, canvas, timeline ) {
	PP.Core.SceneObject.call( this, config, canvas, timeline );


};

Shape.prototype = Object.create( PP.Core.SceneObject.prototype );
