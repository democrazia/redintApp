angular.module('app')

.factory('Friends', function($q){
  // Some fake testing data
  var service = {
    all: function(){
      return $q.when(friends);
    },
    get: function(friendId){
      return $q.when(friends[friendId]);
    }
  };

  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return service;
});
