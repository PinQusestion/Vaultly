const express = require("express");
const goalRouter = express.Router();
const goalController = require("../controllers/goal.Controllers");
const authMiddleware = require("../middlewares/authMiddleware");

goalRouter.get("/", authMiddleware.authenticate, goalController.getUserGoals);

goalRouter.post("/", authMiddleware.authenticate, goalController.createGoal);

goalRouter.get("/:goalId", authMiddleware.authenticate, goalController.getGoalById);

goalRouter.put("/:goalId", authMiddleware.authenticate, goalController.updateGoal);

goalRouter.delete("/:goalId", authMiddleware.authenticate, goalController.deleteGoal);

goalRouter.post("/:goalId/contribute", authMiddleware.authenticate, goalController.contributeToGoal);

module.exports = goalRouter;
