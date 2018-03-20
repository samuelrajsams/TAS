// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PlaystoreAppInstallValidator;
const PlaystoreAppsInstall = require("../../../../commons/resources/playstore-apps-installs");
const log4js = require("log4js");
const logger = log4js.getLogger();

module.exports = (PlaystoreAppInstallValidator = class PlaystoreAppInstallValidator {
  constructor(config) {
    this.config = config;
    this.playstoreAppsInstalls = new PlaystoreAppsInstall();
  }

  validate(task) {
    return new Promise((resolve, reject) => {
      const userId = task.user_id;
      const taskData = task.task_data;
      const {package_name} = taskData;
      return this.playstoreAppsInstalls.getUserInstallsForApp(userId, package_name)
      .then(function(packages) {
        if (packages.length > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }}).catch(function(error) {
        logger.error("Error in PlaystoreAppInstallValidator: ", error);
        logger.error("Task details: ", JSON.stringify(task));
        return reject(error);
      });
    });
  }
});