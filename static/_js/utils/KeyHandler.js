/*
 * Constructor for new KeyHandler objects
 */
function KeyHandler(onDown, onUp, onLeft, onRight, onLetter, onBackspace, onEscape, onEnter ) {
	this.enabled = false;
	this.currentlyPressedKeys = {};
	
	document.onkeydown = $.proxy( this.handleKeyDown, this );
	document.onkeyup = $.proxy( this.handleKeyUp, this );

	this.onDown = onDown;
	this.onUp = onUp;
	this.onLeft = onLeft;
	this.onRight = onRight;
	this.onLetter = onLetter;
	this.onBackspace = onBackspace;
	this.onEscape = onEscape;
	this.onEnter = onEnter;
	
	return this;
}

/*
 * Register the currently pressed key as having been pressed
 */
KeyHandler.prototype.handleKeyDown = function( event ) {

	if ( !this.enabled ) {
		return;
	}

	var keyCode = event.keyCode;
	
	this.currentlyPressedKeys[ keyCode ] = true;

	// If a modifier key is being held, bubble up input
	if ( event.ctrlKey || event.altKey || event.metaKey ) {
		return;
	}
	// If escape key
	else if ( keyCode === 27 ) {
		this.onEscape();
	}
	// If enter key
	else if ( keyCode === 13 ) {
		this.onEnter();
	}
	else if ( keyCode === 8 ) {
		this.onBackspace();
	}
	else {

		// Convert key code to character
		var char = String.fromCharCode( keyCode ).toLowerCase();
		
		// If the key pressed was a letter, invoke the "onLetter" callback and pass it the letter
		if ( char >= "a" && char <= "z" ) {
			this.onLetter( char );
		}
	}
	
	event.preventDefault();
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