var Game = ( function() {

	var INITIAL_TIME_ALLOTMENT = 10;
	var CORRECT_GUESS_BONUS = 5;
	var GAME_SPEED = 0.05;

	function Game( fileName, ondone ) {

		var that = this;

		// Load the file
		loadMazeText( fileName, function( data ) {

			// After the file is loaded, parse the maze
			that.maze = MazeParser.parse( data );

			// Generate a word and get image URLs for each ImageCube in the maze
			WordGenerator.generate( that.maze.getNumImageCubes(), function( imageUrls ) {
				that.resetWord( word, imageUrls );
			}, fail );

			// Invoke callback now that the Game is ready to be used
			ondone( that );
		} );

		this.curPos = {
			x : 0,
			z : 0,
			xRot : 0
		};

		this.priorPos = {
			x : 0,
			z : 0,
			xRot : 0
		};
		
		// TODO: FIX THIS!
		var noop = function() {};

		// TODO: This needs callbacks
		this.timer = new Timer( INITIAL_TIME_ALLOTMENT, noop, noop );

	}
	
	Game.prototype.getTimeLeft = function() {
		return this.timer.secRemaining;
	};

	Game.prototype.resetWord = function( word, imageUrls ) {
		this.currentWord = word;

		this.imageUrls = imageUrls;
	};

	Game.prototype.start = function() {
		this.timer.start();
	};

	Game.prototype.guessWord = function( word ) {
		if ( word === this.currentWord ) {
			this.timer.add( CORRECT_GUESS_BONUS );

			var that = this;

			WordGenerator.generate( this.maze.getNumImageCubes(), function() {
				that.resetWord( word, imageUrls );
			}, fail );

			return true;
		}

		return false;
	};

	Game.prototype.handleDown = function() {
		this.curPos.x -= ( GAME_SPEED * Math.sin( this.curPos.xRot ) );
		this.curPos.z += ( GAME_SPEED * Math.cos( this.curPos.xRot ) );
	};

	Game.prototype.handleUp = function() {
		this.curPos.x += ( GAME_SPEED * Math.sin( this.curPos.xRot ) );
		this.curPos.z -= ( GAME_SPEED * Math.cos( this.curPos.xRot ) );
	};

	Game.prototype.handleLeft = function() {
		this.curPos.xRot -= GAME_SPEED;
	};

	Game.prototype.handleRight = function() {
		this.curPos.xRot += GAME_SPEED;
	};
	
	Game.prototype.getNumImageCubes = function() {
		return this.maze.getNumImageCubes();
	};
	
	Game.prototype.getX = function() {
		return this.curPos.x;
	};

	Game.prototype.getZ = function() {
		return this.curPos.z;
	};

	Game.prototype.getXRot = function() {
		return this.curPos.xRot;
	};

	Game.prototype.getMaze = function() {
		return this.maze;
	};

	function fail() {
		// TODO: This should not be messing with the view
		alert( "Oops!" );
	}

	function loadMazeText( fileName, callback ) {
		URL = "/static/mazes/";

		$.get( URL + fileName, callback );
	}

	return Game;
} )();
