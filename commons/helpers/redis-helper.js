// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let RedisHelper;
const Redis = require("redis");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");
const ClientsHelper = require("./clients-helper");
const Globals = require("./globals");
module.exports = (RedisHelper = class RedisHelper {
  constructor() {
    this.setAccessToken = this.setAccessToken.bind(this);
    this.setOTPDetails = this.setOTPDetails.bind(this);
    this.getOTPDetails = this.getOTPDetails.bind(this);
    this.redisClient = ClientsHelper.getRedisClient();
  }

  getFromRedis(id) {
    return new Promise((resolve, reject) => {
      return this.redisClient.get(id, (error, data) => {
        if (error != null) {
          logger.error("Error occurred getFromRedis: ", error.message);
          return reject(error);
        } else {
          if (data != null) {
            try {
              const obj = JSON.parse(data);
              return resolve(obj);
            } catch (error1) {
              error = error1;
              logger.error("Error occurred getFromRedis parse exception: ", error.message);
              return resolve(null);
            }
          } else {
            return resolve(null);
          }
        }
      });
    });
  }

  storeInRedis({id, expiry, data}) {
    return new Promise((resolve, reject) => {
      if (expiry != null) {
        return this.redisClient.setex(id, expiry, JSON.stringify(data), (error, data) => {
          if (error != null) {
            logger.error("Error in storeInRedis: ", error);
            return reject(error);
          } else {
            return resolve();
          }
        });
      } else {
        return this.redisClient.set(id, JSON.stringify(data), (error,data) => {
          if (error != null) {
            logger.error("Error in storeInRedis: ", error);
            return reject(error);
          } else {
            return resolve();
          }
        });
      }
    });
  }

  setAccessToken(token, user) {
    const dbPrefix = Globals.getDBPrefix();
    return this.storeInRedis({id:`${dbPrefix}-access-token-${token}`, expiry: 86400, data: user});
  }

  setOTPDetails(userId, details) {
    const dbPrefix = Globals.getDBPrefix();
    return this.storeInRedis({id: `${dbPrefix}-otp-session-${userId}`, expiry: 3600, data: {details, userId}});
  }

  getOTPDetails(userId) {
    const dbPrefix = Globals.getDBPrefix();
    return this.getFromRedis(`${dbPrefix}-otp-session-${userId}`);
  }
});