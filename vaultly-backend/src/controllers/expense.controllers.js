const expenseService = require('../services/expense.service');

async function createExpense(req, res) {
    const {userId, categoryId, amount, date, description, groupId = null} = req.body;

    if(!userId || !categoryId || !amount || !date || !description) {
        return res.status(400).json({error: 'Missing required fields'});
    }

    try{
        const expenses = await expenseService.createExpense({userId, categoryId, amount, date, description, groupId});
        return res.status(201).json({expenses});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    createExpense,
};