var maze =
	".X.O\n" +
	"XXXX\n" +
	"X..X\n" +
	"XXXX";

function ImageMazeApp() {
	
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
	
	// To be called when timer runs out
	var elClockMessage;
	var onTimerExpire = function() {
		if ( !elClockMessage ) {
			elClockMessage = document.getElementById( "clockMessage" );
		}
		
		elClockMessage.innerHTML = "CLOCK EXPIRED!";
	};
	
	var elClock;
	var onTimerChange = function( secRemaining ) {
		if ( !elClock ) {
			elClock = document.getElementById( "clock" );
		}
		
		elClock.innerHTML = secRemaining;
	};

	this.timer = new Timer( 5, onTimerExpire, onTimerChange );

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
