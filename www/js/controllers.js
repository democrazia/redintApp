angular.module('app')

.controller('PeopleCtrl', function($scope){
})

.controller('ChatsCtrl', function($scope, Friends){
  Friends.all().then(function(friends){
    $scope.friends = friends;
  });
})

.controller('ChatCtrl', function($scope, $stateParams, Friends){
  Friends.get($stateParams.chatId).then(function(friend){
    $scope.friend = friend;
  });
})

.controller('ProfileCtrl', function($scope){
});
