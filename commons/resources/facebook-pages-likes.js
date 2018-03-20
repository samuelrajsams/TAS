// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let FacebookPagesLikes;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("api");
const {randomKey} = require("key-forge");
const statusEnums = {
  1: "admin",
  2: "api"
};

module.exports = (FacebookPagesLikes = class FacebookPagesLikes {
  constructor() {
    this.addLike = this.addLike.bind(this);
    this.saveLikes = this.saveLikes.bind(this);
    this.getUserPageLikes = this.getUserPageLikes.bind(this);
    this.helper = new ObjectHelper("facebookPagesLikes");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("facebookPagesLikes");
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.index;
    this.type = dbConfig.type;
  }

  addLike(userId, page) {
    for (let key in page) {
      const value = page[key];
      if (key !== "id") { delete page[key]; }
    }
    const likeObj = {user_id: userId, page};
    const now = new Date().toISOString();
    likeObj.create_time = now;
    likeObj.update_time = now;
    likeObj.status = 1;
    console.log(`like Obj ${JSON.stringify(likeObj)}`);
    return this.helper.create({id: randomKey(9), data: likeObj});
  }

  saveLikes(userId, pages) {
    return new Promise((resolve, reject) => {
      let iterate;
      let currentIndex = 0;
      return (iterate = () => {
        if (currentIndex < pages.length) {
          const page = pages[currentIndex];
          return this.addLike(userId, page)
          .then(function() {
            currentIndex++;
            return iterate();}).catch(function(error) {
            logger.error("Error in saveLikes : ", error);
            currentIndex++;
            return iterate();
          });
        } else {
          return resolve();
        }
      })();
    });
  }

  getUserPageLikes(userId, pageId) {
    const query = {
      query: {
        bool: {
          must:[
            {term: {user_id: userId}},
            {term: {page_id: pageId}}
          ]
        }
      },
      sort: { create_time: "desc"
    }
    };
    return this.helper.search(query);
  }
});