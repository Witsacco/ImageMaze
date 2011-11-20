var maze = 
	"XX..XX..\n" +
	".XXXXXXX\n" +
	"...XX..X\n" +
	"....XXXX";

function MazeParser( text ) {
	this.parsed = this.parse( text );
	this.grid = this.buildCubes( this.parsed );
}

MazeParser.prototype.getCubes = function() {
	return this.grid;
}

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

var parser = new MazeParser( maze );
