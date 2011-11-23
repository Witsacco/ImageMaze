var maze =
	".XXX\n" +
	".X.X\n" +
	"XX.X\n" +
	"X..X";

function ImageMazeApp() {
	
	var keyHandler = new KeyHandler();
	
	this.pos = {
		x : 0,
		z : 1,
		xRot : 0
	};
	
	this.ppos = {
		x: 0,
		z: 1,
		xRot: 0
	};
	
	document.onkeydown = function( e ) { keyHandler.handleKeyDown( e ) };
	document.onkeyup = function( e ) { keyHandler.handleKeyUp( e ) };
	
	this.keyHandler = keyHandler;
	
	this.mvMatrixStack = new ModelViewStack( mat4 );
	
	this.maze = new MazeParser( maze );

	return this;
}

ImageMazeApp.prototype.handleKeys = function() {
	this.keyHandler.handleKeys( this.pos );
};

ImageMazeApp.prototype.priorPos = function() {
	this.pos = this.ppos;
};

ImageMazeApp.prototype.registerMove = function() {
	this.ppos = this.pos;
};

ImageMazeApp.prototype.getX = function() { return this.pos.x };
ImageMazeApp.prototype.getZ = function() { return this.pos.z };
ImageMazeApp.prototype.getRot = function() { return this.pos.xRot };
ImageMazeApp.prototype.getMaze = function() { return this.maze };
