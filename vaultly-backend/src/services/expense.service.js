const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function createExpense({ userId, amount, categoryId, date, description, groupId = null }) {
    try{
        // Find or create category by name
        let category = await prisma.categories.findFirst({
            where: { name: categoryId }
        });

        if (!category) {
            // Create category if it doesn't exist
            category = await prisma.categories.create({
                data: { name: categoryId }
            });
        }

        const expense = await prisma.expenses.create({
            data: {
                userId,
                amount,
                categoryId: category.id,
                date: new Date(date),
                description,
                groupId
            },
            include: {
                Categories: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Format expense to match getUserExpenses format
        return {
            id: expense.id,
            date: expense.date,
            description: expense.description,
            category: expense.Categories.name,
            amount: expense.amount,
            userId: expense.userId,
            groupId: expense.groupId
        };
    }catch(error){
        console.error('Service error:', error);
        throw new Error("Error creating expense: " + error.message);
    }
}

async function getUserExpenses(userId){
    try{
        const expenses = await prisma.expenses.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            include: {
                Categories: {
                    select: {
                        name: true
                    }
                }
            }
        });

        // Format expenses to include category name
        const formattedExpenses = expenses.map(expense => ({
            id: expense.id,
            date: expense.date,
            description: expense.description,
            category: expense.Categories.name,
            amount: expense.amount,
            userId: expense.userId,
            groupId: expense.groupId
        }));

        return formattedExpenses;
    }catch(error){
        throw new Error("Error fetching expenses: " + error.message);
    }
}

async function deleteExpense(expenseId, userId) {
    try {
        // Verify the expense belongs to the user before deleting
        const expense = await prisma.expenses.findUnique({
            where: { id: expenseId }
        });

        if (!expense) {
            throw new Error("Expense not found");
        }

        if (expense.userId !== userId) {
            throw new Error("Unauthorized to delete this expense");
        }

        await prisma.expenses.delete({
            where: { id: expenseId }
        });

        return { success: true };
    } catch (error) {
        throw new Error("Error deleting expense: " + error.message);
    }
}

module.exports = {
    createExpense,
    getUserExpenses,
    deleteExpense
};