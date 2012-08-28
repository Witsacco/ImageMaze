var Game = ( function() {

	var INITIAL_TIME_ALLOTMENT = 10;
	var CORRECT_GUESS_BONUS = 5;
	var GAME_SPEED = 0.05;

	var LEVELS = [ "maze0.txt", "maze1.txt" ];

	function Game() {
		// Set up our timer with its initial time allotment
		this.timer = new Timer( INITIAL_TIME_ALLOTMENT );

		// Reset the game to initialize it
		this.reset();
	}

	Game.prototype.reset = function() {
		// "Current level" is -1 because we haven't yet loaded a level
		this.currentLevel = -1;
	};

	Game.prototype.initLevel = function() {
		// `finishedLevel` represents if this level has been finished by the
		//  player
		this.finishedLevel = false;

		// `finishedGame` represents if this game has been finished by the
		//  player
		this.finishedGame = false;

		this.queueOfNewImageURLs = [];

		// This is the current position of the player.  It will
		// only be updated with valid coordinates
		this.curPos = {
			x : 0,
			z : 0,
			xRot : 0
		};

		// This holds the prospective next move.  It may or may not be valid.
		// This will be copied into the current position if valid on next tick
		this.bufferPos = {
			x : 0,
			z : 0,
			xRot : 0
		};

		// Set up our timer with its initial time allotment
		this.timer.reset( INITIAL_TIME_ALLOTMENT );
	};

	Game.prototype.getCurrentLevel = function() {
		return this.currentLevel;
	};

	Game.prototype.loadNewLevel = function( onLevelLoaded ) {

		// Bump up to the next level and load it
		++this.currentLevel;

		// Are we done?
		if ( this.currentLevel >= LEVELS.length ) {
			// TODO: implement total completion sequence
			alert( "You're already done!" );
			return;
		}

		// Get the path to the specified level's maze
		var fileName = LEVELS[ this.currentLevel ];

		// Save context
		var that = this;

		// Load that level
		loadMazeText( fileName, function( data ) {

			// After the file is loaded, parse the maze
			that.maze = MazeParser.parse( data );

			// Generate a word and get image URLs for each ImageCube in the maze
			WordGenerator.generate( that.maze.getNumImageCubes(), function( word, imageUrls ) {
				that.resetWord( word, imageUrls );
			}, fail );

			// Invoke callback now that the Game is ready to be used
			onLevelLoaded( that );
		} );

	};

	Game.prototype.getTimeLeft = function() {
		return this.timer.secRemaining;
	};

	Game.prototype.getCurrentWord = function() {
		return this.currentWord;
	};

	Game.prototype.resetWord = function( word, imageUrls ) {
		this.currentWord = word;
		this.queueOfNewImageURLs = imageUrls;
	};

	Game.prototype.start = function() {
		this.timer.start();
	};

	Game.prototype.stop = function() {
		this.timer.stop();
	};

	Game.prototype.guessWord = function( word ) {
		if ( word === this.currentWord ) {
			this.timer.add( CORRECT_GUESS_BONUS );

			var that = this;

			WordGenerator.generate( this.maze.getNumImageCubes(), function( newWord, newImageUrls ) {
				that.resetWord( newWord, newImageUrls );
			}, fail );

			return true;
		}

		return false;
	};

	Game.prototype.handleDown = function() {
		this.bufferPos.x -= ( GAME_SPEED * Math.sin( this.bufferPos.xRot ) );
		this.bufferPos.z += ( GAME_SPEED * Math.cos( this.bufferPos.xRot ) );
	};

	Game.prototype.handleUp = function() {
		this.bufferPos.x += ( GAME_SPEED * Math.sin( this.bufferPos.xRot ) );
		this.bufferPos.z -= ( GAME_SPEED * Math.cos( this.bufferPos.xRot ) );
	};

	Game.prototype.handleLeft = function() {
		this.bufferPos.xRot -= GAME_SPEED;
	};

	Game.prototype.handleRight = function() {
		this.bufferPos.xRot += GAME_SPEED;
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

	Game.prototype.applyMove = function() {

		// Apply turn
		this.curPos.xRot = this.bufferPos.xRot;

		// Is (new x, old z) a valid position?
		if ( this.maze.isValidPosition( this.bufferPos.x, this.curPos.z ) ) {
			this.curPos.x = this.bufferPos.x;
		}
		else {
			this.bufferPos.x = this.curPos.x;
		}

		// Is (x, new z) a valid position ?
		if ( this.maze.isValidPosition( this.curPos.x, this.bufferPos.z ) ) {
			this.curPos.z = this.bufferPos.z;
		}
		else {
			this.bufferPos.z = this.curPos.z;
		}

		// Are you in the FinishCube?
		if ( this.maze.getCubeAtPosition(this.curPos.x, this.curPos.z) instanceof FinishCube ) {
			this.finishedLevel = true;

			if ( this.currentLevel === ( LEVELS.length - 1 ) ) {
				// The player just finished the last level
				this.finishedGame = true;
			}
		}

	};

	Game.prototype.getMaze = function() {
		return this.maze;
	};

	Game.prototype.getQueueOfNewImageURLs = function() {
		return this.queueOfNewImageURLs;
	};

	Game.prototype.clearQueueOfNewImageURLs = function() {
		this.queueOfNewImageURLs = [];
	};

	Game.prototype.onTimeChange = function( onChange ) {
		this.timer.setOnChange( onChange );
	};

	Game.prototype.onTimeExpire = function ( onExpire ) {
		this.timer.setOnExpire( onExpire );
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
