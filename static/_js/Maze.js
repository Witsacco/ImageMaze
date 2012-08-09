var Maze = ( function() {

	function Maze( len, width ) {
		this.grid = [];
		this.numImageCubes = 0;

		for ( var r = 0; r < len; ++r ) {
			this.grid.push( [] );

			for ( var c = 0; c < width; ++c ) {
				this.grid[ r ].push( null );
			}
		}
	}

	Maze.prototype.getCubes = function() {
		return this.grid;
	};

	Maze.prototype.setCubeAtIndex = function( row, col, cube ) {

		// Add cube to grid
		this.grid[ row ][ col ] = cube;

		// If cube is an ImageCube, keep track of how many we've seen
		if ( cube.getType() === "ImageCube" ) {
			++this.numImageCubes;
		}

		// Grab neighbors of this cube
		var neighbors = getNeighbors( this.grid, row, col );

		// Update walls of the newly added cube
		cube.setWalls( neighbors.top === null, neighbors.bottom === null, neighbors.left === null,
				neighbors.right === null );

		// Update walls of neighbors of newly added cube
		if ( neighbors.top !== null ) {
			neighbors.top.setWall( "bottom", false );
		}
		if ( neighbors.bottom !== null ) {
			neighbors.bottom.setWall( "top", false );
		}
		if ( neighbors.left !== null ) {
			neighbors.left.setWall( "right", false );
		}
		if ( neighbors.right !== null ) {
			neighbors.right.setWall( "left", false );
		}
	};

	Maze.prototype.getCubeAtIndex = function( row, col ) {
		return this.grid[ row ][ col ];
	};

	Maze.prototype.getCubeAtPosition = function( x, z ) {
		var testX = ( x + 1 ) / 2;
		var testZ = ( z - 1 ) / 2;

		// Flip sign of Z
		testZ = -testZ;

		return this.getCubeAtIndex( Math.floor( testX ), Math.floor( testZ ) );
	};

	Maze.prototype.isValidPosition = function( x, z ) {

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

	Maze.prototype.getNumImageCubes = function() {
		return this.numImageCubes;
	};

	function getNeighbors( grid, row, col ) {
		var lastRow = grid.length - 1;
		var lastCol = grid[ 0 ].length - 1;

		// Get top
		var top = ( row === 0 ? null : grid[ row - 1 ][ col ] );

		// Get bottom
		var bottom = ( row === lastRow ? null : grid[ row + 1 ][ col ] );

		// Get left
		var left = ( col === 0 ? null : grid[ row ][ col - 1 ] );

		// Get right
		var right = ( col === lastCol ? null : grid[ row ][ col + 1 ] );

		return {
			top : top,
			bottom : bottom,
			left : left,
			right : right
		};
	}

	return Maze;
} )();