var Logger = (function(){
  'use strict';
  var backgroundUrl = 'https://redint.firebaseio.com'+(Config && Config.debug ? '/dev' : '');

  function _getUserId(){
    if(localStorage){
      var user = JSON.parse(localStorage.getItem('ionic-user'));
      if(user && user.id){
        return user.id;
      }
    }
  }

  return {
    error: function(err){
      if(!err.time) { err.time = Date.now();  }
      if(!err.user) { err.user = _getUserId();}
      $.ajax({
        type: 'POST',
        url: backgroundUrl+'/errors.json',
        data: JSON.stringify(err),
        contentType: 'application/json'
      });
    }
  };
})();



// catch exceptions
window.onerror = function(message, url, line, col, error){
  'use strict';
  var stopPropagation = false;
  var data = {
    type: 'javascript'
  };
  if(message)       { data.message      = message;      }
  if(url)           { data.fileName     = url;          }
  if(line)          { data.lineNumber   = line;         }
  if(col)           { data.columnNumber = col;          }
  if(error){
    if(error.name)  { data.name         = error.name;   }
    if(error.stack) { data.stack        = error.stack;  }
  }
  if(navigator){
    if(navigator.userAgent)   { data['navigator.userAgent']     = navigator.userAgent;    }
    if(navigator.platform)    { data['navigator.platform']      = navigator.platform;     }
    if(navigator.vendor)      { data['navigator.vendor']        = navigator.vendor;       }
    if(navigator.appCodeName) { data['navigator.appCodeName']   = navigator.appCodeName;  }
    if(navigator.appName)     { data['navigator.appName']       = navigator.appName;      }
    if(navigator.appVersion)  { data['navigator.appVersion']    = navigator.appVersion;   }
    if(navigator.product)     { data['navigator.product']       = navigator.product;      }
  }

  Logger.error(data);
  return stopPropagation;
};
