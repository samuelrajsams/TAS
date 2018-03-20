// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let UsersTasks;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (UsersTasks = class UsersTasks {
  constructor() {
    this.addTask = this.addTask.bind(this);
    this.helper = new ObjectHelper("usersTasks");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("usersTasks");
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.index;
    this.type = dbConfig.type;
  }

    addTask(taskId, data) {
        return this.helper.create({id: taskId, data});
    }


  getTasks(userId, queryParams) {
    const filters = [{term: {user_id: userId}}];
    const { status } = queryParams;
    let levelId = queryParams.level;
    let packageId = queryParams.package;
    const accountId = queryParams["account-id"];

    if ((status != null) && ["pending", "completed", "validated"].includes(status)) {
      filters.push({term: {status: queryParams.status}});
    }
    if (packageId != null) {
      packageId = `p${packageId}`;
      filters.push({term: {package_id: packageId}});
      if (levelId != null) {
        levelId = `l${levelId}`;
        filters.push({term: {level_id: `${packageId}-${levelId}`}});
      }
    }
    if (accountId != null) {
      filters.push({term: {account_id: accountId}});
    }
    const query = {query: {bool: {must: filters}}};
    return this.helper.count(query)
    .then(count => {
      return this.helper.search(query, count);
  }).catch(function(error) {
      console.log("Error in UsersTasks:getTasks ", error);
      return Promise.reject(error);
    });
  }

  getCredits(userId) {
    const query = {
      query: {
        bool: {
          must:[
            {terms: {status: ["validated"]}},
            {term: {user_id: userId}}
            ]
        }
      },
      aggs: {
        credits: { 
          sum: {field: "task_credits"}
        }
      }
    };
    return this.helper.aggs(query)
    .then(data => data.aggregations.credits.value);
  }

  getAccountCredits(userId, accountId) {
    const query = {
      query: {
        bool: {
          must:[
            {terms: {status: ["validated"]}},
            {term: {user_id: userId}},
            {term: {account_id: accountId}}
            ]
        }
      },
      aggs: {
        credits: {
          sum: {field: "task_credits"}
        }
      }
    };
    return this.helper.aggs(query)
    .then(data => data.aggregations.credits.value);
  }

  getAssignedBrands(userId) {
    const query = {
      query: {
        term: {user_id: userId}
      }
    };
    return this.helper.count(query)
    .then(count => {
      query._source = ["task_category_brand_uid"];
      return this.helper.search(query,count);
    });
  }

  countTasksForBrandUID(userId, brandUID) {
    const query = {
      query: {
        bool: {
          must:[
            {term: {task_category_brand_uid: brandUID}},
            {term: {user_id: userId}}
          ]
        }
      }
    };
    return this.helper.count(query)
    .then(count => count);
  }

  getTask(taskId) {
    return this.helper.get(taskId);
  }

  updateTask(id, fieldValues) {
    return this.helper.update({id, data: fieldValues});
  }

  getAllTasks(queryParams) {
    const query = { query: {
      bool: {
        must:[
          {term: {task_category_type: "facebook_page_like"}}
        ]
      }
    }
  };
    return this.helper.count(query)
    .then(count => {
      return this.helper.search(query, count);
    });
  }

  markTaskAsCompleted(taskId) {
    return this.helper.update(taskId, {status: "validated"});
  }

  scrollCompletedTasks(scrollId) {
    const scrollTimeout = "10m";
    return Promise.resolve()
    .then(() => {
      if ((scrollId == null)) {
        const query = {
          query: {
            bool: {
              must:[
                {"term": {status: "completed"}}
              ]
            }
          }
        };
        return this.helper.getScrollId(query, 1000, scrollTimeout);
      } else {
        return this.helper.scroll(scrollId, scrollTimeout);
      }
  }).then(function(data) {
      const tasks = data.hits.hits.map(function(x) {
        x._source._id = x._id;
        x._source.task_data = JSON.parse(x._source.task_data);
        return x._source;
      });
      scrollId = data._scroll_id;
      return {scrollId, tasks};});
  }
});















 