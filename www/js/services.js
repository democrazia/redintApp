angular.module('app')

.factory('PeopleSrv', function($q, $firebase, firebaseUrl){
  'use strict';
  var ref = new Firebase(firebaseUrl+'/users');
  var sync = $firebase(ref);
  var service = {
    getPresents: getPresents
  };

  function getPresents(){
    /*
     * var user = {
     *  id: '',
     *  created: date,
     *  profile: {
     *    name: '',
     *    descriptions: '',
     *    profile: {},
     *    pitcher: true,
     *    updated: date
     *  },
     *  position: {
     *    updated: date
     *  }
     * }
     */
    //return $q.when(sync.$asArray());
    return $q.when([
      {id: '1', name: 'Kevin', description: 'Développeur web fullstack', profile: {id: 'dev', name: 'Dév'}, pitcher: true},
      {id: '2', name: 'Perrine', description: 'Designer print', profile: {id: 'crea', name: 'Créa'}, pitcher: false},
      {id: '3', name: 'Claude', description: 'Commercial chez Danone', profile: {id: 'biz', name: 'Biz'}, pitcher: false},
      {id: '4', name: 'Alice', description: 'Chef de projet, BNP', profile: {id: 'biz', name: 'Biz'}, pitcher: true},
      {id: '5', name: 'Julie', description: 'Développeuse mobile, iOS / Android', profile: {id: 'dev', name: 'Dév'}, pitcher: false}
    ]);
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
