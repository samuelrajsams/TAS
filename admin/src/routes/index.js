// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const AuthRoutes = require("./auth");
const TaskRoutes = require("./tasks");
const APIRoutes = require("./api");
const ValidationRoutes = require("./validation-routes");
module.exports = {
  initialise(router) {
    // In case of admin no reqests
    // should be allowed without accesstokens
    // unless its login
    router.get("/privacy-policy", function(req, res) {
      console.log("entered");
      return res.render("privacy-policy");
    });
    router.use(function(req, res, next) {
      let cookies = req.headers["cookie"];
      const accessToken = req.headers["x-pas-token"];
      if (cookies != null) {
        cookies = req.headers["cookie"].split(";").filter(x => x.indexOf("token=") >= 0);
        if ((cookies != null) && (cookies[0] != null)) {
          const token = cookies[0].split("=")[1].trim();
          return next();
        } else if ((req.path === "/login") && (req.method === "POST")) {
          return next();
        } else {
          return res.render("login");
        }
      } else if ((accessToken != null) && ["7c09a84e86338059a5", "60fe5e346ca28d0eb2"].includes(accessToken)) {
        return next();
      } else {
        if ((req.path === "/login") && (req.method === "POST")) {
          return next();
        } else {
          return res.render("login");
        }
      }
    });
    router.get('/', (req, res) => res.render("index"));
    new AuthRoutes(router);
    new TaskRoutes(router);
    new APIRoutes(router);
    return new ValidationRoutes(router);
  }
};