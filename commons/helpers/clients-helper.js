// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Elasticsearch = require("elasticsearch");
const Redis = require("redis");

let esClient = null;
let redisClient = null;

module.exports = { 
  init(config) {
    const {elasticsearch, redis} = config;
    esClient = new Elasticsearch.Client({host:`${elasticsearch.host}:${elasticsearch.port}`, keepAlive:false});
    //console.log(esClient);
    return redisClient = new Redis.createClient(redis.port, redis.host);
  },

  getESClient() {
    return esClient;
  },

  getRedisClient() {
    return redisClient;
  },

  closeClients() {
    esClient.close();
    redisClient.quit();
  }
};