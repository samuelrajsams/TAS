// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let AdminServer;
const bodyParser = require("body-parser");
const express = require("express");
const log4js = require("log4js");
const logger = log4js.getLogger();
let path = require("path");
const redis = require("redis");
const {randomKey} = require("key-forge");
const expressCoffee = require("express-coffee-script");
const coffeeScript = require("coffee-script");
const ClientsHelper = require("../../commons/helpers/clients-helper");
const Globals = require("../../commons/helpers/globals");
const Routes = require("./routes");

module.exports = (AdminServer = class AdminServer {
  static run(config) {
    return (new (this)(config)).run();
  }

  constructor(configuration) {
    this.configuration = configuration;
    this.app = express();
    const publicPath = path.resolve(__dirname, "..", "public");
    const viewPath = path.resolve(__dirname, "..", "views");
    const assetsPath = path.resolve(__dirname, "..", "assets");
    this.app.use("/", express.static(publicPath));
    this.app.set("views", viewPath);
    this.app.set("view engine", "pug");
    this.app.use("/views", function(req, res, next) {
      path = req.path.replace("/", "");
      path = path.replace(".html", "");
      return res.render(path);
    });
    this.router = express.Router();
  }

  run() {
    this.app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO })); // used for logging requests
    ClientsHelper.init(this.configuration);
    Globals.init(this.configuration);
    Routes.initialise(this.router);
    this.app.use(bodyParser.json({limit: "50mb", "strict": true}));
    this.app.use(this.router);
    const {port, host} = this.configuration.admin;
    this.app.listen(port, host);
    return console.log(`App Initialised listening on ${host}:${port}`);
  }
});