app.controller('deviceCtrl', ['$scope', 'Api','$ionicPopup', 'Toast','SessionService', "$http",'API_URL', function($scope, Api, $ionicPopup, Toast,SessionService, $http, API_URL) {
    
    Api.Device.query({}, function(data){
    	$scope.devices=data;
    }); // end query
    
    $scope.form = {};
    $scope.devices = [];
    $scope.listCanSwipe = true;
    
    $scope.cleanSessions = SessionService.getSessions();
    $scope.sessionArray = [];
    
    $scope.$watch('cleanSessions', function () {
        sessionsToArray($scope.cleanSessions);
	}, true);
	
	function sessionsToArray(sessions) {
        var total = 0;
		$scope.sessionArray = [];
		sessions.forEach(function (session) {
			// Skip invalid entries so they don't break the entire app.
			if (!session || !session.deviceName) {
				return;
			}
			console.log("session : ",session);
            $scope.sessionArray.push(session);    
			total++;
		});
		$scope.totalCount = total;
    }
    
    $scope.doRefresh;

    $scope.deleteAll = function(){
        Api.Device.delete({}, function(data){
            $scope.devices = [];
        })
    }
    
    $scope.delete = function(device){
        var confirmPopup = $ionicPopup.confirm({
         title: 'Delete!',
         template: 'Are you sure you want to delete this device? ' +device.tagid
       });
       confirmPopup.then(function(res) {
         if(res) {
            Api.Device.delete({id: device._id}, function(data){
                $scope.doRefresh();
            });
         } 
       });
    }
    
    $scope.addToDatabase = function(){
        Api.Device.save({}, $scope.form, 
        function(data){
            $scope.devices.push(data);
        },
        function(err){
             $scope.showAlert("Error!", err)
        });
    }
    
    $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
	 
	 $scope.resetSession = function (session) {
         $http.post(API_URL + '/sync', {sessionid : session.sessionid, socketid: session.socketid, action : 'reset', tagId : session.tagId, url : session.serverUrl}).
          then(function(response) {
             Toast.show("Reseting....", 30);
          }, function(response) {
              Toast.show(response.statusText + " "+ response.data.error, 30);
         });
	 };
	 
	 $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        Toast.show('Loading...');
        Api.Device.query({}, function(data){
            
            $scope.devices = data;
            $scope.refreshDataAmount();
        });
    }
    
    $scope.testSession = function() {
        $scope.data = {}
        $scope.persons = [
            {name: 'san ariel'},
            {name: 'santa anita'},
            {name: 'san bartolome'}
        ];
        $scope.personSelected = {};
        
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template:   '<div class="list">'+
                        '<label class="item item-input item-select">'+
                        '<div class="input-label">'+
                            'Select Person'+
                        '</div>'+
                        '<select class="form-control margin-bottom" ng-model="personSelected" ng-options="person as person.name for person in persons"><option></option></select>'+
                      '</label>'+
                    '</div>',
            title: 'Test',
            //subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
                
                {
                    text: '<b>Send</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.wifi) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                },
                { text: 'Cancel' }
              
            ]
        });
        
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
    };
    
}]);