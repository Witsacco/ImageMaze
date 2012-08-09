var Cube = ( function() {

	var cubeType = "Cube";
	
	// TRUE means there is a wall.  FALSE means the wall is missing
	function Cube() {
		this.top = this.bottom = this.left = this.right = true;
		
		this.name = buildName( this.top, this.bottom, this.left, this.right );
	}
	
	Cube.prototype.setWall = function( wall, isAWall ) {
		this[ wall ] = isAWall;

		this.name = buildName( this.top, this.bottom, this.left, this.right );

	};
	
	Cube.prototype.setWalls = function ( top, bottom, left, right ) {
		this.setWall( "top", top );
		this.setWall( "bottom", bottom );
		this.setWall( "left", left );
		this.setWall( "right", right );
	};

	Cube.prototype.getName = function() {
		return this.name;
	};

	Cube.prototype.getType = function() {
		return cubeType;
	};
	
	function buildName( top, bottom, left, right ) {

		var name = [];

		if ( top === true ) {
			name.push( "top" );
		}
		if ( bottom === true ) {
			name.push( "bottom" );
		}
		if ( left === true ) {
			name.push( "left" );
		}
		if ( right === true ) {
			name.push( "right" );
		}
		if ( name.length === 0 ) {
			name.push( "none" );
		}

		return name.join( "-" );
	}

	return Cube;
} )();
