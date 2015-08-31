'use strict';

angular.module('curateApp')
  .controller('MainCtrl', function ($scope, $location, $http, socket) {
    $scope.newPoll = {
			"title": '',
			"options" : [{}]
		};
	
	$scope.goto = function (path){
			$location.path(path);
		};
	
	$scope.addOption = function(){
		$scope.newPoll.options.push(new option());
	};
		
	$scope.removeOption = function(x){
		$scope.newPoll.options.splice(x, 1);
	};
    // Grab the initial set of available comments
    $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls;
      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('poll', $scope.polls, function(event, poll, polls) {
        // This callback is fired after the comments array is updated by the socket listeners
 				
        // sort the array every time its modified
        polls.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    });
 
    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
 
    // Use our rest api to post a new comment
    $scope.addPoll = function() {
			
      $http.post('/api/polls', { title: $scope.newPoll.title , content: $scope.newPoll.options });
			$scope.reForm();
    };
	
	$scope.reForm = function(){
		$scope.newPoll = {
			"title": '',
			"options" : []
		};
	};
});

var option = function(){
	option.title = '';
	option.votes = 0;
};