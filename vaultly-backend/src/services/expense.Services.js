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

async function updateExpense(expenseId, userId, updateData){
    try{
        const expense = await prisma.expenses.findUnique({
            where: { id: expenseId }
        });

        if(!expense){
            throw new Error("Expense not found");
        }

        if(expense.userId !== userId){
            throw new Error("Unauthorized to update this expense");
        }

        // Handle category if provided
        let categoryId = expense.categoryId;
        if(updateData.categoryId){
            let category = await prisma.categories.findFirst({
                where: { name: updateData.categoryId }
            });

            if (!category) {
                category = await prisma.categories.create({
                    data: { name: updateData.categoryId }
                });
            }
            categoryId = category.id;
        }

        // Prepare update data
        const dataToUpdate = {
            amount: updateData.amount !== undefined ? updateData.amount : expense.amount,
            categoryId: categoryId,
            date: updateData.date ? new Date(updateData.date) : expense.date,
            description: updateData.description !== undefined ? updateData.description : expense.description,
        };

        const updatedExpense = await prisma.expenses.update({
            where: { id: expenseId },
            data: dataToUpdate,
            include: {
                Categories: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return {
            id: updatedExpense.id,
            date: updatedExpense.date,
            description: updatedExpense.description,
            category: updatedExpense.Categories.name,
            amount: updatedExpense.amount,
            userId: updatedExpense.userId,
            groupId: updatedExpense.groupId
        };
    }catch(error){
        throw new Error("Error updating expense: " + error.message);
    }
}

module.exports = {
    createExpense,
    getUserExpenses,
    deleteExpense,
    updateExpense
};