var TaskController;

TaskController = function($scope, $http, $mdToast) {
  var showToast, userData;
  $scope.users = [];
  $scope.camp = {};
  userData = JSON.parse(localStorage.getItem("userData"));
  $scope.campLevels = [
    {
      id: "P1L1",
      name: "P1-L1"
    }, {
      id: "P2L2",
      name: "P2-L2"
    }
  ];
  $scope.taskCategories = [
    {
      id: "01",
      name: "Cat-1A"
    }, {
      id: "02",
      name: "Cat-2A"
    }
  ];
  showToast = function(msg) {
    if (!msg) {
      msg = ' ';
    }
    $mdToast.show($mdToast.simple().textContent(msg).position('top').hideDelay(3000));
  };
  $scope.cancleCamp = function() {
    $scope.camp = {};
    $scope.campaignForm.$setPristine();
    return showToast("Hi " + userData.email + " Your Campaing data is NOT saved");
  };
  $scope.saveCamp = function() {
    var campData, req;
    campData = $scope.camp;
    campData.createDate = new Date();
    campData.cu_id = campData.taskCat + campData.level_id;
    campData.created_by = userData.email;
    console.log("campData : ", campData);
    if ((campData.name != null) && (campData.budget != null)) {
      req = {
        url: "/campaign-add",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        data: campData
      };
      return $http(req).then(function(data) {
        console.log("data", data);
        return showToast("Hi " + userData.email + " Your Campaing data is SAVED");
      })["catch"](function(error) {
        console.log("Error occurred: ", error);
        return showToast("Some error occurred please try after some time");
      });
    } else {
      return showToast("Please fill all required fields");
    }
  };
  $scope.campaignList = [
    {
      id: "01",
      name: "Camp 1",
      priority: "01",
      expDate: new Date()
    }, {
      id: "02",
      name: "Camp 2",
      priority: "04",
      expDate: new Date()
    }, {
      id: "04",
      name: "Camp 3",
      priority: "01",
      expDate: new Date()
    }, {
      id: "05",
      name: "Camp 4",
      priority: "02",
      expDate: new Date()
    }
  ];
  $scope.openEdit = function(campData) {
    $scope.showForm = true;
    $scope.editCamp = campData;
    return console.log("campaign Data to be edited: ", campData);
  };
  return $scope.cancleEdit = function() {
    $scope.editCamp = {};
    $scope.showForm = false;
    $scope.editCampaignForm.$setPristine();
    return showToast("Hi " + userData.email + " Your Campaing data is NOT saved");
  };
};

TaskController.$inject = ["$scope", "$http", "$mdToast"];

app.controller('TaskController', TaskController);
