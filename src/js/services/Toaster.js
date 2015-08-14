app.factory('Toast', function($rootScope, $timeout, $ionicPopup, $cordovaToast) {
	    return {
	        show: function (message, duration, position) {
	        	message = message || "There was a problem...";
	        	duration = duration || 'short';
	        	position = position || 'top';

	        	if (!!window.cordova) {
	        		// Use the Cordova Toast plugin
					$cordovaToast.show(message, duration, position);	        		
	        	}
	        	else {
                    if (duration == 'short') {
                        duration = 2000;
                    }
                    else {
                        duration = 5000;
                    }

  					var myPopup = $ionicPopup.show({
  						template: "<div class='loading-container'>" + message + "</div>",
  						scope: $rootScope,
  						buttons: []
  					});
  
  					$timeout(function() {
  						myPopup.close(); 
  					}, duration);
	        	}
			}
		};
	})