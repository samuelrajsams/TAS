var AppController;

AppController = function($scope, $http, $mdDialog, $mdSidenav, usersFact) {
  var userData, usersActions;
  userData = JSON.parse(localStorage.getItem("userData"));
  $scope.user = userData;
  usersActions = {
    adminActions: [
      {
        name: "Add Campaign",
        path: "campaign/add"
      }, {
        name: "View Campaign",
        path: "campaign/view"
      }, {
        name: "Validate Task",
        path: "task/validate"
      }
    ],
    pubActions: [
      {
        name: "Add Tasks Config",
        path: "tasks-config/add"
      }, {
        name: "View Tasks Config",
        path: "tasks-config/view"
      }
    ]
  };
  $scope.actions = usersActions.adminActions;
  $scope.openMenu = function() {
    return $mdSidenav("left").toggle();
  };
  $scope.logout = function() {
    var accept, confirm, reject;
    accept = function() {
      var req;
      req = {
        method: "POST",
        url: "/logout",
        headers: "application/json"
      };
      return $http(req).then(function(response) {
        if (response.status === 200) {
          return window.location = "/login";
        } else {
          return $mdToast.show($mdToast.simple({
            position: "top"
          }).content("Error occurred please contact admin"));
        }
      });
    };
    reject = function() {
      return console.log("logout rejected");
    };
    confirm = $mdDialog.confirm().title("Logout").content("Click YES to logout").ariaLabel("reset token").ok("YES").cancel("NO");
    return $mdDialog.show(confirm).then(accept, reject);
  };
  $scope.login = function() {
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
        console.log("data", data);
        return window.location.href = "/";
      })["catch"](function(error) {
        return console.log("Error occurred: ", error);
      });
    } else {
      return console.log("username or password not defined");
    }
  };
  return $scope.selectMenu = function(indexNum) {
    var i;
    i = 0;
    while (i < $scope.actions.length) {
      $scope.actions[i].selected = false;
      i++;
    }
    return $scope.actions[indexNum].selected = true;
  };
};

AppController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "usersFact"];

app.controller('AppController', AppController);
