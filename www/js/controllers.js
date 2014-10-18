angular.module('app')


.controller('PeopleCtrl', function($scope, $ionicPopover, PeopleSrv){
  var data = {};
  $scope.data = data;
  $scope.ctxData = {};

  PeopleSrv.getPresents().then(function(peoples){
    data.peoples = peoples;
  });

  $ionicPopover.fromTemplateUrl('templates/popover/people-actions.html', {
    scope: $scope
  }).then(function(popover){
    $scope.popover = popover;
  });

  $scope.openPopover = function($event, user){
    $scope.ctxData = user;
    $scope.popover.show($event);
  };

  $scope.poke = function(){
    var user = $scope.ctxData;
    alert('poke '+user.name+' !');
    $scope.popover.hide();
  };

  $scope.chat = function(){
    var user = $scope.ctxData;
    alert('chat with '+user.name+' !');
    $scope.popover.hide();
  };

  $scope.viewProfile = function(){
    var user = $scope.ctxData;
    alert('viewProfile '+user.name+' !');
    $scope.popover.hide();
  };
})


.controller('ChatsCtrl', function($scope, $timeout, $ionicScrollDelegate){
  var alternate,
      isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

  $scope.sendMessage = function() {
    alternate = !alternate;
    $scope.messages.push({
      userId: alternate ? '12345' : '54321',
      text: $scope.data.message
    });
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  }

  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(true);
    }, 300);

  }
  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  }

  $scope.data = {};
  $scope.myId = '12345';
  $scope.messages = [];
})


.controller('ChatCtrl', function($scope, $stateParams){

})


.controller('ProfileCtrl', function($scope){
});
