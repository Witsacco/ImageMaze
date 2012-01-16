
/*
 * Constructor for new MazeParser objects
 */
function MazeParser( text ) {
	
	// Parse the text into a grid of booleans
	this.parsed = this.parse( text );
	
	// Convert booleans into a grid of Cubes
	this.grid = this.buildCubes( this.parsed );
}

/*
 * Getter for grid of Cubes
 */
MazeParser.prototype.getCubes = function() {
	return this.grid;
};


MazeParser.prototype.isValidPosition = function( x, z ) {
	
	document.getElementById( "isValid" ).innerHTML = "X: " + x + " Z: " + z;
	
	var testX = ( x + 1 ) / 2;
	var testZ = ( z - 1 ) / 2;
	
	// Flip sign of Z
	testZ = -testZ;
	
	var buffer = 0.30;
	var leftX = testX - buffer;
	var backZ = testZ - buffer;
	var rightX = testX + buffer;
	var frontZ = testZ + buffer;
	
	// If either is negative, return false
	if ( leftX < 0 || backZ < 0 ) {
		return false;
	}
	
	// If Z exceeds height of grid, return false
	if ( frontZ >= this.grid.length ) {
		return false;
	}
	
	// If X exceeds width of grid, return false
	if ( rightX >= this.grid[ 0 ].length ) {
		return false;
	}
		
	// Index into grid
	var floorLeftX = Math.floor( leftX );
	var floorRightX = Math.floor( rightX );
	var floorFrontZ = Math.floor( frontZ );
	var floorBackZ = Math.floor( backZ );
	
	if ( this.grid[ floorFrontZ ][ floorLeftX ] === null || 
		this.grid[ floorFrontZ ][ floorRightX ] === null ||
		this.grid[ floorBackZ ][ floorLeftX ] === null ||
		this.grid[ floorBackZ ][ floorRightX ] === null ) {
		return false;
	}

	return true;
};

/*
 * Parses the maze text into a grid of booleans
 */
MazeParser.prototype.parse = function( text ) {

	// Split apart the text into newlines
	var lines = text.split( "\n" );

	// This will hold the arrays of booleans
	var parsed = [];
	
	// Iterate through the lines
	for ( var lineNum = lines.length - 1; lineNum >= 0; --lineNum ) {
		var line = lines[ lineNum ];
		
		// Split apart the characters on the current line
		var tokens = line.split( "" );

		// Iterate through the characters
		for ( var j in tokens ) {
			
			// Token "X" means true, anything else is false
			tokens[ j ] = ( tokens[ j ] === "X" ? true : false );
		}
		
		// Add this array of booleans to the final result set
		parsed.push( tokens );
	}
	
	// Return the array of booleans
	return parsed;
}

/*
 * Converts a grid of booleans into a grid of Cubes
 */
MazeParser.prototype.buildCubes = function( parsed ) {
	var grid = [];
	
	// First, add a border of "false" to the entire grid
	var cols = parsed[ 0 ].length;
	
	// Build a row of falses for the top and bottom
	var topBottom = [];
	for ( var i = 0; i < cols; i++ ) {
		topBottom.push( false );
	}
	
	parsed.unshift( topBottom );
	parsed.push( topBottom );
	
	// Add false to the beginning and end of each line
	for ( var i in parsed ) {
		var line = parsed[ i ];
		
	  	line.unshift( false );
		line.push( false );
	}
	
	for ( var rowNum = 1; rowNum < parsed.length - 1; ++rowNum ) {
		var priorRow = parsed[ rowNum - 1 ];
		var curRow = parsed[ rowNum ];
		var nextRow = parsed[ rowNum + 1 ];

		var gridRow = [];
		
		for ( var colNum = 1; colNum < curRow.length - 1; ++colNum ) {
			var top = priorRow[ colNum ];
			var left = curRow[ colNum - 1 ];
			var right = curRow[ colNum + 1 ];
			var bottom = nextRow[ colNum ];
			var elem = curRow[ colNum ];
			
			if ( elem === true ) {
				gridRow.push( new Cube( top, bottom, left, right ) );
			}
			else {
				gridRow.push( null );
			}
		}
		
		grid.push( gridRow );
	}
	
	return grid;
};
