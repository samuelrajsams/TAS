// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Campaigns;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (Campaigns = class Campaigns {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getPackageCampaigns = this.getPackageCampaigns.bind(this);
    this.addCampaign = this.addCampaign.bind(this);
    this.getCampaignsObj = this.getCampaignsObj.bind(this);
    this.getCampaignsForIds = this.getCampaignsForIds.bind(this);
    this.helper = new ObjectHelper("campaigns");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("campaigns");
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

  getPackageCampaigns(packageId) {
    const query = {query: {term: {package_id: packageId}}};
    return this.helper.count(query)
    .then(count => {
      return this.helper.search(query,count);
    });
  }

  addCampaign(campaignId, data) {
    return this.helper.create({id: campaignId, data});
  }

  getCampaignsObj() {
    const campaignsObj = {};
    return this.getAll()
    .then(results => {
      for (let campaign of Array.from(results)) {
        campaignsObj[campaign._id] = campaign;
      }
      return campaignsObj;
  }).catch(error => {
      logger.error("Error in getCampaignsObj: ", error);
      return Promise.reject(error);
    });
  }

  getCampaignsForIds(ids) {
    const query = {query: {ids: {values: ids}}};
    return this.helper.search(query, ids.length)
    .then(results => {
      const campaignsObj = {};
      for (let campaign of Array.from(results)) {
        campaignsObj[campaign._id] = campaign;
      }
      return campaignsObj;
  }).catch(error => {
      logger.error("Error in getCampaignsForIds: ", error);
      return Promise.reject(error);
    });
  }
});