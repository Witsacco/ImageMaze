function Timer( initSeconds, onExpire, onChange ) {
	this.secRemaining = initSeconds;
	this.onExpire = onExpire;
	this.onChange = onChange;
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

