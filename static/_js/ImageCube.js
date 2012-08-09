var ImageCube = ( function() {
	
	var cubeType = "ImageCube";

	function ImageCube( cubeNumber ) {
		
		this.cubeNumber = cubeNumber;
		
	}
	
	ImageCube.prototype = new Cube();
	ImageCube.prototype.constructor = ImageCube;
	
	ImageCube.prototype.getCubeNumber = function() {
		return this.cubeNumber;
	};
	
	ImageCube.prototype.getType = function() {
		return cubeType;
	};
	
	return ImageCube;
} )();