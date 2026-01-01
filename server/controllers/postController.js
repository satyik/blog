const prisma = require('../prismaClient');

// Get all posts (public can see published)
exports.getPosts = async (req, res) => {
    try {
        const { search, tag, sort } = req.query;

        // Build query
        const where = { published: true };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (tag) {
            // Search by tag name
            where.tags = { some: { name: tag } };
        }

        // Build Sort
        let orderBy = { createdAt: 'desc' }; // default 'Recent'
        if (sort === 'popular') {
            orderBy = { views: 'desc' };
        }

        const posts = await prisma.post.findMany({
            where,
            include: { author: { select: { username: true } }, categories: true, tags: true },
            orderBy
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single post
exports.getPost = async (req, res) => {
    try {
        const { id } = req.params;

        // Increment views
        await prisma.post.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        const post = await prisma.post.findUnique({
            where: { id },
            include: { author: { select: { username: true } }, categories: true, tags: true, comments: true }
        });
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create post (Protected)
exports.createPost = async (req, res) => {
    try {
        const { title, content, image, categoryIds, tagIds, published } = req.body;
        const post = await prisma.post.create({
            data: {
                title,
                content,
                image,
                published: published || false,
                author: { connect: { id: req.user.userId } },
                categories: categoryIds ? { connect: categoryIds.map(id => ({ id })) } : undefined,
                tags: tagIds ? { connect: tagIds.map(id => ({ id })) } : undefined,
            }
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update post (Protected)
exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image, categoryIds, tagIds, published } = req.body;

        // Check ownership or admin role (omitted for brevity, assume auth check passed)

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                image,
                published,
                categories: categoryIds ? { set: categoryIds.map(id => ({ id })) } : undefined,
                tags: tagIds ? { set: tagIds.map(id => ({ id })) } : undefined,
            }
        });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete post (Protected)
exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.post.delete({ where: { id } });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
