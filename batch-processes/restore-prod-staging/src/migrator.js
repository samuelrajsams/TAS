// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Migrator;
const Elasticsearch = require("elasticsearch");
const log4js = require("log4js");
const {randomKey} = require("key-forge");
const logger = log4js.getLogger();
const csv = require("csvtojson");
const fs = require("fs");

module.exports = (Migrator = class Migrator {
  static run(config) {
    return new Migrator(config);
  }

  constructor(config) {
    let productionConfig, stagingConfig;
    this.scroll = this.scroll.bind(this);
    this.indexHits = this.indexHits.bind(this);
    this.transferDocs = this.transferDocs.bind(this);
    this.migrate = this.migrate.bind(this);
    this.run = this.run.bind(this);
    this.scrollSize = 1000;
    ({productionConfig, stagingConfig, dbConfig: this.dbConfig} = config);
    let {elasticsearch} = productionConfig;
    this.prodESClient = new Elasticsearch.Client({host:`${elasticsearch.host}:${elasticsearch.port}`, keepAlive:false});
    ({elasticsearch} = stagingConfig);
    this.stagingESClient = new Elasticsearch.Client({host:`${elasticsearch.host}:${elasticsearch.port}`, keepAlive:false});
    this.run();
  }

  scroll(index, scrollId) {
    let params;
    if ((scrollId == null)) {
      const query = {query: {match_all: {}}};
      params = {index, scroll: "2m", body: query};
      return this.prodESClient.search(params);
    } else {
      params = {scrollId, scroll: "2m"};
      return this.prodESClient.scroll(params);
    }
  }

  indexHits(index, hits) {
    const bulkCommandArray = [];
    for (let hit of Array.from(hits)) {
      bulkCommandArray.push({index:{_index: hit._index, _type: hit._type, _id: hit._id}});
      bulkCommandArray.push(hit._source);
    }
    this.stagingESClient.bulk({body: bulkCommandArray});
    return Promise.resolve();
  }

  transferDocs(index) {
    return new Promise((resolve, reject) => {
      let iterate;
      let scrollId = null;
      const stats = {read: 0, indexed: 0};
      return (iterate = () => {
        return this.scroll(index, scrollId)
        .then(data => {
          scrollId = data._scroll_id;
          if (data.hits.hits.length > 0) {
            stats.read += data.hits.hits.length;
            this.indexHits(index, data.hits.hits)
            .then(data => {
              console.log(data);
              return stats.indexed += 1;
          }).catch(error => {
              return console.log(`Error in indexing docs to staing ${index}: `, error);
            });
            return setTimeout(iterate, 1000);
          } else {
            return resolve();
          }
      }).catch(error => {
          return console.log(`Error in scroll ${index} `, error);
        });
      })();
    });
  }

  migrate(entity) {
    return new Promise((resolve, reject) => {
      const entityConfig = this.dbConfig[entity];
      if (entityConfig != null) {
        let index;
        const scrollId = null;
        if (entityConfig.usePrefix != null) {
          index = `${this.dbConfig.dbPrefix}_${entityConfig.index}`; 
        } else { 
          index = `${entityConfig.index}`;
        }
        return this.transferDocs(index)
        .then(function(stats) {
          console.log(stats);
          return resolve();}).catch(function(error) {
          console.log("Error in transferring docs: ", error);
          return reject(error);
        });
      } else {
        console.log(`Entity config not defined: ${entity}`);
        return resolve();
      }
    });
  }

  run() {
    return this.migrate("campaigns")
    .then(() => {
      return this.migrate("levels");
  }).then(() => {
      return this.migrate("taskCategory");
    }).then(() => {
      return this.migrate("packages");
    });
  }
});