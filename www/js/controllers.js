angular.module('app')


.controller('TabCtrl', function($scope, $window, $state, UserSrv, StorageSrv, Config){
  $scope.showVersion = function(){
    $window.alert('version: '+Config.version);
  };

  var user = StorageSrv.get('user');
  if(!user || !user.profile || !user.profile.name){
    $state.go('tab.profile');
  }
  if(user && user.id){
    UserSrv.seen(user.id);
  }
})


.controller('UsersCtrl', function($scope, $ionicPopover, $ionicActionSheet, UserSrv, NotifSrv, PluginsSrv, StorageSrv){
  var user = StorageSrv.get('user');
  var data = {
    user: user,
    users: UserSrv.syncUsers(),
    notifs: [],
    hepSent: StorageSrv.get('hepSent') || {}
  };
  $scope.data = data;
  PluginsSrv.getDeviceId().then(function(userId){
    data.notifs = NotifSrv.syncNotifs(userId);
  });

  var notifAnswers = [
    { text: 'Je lève les bras !' },
    { text: 'A l\'entrée du Hub !' },
    { text: 'Je suis debout sur une chaise !' },
    { text: 'En bas à droite de l\'amphi !' },
    { text: 'Je fume une clope dehors !' },
    { text: 'A la machine à café !' }
  ];

  $ionicPopover.fromTemplateUrl('templates/popover/notifications.html', {
    scope: $scope
  }).then(function(popover){
    $scope.notifPopover = popover;
  });
  $scope.openNotifPopover = function($event){
    if(data.notifs.length > 0){
      $scope.notifPopover.show($event);
    }
  };

  $scope.readNotif = function(notif, from){
    if(!notif.read){
      NotifSrv.readNotif(user.id, notif);
    }
    $ionicActionSheet.show({
      titleText: 'Répondre :',
      buttons: notifAnswers,
      buttonClicked: function(index) {
        console.log('index', index);
        NotifSrv.sendNotif(user.id, from, notifAnswers[index].text);
        return true;
      }
    });
    $scope.notifPopover.hide();
  };

  $scope.hep = function(user){
    NotifSrv.sendNotif(data.user.id, user.id).then(function(){
      data.hepSent[user.id] = true;
      StorageSrv.set('hepSent', data.hepSent);
      PluginsSrv.showToast('✔ Notif envoyée !');
    });
  };

  $scope.doRefresh = function(){
    $scope.$broadcast('scroll.refreshComplete');
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
      user.lastSeen = Date.now();
      user.id = results[0];
      user.email = results[1];
      user.profile = profile;
      if(user.profile){user.profile.updated = Date.now();}
      user.position = results[2].coords;
      if(user.position){user.position.updated = Date.now();}
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
