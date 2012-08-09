var Texture = ( function() {

	function Texture( gl, src ) {

		this.glTexture = gl.createTexture();

		var img = new Image();
		this.image = img;

		var that = this;
		img.onload = function() {
			handleLoadedTexture( gl, that );
		};

		if ( typeof src !== "undefined" ) {
			img.src = src;
		}
	}

	function handleLoadedTexture( gl, texture ) {
		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );

		gl.bindTexture( gl.TEXTURE_2D, texture.glTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		gl.bindTexture( gl.TEXTURE_2D, null );
	}

	Texture.prototype.setSrc = function( src ) {
		this.image.src = src;
	};

	return Texture;
} )();

function CrateTexture( gl ) {
	var src = "static/_images/crate.gif";
	return new Texture( gl, src );
}

function FinishTexture( gl ) {
	var src = "static/_images/finish_crate.gif";
	return new Texture( gl, src );
}

function ImageTexture( gl ) {
	return new Texture( gl );
}
