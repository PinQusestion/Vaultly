const expenseService = require('../services/expense.service');

async function createExpense(req, res) {
    const { categoryId, amount, date, description, groupId = null } = req.body;
    const userId = req.userId;

    if(!categoryId || !amount || !date) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try{
        const expense = await expenseService.createExpense({ userId, categoryId, amount, date, description: description || '', groupId });
        return res.status(201).json({ expense });
    }catch(error){
        console.error('Create expense error:', error);
        return res.status(500).json({error: error.message});
    }
}

async function getUserExpenses(req, res) {
    const userId = req.userId;

    try{
        const expenses = await expenseService.getUserExpenses(userId);
        return res.status(200).json({ expenses });
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    createExpense,
    getUserExpenses,
};