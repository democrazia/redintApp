angular.module('app')

.filter('matchUser', function(){
  function distance(user1, user2){
    var location1 = user1 && user1.position && user1.position.latitude ? [user1.position.latitude, user1.position.longitude] : null;
    var location2 = user2 && user2.position && user2.position.latitude ? [user2.position.latitude, user2.position.longitude] : null;
    if(location1 && location2){
      return GeoFire.distance(location1, location2) * 1000; // distance in meters
    } else {
      return 0;
    }
  }
  
  return function(users, curUser){
    var filtered = [];
    if(users){
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(curUser.id != user.id && distance(user, curUser) < 100){
          filtered.push(user);
        }
      }
      // TODO : sort
    }
    return filtered;
  };
});
