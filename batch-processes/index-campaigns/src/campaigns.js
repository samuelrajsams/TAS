// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let CampaignsIndexer;
const ClientsHelper = require("../../../commons/helpers/clients-helper");
const Globals = require("../../../commons/helpers/globals");
const Campaigns = require("../../../commons/resources/campaigns");
const log4js = require("log4js");
const {randomKey} = require("key-forge");
const logger = log4js.getLogger();
const csv = require("csvtojson");
const fs = require("fs");

module.exports = (CampaignsIndexer = class CampaignsIndexer {
  static run(config) {
    ClientsHelper.init(config);
    Globals.init(config);
    return new CampaignsIndexer(config).indexCampaigns();
  }

  constructor(config) {
    this.indexToES = this.indexToES.bind(this);
    this.config = config;
    this.campaigns = new Campaigns();
    this.campaignsObj = {};
    this.index = this.campaigns.index;
    this.type = this.campaigns.type;
    this.esClient = ClientsHelper.getESClient();
  }

  deleteAllCampaigns() {
    const params = {
      index: this.index,
      body: { query: {match_all: {}}
    }
    };
    return this.esClient.deleteByQuery(params);
  }

  indexToES(campaigns) {
    const bulkCommandArray = [];
    for (let campaign of Array.from(campaigns)) {
      bulkCommandArray.push({index: {_index: this.index, _type: this.type, _id: campaign._id}});
      delete campaign._id;
      bulkCommandArray.push(campaign);
    }
    if (bulkCommandArray.length > 0) {
      return this.esClient.bulk({body: bulkCommandArray});
    } else {
      return Promise.reject(new Error("no valid campaigns found"));
    }
  }

  indexCampaigns() {
    let campaigns = [];
    return this.loadCampaignsFromFile()
    .then(_campaigns => {
      campaigns = _campaigns;
      if (campaigns.length > 0) {
        return this.deleteAllCampaigns()
        .then(() => {
          return this.indexToES(campaigns);
        });
      } else {
        logger.error("O campaigns found please check campaigns.csv");
        return Promise.reject(new Error("campaigns not found"));
      }
  }).then(() => {
      return logger.info("Total campaigns indexed: ", campaigns.length);
    });
  }

  loadCampaignsFromFile() {
    const campaigns = [];
    const campaignsFile = `${this.config.campaignsFolder}/campaigns.csv`;
    return new Promise((resolve, reject) => {
      if ((campaignsFile != null ? campaignsFile.length : undefined) > 0) {
        return csv()
        .fromFile(campaignsFile)
        .on('json', jsonObj => {
          if ((jsonObj.unique_id != null ? jsonObj.unique_id.length : undefined) > 0) {
            return campaigns.push(jsonObj);
          }
      }).on('done', function(error) {
          if (error != null) {
            logger.error("Error in campaignsFile: ", error);
            return Promise.reject(error);
          } else {
            // move the file to processed
            return resolve(campaigns);
          }
        });
      } else {
        logger.error("campaigns file not found");
        return resolve(campaigns);
      }
    });
  }
});
