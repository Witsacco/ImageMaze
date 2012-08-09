var MazeParser = ( function() {
	
	function parse( text ) {
		
		// Split apart the text into newlines
		var lines = text.split( "\n" );

		var rows = lines.length;
		var cols = lines[ 0 ].length;
		
		// Instantiate a new Maze
		var maze = new Maze( rows, cols );
		
		// This is the number of ImageCubes we have; gives each ImageCube a sequential number
		var imageCubeSequence = 0;

		// Iterate through the lines
		for ( var lineNum = 0, row = rows - 1; lineNum < rows; ++lineNum, --row ) {
			var line = lines[ lineNum ];

			// Split apart the characters on the current line
			var tokens = line.split( "" );

			// Iterate through the characters
			for ( var col = 0; col < tokens.length; ++col ) {

				switch ( tokens[ col ] ) {
					// Token "X" means standard Cube
					case 'X':
						maze.setCubeAtIndex( row, col, new Cube() );
						break;

					// Token "O" means FinishCube
					case 'O':
						maze.setCubeAtIndex( row, col, new FinishCube() );
						break;
						
					// Token "I" means ImageCube
					case 'I':
						maze.setCubeAtIndex( row, col, new ImageCube( imageCubeSequence ) );
						++imageCubeSequence;
						break;

					// Anything else means no cube
					default:
						break;
				}
			}
		}
		
		return maze;
	}
	
	return {
		parse: parse
	};
} )();