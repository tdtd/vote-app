'use strict';
angular.module('curateApp')
  .controller('PollCtrl', function ($scope, $rootScope, $stateParams, $http, socket, Auth) {
    $scope.message = $stateParams.id;
	
		$scope.user = Auth.getCurrentUser;
		$scope.auth = Auth.isLoggedIn;
		$scope.votable = true;
		$scope.selection = '';
		
		 $scope.data = [[]];
		 $scope.labels = [];
	
		$scope.viewResults = function(){
		if ($scope.auth() && ($scope.polls.voters.indexOf($scope.user()._id) == -1)){
				$scope.votable = true;
			} else {
				$scope.votable = false;
			};
			
			$scope.updatePoll();
		};
	
		$scope.vote = function(x){
			$scope.polls.content[x].votes += 1;
			$scope.polls.voters.push($scope.user()._id);
			$scope.viewResults();
			$scope.patchPoll();
		};
	
		$http.get('/api/polls/'+$scope.message).success(function(polls) {
			$scope.polls = polls;
			$scope.viewResults();
			$scope.selection = $scope.polls.content[0];
      // Update Poll Data
			$scope.updatePoll();
    });
	
 		$scope.updatePoll = function(){
			$scope.data = [[]];
		 	$scope.labels = [];
			
			for (var i = 0, len = $scope.polls.content.length; i < len; i++){
				$scope.labels.push($scope.polls.content[i].title);
				$scope.data[0].push($scope.polls.content[i].votes);
			};
		};
	
    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
 
    // Use our rest api to post a new comment
    $scope.patchPoll = function() {	
      $http.put('/api/polls/'+$scope.message, $scope.polls);		
    };
  });
