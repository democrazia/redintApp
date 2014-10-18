angular.module('app')

.factory('UserSrv', function($rootScope, $q, $http, firebaseUrl){
  'use strict';
  var userUrl = firebaseUrl+'/users';
  var firebaseRef = new Firebase(userUrl);
  //var geoFire = new GeoFire(firebaseRef);
  var collection = [];
  firebaseRef.on('child_added', function(childSnapshot, prevChildName){
    var user = childSnapshot.val();
    console.log('child_added', user);
    $rootScope.safeApply(function(){
      collection.push(user);
    });
  });
  firebaseRef.on('child_removed', function(oldChildSnapshot){
    var user = oldChildSnapshot.val();
    console.log('child_removed', user);
    $rootScope.safeApply(function(){
      for(var i in collection){
        if(collection[i].id === user.id){
          collection.splice(i, 1);
        }
      }
    });
  });
  firebaseRef.on('child_changed', function(childSnapshot, prevChildName){
    var user = childSnapshot.val();
    console.log('child_changed', user);
    $rootScope.safeApply(function(){
      for(var i in collection){
        if(collection[i].id === user.id){
          angular.copy(user, collection[i]);
        }
      }
    });
  });

  var service = {
    syncUsers: syncUsers,
    syncLocalUsers: syncLocalUsers,
    get: get,
    save: save
  };

  function syncUsers(coords){
    return collection;
  }

  function syncLocalUsers(coords){
    var results = [];
    /*var position = [coords.latitude, coords.longitude];
    console.log('geoFire.query({center: '+position+', radius: 0.1})');
    var geoQuery = geoFire.query({center: position, radius: 0.1});

    geoQuery.on('key_entered', function(key, location, distance){
      console.log(key + ' entered query at ' + location + ' (' + distance + ' km from center)');
      get(key).then(function(user){
        user._rel = {
          location: location,
          distance: distance*1000 // distance in meters
        };
        results.push(user);
      });
    });
    geoQuery.on('key_exited', function(key, location, distance){
      console.log(key + ' exited query to ' + location + ' (' + distance + ' km from center)');
      for(var i in results){
        if(results[i].id === key){
          results.splice(i, 1);
        }
      }
    });*/
    return results;
  }

  function get(userId){
    return $http.get(userUrl+'/'+userId+'.json').then(function(res){
      return res.data
    });
  }

  function save(user){
    /*var userPromise = $http.put(userUrl+'/'+user.id+'.json', user);
    if(user && user.position && user.position.latitude){
      var position = [user.position.latitude, user.position.longitude];
      console.log('geoFire.set('+user.id+', '+position+')');
      var geoPromise = geoFire.set(user.id, position);
    } else {
      console.log('geoFire.remove('+user.id+')');
      var geoPromise = geoFire.remove(user.id);
    }
    return $q.all([userPromise, geoPromise]);*/
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
