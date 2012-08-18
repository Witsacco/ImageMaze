var DisplayManager = ( function() {

	function DisplayManager( game, elMazeCanvasId, elTimerId, elCurrentGuessId, elMessageId, elStartButtonId, elUserPositionId ) {
		this.game = game;

		// This holds the guess as the user types it but before submission
		this.currentGuess = "";
		
		this.elems = {
			maze : $( elMazeCanvasId ),
			timer : $( elTimerId ),
			currentGuess : $( elCurrentGuessId ),
			message : $( elMessageId ),
			startButton : $( elStartButtonId ),
			userPosition : $( elUserPositionId )
		};

		try {
			this.drawer = new MazeDrawer( this.elems.maze, game );
		} catch ( e ) {
			// TODO: populate message element with error
			alert( "Unable to create maze drawer: " + e.message );
		}

		var that = this;

		// Give the game instructions on what to do when the timer changes
		this.game.onTimeChange( function( secRemaining ) {
			var clockString = secRemaining.toString();
			
			if ( secRemaining > 9 ) {
				clockString = "0:" + clockString;
			}
			else {
				clockString = "0:0" + clockString;
			}
			
			that.elems.timer.html( clockString );
		} );

		this.game.onTimeExpire( function() {
			var word = that.game.getCurrentWord();
			that.stop( "You lost. The word was: " + word + "." );
		} );

		var onDown = $.proxy( this.game.handleDown, this.game );
		var onUp = $.proxy( this.game.handleUp, this.game );
		var onLeft = $.proxy( this.game.handleLeft, this.game );
		var onRight = $.proxy( this.game.handleRight, this.game );
		var onLetter = $.proxy( this.updateGuess, this );
		var onBackspace = $.proxy( this.backspaceGuess, this ); 
		var onEscape = $.proxy( this.clearGuess, this );
		var onEnter = $.proxy( this.handleGuess, this );
		
		this.keyhandler = new KeyHandler( onDown, onUp, onLeft, onRight, onLetter, onBackspace, onEscape, onEnter );

		// Turn the keyhandler on and off when interacting with the guess box
//		var elGuessBox = $( "input:first", this.elems.form );
//		elGuessBox.focus( $.proxy( this.keyhandler.disable, this.keyhandler ) );
//		elGuessBox.blur( $.proxy( this.keyhandler.enable, this.keyhandler ) );
//
//		// Hook up the handler when the user guesses a word
//		$( elGuessFormId ).submit( $.proxy( this.handleGuess, this ) );
	}

	DisplayManager.prototype.drawMaze = function() {
		this.drawer.draw();
	};

	DisplayManager.prototype.drawTimer = function() {
		var timeLeft = this.game.getTimeLeft();
		this.elems.timer.html( timeLeft );
	};

	DisplayManager.prototype.tick = function() {

		if ( this.game.finished === false ) {
			requestAnimFrame( $.proxy( this.tick, this ) );
		}

		this.keyhandler.handleKeys();

		// Update the user's position on the front end, for debugging
		this.elems.userPosition.text(
			"X: " + this.game.getX() + "\n" +
			"Z: " + this.game.getZ()
		);

		// Update the position of the player
		this.game.applyMove();

		// Did we finish the maze?
		if ( this.game.finished ) {
			this.stop( "You FINISHED!" );
		}

		// Draw scene
		this.drawer.draw();
	};

	DisplayManager.prototype.start = function() {
		// Hide the start button
		this.elems.startButton.hide();

		// Enable the key handler to respond to keys
		this.keyhandler.enable();

		// Make sure the message element is clear
		this.showMessage( "", false );

		// Start the game!
		this.game.start();

		// Tell the browser to start ticking
		this.tick();
	};

	DisplayManager.prototype.stop = function( finishMessage ) {
		// Stop the game
		this.game.stop();

		// Show the message we finished with
		this.showMessage( finishMessage, false );

		// Show the start button again
		this.elems.startButton.show();

		// Tell the keyhandler to stop listening to input
		this.keyhandler.disable();
	};

	DisplayManager.prototype.handleGuess = function() {

		var guessWasCorrect = this.game.guessWord( this.currentGuess );
		
		if ( guessWasCorrect ) {
			this.showMessage( "Correct!", true );
		} else {
			this.showMessage( "That's not it!", true );
		}

		// Reset current guess (and update display)
		this.clearGuess();
		
		return false;
	};

	DisplayManager.prototype.clearGuess = function() {
		
		// Reset the current guess
		this.currentGuess = "";
		
		// Update display of guess
		this.elems.currentGuess.text( this.currentGuess );
		
	};
	
	DisplayManager.prototype.updateGuess = function( newLetter ) {
		
		// Update our guess in memory
		this.currentGuess += newLetter;
		
		// Show the update on the display
		this.elems.currentGuess.text( this.currentGuess );
		
	};
	
	DisplayManager.prototype.backspaceGuess = function() {
		
		// Chop off the last letter
		this.currentGuess = this.currentGuess.substring( 0, this.currentGuess.length - 1 );
		
		// Show the update on the display
		this.elems.currentGuess.text( this.currentGuess );
		
	};
	
	DisplayManager.prototype.showMessage = function( message, fadeItOut ) {
		this.elems.message.text( message ).stop( true ).css({ opacity: 1 }).show();
		
		if ( fadeItOut ) {
			this.elems.message.animate({ opacity: 1 }, 3000).fadeOut( 1000 );
		}		
	};
	
	return DisplayManager;
} )();