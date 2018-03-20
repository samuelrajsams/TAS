// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let AuthRoutes;
const BackendUsers = require("../../../../commons/resources/backend-users");
const RedisHelper = require("../../../../commons/helpers/redis-helper");
const {randomKey} = require("key-forge");
const crypto = require("crypto");
module.exports = (AuthRoutes = class AuthRoutes {
  constructor(router) {
    this.login = this.login.bind(this);
    this.backendUsersHelper = new BackendUsers();
    this.redisHelper = new RedisHelper();
    router.post("/login", this.login);
  }

  login(request, response) {
    const {email, password} = request.body;
    return this.backendUsersHelper.getByEmail(email)
    .then(user => {
      if (user != null) {
        const hashPassword = crypto.pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
        if (user.password === hashPassword) {
          user = this.backendUsersHelper.cleanUser(user);
          const token = randomKey(9);
          this.redisHelper.setAccessToken(token, user);
          response.setHeader('Set-Cookie', [`token=${token}`]);
          return response.end(JSON.stringify({message: "user valid", user}));
        } else {
          response.statusCode = 401;
          return response.end(JSON.stringify({message: "user valid"}));
        }
      } else {
        response.statusCode = 404;
        return response.end(JSON.stringify({message: "user not found"}));
      }
  }).catch(function(error) {
      console.log("Error in validating: ", error);
      response.statusCode = 500;
      return response.end(JSON.stringify({message: "Internal server Error"}));
    });
  }
});