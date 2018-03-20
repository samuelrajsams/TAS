// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const AppController = function($scope, $http, $mdDialog, $mdSidenav, usersFact) {
  // userData = usersFact.user
  const userData = JSON.parse(localStorage.getItem("userData"));
  $scope.user = userData;
  const usersActions = {
    adminActions :[
      // {name: "Add Tasks Config", path: "tasks-config/add"},
      // {name: "View Tasks Config", path: "tasks-config/view"}
      {name: "Add Campaign", path: "campaign/add"},
      {name: "View Campaign", path: "campaign/view"},
      {name: "Validate Task", path: "task/validate"}
      // {name: "Add Publishers", path: "publishers/add"},
      // {name: "View Publishers", path: "publishers/view"}
    ],
    pubActions :[
      {name: "Add Tasks Config", path: "tasks-config/add"},
      {name: "View Tasks Config", path: "tasks-config/view"}
    ]
  };

  $scope.actions = usersActions.adminActions;

  $scope.openMenu = () => $mdSidenav("left").toggle();
  $scope.logout = function() {
    const accept = function() {
      const req = {
        method: "POST",
        url: "/logout",
        headers: "application/json"
      };
      return $http(req)
      .then(function(response) {
        if (response.status === 200) {
          return window.location = "/login";
        } else {
          return $mdToast.show($mdToast.simple({position: "top"}).content("Error occurred please contact admin"));
        }
      });
    };
    const reject = () => console.log("logout rejected");

    const confirm = $mdDialog.confirm()
      .title("Logout")
      .content("Click YES to logout")
      .ariaLabel("reset token")
      .ok("YES")
      .cancel("NO");
    return $mdDialog.show(confirm)
      .then(accept, reject);
  };
  $scope.login = function() {
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
        return window.location.href = "/";}).catch(error => console.log("Error occurred: ", error));
    } else {
      // toast messages to be shown
      return console.log("username or password not defined");
    }
  };

  return $scope.selectMenu = function(indexNum) {
    let i = 0;
    while (i < $scope.actions.length) {
      $scope.actions[i].selected = false;
      i++;
    }

    return $scope.actions[indexNum].selected = true;
  };
};

AppController.$inject = ["$scope", "$http", "$mdDialog", "$mdSidenav", "usersFact"];
app.controller('AppController', AppController);