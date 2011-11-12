

var mvMatrix = mat4.create();
var mvMatrixStack = new ModelViewStack( mat4 );
var pMatrix = mat4.create();

function setMatrixUniforms( gl ) {
	gl.uniformMatrix4fv( shaderProgram.pMatrixUniform, false, pMatrix );
	gl.uniformMatrix4fv( shaderProgram.mvMatrixUniform, false, mvMatrix );
}

function degToRad( degrees ) {
	return degrees * Math.PI / 180;
}

var xRot = 0;

var x = 0, z = 1;

var tunnelLength = 5;

var filter = 0;

var currentlyPressedKeys = {};

function handleKeyDown( event ) {
	currentlyPressedKeys[ event.keyCode ] = true;
}

function handleKeyUp( event ) {
	currentlyPressedKeys[ event.keyCode ] = false;
}

function handleKeys() {
	if ( currentlyPressedKeys[ 40 ] ) {
		// Down arrow
		
		x += (0.05 * Math.sin(xRot));
		z -= (0.05 * Math.cos(xRot));
	} else if ( currentlyPressedKeys[ 38 ] ) {
		// Up arrow

		x -= (0.05 * Math.sin(xRot));
		z += (0.05 * Math.cos(xRot));
	}
	
	if ( currentlyPressedKeys[ 37 ] ) {
		// Left arrow
		xRot -= 0.05;
	} else if ( currentlyPressedKeys[ 39 ] ) {
		// Right arrow
		xRot += 0.05;
	}
}

var cubeVertexPositionBuffer;
var cubeVertexTextureCoordBuffer;

var cubeVertexIndexBuffer0;
var cubeVertexIndexBuffer1;
var cubeVertexIndexBuffer2;

function initBuffers( gl ) {
	
	cubeVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );
	vertices = [
		// Front face
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, 1.0, 1.0,
		-1.0, 1.0, 1.0,
	
		// Back face
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,
	
		// Top face
		-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
	
		// Bottom face
		-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
	
		// Right face
		1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
	
		// Left face
		-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
	];
	
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
	cubeVertexPositionBuffer.itemSize = 3;
	cubeVertexPositionBuffer.numItems = 16;

	cubeVertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer );

	var textureCoords = [
		// Front face
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0,
		0.0, 1.0,
	
		// Back face
		1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
	
		// Top face
		0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
	
		// Bottom face
		1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
	
		// Right face
		1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0,
	
		// Left face
		0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0
	];
	
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoords ), gl.STATIC_DRAW );
	cubeVertexTextureCoordBuffer.itemSize = 2;
	cubeVertexTextureCoordBuffer.numItems = 24;
	
	cubeVertexIndexBuffer0 = createVertexIndexBuffer( gl, 0 );
	cubeVertexIndexBuffer1 = createVertexIndexBuffer( gl, 1 );
	cubeVertexIndexBuffer2 = createVertexIndexBuffer( gl, 2 );
}

function createVertexIndexBuffer( gl, type) {
	var result = gl.createBuffer();
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, result );
	
	var cubeVertexIndices; 
	if ( type === 0 ) {
		cubeVertexIndices = [
		0, 1, 2, 0, 2, 3, // Front face
//		4, 5, 6, 4, 6, 7, // Back face
		8, 9, 10, 8, 10, 11, // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23 // Left face
		];

	 	result.numItems = 30;
	}
	else if ( type === 1 ) {
		cubeVertexIndices = [
//		0, 1, 2, 0, 2, 3, // Front face
//		4, 5, 6, 4, 6, 7, // Back face
		8, 9, 10, 8, 10, 11, // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23 // Left face
		];
		
	 	result.numItems = 24;
	}
	else if ( type === 2 ) {
		cubeVertexIndices = [
//		0, 1, 2, 0, 2, 3, // Front face
		4, 5, 6, 4, 6, 7, // Back face
		8, 9, 10, 8, 10, 11, // Top face
		12, 13, 14, 12, 14, 15, // Bottom face
		16, 17, 18, 16, 18, 19, // Right face
		20, 21, 22, 20, 22, 23 // Left face
		];
		
	 	result.numItems = 30;
	}
	
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( cubeVertexIndices ), gl.STATIC_DRAW );
	result.itemSize = 1;
	
	return result;
}

function drawScene( gl ) {
	gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	mat4.perspective( 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix );

	mat4.identity( mvMatrix );

	mat4.rotate( mvMatrix, xRot, [0, 1, 0] );
	mat4.translate( mvMatrix, [ x, 0.0, z ] );
	
	// -- Draw each cube --
	for ( var i = 0; i < tunnelLength; ++i ) {
		var indexBuffer;
		
		if (i === 0) {
			indexBuffer = cubeVertexIndexBuffer0; 
		}
		else if (i === (tunnelLength - 1)) {
			indexBuffer = cubeVertexIndexBuffer2;
		}
		else {
			indexBuffer = cubeVertexIndexBuffer1;
		}
		
		// Move pencil
		mat4.translate( mvMatrix, [ 0.0, 0.0, -2 ] );

		// Push mvMatrix
		mvMatrixStack.push( mvMatrix );
		
		// Draw cube (possibly rotating paper)
		drawCube( gl, indexBuffer);
		
		// Pop mvMatrix
		mvMatrixStack.pop();
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
	requestAnimFrame( function() { tick( gl) } );
	handleKeys();
	drawScene( gl );
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

	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;

	tick( gl );
}
