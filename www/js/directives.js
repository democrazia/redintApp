angular.module('app')

.directive('userName', function(UserSrv){
  return {
    restrict: 'E',
    template: '<span>{{name}}</span>',
    scope: {
      id: '@'
    },
    link: function(scope, element, attr) {
      UserSrv.get(scope.id).then(function(user){
        scope.name = user.profile.name;
      });
    }
  };
})

.directive('input', function($timeout){
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})

.directive('loader', function(){
  return {
    restrict: 'E',
    template: '<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
  };
});
