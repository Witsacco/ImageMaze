/*
 * Constructor for new KeyHandler objects
 */
function KeyHandler() {
	this.enabled = false;
	this.currentlyPressedKeys = {};
	return this;
}

/*
 * Register the currently pressed key as having been pressed
 */
KeyHandler.prototype.handleKeyDown = function( event ) {
	if (this.enabled) {
		this.currentlyPressedKeys[ event.keyCode ] = true;
	}
};

/*
 * Unregister the key that was recently pressed
 */
KeyHandler.prototype.handleKeyUp = function( event ) {
	if (this.enabled) {
		this.currentlyPressedKeys[ event.keyCode ] = false;
	}
};

/*
 * Adjust the position based on the currently pressed keys
 */
KeyHandler.prototype.handleKeys = function( pos ) {
	// Down arrow
	if ( this.currentlyPressedKeys[ 40 ] ) {
		pos.x -= ( 0.05 * Math.sin( pos.xRot ) );
		pos.z += ( 0.05 * Math.cos( pos.xRot ) );
	}
	// Up arrow
	else if ( this.currentlyPressedKeys[ 38 ] ) {
		pos.x += ( 0.05 * Math.sin( pos.xRot ) );
		pos.z -= ( 0.05 * Math.cos( pos.xRot ) );
	}

	// Left arrow
	if ( this.currentlyPressedKeys[ 37 ] ) {
		pos.xRot -= 0.05;
	}
	// Right arrow
	else if ( this.currentlyPressedKeys[ 39 ] ) {
		pos.xRot += 0.05;
	}
};

KeyHandler.prototype.enable = function() {
	this.enabled = true;
};

KeyHandler.prototype.disable = function() {
	this.enabled = false;
	this.currentlyPressedKeys = {};
};