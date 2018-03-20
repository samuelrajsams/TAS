// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ESHelper;
const Elasticsearch = require("elasticsearch");
const log4js = require("log4js");
const logger = log4js.getLogger();
const ClientsHelper = require("./clients-helper");
module.exports = (ESHelper = class ESHelper {
  constructor() {
    this.esClient = ClientsHelper.getESClient();
  }

  getFromES(params) {
    return this.esClient.search(params);
  }

  exists(data) {
    return this.esClient.exists(data);
  }
    
  storeInES(params) {
    console.log("esparams");
    console.log(params);
    return this.esClient.index(params);
  }

  bulk(data) {
    return this.esClient.bulk({body: data})
    .then(res => {
      return console.log("Bulk Ops performed on Data");
  }).catch(error => {
      return console.log("Error occured in Bulk:", error);
    }); 
  }

  get(params) {
    return this.esClient.get(params);
  }

  update(params) {
    return this.esClient.update(params);
  }

  count(params) {
    console.log("count");
    console.log(params);
    return this.esClient.count(params)
    .then(data => {
      if (data.count != null) {
        return data.count;
      } else {
        logger.error("count data format ES Helper incorrect: ",JSON.stringify(params));
        return Promise.reject(new Error("ES helper count data format error"));
      }
  }).catch(error => {
    console.log("this is es help error");
      logger.error("ES Helper Error :", JSON.stringify(params), error);
      return Promise.reject(error);
    });
  }
  
  search(params) {
    return this.esClient.search(params)
    .then(data => {
      if (__guard__(data != null ? data.hits : undefined, x => x.hits) != null) {
        return data.hits.hits.map(function(x) {
          x._source._id = x._id;
          return x._source;
        });
      } else {
        logger.error("data format ES Helper incorrect: ",JSON.stringify(params));
        return Promise.reject("Es Helper error: ");
      }
  }).catch(error => {
      logger.error("ES Helper Error :", JSON.stringify(params), error);
      return Promise.reject(error);
    });
  }

  aggs(params) {
    return this.esClient.search(params);
  }
});
function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}