// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let ValidationRoutes;
const FacebookPagesLikes = require("../../../../commons/resources/facebook-pages-likes");
const PlaystoreAppsInstalls = require("../../../../commons/resources/playstore-apps-installs");
const Campaigns = require("../../../../commons/resources/campaigns");
const Packages = require("../../../../commons/resources/packages");
const log4js = require("log4js");
const logger = log4js.getLogger();
module.exports = (ValidationRoutes = class ValidationRoutes {
  constructor(router) {
    this.saveLikedPages = this.saveLikedPages.bind(this);
    this.saveUserInstalledApps = this.saveUserInstalledApps.bind(this);
    this.facebookPagesLikes = new FacebookPagesLikes();
    this.playstoreAppsInstalls = new PlaystoreAppsInstalls();
    router.post("/api/v1/user/:userId/installed-apps", this.saveUserInstalledApps);
    router.post("/api/v1/user/:userId/liked-pages", this.saveLikedPages);
  }

  saveLikedPages(request, response) {
    const queryParams = request.query;
    const { userId } = request.params;
    if ((userId == null) || (userId.length === 0)) {
      response.statusCode = 400;
      return response.end(JSON.stringify({message: "userId not defined"}));
    }
    const { pages } = request.body;
    return this.facebookPagesLikes.saveLikes(userId, pages)
    .then(function() {
      response.statusCode = 200;
      return response.end(JSON.stringify({message: "likes save successfull"}));}).catch(function(error) {
      response.statusCode = 500;
      logger.error("Error in saveLikedPages: ", error);
      return response.end(JSON.stringify({message: "Internal server error"}));
    });
  }

  saveUserInstalledApps(request, response) {
    const queryParams = request.query;
    const { userId } = request.params;
    if ((userId == null) || (userId.length === 0)) {
      response.statusCode = 400;
      return response.end(JSON.stringify({message: "userId not defined"}));
    }
    return this.playstoreAppsInstalls.saveInstalledApps(userId, request.body.apps)
    .then(function() {
      response.statusCode = 200;
      return response.end(JSON.stringify({message: "user installed apps saved successfully"}));}).catch(function(error) {
      response.statusCode = 500;
      logger.error("Error in saveUserInstalledApps: ", error);
      return response.end(JSON.stringify({message: "Internal server error"}));
    });
  }
});