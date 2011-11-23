var Cube = ( function() {

	function Cube( top, bottom, left, right ) {
		this.top = top;
		this.bottom = bottom;
		this.left = left;
		this.right = right;

		this.name = buildName( top, bottom, left, right );
		// this.indexBuffer = indexBuffers[ this.name ];
	}

	Cube.prototype.getName = function() {
		return this.name;
	};

	Cube.prototype.getIndexBuffer = function() {
		return this.indexBuffer;
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
