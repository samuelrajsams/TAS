// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let PlaystoreAppInstalls;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const {randomKey} = require("key-forge");
const logger = log4js.getLogger("admin");
const allowedFields = ["package_name", "application_name", "version", "version_code"];
allowedFields.push("app_installed_date", "app_updated_date");
allowedFields.push("min_sdk_version", "target_sdk_version");
module.exports = (PlaystoreAppInstalls = class PlaystoreAppInstalls {
  constructor() {
    this.saveInstalledApps = this.saveInstalledApps.bind(this);
    this.helper = new ObjectHelper("playstoreAppsInstalls");
    this.esHelper = new ESHelper();
    const dbConfig = Globals.getDBConfig("playstoreAppsInstalls");
    const dbPrefix = Globals.getDBPrefix();
    this.index = dbConfig.index;
    this.type = dbConfig.type;
  }

  saveInstalledApps(userId, apps) {
    for (let app of Array.from(apps)) {
      for (let key in app) {
        let value = app[key];
        if (!Array.from(allowedFields).includes(key)) { delete app[key]; }
        if (["app_install_date", "app_update_date"].includes(key) && (value != null)) {
          if (!isNaN(value)) {
            value = parseInt(value);
            app[key] = new Date(value).toISOString();
          }
        }
      }
    }
    const appInstallsObj = {user_id: userId, apps};
    const now = new Date().toISOString();
    appInstallsObj.create_time = now;
    appInstallsObj.update_time = now;
    appInstallsObj.status = 1;
    return this.helper.create({id: randomKey(9), data: appInstallsObj});
  }

  getUserInstallsForApp(userId, packageId) {
    const query = {
      query: {
        bool: {
          must:[
            {term: {package_name: packageId}},
            {term: {user_id: userId}}
          ]
        }
      },
      sort: { create_time: "desc"
    }
    };
    return this.helper.search(query);
  }
});
    