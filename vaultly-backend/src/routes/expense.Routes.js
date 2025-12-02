const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/expense.controllers");
const authMiddleware = require("../middlewares/authMiddleware");

// All expense routes require authentication
expenseRouter.post("/", authMiddleware.authenticate, expenseController.createExpense);
expenseRouter.get("/", authMiddleware.authenticate, expenseController.getUserExpenses);

module.exports = expenseRouter;