/*
 * Constructor for new KeyHandler objects
 */
function KeyHandler(onDown, onUp, onLeft, onRight) {
	this.enabled = false;
	this.currentlyPressedKeys = {};
	
	this.onDown = onDown;
	this.onUp = onUp;
	this.onLeft = onLeft;
	this.onRight = onRight;
	
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
		this.onDown();
	}
	// Up arrow
	else if ( this.currentlyPressedKeys[ 38 ] ) {
		this.onUp();
	}

	// Left arrow
	if ( this.currentlyPressedKeys[ 37 ] ) {
		this.onLeft();
	}
	// Right arrow
	else if ( this.currentlyPressedKeys[ 39 ] ) {
		this.onRight();
	}
};

KeyHandler.prototype.enable = function() {
	this.enabled = true;
};

KeyHandler.prototype.disable = function() {
	this.enabled = false;
	this.currentlyPressedKeys = {};
};