const express = require("express");

const authRouter = express.Router();
const authController = require("../controllers/auth.Controllers");
const authMiddleware = require("../middlewares/authMiddleware");

authRouter.post("/signup", authController.signup)

authRouter.post("/login", authController.login)

authRouter.post("/logout", authController.logout)

authRouter.get("/me", authMiddleware.authenticate, authController.ifLoggedIn)

module.exports = authRouter;