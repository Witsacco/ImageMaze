// Cube types
// X = standard cube
// O = finishing cube
// I = top image cube

var maze =
	".X.O\n" +
	"IXXX\n" +
	"X..X\n" +
	"XIXI";

function ImageMazeApp() {
	
	// Current word to be guessed
	this.curWord = "";
	
	var keyHandler = new KeyHandler();
	
	this.pos = {
		x : 0,
		z : 0,
		xRot : 0
	};
	
	this.ppos = {
		x: 0,
		z: 0,
		xRot: 0
	};
	
	document.onkeydown = function( e ) { keyHandler.handleKeyDown( e ) };
	document.onkeyup = function( e ) { keyHandler.handleKeyUp( e ) };
	
	this.keyHandler = keyHandler;
	
	this.mvMatrixStack = new ModelViewStack( mat4 );
	
	this.maze = new MazeParser( maze );
	
	var that = this;
	
	// To be called when timer runs out
	var onTimerExpire = function() {
		that.timeExpired();
	};
	
	var elClock;
	var onTimerChange = function( secRemaining ) {
		if ( !elClock ) {
			elClock = document.getElementById( "clock" );
		}
		
		elClock.innerHTML = secRemaining;
	};

	this.timer = new Timer( 10, onTimerExpire, onTimerChange );

	return this;
}

ImageMazeApp.prototype.handleKeys = function() {
	this.keyHandler.handleKeys( this.pos );
};

ImageMazeApp.prototype.registerX = function() {
	this.ppos.x = this.pos.x;
};

ImageMazeApp.prototype.revertX = function() {
	this.pos.x = this.ppos.x;
};

ImageMazeApp.prototype.registerZ = function() {
	this.ppos.z = this.pos.z;
};

ImageMazeApp.prototype.revertZ = function() {
	this.pos.z = this.ppos.z;
};

ImageMazeApp.prototype.getX = function() { return this.pos.x };
ImageMazeApp.prototype.getPriorZ = function() { return this.ppos.z };
ImageMazeApp.prototype.getPriorX = function() { return this.ppos.x };
ImageMazeApp.prototype.getZ = function() { return this.pos.z };
ImageMazeApp.prototype.getRot = function() { return this.pos.xRot };
ImageMazeApp.prototype.getMaze = function() { return this.maze };

ImageMazeApp.prototype.chooseWordAndRefreshImages = function() {
	var that = this;
	
	$.getJSON("/getImageUrls", function( data ) {
		that.handleURLs( data );
	} );
};

ImageMazeApp.prototype.handleURLs = function( data ) {

	// TODO: fix this global nastiness
	for (textureNum in imageCubeTextures) {
		imageCubeTextures[ textureNum ].image.src = data.urls[ textureNum ];
	}
	
	this.curWord = data.word;
};

ImageMazeApp.prototype.guessWord = function( guess ) {
	return ( $.trim( guess ).toLowerCase() === this.curWord.toLowerCase() );
};

ImageMazeApp.prototype.addTime = function() {
	this.timer.add( 10 );
};

ImageMazeApp.prototype.turnOnKeyHandler = function() {
	this.keyHandler.enable();
};

ImageMazeApp.prototype.turnOffKeyHandler = function() {
	this.keyHandler.disable();
};

ImageMazeApp.prototype.timeExpired = function() {
	this.timer.stop();
	this.turnOffKeyHandler();
	
	var elClockMessage;	
	if ( !elClockMessage ) {
		elClockMessage = document.getElementById( "clockMessage" );
	}

	elClockMessage.innerHTML = "CLOCK EXPIRED!";
};