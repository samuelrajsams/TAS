// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let Users;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
let {randomKey} = require("key-forge");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");
({randomKey} = require("key-forge"));
//# Note change to singleton form multiple instances not needed
//# --kiran
module.exports = (Users = class Users {
  constructor() {
    this.findByEmail = this.findByEmail.bind(this);
    this.createAndSave = this.createAndSave.bind(this);
    this.helper = new ObjectHelper("users");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("users");
  }

  get(id) {
    return this.helper.get(id);
  }

  create(id, data) {
    return this.helper.create({id, data});
  }

  update(id, data) {
    return this.helper.update({id, data});
  }

  exists(id) {
    return this.helper.exists(id); 
  }

  count(query) {
    return this.helper.count(query);
  }

  search(query, count) {
    return this.helper.search(query, count);
  }

  clean(user) {
    delete user.password;
    delete user.salt;
    return user;
  }

  searchUserByEmail(email) {
    const query = {query: {term: {email}}};
    return this.helper.search(query)
    .then(function(data) {
      if (data.length > 0) {
        const user = data[0];
        return data[0];
      } else {
        return null;
      }
    });
  }

  findByEmail(email) {
    const query = {query: {term: {email}}};
    return this.helper.search(query)
    .then(function(data) {
      if (data.length > 0) {
        const user = data[0];
        return data[0];
      } else {
        return null;
      }
    });
  }

  createAndSave(userData) {
    const token = randomKey(11, "base64url");
    const salt = randomKey(9, "base64url");
    const id = randomKey(9, "base64url");
    userData.token = token;
    userData.salt = salt;
    return this.create(id, userData);
  }


  getAll() {
    const query = {query: {match_all: {}}};
    return this.helper.count(query)
    .then(count => {
      if (count > 0) {
        return this.helper.search(query, count);
      } else {
        return [];
      }
  });
  }
});
