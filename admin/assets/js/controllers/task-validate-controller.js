// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TaskValidateController = function($scope, $http, $mdToast) {
  $scope.users = [];
  $scope.camp = {};
  // userData = usersFact.user
  const userData = JSON.parse(localStorage.getItem("userData"));

// adding few dummy data for view/ Validate task
  const dummyList = [ {user_id:"khajamunna20@gmail.com", task_data:{"url":"https://www.facebook.com/Bestonezone-446100089121306/", "facebook_page_id": "446100089121306"}},
                {user_id:"inthuvicky@gmail.com", task_data:{"url":"https://www.facebook.com/Wedobest-300775327092830/", "facebook_page_id": "446100089121306" }},
                {user_id:"khajamunna20@gmail.com", task_data:{"url":"https://www.facebook.com/Bestonezone-446100089121306/", "facebook_page_id": "446100089121306" }},
                {user_id:"inthuvicky@gmail.com", task_data:{"url":"https://www.facebook.com/Wedobest-300775327092830/", "facebook_page_id": "446100089121306" }}
            ];
  $scope.tasksList = dummyList;

  const showToast = function(msg) {
    if (!msg) {
      msg = ' ';
    }
    $mdToast.show($mdToast.simple().textContent(msg).position('top').hideDelay(3000));
  };

  const getTaskList = function(){
    const req = {
      url: "/tasks",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };
    return $http(req)
    .then(function(data) {
      console.log("data", data);
      if (data.data.data.length === 0) {
        showToast(`Hi ${userData.email} You don't have any task to validate`);
        return $scope.tasksList = dummyList;
      } else {
        return $scope.tasksList = data.data.data;
      }
    });
  };

  $scope.validateTask = function(task) {
    const taskData = task;
    taskData.valiated_date = new Date();
    taskData.valiate_by = userData.email;
    showToast(`Hi ${userData.email}\n Task for ${taskData.user_id} Can't be validated now`);
    return console.log("taskData : " ,taskData);
  };
    // idObj = {}
    // idObj.id = taskData.id
    // dataToSend = {"pages" : [idObj]}
    // req =
    //   url: "/api/v1/user/"+taskData.user_id + "/liked-pages"
    //   method: "POST"
    //   headers:
    //     "Content-Type": "application/json"
    //     "Accept": "application/json"
    //   data: taskData
    // $http req
    // .then (data) ->
    //   console.log "data", data
    //   showToast "Hi " +userData.email+ " Your task is valiidated"
    // .catch (error) ->
    //   console.log "Error occurred: ", error
    //   showToast "Some error occurred please try after some time"

  $scope.expndDiv = function(index) {
    if ($scope.showDiv === index) {
      return $scope.showDiv = -1;
    } else {
      return $scope.showDiv = index;
    }
  };

  $scope.openEdit = function(campData) {
    $scope.showForm = true;
    $scope.editCamp = campData;
    return console.log("campaign Data to be edited: ", campData);
  };

  $scope.cancleEdit = function() {
    $scope.editCamp = {};
    $scope.showForm = false;
    $scope.editCampaignForm.$setPristine();
    
    return showToast(`Hi ${userData.email} Your Campaing data is NOT saved`);
  };

  return $scope.init = () => getTaskList();
};

TaskValidateController.$inject = ["$scope", "$http", "$mdToast"];
app.controller('TaskValidateController', TaskValidateController);