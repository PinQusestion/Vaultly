const {PrismaClient} = require('@prisma/client');
const dotenv = require('dotenv');
dotenv.config();

const prisma = new PrismaClient({
    datasourseURL: process.env.DATABASE_URL
});

module.exports = prisma;