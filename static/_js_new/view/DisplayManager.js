var DisplayManager = ( function() {
	
	function DisplayManager( game, elMazeCanvasId, elTimerId, elGuessBoxId, elMessageId ) {
		this.game = game;
		
		this.elems = {
			maze: $( elMazeCanvasId ),
			timer: $( elTimerId ),
			guessBox: $( elGuessBoxId ),
			message: $( elMessageId )
		};
		
		try {
			this.drawer = new MazeDrawer( this.elems.maze, game );
		}
		catch ( e ) {
			// TODO: populate message element with error
			alert( "Unable to create maze drawer: " + e.message );
		}
		
		var that = this;
		
		this.keyhandler = new KeyHandler(
			$.proxy( this.game.handleDown, this.game ),	
			$.proxy( this.game.handleUp, this.game ),
			$.proxy( this.game.handleLeft, this.game ),
			$.proxy( this.game.handleRight, this.game )
		);
	}
	
	DisplayManager.prototype.drawMaze = function() {
		this.drawer.draw();
	};
	
	DisplayManager.prototype.drawTimer = function() {
		var timeLeft = this.game.getTimeLeft();
		this.elems.timer.html( timeLeft );
	};

	DisplayManager.prototype.tick = function() {
		
		requestAnimFrame( $.proxy( this.tick, this ) );

		this.keyhandler.handleKeys();
		
		// TODO: this is a hack, remove
		$('#isValid').text("X: " + this.game.getX() + " - Z: " + this.game.getZ());

		/*
		TODO:
		
		// Is (new x, old z) a valid position?
		if ( App.getMaze().isValidPosition( App.getX(), App.getPriorZ() ) ) {

			// If so, update x to new x
			App.registerX();
		} else {
			App.revertX();
		}

		// Is (x, new z) a valid position ?
		if ( App.getMaze().isValidPosition( App.getX(), App.getZ() ) ) {

			// If so, update z to new z
			App.registerZ();
		} else {
			App.revertZ();
		}
		*/

		// Draw scene
		this.drawer.draw();
	};
	
	DisplayManager.prototype.start = function() {
		this.keyhandler.enable();
		this.game.start();
		this.tick();
	};


	return DisplayManager;
} )();