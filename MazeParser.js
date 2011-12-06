function MazeParser( text ) {
	this.parsed = this.parse( text );
	this.grid = this.buildCubes( this.parsed );
	this.radius = 0.35;
}

MazeParser.prototype.getCubes = function() {
	return this.grid;
}

MazeParser.prototype.getPositionValidity = function( currentX, currentZ, priorX, priorZ ) {
	
	var r = this.radius;
	
	// Assume priorX and priorZ are a valid state
	
	var absCurX = Math.floor( Math.abs( currentX ) / 2 );
	var absCurX_buffL = Math.floor( Math.abs( currentX - r ) / 2 );
	var absCurX_buffR = Math.floor( Math.abs( currentX + r ) / 2 );
	
	var absCurZ = Math.floor( Math.abs( currentZ ) / 2 );
	var absCurZ_buffU = Math.floor( Math.abs( currentZ - r ) / 2 );
	var absCurZ_buffD = Math.floor( Math.abs( currentZ + r ) / 2 );
	
	var absPriX = Math.floor( Math.abs( priorX   ) / 2 );
	var absPriZ = Math.floor( Math.abs( priorZ   ) / 2 );

	var result = { "x": false, "z": false };
	
	var gridHeight = this.grid.length;
	var gridWidth = this.grid[ 0 ].length; // Assume all rows are the same length
	
	if ( currentX + r <= 0 && absCurX < gridWidth && this.grid[ gridHeight - absPriZ - 1 ][ absCurX ] !== null ) {
		result.x = true;
	}
		
	if ( currentZ + r <= 0 && absCurZ < gridHeight && this.grid[ gridHeight - absCurZ - 1 ][ absPriX ] !== null ) {
		result.z = true;
	}

	var elValid = document.getElementById( "isValid" );
	elValid.innerHTML = "cX: " + currentX + " cZ: " + currentZ + "<br>" +
		"aX: " + absCurX + " aZ: " + absCurZ + "<br>" +
		"vX: " + result.x + " vZ: " + result.z;
	
	return result;
	
};

MazeParser.prototype.parse = function( text ) {
	var lines = text.split( "\n" );

	var parsed = [];
	
	for ( var i in lines ) {
		var line = lines[ i ];
		
		var tokens = line.split( "" );

		for ( var j in tokens ) {
			tokens[ j ] = ( tokens[ j ] === "X" ? true : false );
		}
		
		parsed.push( tokens );
	}
	
	return parsed;
}

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
