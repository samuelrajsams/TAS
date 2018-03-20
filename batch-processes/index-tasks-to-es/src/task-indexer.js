// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let TaskIndexer;
const ClientsHelper = require("../../../commons/helpers/clients-helper");
const Globals = require("../../../commons/helpers/globals");
const Campaigns = require("../../../commons/resources/campaigns");
const UsersTasks = require("../../../commons/resources/users-tasks");
const log4js = require("log4js");
const {randomKey} = require("key-forge");
const logger = log4js.getLogger();
const csv = require("csvtojson");
const fs = require("fs");
module.exports = (TaskIndexer = class TaskIndexer {
  static run(config) {
    ClientsHelper.init(config);
    Globals.init(config);
    return new TaskIndexer(config);

  }

  constructor(config) {
    console.log("config");
    console.log(config.allocationFilesFolder);
    this.getCampaignsObj = this.getCampaignsObj.bind(this);
    this.indexUserTask = this.indexUserTask.bind(this);
    this.campaigns = new Campaigns();
    this.usersTasks = new UsersTasks();
    this.campaignsObj = {};
    this.allocationFilesFolder = config.allocationFilesFolder;
    this.allocateTasks();
  }

  getCampaignsObj() {
    return this.campaigns.getAll()
    .then(results => {
      return Array.from(results).map((campaign) =>
        (this.campaignsObj[campaign._id] = campaign));
  }).catch(error => {
      logger.error("Error in getCampaignsObj: ", error);
      return Promise.reject(error);
    });
  }

  indexUserTask(allocationObj) {
    return new Promise((resolve, reject) => {
      const userId = allocationObj.user_id;
      const accountId = allocationObj.AccountId;
      const campaign = this.campaignsObj[allocationObj.assigned];
      if (campaign != null) {
        allocationObj.status = "not indexed";
        const {level_id, package_id, task_category_data, task_category_type} = campaign;
        const {task_category_brand_uid} = campaign;
        
        const taskObj = {level_id, package_id, task_category_type, task_category_brand_uid};
        taskObj.user_id = userId;
        taskObj.campaign_id = campaign._id;
        taskObj.account_id = accountId;
        taskObj.task_data = task_category_data;
        taskObj.status = "pending";
        taskObj.task_credits = campaign.user_credits;
        const now = new Date().toISOString();
        taskObj.create_time = now;
        taskObj.update_time = now;
        return this.usersTasks.countTasksForBrandUID(userId, task_category_brand_uid)
        .then(count => {
          if (count === 0) {
            const taskId = randomKey(9);
            return this.usersTasks.addTask(taskId, taskObj)
            .then(() => {
              allocationObj.status = "indexed";
              return resolve();
          }).catch(error => {
            console.log("hiiiiii");
              logger.error(`Error in indexing user task: ${userId}, ${campaign._id}`, error);
              allocationObj.reason = `error in indexing: ${error.message}, userId: ${userId}, campaignId: ${campaign._id}`;
              return resolve();
            });
          } else {
            logger.info(`user already assigned task: ${task_category_brand_uid}`);
            allocationObj.reason = `user already assigned this brand ${task_category_brand_uid}`;
            return resolve();
          }
      }).catch(error => {
        console.log("hiiiiiiiiiiiiiiiiiiiii");
          logger.error(`Error in countTasksForBrandUID: ${userId}, ${task_category_brand_uid}`, error);
          task.reason = `error in get count for brandUID: ${error.message}`;
          return resolve();
        });
      } else {
        logger.info("campaign not found: ", allocationObj.assigned);
        allocationObj.status = "not indexed";
        allocationObj.reason = "campaign not found";
        return resolve();
      }
    });
  }

  indexAllocatedTasks(allocatedTasks) {
    console.log("pls",allocatedTasks);
    return new Promise((resolve, reject) => {
      let iterate;
      let currentIndex = 0;
      return (iterate = () => {
        if (currentIndex < allocatedTasks.length) {
          const task = allocatedTasks[currentIndex];
          return this.indexUserTask(task)
          .then(() => {
            currentIndex++;
            return iterate();
        }).catch(error => {
            logger.error("Error in indexAllocatedTasks: ", error);
            if ((task.status == null)) {
              task.status = "not indexed";
              task.reason = error.message;
            }
            currentIndex++;
            return iterate();
          });
        } else {
          return resolve();
        }
      })();
    });
  }


  readAllocationFile(allocationFile) {
    const allocatedTasks = [];
    return new Promise((resolve, reject) => {
      if ((allocationFile != null ? allocationFile.length : undefined) > 0) {
        return csv()
        .fromFile(allocationFile)
        .on('json', jsonObj => {
          if (((jsonObj.user_id != null ? jsonObj.user_id.length : undefined) > 0) && ((jsonObj.assigned != null ? jsonObj.assigned.length : undefined) > 0)) {
            return allocatedTasks.push(jsonObj);
          }
      }).on('done', function(error) {
          if (error != null) {
            logger.error("Error in readAllocationFile: ", error);
            return Promise.reject(error);
          } else {
            // move the file to processed
            return resolve(allocatedTasks);
          }
        });
      } else {
        return resolve();
      }
    });
  }

  allocateTasks() {
    return this.getCampaignsObj()
    .then(() => {
      let iterate;
      console.log("allocations folder:", this.allocationFilesFolder);
      const files = fs.readdirSync(this.allocationFilesFolder);
      console.log(files);
      let currentIndex = 0;
      return (iterate = () => {
        if (currentIndex < files.length) {
          const file = files[currentIndex];
          const allocationFile = `${this.allocationFilesFolder}/${file}`;
          console.log("allocation file", allocationFile);
          return this.readAllocationFile(allocationFile)
          .then(allocatedTasks => {
            logger.info(`allocatedTasks: ${allocatedTasks.length}`);
            return this.indexAllocatedTasks(allocatedTasks);
        }).then(() => {
            currentIndex++;
            return iterate();
          }).catch(error => {
            logger.error(`Error while allocateTasks currentIndex: ${currentIndex}, filename: ${filename} `, error);
            currentIndex++;
            return iterate();
          });
        } else {
          return logger.info(`Iteration done for files: ${files.length}`);
        }
      })();
    });
  }
});

