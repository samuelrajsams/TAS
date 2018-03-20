// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let FacebookPageLikeValidator;
const FacebookPagesLikes = require("../../../../commons/resources/facebook-pages-installs");
const log4js = require("log4js");
const logger = log4js.getLogger("validation");

// FB = require "fb"

// options =
//   version: "v2.11"
// fb = new FB.Facebook(options)
// fb.extend({appId:163771097702797, appSecret:"55a8ec22d7480618162172325d10d6db"})
// fb.setAccessToken("EAACU8u4aYY0BAMck3EYIMpLed7qaP3J9dKdsSbGKbTLnnppuTZCgOHVP4PSh0kgOUwWS5h82sPd1wFMJeCXwPWswGtU3Fvh4uEdeyj72wFrQkesPKub5j2wfIhO52CbVXP7GMOsMOKu4GXZAwR34GgzZCtkDXNZBZB059rlxjrETK9rVtJJRm7iUlaAZBvKEgf6XZCM8caNRDe5dt42ZBz1d")
// fb.api "/me/likes", "get", (response) ->
//   if response.error?
//     console.log "Error in getting likes: ", error
//   else
//     console.log "response: ", response
module.exports = (FacebookPageLikeValidator = class FacebookPageLikeValidator {
  constructor() {
    this.facebookPagesLikes = new FacebookPagesLikes();
  }

  validate(task) {
    return new Promise((resolve, reject) => {
      const userId = task.user_id;
      const {page_id} = task.task_data;
      return this.facebookPagesLikes.getUserPageLikes(userId, page_id)
      .then(function(likes) {
        if (likes.length > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }}).catch(function(error) {
        logger.error("Error in FacebookPageLikeValidator: ", error);
        logger.error("Task details: ", JSON.stringify(task));
        return reject(error);
      });
    });
  }
});
