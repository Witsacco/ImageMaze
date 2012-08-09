var FinishCube = ( function() {

	var cubeType = "FinishCube";

	function FinishCube() {

	}

	FinishCube.prototype = new Cube();
	FinishCube.prototype.constructor = FinishCube;

	FinishCube.prototype.getType = function() {
		return cubeType;
	};

	return FinishCube;
} )();