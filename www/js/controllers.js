angular.module('app')

.controller('PeopleCtrl', function($scope, $ionicPopover, PeopleSrv){
  var data = {};
  $scope.data = data;

  PeopleSrv.getPresents().then(function(peoples){
    data.peoples = peoples;
  });


  $ionicPopover.fromTemplateUrl('templates/popover/people-actions.html', function(popover){
    $scope.popover = popover;
  });
})

.controller('ChatsCtrl', function($scope){

})

.controller('ChatCtrl', function($scope, $stateParams){

})

.controller('ProfileCtrl', function($scope){
});
