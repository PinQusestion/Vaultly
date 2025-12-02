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

        return prisma.expenses.create({
            data: {
                userId,
                amount,
                categoryId: category.id,
                date: new Date(date),
                description,
                groupId
            }
        });
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
                category: {
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
            category: expense.category.name,
            amount: expense.amount,
            userId: expense.userId,
            groupId: expense.groupId
        }));

        return formattedExpenses;
    }catch(error){
        throw new Error("Error fetching expenses: " + error.message);
    }
}

module.exports = {
    createExpense,
    getUserExpenses
};