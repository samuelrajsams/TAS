var AddOnsController;

AddOnsController = function($scope, $http, $mdDialog, $mdSidenav) {
  $scope.addons = [];
  $scope.saveAddon = function() {};
  return $scope.addAddon = function() {};
};

AddOnsController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav"];

app.controller('AddOnsController', AddOnsController);
