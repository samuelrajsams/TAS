// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TasksRoutes;
const UsersTasks = require("../../../../commons/resources/users-tasks");
const Levels = require("../../../../commons/resources/levels");
const Campaigns = require("../../../../commons/resources/campaigns");
const Packages = require("../../../../commons/resources/packages");
const log4js = require("log4js");
const logger = log4js.getLogger();

module.exports = (TasksRoutes = class TasksRoutes {
  constructor(router) {
    this.getTasks = this.getTasks.bind(this);
    this.usersTasks = new UsersTasks();
    this.campaigns = new Campaigns();
    router.get("/tasks", this.getTasks);
  }
    // router.post "/validate-task", @validateTask

  getTasks(request, response) {
    let tasks = null;
    return this.usersTasks.getAllTasks()
    .then(_tasks => {
      tasks = _tasks;
      const campaignIds = tasks.map(x => x.campaign_id);
      return this.campaigns.getCampaignsForIds(campaignIds);
  }).then(campaignsObj => {
      for (let task of Array.from(tasks)) {
        const campaign = campaignsObj[task.campaign_id];
        task.campaign_title = campaign.name;
        task.campaign_description = campaign.description;
        task.campaign_icon_url = campaign.icon_url;
        delete task.task_category_id;
        delete task.campaign_id;
        task.task_data = JSON.parse(task.task_data);
      }
      const pagination = {cursors: {after: null, before: null}, prev: "", next: ""};
      const data = {data: tasks, pagination};
      response.statusCode = 200;
      return response.end(JSON.stringify(data));
    }).catch(function(error) {
      logger.error("Error in getTasks: ", error);
      response.statusCode = 500;
      return response.end(JSON.stringify({"message": "Internal server error"}));});
  }
});

  // validateTask: (request, response) =>
