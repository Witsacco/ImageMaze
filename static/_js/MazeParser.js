/*
 * Constructor for new MazeParser objects
 */
function MazeParser( text ) {

	// Parse the text into a grid of Cubes
	this.grid = this.parse( text );
	
	this.numImageCubes = countImageCubes( this.grid );
}

function countImageCubes( grid ) {
	
	var numImageCubes = 0;
	
	for ( var rowNum in grid ) {
		var row = grid[ rowNum ];
		
		for ( var colNum in row ){
			var cube = row[ colNum ];
			
			if ( cube instanceof ImageCube ) {
				++numImageCubes;
			}
		}
	}

	return numImageCubes;
}

/*
 * Getter for grid of Cubes
 */
MazeParser.prototype.getCubes = function() {
	return this.grid;
};

MazeParser.prototype.getNumImageCubes = function() {
	return this.numImageCubes;
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

	if ( this.grid[ floorFrontZ ][ floorLeftX ] === null || this.grid[ floorFrontZ ][ floorRightX ] === null
			|| this.grid[ floorBackZ ][ floorLeftX ] === null || this.grid[ floorBackZ ][ floorRightX ] === null ) {
		return false;
	}

	return true;
};

/*
 * Parses the maze text into a grid of Cubes
 */
MazeParser.prototype.parse = function( text ) {

	// Split apart the text into newlines
	var lines = text.split( "\n" );

	// This will hold the interim grid
	var parsed = [];
	
	// This is the number of ImageCubes we have; gives each ImageCube a sequential number
	var imageCubeSequence = 0;

	// Iterate through the lines
	for ( var lineNum = lines.length - 1; lineNum >= 0; --lineNum ) {
		var line = lines[ lineNum ];

		// Split apart the characters on the current line
		var tokens = line.split( "" );

		var curRow = [];

		// Iterate through the characters
		for ( var j in tokens ) {

			switch ( tokens[ j ] ) {
				// Token "X" means standard Cube
				case 'X':
					curRow.push( new Cube() );
					break;

				// Token "O" means FinishCube
				case 'O':
					curRow.push( new FinishCube() );
					break;
					
				// Token "I" means top ImageCube
				case 'I':
					curRow.push( new ImageCube( imageCubeSequence ) );
					++imageCubeSequence;
					break;

				// Anything else means no cube
				default:
					curRow.push( null );
					break;
			}

		}

		// Add this array of booleans to the final result set
		parsed.push( curRow );
	}

	// Add the border of nulls
	var cols = parsed[ 0 ].length;

	// Build a row of nulls for the top and bottom
	var top = [];
	var bottom = [];
	for ( var i = 0; i < cols; i++ ) {
		top.push( null );
		bottom.push( null );
	}

	parsed.unshift( top );
	parsed.push( bottom );

	// Add null to the beginning and end of each line
	for ( var i in parsed ) {
		var line = parsed[ i ];

		line.unshift( null );
		line.push( null );
	}

	// This will hold the final grid
	var grid = [];

	// Set walls
	for ( var rowNum = 1; rowNum < parsed.length - 1; ++rowNum ) {
		var gridRow = [];

		var priorRow = parsed[ rowNum - 1 ];
		var curRow = parsed[ rowNum ];
		var nextRow = parsed[ rowNum + 1 ];

		for ( var colNum = 1; colNum < curRow.length - 1; ++colNum ) {
			var elem = curRow[ colNum ];

			if ( elem !== null ) {
				var top = (priorRow[ colNum ] !== null);
				var left = (curRow[ colNum - 1 ] !== null);
				var right = (curRow[ colNum + 1 ] !== null);
				var bottom = (nextRow[ colNum ] !== null);

				elem.setWalls( top, bottom, left, right );
			}

			gridRow.push( elem );
		}

		grid.push( gridRow );
	}
	
	return grid;
};
