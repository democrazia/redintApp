angular.module('app')

.factory('UserSrv', function($http, $firebase, firebaseUrl){
  'use strict';
  var userUrl = firebaseUrl+'/users';
  var sync = $firebase(new Firebase(userUrl));
  var service = {
    syncUsers: syncUsers,
    get: get,
    save: save,
    seen: seen,
    wereHeped: wereHeped
  };

  function syncUsers(){
    return sync.$asArray();
  }

  function get(userId){
    return $http.get(userUrl+'/'+userId+'.json').then(function(res){
      return res.data
    });
  }

  function save(user){
    return $http.put(userUrl+'/'+user.id+'.json', user);
  }

  function seen(userId){
    return $http.put(userUrl+'/'+userId+'/lastSeen.json', Date.now());
  }

  function wereHeped(userId){
    var counterRef = new Firebase(userUrl+'/'+userId+'/stats/heps');
    counterRef.transaction(function(current_value){
      return (current_value || 0) + 1;
    });
  }

  return service;
})

.factory('NotifSrv', function($window, $http, $firebase, PluginsSrv, UserSrv, firebaseUrl){
  'use strict';
  var notifUrl = firebaseUrl+'/notifs';
  var service = {
    syncNotifs: syncNotifs,
    sendNotif: sendNotif,
    readNotif: readNotif
  };

  function syncNotifs(userId){
    var ref = new Firebase(notifUrl+'/'+userId);
    var ret = $firebase(ref).$asArray();
    $window.setTimeout(function(){
      var start = Date.now();
      ref.endAt().limit(1).on('child_added', function(snapshot){
        var notif = snapshot.val();
        if(notif && notif.date && notif.date > start){
          PluginsSrv.vibrate(200);
        }
      });
    }, 20000);
    return ret;
  }

  function sendNotif(from, to, text){
    if(!text){
      UserSrv.wereHeped(to);
    }
    return $http.post(notifUrl+'/'+to+'.json', {
      from: from,
      date: Date.now(),
      text: text ? text : null,
      read: false
    });
  }

  function readNotif(userId, notif){
    notif.read = true;
    return $http.put(notifUrl+'/'+userId+'/'+notif.$id+'.json', notif);
  }

  return service;
})

.factory('PluginsSrv', function($window, $q, $ionicPlatform, StorageSrv, Utils){
  'use strict';
  var service = {
    getPosition: getPosition,
    getDeviceId: getDeviceId,
    getDeviceEmail: getDeviceEmail,
    showToast: showToast,
    vibrate: vibrate
  };

  function getDeviceId(){
    var defer = $q.defer();
    $ionicPlatform.ready(function(){
      var device = ionic.Platform.device();
      if(device && device.uuid){
        defer.resolve(device.uuid);
      } else {
        var user = StorageSrv.get('user');
        defer.resolve(user && user.id ? user.id : Utils.createUuid());
      }
    });
    return defer.promise;
  }

  function getDeviceEmail(){
    var defer = $q.defer();
    if($window.plugins && $window.plugins.DeviceAccounts){
      $ionicPlatform.ready(function(){
        $window.plugins.DeviceAccounts.getEmail(function(email){
          defer.resolve(email);
        }, function(error){
          defer.reject(error);
        });
      });
    } else {
      defer.resolve('fake@noplugin.fr');
    }
    return defer.promise;
  }

  function getPosition(){
    if(navigator && navigator.geolocation){
      var defer = $q.defer();
      $ionicPlatform.ready(function(){
        navigator.geolocation.getCurrentPosition(function(position){
          defer.resolve(position);
        }, function(error){
          defer.resolve(error);
        }, {
          enableHighAccuracy: true,
          timeout: 2000,
          maximumAge: 0
        });
      });
      return defer.promise;
    } else {
      return $q.when({error: true, message: 'navigator.geolocation does not exists !'});
    }
  }

  function showToast(message, duration, position, successCb, errorCb){
    if(!duration)   { duration  = 'short';            } // possible values : 'short', 'long'
    if(!position)   { position  = 'bottom';           } // possible values : 'top', 'center', 'bottom'
    if(!successCb)  { successCb = function(status){}; }
    if(!errorCb)    { errorCb   = function(error){};  }
    $ionicPlatform.ready(function(){
      if($window.plugins && $window.plugins.toast){
        $window.plugins.toast.show(message, duration, position, successCb, errorCb);
      }
    });
  }

  function vibrate(time){
    if(navigator && navigator.vibrate){
      $ionicPlatform.ready(function(){
        navigator.vibrate(time);
      });
    }
  }

  return service;
})

.factory('StorageSrv', function($window){
  'use strict';
  var localStorageCache = {};
  var localStoragePrefix = 'ionic-';
  var service = {
    get: get,
    set: set
  };

  function get(key){
    if(!localStorageCache[key] && $window.localStorage){
      localStorageCache[key] = JSON.parse($window.localStorage.getItem(localStoragePrefix+key));
    }
    return angular.copy(localStorageCache[key]);
  }

  function set(key, value){
    if(!angular.equals(localStorageCache[key], value)){
      localStorageCache[key] = angular.copy(value);
      if($window.localStorage){
        $window.localStorage.setItem(localStoragePrefix+key, JSON.stringify(localStorageCache[key]));
      }
    }
  }

  return service;
});
