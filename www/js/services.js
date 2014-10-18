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
});
