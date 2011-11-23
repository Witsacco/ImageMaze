var App = new ImageMazeApp();

var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms( gl ) {
	gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
	gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );
}

function degToRad( degrees ) {
	return degrees * Math.PI / 180;
}

var tunnelLength = 5;

var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;
var cubeBuffers = {};

//var cubeVertexIndexBuffer0;
//var cubeVertexIndexBuffer1;
//var cubeVertexIndexBuffer2;

function initBuffers( gl ) {

	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );
	vertices = [
	// Front face
	-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

	// Back face
	-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

	// Top face
	-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

	// Bottom face
	-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

	// Right face
	1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

	// Left face
	-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0 ];

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = 16;

	cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer );

	var textureCoords = [
	// Front face
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,

	// Back face
	1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

	// Top face
	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,

	// Bottom face
	1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

	// Right face
	1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,

	// Left face
	0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0 ];

	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoords ), gl.STATIC_DRAW );
	cubeVertexTextureCoordBuffer.itemSize = 2;
	cubeVertexTextureCoordBuffer.numItems = 24;

	var wallIndices = {
		// top of the square
		"front" : [ 0, 1, 2, 0, 2, 3 ],
		// bottom of the square
		"back" : [ 4, 5, 6, 4, 6, 7 ],
		"left" : [ 20, 21, 22, 20, 22, 23 ],
		"right" : [ 16, 17, 18, 16, 18, 19 ],
		"floor" : [ 12, 13, 14, 12, 14, 15 ],
		"ceiling" : [ 8, 9, 10, 8, 10, 11 ]
	};

//	var cubeBuffers = {};

	var cubeVertexIndices;

	for ( var a = 0; a < 2; ++a ) {
		for ( var b = 0; b < 2; ++b ) {
			for ( var c = 0; c < 2; ++c ) {
				for ( var d = 0; d < 2; ++d ) {

					var cube = new Cube( a === 0, b === 0, c === 0, d === 0 );
					var name = cube.getName();
					
					console.log(name);

					cubeBuffers[ name ] = gl.createBuffer();
					gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cubeBuffers[ name ] );

					cubeVertexIndices = [];
					if ( a === 1 ) {
						cubeVertexIndices = cubeVertexIndices.concat( wallIndices.front );
					}
					if ( b === 1 ) {
						cubeVertexIndices = cubeVertexIndices.concat( wallIndices.back );
					}
					if ( c === 1 ) {
						cubeVertexIndices = cubeVertexIndices.concat( wallIndices.left );
					}
					if ( d === 1 ) {
						cubeVertexIndices = cubeVertexIndices.concat( wallIndices.right );
					}
					cubeVertexIndices = cubeVertexIndices.concat( wallIndices.ceiling, wallIndices.floor );
					
					gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( cubeVertexIndices ), gl.STATIC_DRAW );
					cubeBuffers[ name ].itemSize = 1;
					cubeBuffers[ name ].numItems = cubeVertexIndices.length;
					
				}
			}
		}
	}
}

function drawScene( gl ) {
	
	gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix );

	mat4.identity( mvMatrix );

	mat4.rotate( mvMatrix, App.getRot(), [ 0, 1, 0 ] );
	mat4.translate( mvMatrix, [ App.getX(), 0.0, App.getZ() ] );

	// Grab our grid of Cubes
	var maze = App.getMaze().getCubes();
	
	// Iterate through the rows of the maze
	for ( var totRows = maze.length - 1, rowNum = totRows; rowNum >= 0; --rowNum ) {
		var row = maze[ rowNum ];

		// Save our current mvMatrix
		App.mvMatrixStack.push( mvMatrix );
		
		// Iterate through the columns of the maze
		for ( var colNum in row ) {
			var cube = row[ colNum ];

			// If this cube is defined, draw it
			if ( cube !== null ) {
				var name = cube.getName();
				var indexBuffer = cubeBuffers[ name ];

				// Push mvMatrix
				App.mvMatrixStack.push( mvMatrix );

				// Draw cube (possibly rotating paper)
				drawCube( gl, indexBuffer );

				// Pop mvMatrix
				mvMatrix = App.mvMatrixStack.pop();
			}

			// Move pencil
			mat4.translate( mvMatrix, [ 2.0, 0.0, 0.0 ] );
		}
		
		mvMatrix = App.mvMatrixStack.pop();
		
		// Move pencil two units forward and reset the X axis back to where we started
		mat4.translate( mvMatrix, [ 0.0, 0.0, 2 ] );
	}
}

function drawCube( gl, indexBuffer ) {

	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );
	gl.vertexAttribPointer( shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false,
			0, 0 );

	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer );
	gl.vertexAttribPointer( shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT,
			false, 0, 0 );

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, crateTexture );
	gl.uniform1i( shaderProgram.samplerUniform, 0 );

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
	setMatrixUniforms( gl );
	gl.drawElements( gl.TRIANGLES, indexBuffer.numItems, gl.UNSIGNED_SHORT, 0 );
}

function tick( gl ) {
	requestAnimFrame( function() {
		tick( gl )
	} );
	App.handleKeys();
	
	var isValid = App.getMaze().isValidPosition( App.getX(), App.getZ() );
	
	if ( !isValid ) {
		App.priorPos();
	}
	else {
		App.registerMove();
		drawScene( gl );
	}
}

var crateTexture;

function webGLStart() {
	var canvas = document.getElementById( "lesson06-canvas" );

	var gl = initGL( canvas );

	initShaders( gl );
	initBuffers( gl );
	crateTexture = initTexture( gl );

	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
	gl.enable( gl.DEPTH_TEST );

	tick( gl );
}
