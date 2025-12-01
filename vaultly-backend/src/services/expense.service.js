const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function createExpense({ userId, amount, category, date, description }) {
    try{
        return prisma.expenses.create({
            data: {
                userId,
                amount,
                categoryId: category,
                date: new Date(date),
                description
            }
        });
    }catch(error){
        throw new Error("Error creating expense: " + error.message);
    }
}

async function getUserExpenses(userId){
    try{
        const expenses = await prisma.expenses.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        })

        return expenses;
    }catch(error){
        throw new Error("Error fetching expenses: " + error.message);
    }
}

module.exports = {
    createExpense,
    getUserExpenses
};