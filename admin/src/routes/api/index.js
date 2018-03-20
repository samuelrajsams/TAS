// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let APIRoutes;
const UsersTasks = require("../../../../commons/resources/users-tasks");
const UserCreditsNew = require("../../../../commons/resources/user-credits");
const Levels = require("../../../../commons/resources/levels");
const Campaigns = require("../../../../commons/resources/campaigns");
const Packages = require("../../../../commons/resources/packages");
const log4js = require("log4js");
const logger = log4js.getLogger();
module.exports = (APIRoutes = class APIRoutes {
    constructor(router) {
        this.getUserTasks = this.getUserTasks.bind(this);
        this.getUserCredits = this.getUserCredits.bind(this);
        this.userCredits = this.userCredits.bind(this);
        this.getLevels = this.getLevels.bind(this);
        this.getCampaigns = this.getCampaigns.bind(this);
        this.addCampaign = this.addCampaign.bind(this);
        this.getUserCreditsAndAssignedBrands = this.getUserCreditsAndAssignedBrands.bind(this);
        this.getUsersHistory = this.getUsersHistory.bind(this);
        this.getAccountsCredits = this.getAccountsCredits.bind(this);
        this.getUsersAccountsCredits = this.getUsersAccountsCredits.bind(this);
        this.getUserLevel = this.getUserLevel.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.getPackages = this.getPackages.bind(this);
        this.usersTasks = new UsersTasks();
        this.userCreditsNew = new UserCreditsNew();
        this.levels = new Levels();
        this.packages = new Packages();
        this.campaigns = new Campaigns();
        router.get("/api/v1/user/tasks", this.getUserTasks);
        router.patch("/api/v1/task/:taskId", this.updateTask);
        router.get("/api/v1/user/credits", this.getUserCredits);
        router.get("/api/v1/levels", this.getLevels);
        router.get("/api/v1/campaigns", this.getCampaigns);
        router.get("/api/v1/all/credits", this.getAllCredits);
        router.post("/api/v1/credits", this.userCredits);
        // move this method to admin routes
        router.post("/api/v1/campaigns/:campaignId", this.addCampaign);
        router.post("/api/v1/users/history", this.getUsersHistory);
        router.get("/api/v1/users/history", this.getUsersHistory);
        router.post("/api/v1/accounts/credits", this.getUsersAccountsCredits);
        router.get("/api/v1/packages", this.getPackages);
        router.get("/api/v1/user/level", this.getUserLevel);
    }

    userCredits(request, response) {
        const id = request.body.id;
        var params = {
            user_id: request.body.user_id,
            no_of_credits_finished: request.body.no_of_credits_finished,
            remaining_credits: request.body.remaining_credits
        };
        return this.userCreditsNew.addUserCredits(id, params).then(() => {
            response.statusCode = 200;
            return response.end(JSON.stringify({message: "credits Added successfully"}));
        }).catch(function (error) {
            response.statusCode = 500;
            logger.error(`Error in Adding User credits: ${error.message}`);
            return response.end(JSON.stringify({message: "Internal server error"}));
        });
    }

    getAllCredits(request, response) {
        return this.userCreditsNew.getAllCredits().then((data) => {
            response.statusCode = 200;
            return response.end(JSON.stringify({data}));
        }).catch(function (error) {
            response.statusCode = 500;
            logger.error(`Error in Adding User credits: ${error.message}`);
            return response.end(JSON.stringify({message: "Internal server error"}));
        });
    }

    getUserTasks(request, response) {
        const queryParams = request.query;
        const userId = queryParams["user-id"];
        if ((userId == null) || (userId.length === 0)) {
            response.statusCode = 400;
            return response.end(JSON.stringify({message: "userId not defined"}));
        }
        let tasks = [];
        return this.usersTasks.getTasks(userId, queryParams)
            .then(_tasks => {
                tasks = _tasks;
                const campaignIds = tasks.map(x => x.campaign_id);
                return this.campaigns.getCampaignsForIds(campaignIds);
            }).then(campaignsObj => {
                for (let task of Array.from(tasks)) {
                    const campaign = campaignsObj[task.campaign_id];
                    if (campaign != null) {
                        task.campaign_title = campaign.name;
                        task.campaign_description = campaign.description;
                        task.campaign_icon_url = campaign.icon_url;
                    } else {
                        logger.error(`Campaign not defined for ${task.campaign_id}`);
                        logger.error("Task : JSON.stringify(task)");
                    }
                    delete task.task_category_id;
                    delete task.campaign_id;
                    task.task_data = JSON.parse(task.task_data);
                }
                const pagination = {cursors: {after: null, before: null}, prev: "", next: ""};
                const data = {data: tasks, pagination};
                response.statusCode = 200;
                return response.end(JSON.stringify(data));
            }).catch(function (error) {
                response.statusCode = 500;
                logger.error(`Error in getUserTasks: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    getUserCredits(request, response) {
        const queryParams = request.query;
        const userId = queryParams["user-id"];
        if ((userId == null) || (userId.length === 0)) {
            response.statusCode = 400;
            return response.end(JSON.stringify({message: "userId not defined"}));
        }
        return this.usersTasks.getCredits(userId)
            .then(function (count) {
                response.statusCode = 200;
                return response.end(JSON.stringify({credits: count}));
            }).catch(function (error) {
                response.statusCode = 500;
                logger.error(`Error in getUserCredits: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    getLevels(request, response) {
        return this.levels.getAll()
            .then(data => {
                response.statusCode = 200;
                return response.end(JSON.stringify({data}));
            }).catch(function (error) {
                response.statusCode = 500;
                logger.error(`Error in getLevels: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    getCampaigns(request, response) {
        const queryParams = request.query;
        const packageId = queryParams["package"];
        return Promise.resolve()
            .then(() => {
                if ((packageId != null ? packageId.length : undefined) > 0) {
                    return this.campaigns.getPackageCampaigns(packageId);
                } else {
                    return this.campaigns.getAll();
                }
            }).then(data => {
                response.statusCode = 200;
                return response.end(JSON.stringify({data}));
            }).catch(function (error) {
                response.statusCode = 500;
                logger.error(`Error in getCampaigns: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    addCampaign(request, response) {
        const {campaignId} = request.params;
        if ((campaignId == null) || (campaignId.length === 0)) {
            response.statusCode = 400;
            response.end(JSON.stringify({message: "invalid or undefined campaignId"}));
        }
        // add validation for campaign
        const reqBody = request.body;
        return this.campaigns.addCampaign(campaignId, request.body)
            .then(() => {
                response.statusCode = 200;
                return response.end(JSON.stringify({message: "Added campaign successfully"}));
            })
            .catch(error => {
                logger.error("Error in add campaign:", error);
                return response.end(JSON.stringify({message: "Internal server error in add campaign"}));
            });
    }

    getUserCreditsAndAssignedBrands(userIds) {
        return new Promise((resolve, reject) => {
            let iterate;
            let currentIndex = 0;
            const usersHistory = [];
            return (iterate = () => {
                if (currentIndex < userIds.length) {
                    const userId = userIds[currentIndex];
                    let taskCategoryBrands = [];
                    return this.usersTasks.getAssignedBrands(userId)
                        .then(_brands => {
                            taskCategoryBrands = _brands;
                            return this.usersTasks.getCredits(userId);
                        }).then(credits => {
                            for (let brand of Array.from(taskCategoryBrands)) {
                                delete brand._id;
                            }
                            usersHistory.push({user_id: userId, task_category_brands: taskCategoryBrands, credits});
                            currentIndex++;
                            return iterate();
                        }).catch(error => {
                            logger.error("Error in iteration: ", error.message);
                            currentIndex++;
                            return iterate();
                        });
                } else {
                    return resolve(usersHistory);
                }
            })();
        });
    }

    getUsersHistory(request, response) {
        let userIds;
        const queryParams = request.query;
        if ((request.body != null ? request.body.user_ids : undefined) != null) {
            userIds = request.body.user_ids;
        }
        if ((userIds == null) && (queryParams["user-ids"] != null)) {
            userIds = queryParams["user-ids"];
        }
        if ((userIds == null) || (userIds.length === 0)) {
            response.statusCode = 400;
            return response.end(JSON.stringify({message: "user_ids not defined"}));
        }
        return this.getUserCreditsAndAssignedBrands(userIds)
            .then(data => {
                return response.end(JSON.stringify({data}));
            }).catch(error => {
                response.statusCode = 500;
                logger.error(`Error in getUsersHistory: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    getAccountsCredits(accounts) {
        return new Promise((resolve, reject) => {
            let iterate;
            let currentIndex = 0;
            return (iterate = () => {
                if (currentIndex < accounts.length) {
                    const account = accounts[currentIndex];
                    const {user_id, account_id} = account;
                    if (((user_id != null ? user_id.length : undefined) > 0) && ((account_id != null ? account_id.length : undefined) > 0)) {
                        return this.usersTasks.getAccountCredits(user_id, account_id)
                            .then(credits => {
                                account.credits = credits;
                                currentIndex++;
                                return iterate();
                            }).catch(error => {
                                logger.error("Error in iteration:", error);
                                currentIndex++;
                                return iterate();
                            });
                    } else {
                        logger.info("Account or user id not defined: JSON.stringify(account)");
                        currentIndex++;
                        return iterate();
                    }
                } else {
                    return resolve(accounts);
                }
            })();
        });
    }

    getUsersAccountsCredits(request, response) {
        const {accounts} = request.body;
        if ((accounts == null) || (accounts.length === 0)) {
            response.statusCode = 400;
            return response.end(JSON.stringify({message: "accounts not defined"}));
        }
        return this.getAccountsCredits(accounts)
            .then(data => {
                return response.end(JSON.stringify({data}));
            }).catch(error => {
                response.statusCode = 500;
                logger.error("Error in getAccountsCredits: ", error.message);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }

    getUserLevel(request, response) {
        const queryParams = request.query;
        const userId = queryParams["user-id"];
        const accountId = queryParams["account-id"];
        const packageId = queryParams["package-id"];
        if ((!(userId != null ? userId.length : undefined) > 0) || (userId.length === 0) || (accountId == null) || (accountId.length === 0)) {
            response.statusCode = 400;
            response.end(JSON.stringify({message: "user-id or account-id not defined"}));
        }
        let levels = null;
        return this.levels.getPackageLevels(packageId)
            .then(_levels => {
                levels = _levels;
                return this.usersTasks.getAccountCredits(userId, accountId);
            }).then(credits => {
                const totalCredits = 0;
                let lastLevel = null;
                for (let level of Array.from(levels)) {
                    if (totalCredits > credits) {
                        break;
                    }
                    lastLevel = level;
                }
                response.statusCode = 200;
                const levelId = lastLevel.level_id.split("-")[1].replace("l", "");
                return response.end(JSON.stringify({level: parseInt(levelId)}));
            }).catch(error => {
                logger.error("Error in getUserLevel: ", error);
                response.statusCode = 500;
                return response.end(JSON.stringify({message: error.message}));
            });
    }

    updateTask(request, response) {
        const {taskId} = request.params;
        let task = null;
        let taskModified = false;
        const updateFields = {};
        if ((taskId == null) || (taskId.length === 0)) {
            response.statusCode = 400;
            return response.end(JSON.stringify({message: "taskId not found"}));
        }
        return this.usersTasks.getTask(taskId)
            .then(data => {
                task = data;
                if (task != null) {
                    let {status, order_id} = request.body;
                    // if status == "completed" and task.status ==  "pending"

                    taskModified = true;
                    if (status === "completed") {
                        status = "validated";
                    }
                    updateFields.status = status;
                    if (order_id != null) {
                        updateFields.user_data = JSON.stringify({order_id});
                    }
                    if (taskModified) {
                        return this.usersTasks.updateTask(taskId, updateFields)
                            .then(function () {
                                response.statusCode = 200;
                                return response.end(JSON.stringify({message: "task status updated successfully"}));
                            });
                    } else {
                        if (status !== "completed") {
                            response.statusCode = 401;
                            return response.end(JSON.stringify({message: `not authorized to change task status to ${status}`}));
                        } else if (task.status !== "pending") {
                            response.statusCode = 401;
                            return response.end(JSON.stringify({message: "task not in pending state"}));
                        }
                    }
                } else {
                    response.statusCode = 404;
                    response.end(JSON.stringify({message: "task not found"}));
                    return Promise.reject(new Error("task not found"));
                }
            }).catch(function (error) {
                logger.error(`Error in updateTask: taskId: ${taskId}`, error.message);
                if (!response.headersSent) {
                    response.status = 500;
                    return response.end(JSON.stringify({message: "Internal error occurred while updating task"}));
                }
            });
    }

    getPackages(request, response) {
        return this.packages.getAll()
            .then(data => {
                response.statusCode = 200;
                return response.end(JSON.stringify({data}));
            }).catch(function (error) {
                response.statusCode = 500;
                logger.error(`Error in getCampaigns: ${error.message}`);
                return response.end(JSON.stringify({message: "Internal server error"}));
            });
    }
});