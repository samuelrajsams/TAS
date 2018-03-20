// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let configuration = null;

module.exports = {
  init(config) {
    return configuration = config;
  },

  getDBPrefix() {
    return configuration.dbConfig.dbPrefix;
  },

  getAuthConfig() {
    return {
      KEY_SIZE: 32,
      ITERATIONS: 10000,
      SALT_KEY_SIZE: 16
    };
  },

  getAWSConfig() {
    return configuration.aws;
  },

  getDBConfig(name) {
    return configuration.dbConfig[name];
  },

  getImageBaseUrl() {
    return "https://s3.ap-south-1.amazonaws.com/images.memoriesunlimited.com";
  },

  getRedirectUrl() {
    return "http://localhost:9900/orders/process";
  },

  getPaymentUrl() {
    return "https://www.instamojo.com/api/1.1/payment-requests/";
  }
};
    // "https://test.instamojo.com/api/1.1/payment-requests/"