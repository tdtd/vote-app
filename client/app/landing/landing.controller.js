'use strict';

angular.module('curateApp')
  .controller('LandingCtrl', function ($scope, $location, User, Auth) {
		$scope.curPath = $location.path();
	
		$scope.getPath = function(){
			$scope.curPath = $location.path();
		};
		$scope.goto = function (path){
			$location.path(path);
		};
			
		$scope.isLoggedIn = Auth.isLoggedIn();
		
		 $scope.logged = function(){
			 if ( $scope.isLoggedIn ) {
				$scope.goto('main')
			 }
		 };

		$scope.logged();
  });