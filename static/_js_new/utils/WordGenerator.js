var WordGenerator = ( function() {

	var URL = "/getImageUrls";

	function generate( numOfUrlsRequested, onSuccess, onFailure ) {
		$.ajax( {
			url : URL,
			data : {
				"numberOfImagesRequested" : numOfUrlsRequested
			},
			dataType : 'json',
			success : function( data ) {
				word = data.word;
				urls = data.urls;

				onSuccess( word, urls );
			},
			error : onFailure
		} );
	}

	return {
		generate : generate
	};
} )();