const express = require("express");
const analyticsRouter = express.Router();
const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middlewares/authMiddleware");

analyticsRouter.get("/overview", authMiddleware.authenticate, analyticsController.getSpendingOverview);

analyticsRouter.get("/trends", authMiddleware.authenticate, analyticsController.getMonthlyTrends);

analyticsRouter.get("/top-expenses", authMiddleware.authenticate, analyticsController.getTopExpenses);

analyticsRouter.get("/groups", authMiddleware.authenticate, analyticsController.getGroupAnalytics);

analyticsRouter.get("/goals", authMiddleware.authenticate, analyticsController.getGoalsProgress);

analyticsRouter.get("/comparison", authMiddleware.authenticate, analyticsController.getComparisonData);

analyticsRouter.get("/dashboard", authMiddleware.authenticate, analyticsController.getDashboardStats);

module.exports = analyticsRouter;
