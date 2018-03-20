// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Packages;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (Packages = class Packages {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getLevelsObj = this.getLevelsObj.bind(this);
    this.helper = new ObjectHelper("packages");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("packages");
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.index;
    this.type = dbConfig.type;
  }

  getAll() {
    const query = {query: {match_all: {}}};
    return this.helper.count(query)
    .then(({count}) => {
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
});
