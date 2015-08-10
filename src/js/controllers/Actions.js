'use strict';

app.controller('Actions', function($scope, $ionicActionSheet, $ionicModal) {
	$ionicModal.fromTemplateUrl('templates/edit-action.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modal = modal;
		$scope.editaction = {};
	});
	$scope.actionHold = function(action) {
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: 'Edit' },
			],
			destructiveText: 'Delete',
			titleText: 'Modify Action',
			cancelText: 'Cancel',
			cancel: function() {
				return true;
			},
			buttonClicked: function(index) {
				$scope.editaction = action;
				$scope.modal.show();
				return true;
			},
			destructiveButtonClicked: function(index) {
				$scope.actions.splice($scope.actions.indexOf(action), 1);
				return true;
			}
		});
	}
});