angular.module('app')

.filter('matchUser', function(){
  var deuxHeures = 2 * 60 * 60 * 1000;
  
  function distance(user1, user2){
    var location1 = user1 && user1.position && user1.position.latitude ? [user1.position.latitude, user1.position.longitude] : null;
    var location2 = user2 && user2.position && user2.position.latitude ? [user2.position.latitude, user2.position.longitude] : null;
    if(location1 && location2){
      return GeoFire.distance(location1, location2) * 1000; // distance in meters
    } else {
      return 0;
    }
  }

  function score(u1, u2){
    if(u1 && u1.stats && u1.stats.heps && u2 && u2.stats && u2.stats.heps){
      return u2.stats.heps - u1.stats.heps;
    } else {
      return u1.profile.name > u2.profile.name ? 1 : -1;
    }
  }

  return function(users, curUser){
    var filtered = [];
    if(users){
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(curUser && user && curUser.id != user.id && Date.now()-user.lastSeen < deuxHeures && distance(user, curUser) < 100){
          filtered.push(user);
        }
      }
      filtered.sort(score);
    }
    return filtered;
  };
})

.filter('humanTime', function(){
  'use strict';
  return function(timestamp){
    return timestamp ? moment(timestamp).fromNow(true) : '<humanTime>';
  };
});
