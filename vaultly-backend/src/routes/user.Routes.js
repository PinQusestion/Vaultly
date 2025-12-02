const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/user.Controllers");
const authMiddleware = require("../middlewares/authMiddleware");

userRouter.get("/:id", authMiddleware.authenticate, userController.getUserById);

userRouter.put("/:id", authMiddleware.authenticate, userController.updateUserById);

module.exports = userRouter;