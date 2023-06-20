const express = require("express");
const abilityController = require("../controller/ability");
const userController = require("../controller/user");
const reposController = require("../controller/repos");
const commitsController = require("../controller/commits");
const router = express.Router();

router.use("/ability", abilityController.ability); // получение прав доступа
router.use("/user/:id", userController.infoByUserId);
router.use("/user", userController.listUsers);
router.use("/repos/:id/commits/:commitId", commitsController.commitsById);
router.use("/repos/:id/commits", commitsController.commits);
router.use("/repos/:id", reposController.reposById);
router.use("/repos", reposController.repos);

module.exports = router;
