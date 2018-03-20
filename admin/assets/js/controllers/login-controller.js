// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const loginController = function($scope, $http, $mdToast) {
  $scope.users = [];

  const showToast = function(msg) {
    if (!msg) {
      msg = ' ';
    }
    $mdToast.show($mdToast.simple().textContent(msg).position('top').hideDelay(3000));
  };


  return $scope.login = function() {
    const {username, password} = $scope;
    if ((username != null) && (password != null)) {
      const req = {
        url: "/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: {email: username, password}
      };
      return $http(req)
      .then(function(data) {
        console.log("data", data);
        if (data.data.user.role === "admin") {
          // usersFact.user = data.data.user
          const userData = JSON.stringify(data.data.user);
          localStorage.setItem('userData', userData);
          showToast(`Welcome ${data.data.user.email}`);
        }
        return window.location.href = "/";}).catch(function(error) {
        console.log("Error occurred: ", error);
        return showToast("Check username or password ");
      });
    } else {
      showToast("Check username or password ");
      return console.log("username or password not defined");
    }
  };
};
loginController.$inject = ["$scope", "$http", "$mdToast"];
app.controller('loginController', loginController);