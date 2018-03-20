// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let LevelsIndexer;
const ClientsHelper = require("../../../commons/helpers/clients-helper");
const Globals = require("../../../commons/helpers/globals");
const Levels = require("../../../commons/resources/levels");
const log4js = require("log4js");
const {randomKey} = require("key-forge");
const logger = log4js.getLogger();
const csv = require("csvtojson");
const fs = require("fs");

module.exports = (LevelsIndexer = class LevelsIndexer {
  static run(config) {
    ClientsHelper.init(config);
    Globals.init(config);
    return new LevelsIndexer(config).indexLevels();
  }

  constructor(config) {
    this.indexToES = this.indexToES.bind(this);
    this.config = config;
    this.levels = new Levels();
    this.campaignsObj = {};
    this.index = this.levels.index;
    this.type = this.levels.type;
    this.esClient = ClientsHelper.getESClient();
  }

  deleteAllLevels() {
    const params = {
      index: this.index,
      body: { query: {match_all: {}}
    }
    };
    return this.esClient.deleteByQuery(params);
  }

  indexToES(levels) {
    const bulkCommandArray = [];
    for (let level of Array.from(levels)) {
      console.log(level);
      bulkCommandArray.push({index: {_index: this.index, _type: this.type, _id: level.level_id}});
      delete level._id;
      bulkCommandArray.push(level);
    }
    if (bulkCommandArray.length > 0) {
      return this.esClient.bulk({body: bulkCommandArray});
    } else {
      return Promise.reject(new Error("no valid levels found"));
    }
  }

  indexLevels() {
    let levels = this.config.levels;
    if(levels.length > 0){
      this.indexToES(levels)
      .then(function(data){
        console.log(data);
        logger.info("Total levels indexed: " + levels.length);
        // this.esClient.close();
        ClientsHelper.closeClients();
      });
    }else{
      // this.esClient.close();
      ClientsHelper.closeClients();
      logger.error("Please check level json file 0 levels found");
      Promise.reject(new Error("levels not found"));
    }
  }
});
