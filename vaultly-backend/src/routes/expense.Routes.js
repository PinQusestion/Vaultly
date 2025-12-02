const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/expense.Controllers");
const authMiddleware = require("../middlewares/authMiddleware");

expenseRouter.get("/", authMiddleware.authenticate, expenseController.getUserExpenses);

expenseRouter.post("/", authMiddleware.authenticate, expenseController.createExpense);

expenseRouter.delete("/:id", authMiddleware.authenticate, expenseController.deleteExpense);

expenseRouter.put("/:id", authMiddleware.authenticate, expenseController.updateExpense);

module.exports = expenseRouter;