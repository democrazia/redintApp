angular.module('app')


.controller('TabCtrl', function($scope, $state, StorageSrv){
  var user = StorageSrv.get('user');
  if(!user || !user.profile || !user.profile.name){
    $state.go('tab.profile');
  }
})


.controller('UsersCtrl', function($scope, $ionicPopover, UserSrv, PluginsSrv){
  var data = {};
  $scope.data = data;
  $scope.ctxData = {};

  setTimeout(function(){
    PluginsSrv.getPosition().then(function(position){
      return UserSrv.getPresents(position.coords);
    }).then(function(users){
      data.users = users;
    });
  }, 2000);

  $ionicPopover.fromTemplateUrl('templates/popover/user-actions.html', {
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


/*.controller('ChatsCtrl', function($scope, $timeout, $ionicScrollDelegate){
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

})*/


.controller('ProfileCtrl', function($scope, $q, $state, UserSrv, PluginsSrv, StorageSrv){
  $scope.data = {
    user: StorageSrv.get('user'),
    saving: false,
    status: [
      {id: 'dev', name: 'Développeur'},
      {id: 'biz', name: 'Marketing'},
      {id: 'crea', name: 'Créatif'}
    ]
  };

  $scope.save = function(profile){
    $scope.data.saving = true;
    var idPromise = PluginsSrv.getDeviceId();
    var emailPromise = PluginsSrv.getDeviceEmail();
    var positionPromise = PluginsSrv.getPosition();
    $q.all([idPromise, emailPromise, positionPromise]).then(function(results){
      var user = StorageSrv.get('user') || {};
      if(!user.created){user.created = Date.now();}
      user.id = results[0];
      user.email = results[1];
      user.profile = profile;
      user.profile.updated = Date.now();
      user.position = results[2].coords;
      user.position.updated = Date.now();
      UserSrv.save(user).then(function(){
        StorageSrv.set('user', user);
        $state.go('tab.users');
      });
    }, function(err){
      $scope.data.saving = false;
      PluginsSrv.showToast('Impossible de sauvegarder le profil :(');
    });
  };
});
