function initGL( canvas ) {

	var gl;
	
	try {
		gl = canvas.getContext( "experimental-webgl" );
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}
	catch ( e ) {
	}

	if ( !gl ) {
		alert( "Could not initialise WebGL, sorry :-(" );
	}
	
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

var shaderProgram;

function initShaders( gl ) {
	var fragmentShader = getShader( gl, "shader-fs" );
	var vertexShader = getShader( gl, "shader-vs" );

	shaderProgram = gl.createProgram();
	gl.attachShader( shaderProgram, vertexShader );
	gl.attachShader( shaderProgram, fragmentShader );
	gl.linkProgram( shaderProgram );

	if ( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ) {
		alert( "Could not initialise shaders" );
	}

	gl.useProgram( shaderProgram );

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
	gl.enableVertexAttribArray( shaderProgram.vertexPositionAttribute );

	shaderProgram.textureCoordAttribute = gl.getAttribLocation( shaderProgram, "aTextureCoord" );
	gl.enableVertexAttribArray( shaderProgram.textureCoordAttribute );

	shaderProgram.pMatrixUniform = gl.getUniformLocation( shaderProgram, "uPMatrix" );
	shaderProgram.mvMatrixUniform = gl.getUniformLocation( shaderProgram, "uMVMatrix" );
	shaderProgram.samplerUniform = gl.getUniformLocation( shaderProgram, "uSampler" );
}

function handleLoadedTexture( gl, texture ) {
	gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );

	gl.bindTexture( gl.TEXTURE_2D, texture );
	gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
	gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

	gl.bindTexture( gl.TEXTURE_2D, null );
}

function initTexture( gl ) {
	var crateImage = new Image();
	var finishImage = new Image();
	var texture;
	
	var numImageCubes = App.getMaze().getNumImageCubes();
	var imageCubeTextures = [];

	for ( var i = 0; i < numImageCubes; ++i ) {

		var img = new Image();
		img.id = i;
		// TODO: this seems to be overwriting itself (see console output, where all ids are 2)
		texture = gl.createTexture();
		texture.image = img;
		texture.id = i;

		imageCubeTextures.push( texture );

		img.onload = function() {
			handleLoadedTexture( gl, imageCubeTextures[ this.id ] );
		};
		
	}

	var mainTexture = gl.createTexture();
	mainTexture.image = crateImage;

	var finishTexture = gl.createTexture();
	finishTexture.image = finishImage;
	
	crateImage.onload = function() {
		handleLoadedTexture( gl, mainTexture );
	};

	finishImage.onload = function() {
		handleLoadedTexture( gl, finishTexture );
	};

	crateImage.src = "static/_images/crate.gif";
	finishImage.src = "static/_images/finish_crate.gif";
	
	return {
		crate: mainTexture,
		finish: finishTexture,
		images: imageCubeTextures
	};
}
