var routes;

routes = [
  {
    path: "/tasks-config/add",
    templateUrl: "/views/tasks/add.html",
    controller: "TaskController"
  }, {
    path: "/tasks-config/view",
    templateUrl: "/views/tasks/view.html",
    controller: "TaskController"
  }, {
    path: "/task/validate",
    templateUrl: "/views/tasks/validate.html",
    controller: "TaskValidateController"
  }, {
    path: "/campaign/add",
    templateUrl: "/views/campaign/add.html",
    controller: "CampaignController"
  }, {
    path: "/campaign/view",
    templateUrl: "/views/campaign/view.html",
    controller: "CampaignController"
  }, {
    path: "/combos/view/:comboId",
    templateUrl: "/views/combos/combo.html",
    controller: "CombosController"
  }
];
