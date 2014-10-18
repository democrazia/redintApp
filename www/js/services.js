angular.module('app')

.factory('UserSrv', function($q, $http, $firebase, firebaseUrl){
  'use strict';
  var userUrl = firebaseUrl+'/users';
  var sync = $firebase(new Firebase(userUrl));
  var service = {
    getPresents: getPresents,
    save: save
  };

  function getPresents(coords){
    return $q.when(sync.$asArray());
  }

  function save(user){
    return $http.put(userUrl+'/'+user.id+'.json', user);
  }

  return service;
})

.factory('PluginsSrv', function($window, $q, $ionicPlatform, StorageSrv, Utils){
  'use strict';
  var service = {
    getPosition: getPosition,
    getDeviceId: getDeviceId,
    getDeviceEmail: getDeviceEmail,
    showToast: showToast
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
