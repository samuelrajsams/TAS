let UserCredits;
const ClientsHelper = require("../helpers/clients-helper");
const RedisHelper = require("../helpers/redis-helper");
const ESHelper = require("../helpers/es-helper");
const Globals = require("../helpers/globals");
const ObjectHelper = require("../helpers/object-helper");
const log4js = require("log4js");
const logger = log4js.getLogger("admin");

module.exports = (UserCredits = class UserCredits {
    constructor() {
        this.getAllCredits = this.getAllCredits.bind(this);
        this.addUserCredits = this.addUserCredits.bind(this);
        this.helper = new ObjectHelper("userCredits");
        this.esHelper = new ESHelper();
        const dbConfig = Globals.getDBConfig("userCredits");
        const dbPrefix = Globals.getDBPrefix();
        this.index = dbConfig.index;
        this.type = dbConfig.type;
    }

    addUserCredits(id, data) {
        return this.helper.create({id: id, data});
    }

    getAllCredits() {
        console.log("hiii");
        const query = {query: {match_all: {}}};
        return this.helper.count(query).then(count => {
            return this.helper.search(query, count);
        });
    }
});
