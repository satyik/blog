const prisma = require('../prismaClient');

exports.getTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });

        const tag = await prisma.tag.create({ data: { name } });
        res.status(201).json(tag);
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ message: "Tag already exists" });
        res.status(500).json({ error: error.message });
    }
};
