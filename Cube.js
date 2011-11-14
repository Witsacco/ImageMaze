function Cube( top, bottom, left, right ) {
	this.top = top;
	this.bottom = bottom;
	this.left = left;
	this.right = right;
}

Cube.prototype.draw = function() {
	
};

function getCube( type ) {
	var left = 0;
	var right = 0;
	var bottom = 0;
	var top = 0;
	
	switch ( type ) {
		case "top" :
			left = 1;
			right = 1;
			bottom = 1;
			break;
		case "left" :
			top = 1;
			right = 1;
			bottom = 1;
			break;
		case "right" :
			top = 1;
			left = 1;
			bottom = 1;
			break;
		case "bottom" :
			left = 1;
			right = 1;
			top = 1;
			break;
		case "top-left" :
			right = 1;
			bottom = 1;
			break;
		case "top-right" :
			left = 1;
			bottom = 1;
			break;
		case "bottom-left" :
			top = 1;
			right = 1;
			break;
		case "bottom-right" :
			top = 1;
			left = 1;
			break;
		case "top-bottom" :
			left = 1;
			right = 1;
			break;
		case "left-right" :
			top = 1;
			bottom = 1;
			break;
		case "left-top-right" :
			bottom = 1;
			break;
		case "top-right-bottom" :
			left = 1;
			break;
		case "left-bottom-right" :
			top = 1;
			break;
		case "top-left-bottom" :
			right = 1;
			break;
		case "all" :
			top = 1;
			bottom = 1;
			left = 1;
			right = 1;
			break;
		case "none" :
			break;
		default :
			throw "Unrecognized cube type!";
	}
	
	return new Cube( top, bottom, left, right )
}