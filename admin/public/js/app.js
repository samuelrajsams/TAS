var app, configFactory, usersFact;

app = angular.module('mainApp', ["ngRoute", "ngMaterial"]);

configFactory = function() {
  var _obj;
  _obj = {};
  return _obj;
};

app.factory("config", configFactory);

usersFact = function() {
  var factory;
  factory = {};
  return factory;
};

app.factory("usersFact", usersFact);

app.config([
  "$routeProvider", function($routeProvider) {
    var i, len, results, route;
    results = [];
    for (i = 0, len = routes.length; i < len; i++) {
      route = routes[i];
      results.push($routeProvider.when(route.path, route));
    }
    return results;
  }
]);
