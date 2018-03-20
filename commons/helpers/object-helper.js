// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ObjectHelper;
const ClientsHelper = require("./clients-helper");
const RedisHelper = require("./redis-helper");
const ESHelper = require("./es-helper");
const Globals = require("./globals");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (ObjectHelper = class ObjectHelper {
  constructor(name) {
    this.esClient = ClientsHelper.getESClient();
    this.redisHelper = new RedisHelper();
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig(name);
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.usePrefix ? `${dbPrefix}_${dbConfig.index}` : dbConfig.index;
    this.type = dbConfig.type;
  }

  get(id) {
    const params = {
      index: this.index,
      type: this.type,
      id
    };
    return this.esHelper.get(params)
    .then(data => {
      if ((data != null ? data._source : undefined) != null) {
        data._source._id = data._id;
        return data._source;
      } else {
        return Promise.reject(new Error(`${this.type} ${id} not found`));
      }
    });
  }

  exists(id) {
    const data = { 
      index: this.index,
      type: this.type,
      id
    };
    return this.esHelper.exists(data);  
  }

  create({id, data}) {
    const params = {
      index: this.index,
      type: this.type,
      id,
      body: data
    };
    return this.esHelper.storeInES(params);
  }

  list() {
    const query = { 
      query: {
        match_all: {}
      }
    };
    return this.count(query)
    .then(count => {
      return this.search(query, count);
    });
  }

  update({id, data}) {
    delete data._id;
    const params = {
      index: this.index,
      type: this.type,
      id,
      body: {doc: data}
    };
    return this.esHelper.update(params);
  }

  delete(id) {}

  count(query) {
    const params = {
      index: this.index,
      type: this.type,
      body: query
    };
    return this.esHelper.count(params);
  }

  search(query, count) {
    const params = {
      index: this.index,
      type: this.type,
      body: query
    };
    if (count != null) { params.size = count; }
    return this.esHelper.search(params);
  }

  bulk(data) {
    for (let record of Array.from(data)) {
      if ((record.update != null ? record.update._index : undefined) != null) {
        record.update._index = this.index;
        record.update._type = this.type;
      }
    }
    return this.esHelper.bulk(data);
  }

  aggs(query) {
    const params = {
      index: this.index,
      type: this.type,
      body: query,
      size: 0
    };
    return this.esHelper.aggs(params);
  }

  getScrollId(query, size, scrollTimeout) {
    const params = {
      index: this.index,
      type: this.type,
      body: query,
      scroll: scrollTimeout
    };
    return this.esClient.search(params);
  }

  scroll(scrollId, scrollTimeout) {
    return this.esClient.scroll({scrollId, scroll: scrollTimeout});
  }
});
