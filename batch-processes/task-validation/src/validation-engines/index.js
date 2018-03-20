// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.


let ValidationEngines;
module.exports = (ValidationEngines = class ValidationEngines {

  constructor(config) {
    this.config = config;
    this.existingValidators = {};
  }


  getValidator(type) {
    if (type === "facebook_page_like") {
      const FacebookPageLikeValidator = require("./facebook-page-like");
      return new FacebookPageLikeValidator(this.config);
    }
    if (type === "playstore_app_install") {
      const PlaystoreAppInstallValidator = require("./playstore-app-install");
      return new PlaystoreAppInstallValidator(this.config);
    }
  }
});
