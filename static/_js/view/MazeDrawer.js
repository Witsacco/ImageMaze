var MazeDrawer = ( function() {

	function MazeDrawer( elCanvas, game ) {
		this.game = game;

		this.mvMatrix = mat4.create();
		this.pMatrix = mat4.create();

		this.mvMatrixStack = new ModelViewStack(mat4);

		this.gl = initGL( elCanvas );

		this.shaderProgram = initShaders( this.gl );

		// Initialize to null.  These will be set in "initBuffers"
		this.cubeVertexPositionBuffer = null;
		this.cubeVertexTextureCoordBuffer = null;
		this.cubeBuffers = null;

		initBuffers( this.gl, this );

		this.textures = initTextures( this.gl, this.game.getNumImageCubes() );

		this.gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
		this.gl.enable( this.gl.DEPTH_TEST );
	}

	MazeDrawer.prototype.draw = function() {

		this.gl.viewport( 0, 0, this.gl.viewportWidth, this.gl.viewportHeight );
		this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

		mat4.perspective( 45, this.gl.viewportWidth / this.gl.viewportHeight, 0.1, 100.0, this.pMatrix );

		mat4.identity( this.mvMatrix );

		mat4.rotate( this.mvMatrix, this.game.getXRot(), [ 0, 1, 0 ] );
		mat4.translate( this.mvMatrix, [ -this.game.getX(), 0.0, -this.game.getZ() ] );

		// Check if there are new images to be loaded up
		var urlQueue = this.game.getQueueOfNewImageURLs();
		if ( urlQueue.length > 0 ) {
			
			for ( var i = 0; i < urlQueue.length; ++i ) {
				this.textures.images[ i ].setSrc( urlQueue[ i ] );
			}
			
			this.game.clearQueueOfNewImageURLs();
		}
		
		// Grab our grid of Cubes
		var maze = this.game.getMaze().getCubes();

		// Iterate through the rows of the maze
		for ( var rowNum in maze ) {
			var row = maze[ rowNum ];

			// Save our current mvMatrix
			this.mvMatrixStack.push( this.mvMatrix );

			// Iterate through the columns of the maze
			for ( var colNum in row ) {
				var cube = row[ colNum ];

				// If this cube is defined, draw it
				if ( cube !== null ) {
					var name = cube.getName();
					var indexBuffer = this.cubeBuffers[ name ];

					// Push mvMatrix
					this.mvMatrixStack.push( this.mvMatrix );

					// Draw cube (possibly rotating paper)
					this.drawCube( indexBuffer, cube );

					// Pop mvMatrix
					this.mvMatrix = this.mvMatrixStack.pop();
				}

				// Move pencil
				mat4.translate( this.mvMatrix, [ 2.0, 0.0, 0.0 ] );
			}

			this.mvMatrix = this.mvMatrixStack.pop();

			// Move pencil two units forward and reset the X axis back to where
			// we started
			mat4.translate( this.mvMatrix, [ 0.0, 0.0, -2.0 ] );
		}

	};

	MazeDrawer.prototype.drawCube = function( indexBuffer, cube ) {

		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer );
	
		this.gl.vertexAttribPointer(
				this.shaderProgram.vertexPositionAttribute,
				this.cubeVertexPositionBuffer.itemSize,
				this.gl.FLOAT, false, 0, 0 );

		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer );

		this.gl.vertexAttribPointer(
				this.shaderProgram.textureCoordAttribute,
				this.cubeVertexTextureCoordBuffer.itemSize,
				this.gl.FLOAT, false, 0, 0 );

		this.gl.activeTexture( this.gl.TEXTURE0 );

		var texture;
		if ( cube instanceof ImageCube ) {
			texture = this.textures.images[ cube.getCubeNumber() ];
		} else if ( cube instanceof FinishCube ) {
			texture = this.textures.finish;
		} else {
			texture = this.textures.crate;
		}

		this.gl.bindTexture( this.gl.TEXTURE_2D, texture.glTexture );
		this.gl.uniform1i( this.shaderProgram.samplerUniform, 0 );

		this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		this.setMatrixUniforms();
		this.gl.drawElements( this.gl.TRIANGLES, indexBuffer.numItems, this.gl.UNSIGNED_SHORT, 0 );

	};
	
	MazeDrawer.prototype.setMatrixUniforms = function() {
		this.gl.uniformMatrix4fv( this.shaderProgram.pMatrixUniform, false, this.pMatrix );
		this.gl.uniformMatrix4fv( this.shaderProgram.mvMatrixUniform, false, this.mvMatrix );
	};

	function initGL( elCanvas ) {

		// Grab the canvas DOM element
		var canvas = elCanvas.get( 0 );

		var gl = canvas.getContext( "webgl" ) || canvas.getContext( "experimental-webgl" );

		if ( !gl ) {
			throw new Error( "Unable to initialize WebGL canvas. Your browser may not support WebGL. Try the latest Chrome or Firefox." );
		}

		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;

		return gl;
	}

	function getShader( gl, id ) {
		var shaderScript = document.getElementById( id );
		if ( !shaderScript ) {
			return null;
		}
	
		var str = "";
		var k = shaderScript.firstChild;
		while ( k ) {
			if ( k.nodeType == 3 ) {
				str += k.textContent;
			}
			k = k.nextSibling;
		}
	
		var shader;
		if ( shaderScript.type == "x-shader/x-fragment" ) {
			shader = gl.createShader( gl.FRAGMENT_SHADER );
		} else if ( shaderScript.type == "x-shader/x-vertex" ) {
			shader = gl.createShader( gl.VERTEX_SHADER );
		} else {
			return null;
		}
	
		gl.shaderSource( shader, str );
		gl.compileShader( shader );
	
		if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
			alert( gl.getShaderInfoLog( shader ) );
			return null;
		}
	
		return shader;
	}

	function initShaders( gl ) {
		var fragmentShader = getShader( gl, "shader-fs" );
		var vertexShader = getShader( gl, "shader-vs" );

		var shaderProgram = gl.createProgram();
		gl.attachShader( shaderProgram, vertexShader );
		gl.attachShader( shaderProgram, fragmentShader );
		gl.linkProgram( shaderProgram );

		if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
			throw new Error( "Could not initialise shaders" );
		}

		gl.useProgram( shaderProgram );

		shaderProgram.vertexPositionAttribute = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
		gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );

		shaderProgram.textureCoordAttribute = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
		gl.enableVertexAttribArray( shaderProgram.textureCoordAttribute );

		shaderProgram.pMatrixUniform = gl.getUniformLocation( shaderProgram, "uPMatrix" );
		shaderProgram.mvMatrixUniform = gl.getUniformLocation( shaderProgram, "uMVMatrix" );
		shaderProgram.samplerUniform = gl.getUniformLocation( shaderProgram, "uSampler" );

		return shaderProgram;
	}

	function initBuffers( gl, drawer ) {

		var cubeVertexPositionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexPositionBuffer );

		var vertices = [
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

		var cubeVertexTextureCoordBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer );

		var textureCoords = [
		// Front face
		1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 

		// Back face
		0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,   

		// Top face
		1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 

		// Bottom face
		1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0,

		// Right face
		0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,   

		// Left face
		1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0 ];

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

		var cubeBuffers = {};

		for ( var a = 0; a < 2; ++a ) {
			for ( var b = 0; b < 2; ++b ) {
				for ( var c = 0; c < 2; ++c ) {
					for ( var d = 0; d < 2; ++d ) {

						// Generate the name of a cube with the given wall
						// combination
						var cube = new Cube();
						cube.setWalls( a === 0, b === 0, c === 0, d === 0 );
						var name = cube.getName();

						cubeBuffers[ name ] = gl.createBuffer();
						gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, cubeBuffers[ name ] );

						var cubeVertexIndices = [];
						if ( a === 0 ) {
							cubeVertexIndices = cubeVertexIndices.concat( wallIndices.front );
						}
						if ( b === 0 ) {
							cubeVertexIndices = cubeVertexIndices.concat( wallIndices.back );
						}
						if ( c === 0 ) {
							cubeVertexIndices = cubeVertexIndices.concat( wallIndices.left );
						}
						if ( d === 0 ) {
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

		drawer.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
		drawer.cubeVertexTextureCoordBuffer = cubeVertexTextureCoordBuffer;
		drawer.cubeBuffers = cubeBuffers;
	}

	function initTextures( gl, numOfImageCubes ) {
		var imageCubeTextures = [];

		for ( var i = 0; i < numOfImageCubes; ++i ) {
			imageCubeTextures.push( ImageTexture( gl ) );
		}

		return {
			crate : CrateTexture( gl ),
			finish : FinishTexture( gl ),
			images : imageCubeTextures
		}
	}

	return MazeDrawer;
} )();