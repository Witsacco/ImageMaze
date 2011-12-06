var maze =
	".XXX\n" +
	".X.X\n" +
	"XX.X\n" +
	"XX.X";

function ImageMazeApp() {
	
	var keyHandler = new KeyHandler();
	
	this.pos = {
		x : -1,
		z : -1,
		xRot : Math.PI
	};
	
	this.ppos = {
		x: -1,
		z: -1,
		xRot: Math.PI
	};
	
	document.onkeydown = function( e ) { keyHandler.handleKeyDown( e ) };
	document.onkeyup = function( e ) { keyHandler.handleKeyUp( e ) };
	
	this.keyHandler = keyHandler;
	
	this.mvMatrixStack = new ModelViewStack( mat4 );
	
	this.maze = new MazeParser( maze );
	
	console.log(this.maze);

	return this;
}

ImageMazeApp.prototype.handleKeys = function() {
	this.keyHandler.handleKeys( this.pos );
};

ImageMazeApp.prototype.priorPos = function() {
	this.pos.x = this.ppos.x;
	this.pos.z = this.ppos.z;
	this.pos.xRot = this.ppos.xRot;
};

ImageMazeApp.prototype.registerMove = function() {
	this.ppos.x = this.pos.x;
	this.ppos.z = this.pos.z;
	this.ppos.xRot = this.pos.xRot;
};

ImageMazeApp.prototype.registerX = function() {
	this.ppos.x = this.pos.x;
};

ImageMazeApp.prototype.revertToPriorX = function() {
	this.pos.x = this.ppos.x;
};

ImageMazeApp.prototype.registerZ = function() {
	this.ppos.z = this.pos.z;
};

ImageMazeApp.prototype.revertToPriorZ = function() {
	this.pos.z = this.ppos.z;
};

ImageMazeApp.prototype.getCurX = function() { return this.pos.x };
ImageMazeApp.prototype.getCurZ = function() { return this.pos.z };
ImageMazeApp.prototype.getPriX = function() { return this.ppos.x };
ImageMazeApp.prototype.getPriZ = function() { return this.ppos.z };
ImageMazeApp.prototype.getRot = function() { return this.pos.xRot };
ImageMazeApp.prototype.getMaze = function() { return this.maze };
