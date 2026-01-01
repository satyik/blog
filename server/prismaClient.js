const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with explicit datasource URL to avoid config issues
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "mongodb://localhost:27017/blog"
        }
    }
});

module.exports = prisma;
