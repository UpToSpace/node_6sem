const express = require("express");
const homeController = require("../controller/home");
const homeRouter = express.Router();

homeRouter.use("/login", homeController.login);
homeRouter.use("/register", homeController.register);
homeRouter.use("/logout", homeController.logout);

module.exports = homeRouter;
