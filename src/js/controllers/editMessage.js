'use strict';

app.controller('editMessage', ['$scope', 'Api', '$ionicPopup', '$cordovaToast','storeService','Toast','$http','API_URL', function($scope, Api, $ionicPopup, $cordovaToast, storeService,Toast,$http,API_URL) {
	$scope.messages = [];
	$scope.newmessage = storeService.jsonRead("shareData");
	console.log("new Message --> ",$scope.newmessage);
	$scope.formScope=null;
	$scope.setFormScope = function(frmMessage){
		$scope.formScope = frmMessage;
	}
	
	var dateStart = new Date($scope.newmessage.start);
	var dateEnd = new Date($scope.newmessage.end);
	
	$scope.datepickerObject = {
      titleLabel: 'Title',  //Optional
      todayLabel: 'Today',  //Optional
      closeLabel: 'Close',  //Optional
      setLabel: 'Set',  //Optional
      setButtonType : 'button-assertive',  //Optional
      todayButtonType : 'button-assertive',  //Optional
      closeButtonType : 'button-assertive',  //Optional
      inputDate: new Date(),    //Optional
      mondayFirst: true,    //Optional
      disabledDates: disabledDates, //Optional
      weekDaysList: weekDaysList,   //Optional
      monthList: monthList, //Optional
      templateType: 'popup', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(),   //Optional
      to: new Date(2030, 8, 25),    //Optional
      callback: function (val) {    //Mandatory
        datePickerCallback(val);
      }
    };
    
    var disabledDates = [];
    var weekDaysList = ["Sun", "Mon", "Tue", "Wed", "thu", "Fri", "Sat"];
    var monthList = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
    var datePickerCallback = function (val) {
	  if (typeof(val) === 'undefined') {
	    console.log('No date selected');
	  } else {
	  	$scope.datepickerObject.inputDate=val;
	  }
	};
	
	$scope.timePickerObjectStart = {
		inputEpochTime: (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60,  //Optional
		step: 1,  //Optional
		format: 24,  //Optional
		titleLabel: '24-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackStart(val);
		}
	};
	
	$scope.timePickerObjectEnd = {
		inputEpochTime: (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60,  //Optional
		step: 1,  //Optional
		format: 24,  //Optional
		titleLabel: '24-hour Format',  //Optional
		setLabel: 'Set',  //Optional
		closeLabel: 'Close',  //Optional
		setButtonType: 'button-positive',  //Optional
		closeButtonType: 'button-stable',  //Optional
		callback: function (val) {    //Mandatory
			timePickerCallbackEnd(val);
		}
	};
	
	function setTimeSelectedStart(hour,minute){
		$scope.startHour = hour;
	    if($scope.startHour<10)$scope.startHour='0'+$scope.startHour;
	    $scope.startMinute = minute;
	    if($scope.startMinute<10)$scope.startMinute='0'+$scope.startMinute;
	}
	
	function setTimeSelectedEnd(hour,minute){
		$scope.endHour = hour;
	    if($scope.endHour<10)$scope.endHour='0'+$scope.endHour;
	    $scope.endMinute = minute;
	    if($scope.endMinute<10)$scope.endMinute='0'+$scope.endMinute;
	}
	
	setTimeSelectedStart(dateStart.getHours(),dateStart.getMinutes())
	setTimeSelectedEnd(dateEnd.getHours(),dateEnd.getMinutes())
	
	
	function timePickerCallbackStart(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	    
	    var selectedTime = new Date(val * 1000),selected_hour,selected_minute;
	  	
	  	selected_hour = selectedTime.getUTCHours();
	  	selected_minute = selectedTime.getUTCMinutes();
	    
	    
	    /*var currentTime = new Date(),currentHour,currentMinute;
	    
	    currentHour = currentTime.getHours();
	    currentMinute = currentTime.getMinutes();
	    
	    if(currentHour<selected_hour){
	    	setTimeSelectedStart(selected_hour,selected_minute);
	    	$scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	//$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	//setTimeSelectedEnd(selected_hour,selected_minute);		//show the time in the button
	    }else{
	    	if(currentHour==selected_hour&&currentMinute<=selected_minute){
	    		setTimeSelectedStart(selected_hour,selected_minute);
	    		$scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		//$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    		//setTimeSelectedEnd(selected_hour,selected_minute);	//show the time in the button
	    	}else{
	    		Toast.show("Select a valid time");
	    	}
	    }*/
	    
	    setTimeSelectedStart(selected_hour,selected_minute);
	    $scope.timePickerObjectStart.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	  }
	}
	
	function timePickerCallbackEnd(val) {
	  if (typeof (val) === 'undefined') {
	    console.log('Time not selected');
	  } else {
	  	
	    var selectedTime = new Date(val * 1000),selected_hour,selected_minute;
	  	
	  	selected_hour = selectedTime.getUTCHours();
	  	selected_minute = selectedTime.getUTCMinutes();
	  	
	  	
	  	if($scope.startHour<selected_hour){
	    	setTimeSelectedEnd(selected_hour,selected_minute);
	    	$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    }else{
	    	if($scope.startHour==selected_hour&&$scope.startMinute<=selected_minute){
	    		setTimeSelectedEnd(selected_hour,selected_minute);
	    		$scope.timePickerObjectEnd.inputEpochTime = (selected_hour*60+selected_minute)*60;	//set the timepicker-end
	    	}
	    	else{
	    		Toast.show("Select a valid time");
	    	}
	    }
	  }
	}
	
	
	
	$scope.messageSubmit = function(message) {
		
		if(typeof message=='undefined'||!message.text) {
			Toast.show("The field Text is required.");
			return;
		}
		if(!message.expositor) {
			Toast.show("The field Presenter is required.");
			return;
		}
		
		if(!$scope.startHour) {
			Toast.show("The start time is required.");
			return;
		}
		
		if(!$scope.endHour){
			Toast.show("The end time is required.");
			return;
		}
		
		var dateObj = new Date();
		var month = dateObj.getUTCMonth() + 1; //months from 1-12
		var day = dateObj.getUTCDate();
		var year = dateObj.getUTCFullYear();
		
		
		// console.log(year+"<="+$scope.datepickerObject.inputDate.getFullYear()+"  "+month+"<="+($scope.datepickerObject.inputDate.getMonth()+1)+"  "+day+"<="+$scope.datepickerObject.inputDate.getDate());
		
		if(year<=$scope.datepickerObject.inputDate.getFullYear()&&month<=$scope.datepickerObject.inputDate.getMonth()+1&&day<=$scope.datepickerObject.inputDate.getDate()){}
		else{
			Toast.show("Please enter a valid Date");
			return;
		}
		
		/*var currentHour=(new Date()).getHours(),currentMinute=(new Date()).getMinutes();
		
		if(currentHour<$scope.startHour){}
		else{
			if(currentHour==$scope.startHour&&currentMinute<=$scope.startMinute){}
			else {
				Toast.show("Please enter a valid time");
				return;
			}
		}*/
		
		if($scope.startHour<$scope.endHour){}
		else{
			if($scope.startHour==$scope.endHour&&$scope.startMinute<=$scope.endMinute){}
			else{
				Toast.show("Please enter a valid time");
				return;
			}
		}
		
		var month = $scope.datepickerObject.inputDate.getUTCMonth() + 1; //months from 1-12
		var day = $scope.datepickerObject.inputDate.getUTCDate();
		var year = $scope.datepickerObject.inputDate.getUTCFullYear();
		
		var startTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.startHour+":"+$scope.startMinute,"YYYY-MM-DD HH:mm");
		var endTimeStamp = moment(year+"-"+month+"-"+day+" "+$scope.endHour+":"+$scope.endMinute,"YYYY-MM-DD HH:mm");
		console.log("original --> ",message);
		var message = {
			text: message.text,
			expositor: message.expositor,
			start: startTimeStamp,
			end: endTimeStamp,
			id: message.id
		}
        
        console.log("message: ",message);
		
		$http.post(API_URL + '/update-message', { message: message }).
			then(function(response) {
				Toast.show("Sending Request....", 30);
				
				$scope.datepickerObject.inputDate = new Date();
				
				$scope.timePickerObjectStart.inputEpochTime= (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60;  //Optional
				$scope.timePickerObjectEnd.inputEpochTime= (((new Date()).getHours() * 60)+(new Date()).getMinutes()) * 60;  //Optiona
			}, function(response) {
				Toast.show(response.statusText + " "+ response.data.error, 30);
		});
	};

	 $scope.showAlert = function(errTitle, errMsg) {
	   var alertPopup = $ionicPopup.alert({
	     title: errTitle,
	     template: errMsg
	   });
	   alertPopup.then(function(res) {
	     
	   });
	 };
}]);
