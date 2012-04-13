var DisplayManager = ( function() {
	
	function DisplayManager( game, elMazeCanvasId, elTimerId, elGuessBoxId, elMessageId ) {
		this.game = game;
		
		this.elems = {
			maze: $( elMazeCanvasId ),
			timer: $( elTimerId ),
			guessBox: $( elGuessBoxId ),
			message: $( elMessageId )
		};
		
		var that = this;
		
		this.keyhandler = new KeyHandler(
			that.game.handleDown,	
			that.game.handleUp,	
			that.game.handleLeft,	
			that.game.handleRight
		);
	}
	
	DisplayManager.prototype.drawTimer = function() {
		var timeLeft = this.game.getTimeLeft();
		this.elems.timer.html( timeLeft );
	};

	return DisplayManager;
} )();