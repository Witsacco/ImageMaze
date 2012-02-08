ImageCube.prototype = new Cube();
ImageCube.prototype.constructor = ImageCube;


function ImageCube( cubeNumber ) {
	
	this.cubeNumber = cubeNumber;
	
}

ImageCube.prototype.getCubeNumber = function() {
	return this.cubeNumber;
};