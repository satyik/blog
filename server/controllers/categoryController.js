const prisma = require('../prismaClient');

exports.getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const category = await prisma.category.create({ data: { name } });
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ message: "Category already exists" });
        res.status(500).json({ error: error.message });
    }
};
