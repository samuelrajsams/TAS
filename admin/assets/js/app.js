// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const app = angular.module('mainApp', [ "ngRoute", "ngMaterial"]);
const configFactory = function() {
  const _obj = {};
  // _obj.imageBaseUrl = "https://s3.ap-south-1.amazonaws.com/images.memoriesunlimited.com"
  return _obj;
};

app.factory("config", configFactory);

const usersFact = function() {
  const factory = {};
  
  return factory;
};
app.factory("usersFact", usersFact);


app.config(["$routeProvider", $routeProvider =>
  Array.from(routes).map((route) =>
    $routeProvider.when(route.path, route))

]); 