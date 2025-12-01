const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/expense.controllers");

expenseRouter.post("/", expenseController.createExpense);

module.exports = expenseRouter;