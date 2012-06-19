var DisplayManager = ( function() {

	function DisplayManager( game, elMazeCanvasId, elTimerId, elGuessFormId, elMessageId ) {
		this.game = game;

		this.elems = {
			maze : $( elMazeCanvasId ),
			timer : $( elTimerId ),
			form : $( elGuessFormId ),
			message : $( elMessageId )
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
			that.elems.timer.html( secRemaining );
		} );

		this.game.onTimeExpire( function() {
			that.elems.message.html( "You lose, asshole." );
			that.game.stop();
			that.keyhandler.disable();
		} );

		this.keyhandler = new KeyHandler( $.proxy( this.game.handleDown, this.game ), $.proxy( this.game.handleUp,
				this.game ), $.proxy( this.game.handleLeft, this.game ), $.proxy( this.game.handleRight, this.game ) );

		// Turn the keyhandler on and off when interacting with the guess box
		var elGuessBox = $( "input:first", this.elems.form );
		elGuessBox.focus( $.proxy( this.keyhandler.disable, this.keyhandler ) );
		elGuessBox.blur( $.proxy( this.keyhandler.enable, this.keyhandler ) );

		// Hook up the handler when the user guesses a word
		$( elGuessFormId ).submit( $.proxy( this.handleGuess, this ) );
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

		// TODO: this is a hack, remove
		$( '#isValid' ).text( "X: " + this.game.getX() + " - Z: " + this.game.getZ() );

		// Update the position of the player
		this.game.applyMove();

		// Did we finish the maze?
		if ( this.game.finished ) {
			this.elems.message.html( "YOU FINISHED!" );
			this.game.stop();
			this.keyhandler.disable();
		}

		// Draw scene
		this.drawer.draw();
	};

	DisplayManager.prototype.start = function() {
		this.keyhandler.enable();
		this.game.start();
		this.tick();
	};

	DisplayManager.prototype.handleGuess = function() {

		var guessedWord = $( "input:first", this.elems.form ).val();

		if ( this.game.guessWord( guessedWord ) ) {
			$( "span:first", this.elems.form ).text( "Correct!" ).show().delay( 3000 ).fadeOut( 1000 );
		} else {
			$( "span:first", this.elems.form ).text( "That's not it!" ).show().delay( 3000 ).fadeOut( 1000 );
		}

		$( "input:first", this.elems.form ).val( "" );

		return false;
	};

	return DisplayManager;
} )();