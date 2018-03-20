// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Validation;
const ClientsHelper = require("../../../commons/helpers/clients-helper");
const Globals = require("../../../commons/helpers/globals");
const UsersTasks = require("../../../commons/resources/users-tasks");
const ValidationEngine = require("./validation-engines");
const log4js = require("log4js");
const logger = log4js.getLogger("validation");

module.exports = (Validation = class Validation {
  static run(config) {
    ClientsHelper.init(config);
    Globals.init(config);
    return new (this)(config);
  }
  
  constructor(config) {
    this.validateTasks = this.validateTasks.bind(this);
    this.scrollTasks = this.scrollTasks.bind(this);
    this.usersTasks = new UsersTasks();
    this.validationEngine = new ValidationEngine();
    this.tasksCount = 0;
    this.validTasksCount = 0;
    this.tasksErrored = 0;
    this.scrollTasks();
  }

  validateTasks(tasks) {
    return new Promise((resolve, reject) => {
      let iterate;
      let currentIndex = 0;
      return (iterate = () => {
        if (currentIndex < tasks.length) {
          const task = tasks[currentIndex];
          this.validator = this.validationEngine.getValidator(task.task_category_type);
          return this.validator.validate(task)
          .then(isValid => {
            logger.info("task validations: ", task.user_id, task.task_category_type, isValid);
            if (isValid) {
              return this.validTasksCount++;
            }
        }).then(() => {
            currentIndex++;
            return iterate();
            }).catch(error => {
            this.tasksErrored++;
            logger.error("Error in validating tasks", error);
            currentIndex++;
            return iterate();
          });
        } else {
          return resolve();
        }
      })();
    });
  }

  scrollTasks(scrollId) {
    return this.usersTasks.scrollCompletedTasks(scrollId)
    .then(data => {
      ({ scrollId } = data);
      const { tasks } = data;
      this.tasksCount += tasks.length;
      if (tasks.length > 0) {
        return this.validateTasks(tasks)
        .then(() => {
          return this.scrollTasks(scrollId);
      }).catch(error => {
          return logger.error("Error in scrollTasks: ", error);
        });
      } else {
        logger.info("Validating tasks done");
        logger.info("Total tasks in completed state: ", this.tasksCount);
        logger.info("Total tasks validated: ", this.validTasksCount);
        return logger.info("Total Errored Tasks: ", this.tasksErrored);
      }
    });
  }
});