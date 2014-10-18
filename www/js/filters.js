angular.module('app')

.filter('matchUser', function(){
  return function(users, curUser){
    var filtered = [];
    if(users){
      for (var i = 0; i < users.length; i++) {
        var user = users[i];
        if(curUser.id != user.id){
          filtered.push(user);
        }
      }
      // TODO : sort
    }
    return filtered;
  };
});
