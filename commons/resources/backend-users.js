// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let BackendUsers;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");
//# Note change to singleton form multiple instances not needed
//# --kiran
module.exports = (BackendUsers = class BackendUsers {
  constructor() {
    this.helper = new ObjectHelper("backendUsers");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("backendUsers");
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.index;
    this.type = dbConfig.type;
  }

  getByEmail(email) {
    const query = {query: {term: {email}}};
    return this.helper.search(query)
    .then(function(data) {
      if (data.length > 0) {
        const user = data[0];
        return data[0];
      } else {
        return null;
      }}).catch(function(error) {
      console.log("Error in BackendUsers:getByEmail ", error);
      return Promise.reject(error);
    });
  }

  cleanUser(user) {
    delete user.salt;
    delete user.password;
    return user;
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

  exists(id) {
    return this.productsObjectHelper.exists(id); 
  }

  // get: (id) ->
  //   @farmersObjectHelper.get(id)
  //   .then (data) =>
  //     if data?._source?
  //       data._source._id = data._id
  //       data._source
  //     else
  //       Promise.reject new Error("#{@type} #{id} not found")

  bulk(data) {
    return this.productsObjectHelper.bulk(data);
  }



  // list: () ->
  //   query = 
  //     query:
  //       match_all: {}
  //   @count(query)
  //   .then (count) =>
  //     @search(query, count)

  // update: ({id, data}) ->
  //   params =
  //     index: @index
  //     type: @type
  //     id: id
  //     body: data
  //   @esHelper.update params

  // delete: (id) ->


  count(query) {
    return this.productsObjectHelper.count(query);
  }
  //   params =
  //     index: @index
  //     type: @type
  //     size: 0
  //     body: query
  //   @esHelper.count params

  search(query, count) {
    return this.productsObjectHelper.search(query, count)
    .then(data => data);
  }
});
