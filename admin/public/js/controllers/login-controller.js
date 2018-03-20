var loginController;

loginController = function($scope, $http, $mdToast) {
  var showToast;
  $scope.users = [];
  showToast = function(msg) {
    if (!msg) {
      msg = ' ';
    }
    $mdToast.show($mdToast.simple().textContent(msg).position('top').hideDelay(3000));
  };
  return $scope.login = function() {
    var password, req, username;
    username = $scope.username, password = $scope.password;
    if ((username != null) && (password != null)) {
      req = {
        url: "/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: {
          email: username,
          password: password
        }
      };
      return $http(req).then(function(data) {
        var userData;
        console.log("data", data);
        if (data.data.user.role === "admin") {
          userData = JSON.stringify(data.data.user);
          localStorage.setItem('userData', userData);
          showToast("Welcome " + data.data.user.email);
        }
        return window.location.href = "/";
      })["catch"](function(error) {
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
