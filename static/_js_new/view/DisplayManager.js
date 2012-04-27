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
		}
		
		var that = this;
		
		this.keyhandler = new KeyHandler(
			that.game.handleDown,	
			that.game.handleUp,	
			that.game.handleLeft,	
			that.game.handleRight
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
		this = that;
		
		requestAnimFrame( function() {
			that.tick();
		} );

		this.keyhandler.handleKeys();

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
		this.game.start();
		this.tick();
	};


	return DisplayManager;
} )();