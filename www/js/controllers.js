angular.module('app')

.controller('DashCtrl', function($scope){
})

.controller('FriendsCtrl', function($scope, Friends){
  Friends.all().then(function(friends){
    $scope.friends = friends;
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends){
  Friends.get($stateParams.friendId).then(function(friend){
    $scope.friend = friend;
  });
})

.controller('AccountCtrl', function($scope){
});
