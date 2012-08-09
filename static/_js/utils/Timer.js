function Timer( initSeconds ) {
	this.secRemaining = initSeconds;
}

Timer.prototype.start = function() {
	var that = this;
	
	this.curInterval = setInterval( function() {
		that.secRemaining -= 1;
		
		// Invoke event handling clock changes
		that.onChange( that.secRemaining );

		if ( that.secRemaining === 0 ) {
			that.onExpire();
			
			// Stop decrementing the timer
			that.stop();
		}
		
	}, 1000 );
};

Timer.prototype.stop = function() {
	clearInterval( this.curInterval );
};

Timer.prototype.add = function( secToAdd ) {
	this.secRemaining += secToAdd;
	
	this.onChange( this.secRemaining );
};

Timer.prototype.setOnChange = function( onChange ) {
	this.onChange = onChange;
};

Timer.prototype.setOnExpire = function( onExpire ) {
	this.onExpire = onExpire;
};