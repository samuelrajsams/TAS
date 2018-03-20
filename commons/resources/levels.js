// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Levels;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (Levels = class Levels {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getLevelsObj = this.getLevelsObj.bind(this);
    this.getPackageLevels = this.getPackageLevels.bind(this);
    this.helper = new ObjectHelper("levels");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("levels");
    const dbPrefix = Globals.getDBPrefix();
    this.index = this.helper.index;
    this.type = this.helper.type;
  }

  getAll() {
    const query = {query: {match_all: {}}};
    return this.helper.count(query)
    .then(count => {
      return this.helper.search(query, count);
    });
  }

  getLevelsObj() {
    return this.getAll()
    .then(levels => {
      const levelsObj = {};
      for (let level of Array.from(levels)) {
        levelsObj[level._id] = level;
      }
      return levelsObj;
    });
  }

  getPackageLevels(packageId) {
    const query = {query: {term: {package_id: packageId}}};
    return this.helper.search(query, 100)
    .then(levels => {
      levels.sort(function(i, j) {
        const levelI = i.level_id.split("-")[1].replace("l", "");
        const levelJ = i.level_id.split("-")[1].replace("l", "");
        return parseInt(levelI) - parseInt(levelJ);
      });
      return levels;
    });
  }
});


