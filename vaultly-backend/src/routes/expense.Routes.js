const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/expense.controllers");
const authMiddleware = require("../middlewares/authMiddleware");

expenseRouter.post("/", authMiddleware.authenticate, expenseController.createExpense);

expenseRouter.get("/", authMiddleware.authenticate, expenseController.getUserExpenses);

expenseRouter.delete("/:id", authMiddleware.authenticate, expenseController.deleteExpense);

module.exports = expenseRouter;