'use strict';

app.controller('settings', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','$timeout' , function($scope, Api, $ionicPopup, $cordovaToast,$timeout) {

	$scope.settings=[];
    Api.Setting.query({}, function(data){
    	$scope.nroSetting=data.length;
    	console.log("Number items "+$scope.nroSetting);
    	if($scope.nroSetting==1){
    		try{
    			$scope.newsetting = data[0];
    			$scope.title="Update";
    		}catch(e){
    			console.log("Error:"+e);
    		}
    	}else{
    		//Initialize
    		$scope.title="Add";
			$scope.newsetting = {
				"notification" : true,
				"usegooglemaps" : false,
				"googlemapapikey" : "",
				"email" : "",
				"sms" : "",
				"urgentalerts" : true,
				"devicesnotifications" : true,
				"devicenotrespondig" : false,
				"connectionlost" : false,
				"dFooterFO": "",
				"dBodyFO": "",
				"kThanksFO": "",
				"wTimeFO": "",
				"wQueueTD": ""
			};   //end json  		
    	} //en else
    }); // end query


	$scope.formScope=null;
	$scope.setFormScope = function(frmSetting){
		$scope.formScope = frmSetting;
	}
	
	$scope.settingSubmit = function() {

		//validate data
		if(!$scope.newsetting.email) {
			$scope.showAlert("Incorrect Value !!","Invalid Notification Email!");
			return;
		}else{
			 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.newsetting.email))  
			  {  
			    
			  }else{
			  	$scope.showAlert("You have entered an invalid email address!");
				return;
			  }			
		} //end else
		
		if($scope.nroSetting==1){
			console.info("***** UPDATE SETTINGS ******");
			Api.Setting.save({id:$scope.newsetting._id}, $scope.newsetting, 
	        function(data){
				$scope.settings.push($scope.newsetting);
				$scope.formScope.addSetttingForm.$setPristine();
				$scope.showAlert2("Update Succeful!!!","");
	        },
	        function(err){
	        	$scope.showAlert("System Error!!!", err.statusText);
				return false;
	        });	// end update		
		}else{
			console.info("***** CREATE SETTINGS ******");
			Api.Setting.save({},$scope.newsetting,
		     	function(data){
		     		$scope.settings.push($scope.newsetting);
		     		$scope.formScope.addSetttingForm.$setPristine();
		     		/*
		     		var defaultForm={
						notification:false,
						usegooglemaps:false,
						googlemapapikey:"",
						email:"",
						sms:"",
						urgentalerts:false,
						devicesnotifications:false,
						devicenotrespondig:false,
						connectionlost:false
		     		};*/
		     		//$scope.newsetting=defaultForm;
		     		$scope.showAlert("Save Succeful!!!","");
		     		
		     	},
			     	function(err){
			     		$scope.showAlert("System Error!!!",err.statusText);
			     		return false;
		     	}); // end save
		}//end else
	};

	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	   });
	 }; //end alert1
	 
	   $scope.showAlert2 = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle
	    // template: errMsg
	   });
	   alertPopup.then(function(res) {
	   });
	     
	     /*
	   	 $timeout(function() {
	   	 	console.info("*** CLOSE POPUP ***");
     		alertPopup.close(); //close the popup after 3 seconds for some reason
  		}, 3000);
	   	*/
	   };//end alert2
	 
}]);
