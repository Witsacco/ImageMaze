function KeyHandler() {
	this.currentlyPressedKeys = {};
	return this;
}

KeyHandler.prototype.handleKeyDown = function( event ) {
	this.currentlyPressedKeys[ event.keyCode ] = true;
};

KeyHandler.prototype.handleKeyUp = function( event ) {
	this.currentlyPressedKeys[ event.keyCode ] = false;
};

KeyHandler.prototype.handleKeys = function( pos ) {
	if ( this.currentlyPressedKeys[ 40 ] ) {
		// Down arrow
		
		pos.x += ( 0.05 * Math.sin( pos.xRot ) );
		pos.z -= ( 0.05 * Math.cos( pos.xRot ) );
	} else if ( this.currentlyPressedKeys[ 38 ] ) {
		// Up arrow

		pos.x -= ( 0.05 * Math.sin( pos.xRot ) );
		pos.z += ( 0.05 * Math.cos( pos.xRot ) );
	}
	
	if ( this.currentlyPressedKeys[ 37 ] ) {
		// Left arrow
		pos.xRot -= 0.05;
	} else if ( this.currentlyPressedKeys[ 39 ] ) {
		// Right arrow
		pos.xRot += 0.05;
	}
}
