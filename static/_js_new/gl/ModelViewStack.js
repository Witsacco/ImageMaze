function ModelViewStack( mat4 ) {
	this.matrix = mat4;
	this.stack = [];

	return this;
}

ModelViewStack.prototype.push = function( mvMatrix ) {
	var copy = this.matrix.create();
	this.matrix.set( mvMatrix, copy );
	this.stack.push( copy );
}

ModelViewStack.prototype.pop = function() {
	if ( this.stack.length === 0 ) {
		throw "Invalid popMatrix!";
	}

	return this.stack.pop();
}